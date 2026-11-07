import "server-only";
import { z } from "zod";
import { enquirySchema } from "./enquiry";

export const CRM_TIMEOUT_MS = 10_000;
export const CRM_LEASE_MS = 60_000;
const MAX_RETRY_AFTER_MS = 24 * 60 * 60 * 1000;
const payloadSchema = enquirySchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime({ offset: true }),
});
export type CrmPayload = z.infer<typeof payloadSchema>;
export type CrmOutcome =
  | { state: "delivered"; companyId: string; diagnostic: null }
  | { state: "pending" | "blocked"; diagnostic: string; retryAfter?: number };

export function getCrmConfig(env = process.env) {
  if (env.CRM_ENQUIRY_ENABLED !== "true") return null;
  const rawUrl = env.CRM_ENQUIRY_URL;
  const secret = env.CRM_ENQUIRY_SECRET;
  if (!rawUrl && !secret) return null;
  try {
    const url = new URL(rawUrl ?? "");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
      url.username || url.password || url.search || url.hash ||
      url.pathname !== "/api/integrations/enquiries" ||
      !secret || secret.trim().length < 32 || /[\r\n]/.test(secret)
    ) throw new Error();
    return { url: url.toString(), secret };
  } catch {
    // Never include environment values in diagnostics.
    throw new Error("Invalid CRM enquiry configuration");
  }
}

/** Validate without normalizing saved values; null message represents the form's empty message. */
export function savedCrmPayload(row: {
  id: string; createdAt: Date; name: string; email: string | null;
  phone: string | null; address: string | null; apartmentType: string | null;
  budget: string | null; message: string | null; crmPayload?: unknown;
}): CrmPayload | null {
  if (row.crmPayload) {
    const result = payloadSchema.safeParse(row.crmPayload);
    return result.success && result.data.id === row.id
      ? row.crmPayload as CrmPayload : null;
  }
  if (!Number.isFinite(row.createdAt.getTime())) return null;
  const payload = {
    id: row.id, name: row.name, email: row.email, phone: row.phone,
    address: row.address, apartmentType: row.apartmentType, budget: row.budget,
    message: row.message ?? "", createdAt: row.createdAt.toISOString(),
  };
  return payloadSchema.safeParse(payload).success ? payload as CrmPayload : null;
}

export function retryDelay(attempt: number, random = Math.random): number {
  // Equal jitter, from 30–60 seconds initially to 30–60 minutes at the cap.
  const cap = Math.min(3_600_000, 60_000 * 2 ** Math.min(6, Math.max(0, attempt - 1)));
  return Math.floor(cap * (0.5 + random() * 0.5));
}

function retryAfter(value: string | null, now: number): number | undefined {
  if (!value) return undefined;
  // Clamp seconds before converting to milliseconds, including values that
  // overflow Number. Untrusted headers must not overflow the stored timestamp.
  if (/^\d+$/.test(value)) {
    return Math.min(Number(value), MAX_RETRY_AFTER_MS / 1000) * 1000;
  }
  const delay = Date.parse(value) - now;
  return Number.isFinite(delay) && delay >= 0
    ? Math.min(delay, MAX_RETRY_AFTER_MS) : undefined;
}

export async function sendCrmEnquiry(
  payload: CrmPayload,
  config: NonNullable<ReturnType<typeof getCrmConfig>>,
  fetcher: typeof fetch = fetch,
  timeoutMs = CRM_TIMEOUT_MS,
): Promise<CrmOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(config.url, {
      method: "POST", redirect: "manual", cache: "no-store",
      headers: { Authorization: `Bearer ${config.secret}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload), signal: controller.signal,
    });
    if (response.status === 200 || response.status === 201) {
      const result = z.object({ id: z.uuid(), companyId: z.uuid(), duplicate: z.boolean() })
        .safeParse(await response.json().catch(() => null));
      if (!result.success || result.data.id !== payload.id ||
          result.data.duplicate !== (response.status === 200)) {
        return { state: "pending", diagnostic: "invalid_acknowledgement" };
      }
      return { state: "delivered", companyId: result.data.companyId, diagnostic: null };
    }
    // Do not read or log error bodies: they may echo personal data.
    void response.body?.cancel().catch(() => {});
    const diagnostic = `http_${response.status}`;
    if (response.status === 429 || response.status >= 500) {
      return { state: "pending", diagnostic, retryAfter: retryAfter(response.headers.get("Retry-After"), Date.now()) };
    }
    return { state: "blocked", diagnostic };
  } catch {
    return { state: "pending", diagnostic: controller.signal.aborted ? "timeout" : "network_error" };
  } finally {
    clearTimeout(timer);
  }
}

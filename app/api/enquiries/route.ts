import { createHash, randomUUID } from "node:crypto";
import { after } from "next/server";
import { reserveEnquirySlot } from "@/lib/enquiry-quota";
import { getDb } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { enquirySchema, zodErrorToFieldErrors } from "@/lib/enquiry";
import { backupEnquiries, hasSheetsCredentials } from "@/lib/sheets";
import { deliverCrmEnquiry } from "@/lib/crm-delivery";

const CLIENT_HOURLY_LIMIT = 5;
const GLOBAL_HOURLY_LIMIT = 100;

let warnedClientIpHeader = false;

function getClientQuotaKey(request: Request): string {
  const header = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  const trustedHeaders = ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"];
  const trustedHeader =
    header && trustedHeaders.includes(header) ? header : undefined;
  if (!trustedHeader && !warnedClientIpHeader) {
    warnedClientIpHeader = true;
    console.warn(
      "CLIENT_IP_HEADER is unset or invalid. All enquiries share one client quota. Configure the header your ingress overwrites with the client IP.",
    );
  }
  const address =
    (trustedHeader ? request.headers.get(trustedHeader)?.trim() : undefined) ||
    "unknown";
  const digest = createHash("sha256")
    .update(address)
    .digest("hex")
    .slice(0, 32);

  return `client:${digest}`;
}

export async function POST(request: Request): Promise<Response> {
  let rawBody: unknown;
  try {
    const reader = request.body?.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let bytes = 0;
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.byteLength;
          if (bytes > 10000) {
            void reader.cancel().catch(() => {});
            return Response.json({ error: "Request is too large." }, { status: 413 });
          }
          text += decoder.decode(value, { stream: true });
        }
        text += decoder.decode();
      } finally {
        reader.releaseLock();
      }
    }
    rawBody = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) return Response.json({ error: "Invalid enquiry." }, { status: 400 });
  const input = rawBody as Record<string, unknown>;

  // A hidden field catches basic form-filling bots without revealing the trap.
  if (typeof input.companyWebsite === "string" && input.companyWebsite.trim()) {
    return Response.json({ id: randomUUID() }, { status: 201 });
  }

  const validation = enquirySchema.safeParse(input);
  if (!validation.success) {
    return Response.json(
      {
        error: "Please review the highlighted fields.",
        fields: zodErrorToFieldErrors(validation.error),
      },
      { status: 400 },
    );
  }
  const body = validation.data;
  try {
    if (!await reserveEnquirySlot(getClientQuotaKey(request), CLIENT_HOURLY_LIMIT)) {
      return Response.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
    }
    if (!await reserveEnquirySlot("global", GLOBAL_HOURLY_LIMIT)) {
      return Response.json({ error: "Too many enquiries. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
    }
  } catch (error) {
    console.error("Could not check enquiry quota", error);
    return Response.json({ error: "Could not save your enquiry. Please try again." }, { status: 503 });
  }
  const id = randomUUID();
  try {
    await getDb().insert(enquiries).values({
      id,
      name: body.name,
      email: body.email || null,
      phone: body.phone,
      address: body.address || null,
      apartmentType: body.apartmentType,
      budget: body.budget || null,
      message: body.message || null,
    });
  } catch (error) {
    console.error("Could not save enquiry", error);
    return Response.json({ error: "Could not save your enquiry. Please try again." }, { status: 500 });
  }
  if (process.env.CRM_ENQUIRY_ENABLED === "true") {
    after(async () => {
      try {
        await deliverCrmEnquiry({ enquiryId: id });
      } catch {
        console.error("Enquiry saved; CRM delivery is pending");
      }
    });
  }
  if (hasSheetsCredentials()) {
    after(async () => {
      try {
        await backupEnquiries(id);
      } catch (error) {
        console.error("Enquiry saved; Sheets backup is pending", error instanceof Error ? error.message : "Unknown Sheets error");
      }
    });
  }
  return Response.json({ id }, { status: 201 });
}

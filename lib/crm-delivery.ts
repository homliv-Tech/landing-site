import "server-only";
import { and, eq, inArray, isNull, lte, sql } from "drizzle-orm";
import { getDb } from "./db";
import { enquiries } from "./schema";
import { CRM_LEASE_MS, getCrmConfig, retryDelay, savedCrmPayload, sendCrmEnquiry } from "./crm-enquiry";

export type DeliveryOptions = { enquiryId?: string; backfillLegacy?: boolean };

/** Claim and commit before HTTP. A crashed worker's lease expires; its payload survives. */
export async function claimCrmEnquiry(options: DeliveryOptions = {}, db = getDb()) {
  return db.transaction(async (tx) => {
    const [row] = await tx.select().from(enquiries).where(and(
      isNull(enquiries.crmDeliveredAt),
      inArray(enquiries.crmState, options.backfillLegacy ? ["pending", "legacy"] : ["pending"]),
      lte(enquiries.crmNextAttemptAt, sql`now()`),
      options.enquiryId ? eq(enquiries.id, options.enquiryId) : undefined,
    )).orderBy(enquiries.crmNextAttemptAt, enquiries.createdAt).limit(1)
      .for("update", { skipLocked: true });
    if (!row) return null;
    const payload = savedCrmPayload(row);
    if (!payload) {
      await tx.update(enquiries).set({ crmState: "blocked", crmDiagnostic: "invalid_saved_enquiry" })
        .where(eq(enquiries.id, row.id));
      return { invalid: true as const };
    }
    const attempt = row.crmAttempts + 1;
    await tx.update(enquiries).set({
      crmState: "pending", crmPayload: payload, crmAttempts: attempt,
      crmNextAttemptAt: sql`now() + ${CRM_LEASE_MS} * interval '1 millisecond'`,
      crmDiagnostic: "in_flight",
    }).where(eq(enquiries.id, row.id));
    return { invalid: false as const, payload, attempt };
  });
}

/** One bounded attempt; never throws external response bodies or credentials. */
export async function deliverCrmEnquiry(options: DeliveryOptions = {}, db?: ReturnType<typeof getDb>) {
  const config = getCrmConfig();
  if (!config) return "disabled";
  db ??= getDb();
  const claim = await claimCrmEnquiry(options, db);
  if (!claim) return "idle";
  if (claim.invalid) return "blocked";
  const outcome = await sendCrmEnquiry(claim.payload, config);
  const nextDelay = outcome.state === "pending"
    ? Math.max(retryDelay(claim.attempt), outcome.retryAfter ?? 0) : 0;
  await db.update(enquiries).set({
    crmState: outcome.state,
    crmDiagnostic: outcome.diagnostic,
    ...(outcome.state === "delivered" ? {
      crmDeliveredAt: sql`now()`, crmCompanyId: outcome.companyId,
    } : outcome.state === "pending" ? {
      crmNextAttemptAt: sql`now() + ${nextDelay} * interval '1 millisecond'`,
    } : {}),
  }).where(and(
    eq(enquiries.id, claim.payload.id),
    eq(enquiries.crmAttempts, claim.attempt),
    isNull(enquiries.crmDeliveredAt),
  ));
  return outcome.state;
}

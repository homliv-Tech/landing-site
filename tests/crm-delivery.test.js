import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { readFileSync } from "node:fs";
import { enquiries } from "../lib/schema";
import { claimCrmEnquiry, deliverCrmEnquiry } from "../lib/crm-delivery";

// Real PostgreSQL SQL semantics in an isolated in-memory instance; no deployment DB.
const pg = new PGlite();
const db = drizzle(pg);
const row = {
  id: "11111111-1111-4111-8111-111111111111", name: "Test User",
  email: "test@example.com", phone: "+91 98765 43210", address: "Test Society",
  apartmentType: "2-bhk", budget: "10-20-lakh", message: "A project",
};
beforeAll(async () => {
  for (const migration of ["0000_rare_dreaming_celestial", "0001_motionless_snowbird", "0002_steep_blacklash"]) {
    await pg.exec(readFileSync(new URL(`../drizzle/${migration}.sql`, import.meta.url), "utf8"));
  }
  await pg.exec(`INSERT INTO enquiries (id, name) VALUES ('${row.id}', 'Legacy');`);
  await pg.exec(readFileSync(new URL("../drizzle/0003_daffy_cyclops.sql", import.meta.url), "utf8"));
  expect((await pg.query("SELECT crm_state FROM enquiries")).rows[0].crm_state).toBe("legacy");
});
beforeEach(async () => {
  await pg.exec("TRUNCATE enquiries");
  await db.insert(enquiries).values(row);
});
afterAll(() => pg.close());

test("insert creates durable pending state even if initial callback never runs", async () => {
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmState).toBe("pending");
  expect(saved.crmAttempts).toBe(0);
  expect((await claimCrmEnquiry({}, db)).payload.id).toBe(row.id);
});

test("overlapping claims send only once during lease; expired lease preserves payload", async () => {
  const results = await Promise.all([claimCrmEnquiry({}, db), claimCrmEnquiry({}, db)]);
  const claims = results.filter(Boolean);
  expect(claims).toHaveLength(1);
  expect(claims[0].attempt).toBe(1);
  await pg.exec("UPDATE enquiries SET name = 'Changed', crm_next_attempt_at = now() - interval '1 second'");
  const retried = await claimCrmEnquiry({}, db);
  expect(retried.attempt).toBe(2);
  expect(retried.payload).toEqual(claims[0].payload);
  expect(retried.payload.name).toBe(row.name);
});

test("legacy rows require explicit option and incomplete data is blocked", async () => {
  await pg.exec("UPDATE enquiries SET crm_state = 'legacy', address = NULL");
  expect(await claimCrmEnquiry({}, db)).toBeNull();
  expect(await claimCrmEnquiry({ backfillLegacy: true }, db)).toEqual({ invalid: true });
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmDiagnostic).toBe("invalid_saved_enquiry");
  expect(saved.crmState).toBe("blocked");
  expect(saved.crmAttempts).toBe(0);
  expect(await claimCrmEnquiry({ backfillLegacy: true }, db)).toBeNull();
});

test("successful and blocked rows are excluded even from legacy backfill", async () => {
  await pg.exec("UPDATE enquiries SET crm_delivered_at = now(), crm_state = 'delivered'");
  expect(await claimCrmEnquiry({ backfillLegacy: true }, db)).toBeNull();
  await pg.exec("UPDATE enquiries SET crm_delivered_at = NULL, crm_state = 'blocked'");
  expect(await claimCrmEnquiry({}, db)).toBeNull();
});

const originalFetch = globalThis.fetch;
const originalUrl = process.env.CRM_ENQUIRY_URL;
const originalSecret = process.env.CRM_ENQUIRY_SECRET;
const companyId = "22222222-2222-4222-8222-222222222222";
beforeEach(() => {
  process.env.CRM_ENQUIRY_URL = "https://crm.example/api/integrations/enquiries";
  process.env.CRM_ENQUIRY_SECRET = "s".repeat(32);
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.CRM_ENQUIRY_URL;
  else process.env.CRM_ENQUIRY_URL = originalUrl;
  if (originalSecret === undefined) delete process.env.CRM_ENQUIRY_SECRET;
  else process.env.CRM_ENQUIRY_SECRET = originalSecret;
});

test.each([200, 201])("HTTP %i marks delivery durably and excludes later attempts", async (status) => {
  let requests = 0;
  globalThis.fetch = async (_, request) => {
    requests++;
    const payload = JSON.parse(request.body);
    return Response.json({ id: payload.id, companyId, duplicate: status === 200 }, { status });
  };
  expect(await deliverCrmEnquiry({}, db)).toBe("delivered");
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmCompanyId).toBe(companyId);
  expect(saved.crmDeliveredAt).toBeInstanceOf(Date);
  expect(saved.crmAttempts).toBe(1);
  expect(await deliverCrmEnquiry({ backfillLegacy: true }, db)).toBe("idle");
  expect(requests).toBe(1);
});

test("outage persists retry state, Retry-After, and exact payload for recovery", async () => {
  let firstPayload;
  globalThis.fetch = async (_, request) => {
    firstPayload = request.body;
    return new Response(null, { status: 503, headers: { "Retry-After": "300" } });
  };
  expect(await deliverCrmEnquiry({}, db)).toBe("pending");
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmDiagnostic).toBe("http_503");
  expect(saved.crmDeliveredAt).toBeNull();
  expect(saved.crmNextAttemptAt.getTime()).toBeGreaterThan(Date.now() + 298000);
  expect(await deliverCrmEnquiry({}, db)).toBe("idle");
  await pg.exec("UPDATE enquiries SET crm_next_attempt_at = now() - interval '1 second', name = 'Changed'");
  globalThis.fetch = async (_, request) => {
    expect(JSON.parse(request.body)).toEqual(JSON.parse(firstPayload));
    return Response.json({ id: row.id, companyId, duplicate: true });
  };
  expect(await deliverCrmEnquiry({}, db)).toBe("delivered");
});

test("conflict is flagged without replacing UUID or retrying automatically", async () => {
  globalThis.fetch = async () => new Response(null, { status: 409 });
  expect(await deliverCrmEnquiry({}, db)).toBe("blocked");
  const [saved] = await db.select().from(enquiries);
  expect(saved.id).toBe(row.id);
  expect(saved.crmDiagnostic).toBe("http_409");
  expect(saved.crmCompanyId).toBeNull();
  expect(await deliverCrmEnquiry({ backfillLegacy: true }, db)).toBe("idle");
});

test("oversized Retry-After commits a bounded retry timestamp", async () => {
  globalThis.fetch = async () => new Response(null, {
    status: 429, headers: { "Retry-After": "999999999999999999999999" },
  });
  const before = Date.now();
  expect(await deliverCrmEnquiry({}, db)).toBe("pending");
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmDiagnostic).toBe("http_429");
  expect(saved.crmNextAttemptAt.getTime()).toBeGreaterThanOrEqual(before + 86400000);
  expect(saved.crmNextAttemptAt.getTime()).toBeLessThanOrEqual(Date.now() + 86400000);
  expect(await deliverCrmEnquiry({}, db)).toBe("idle");
});

test("late result from an expired lease cannot overwrite a newer claim", async () => {
  let release;
  let started;
  const ready = new Promise((resolve) => { started = resolve; });
  globalThis.fetch = async () => {
    started();
    await new Promise((resolve) => { release = resolve; });
    return new Response(null, { status: 409 });
  };
  const first = deliverCrmEnquiry({}, db);
  await ready;
  expect(await deliverCrmEnquiry({}, db)).toBe("idle");
  await pg.exec("UPDATE enquiries SET crm_next_attempt_at = now() - interval '1 second'");
  const second = await claimCrmEnquiry({}, db);
  expect(second.attempt).toBe(2);
  release();
  await first;
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmState).toBe("pending");
  expect(saved.crmDiagnostic).toBe("in_flight");
  expect(saved.crmAttempts).toBe(2);
});

test("a real delivery timeout commits a durable pending retry", async () => {
  globalThis.fetch = async (_, { signal }) => new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(new Error("aborted")));
  });
  expect(await deliverCrmEnquiry({}, db)).toBe("pending");
  const [saved] = await db.select().from(enquiries);
  expect(saved.crmDiagnostic).toBe("timeout");
  expect(saved.crmAttempts).toBe(1);
  expect(saved.crmDeliveredAt).toBeNull();
  expect(saved.crmNextAttemptAt.getTime()).toBeGreaterThan(Date.now());
  expect(saved.crmPayload.id).toBe(row.id);
}, 15000);

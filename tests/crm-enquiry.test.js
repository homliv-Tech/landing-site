import { expect, test } from "bun:test";
import { getCrmConfig, retryDelay, savedCrmPayload, sendCrmEnquiry } from "../lib/crm-enquiry";

const row = {
  id: "11111111-1111-4111-8111-111111111111", createdAt: new Date("2026-11-04T08:00:00Z"),
  name: "Test User", email: "test@example.com", phone: "+91 98765 43210",
  address: "Test Society", apartmentType: "2-bhk", budget: "10-20-lakh", message: null,
};
const payload = savedCrmPayload(row);
const companyId = "22222222-2222-4222-8222-222222222222";
const config = { url: "https://crm.example/api/integrations/enquiries", secret: "s".repeat(32) };

test("CRM configuration is optional, private, and validates endpoint and secret", () => {
  expect(getCrmConfig({})).toBeNull();
  expect(getCrmConfig({ CRM_ENQUIRY_URL: config.url, CRM_ENQUIRY_SECRET: config.secret })).toEqual(config);
  for (const env of [
    { CRM_ENQUIRY_URL: config.url },
    { CRM_ENQUIRY_URL: config.url, CRM_ENQUIRY_SECRET: "short" },
    { CRM_ENQUIRY_URL: "http://crm.example/api/integrations/enquiries", CRM_ENQUIRY_SECRET: config.secret },
    { CRM_ENQUIRY_URL: config.url + "?secret=test", CRM_ENQUIRY_SECRET: config.secret },
  ]) expect(() => getCrmConfig(env)).toThrow("Invalid CRM enquiry configuration");
});

test("saved payload excludes metadata and preserves original values and timestamp", () => {
  expect(payload).toEqual({ ...row, createdAt: "2026-11-04T08:00:00.000Z", message: "" });
  expect(savedCrmPayload({ ...row, name: "Changed", crmPayload: payload })).toEqual(payload);
  expect(savedCrmPayload({ ...row, address: null })).toBeNull();
  expect(savedCrmPayload({ ...row, apartmentType: "unknown" })).toBeNull();
});

test.each([200, 201])("valid %i acknowledgement succeeds with exact request contract", async (status) => {
  const result = await sendCrmEnquiry(payload, config, async (url, request) => {
    expect(url).toBe(config.url);
    expect(request.redirect).toBe("manual");
    expect(request.cache).toBe("no-store");
    expect(request.headers.Authorization).toBe(`Bearer ${config.secret}`);
    expect(request.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(request.body)).toEqual(payload);
    return Response.json({ id: payload.id, companyId, duplicate: status === 200 }, { status });
  });
  expect(result).toEqual({ state: "delivered", companyId, diagnostic: null });
});

test.each([
  { id: companyId, companyId, duplicate: false },
  { id: payload.id, companyId: "invalid", duplicate: false },
  { id: payload.id, companyId, duplicate: true },
  {},
])("invalid acknowledgements remain pending", async (ack) => {
  expect((await sendCrmEnquiry(payload, config, async () => Response.json(ack, { status: 201 }))).diagnostic)
    .toBe("invalid_acknowledgement");
});

test.each([400, 401, 409, 413, 415, 302])("HTTP %i blocks delivery for correction", async (status) => {
  expect(await sendCrmEnquiry(payload, config, async () => new Response("private body", { status })))
    .toEqual({ state: "blocked", diagnostic: `http_${status}` });
});

test.each([429, 500, 503])("HTTP %i is retryable and honors Retry-After", async (status) => {
  const result = await sendCrmEnquiry(payload, config, async () => new Response(null, { status, headers: { "Retry-After": "120" } }));
  expect(result).toEqual({ state: "pending", diagnostic: `http_${status}`, retryAfter: 120000 });
});

test.each([
  ["0", 0],
  ["86400", 86400000],
  ["86401", 86400000],
  ["999999999999999999999999", 86400000],
  ["9".repeat(400), 86400000],
  ["Fri, 01 Jan 9999 00:00:00 GMT", 86400000],
  ["invalid", undefined],
  ["Wed, 01 Jan 2020 00:00:00 GMT", undefined],
])("Retry-After %s produces a bounded delay", async (header, expected) => {
  const result = await sendCrmEnquiry(payload, config, async () => new Response(null, {
    status: 429, headers: { "Retry-After": header },
  }));
  expect(result.state).toBe("pending");
  expect(result.retryAfter).toBe(expected);
});

test("HTTP-date Retry-After, network failures, and timeouts", async () => {
  const date = new Date(Date.now() + 300000).toUTCString();
  const result = await sendCrmEnquiry(payload, config, async () => new Response(null, { status: 503, headers: { "Retry-After": date } }));
  expect(result.retryAfter).toBeGreaterThan(298000);
  expect((await sendCrmEnquiry(payload, config, async () => { throw new Error("private network detail"); })).diagnostic).toBe("network_error");
  const timeout = await sendCrmEnquiry(payload, config, async (_, { signal }) => new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(new Error("aborted")));
  }), 5);
  expect(timeout).toEqual({ state: "pending", diagnostic: "timeout" });
});

test("backoff is exponential, jittered, and bounded", () => {
  expect(retryDelay(1, () => 0)).toBe(30000);
  expect(retryDelay(2, () => 1)).toBe(120000);
  expect(retryDelay(1000, () => 1)).toBe(3600000);
});

import { beforeEach, expect, mock, test } from "bun:test";

let allowed = true;
let quotaFails = false;
let quotaChecks = 0;
let inserts = 0;
let backups = 0;
mock.module("@/lib/enquiry-quota", () => ({
  reserveEnquirySlot: async () => {
    quotaChecks++;
    if (quotaFails) throw new Error("unavailable");
    return allowed;
  },
}));
mock.module("@/lib/db", () => ({ getDb: () => ({ insert: () => ({ values: async () => { inserts++; } }) }) }));
mock.module("@/lib/sheets", () => ({ backupEnquiries: async () => { backups++; } }));
const { POST } = await import("../app/api/enquiries/route");
const valid = { name: "Test", email: "test@example.com", message: "A project" };
const request = (body) => new Request("http://localhost/api/enquiries", { method: "POST", body: JSON.stringify(body) });
beforeEach(() => { allowed = true; quotaFails = false; quotaChecks = 0; inserts = 0; backups = 0; });

test("invalid requests do not consume quota", async () => {
  expect((await POST(request({ ...valid, email: "invalid" }))).status).toBe(400);
  expect(quotaChecks).toBe(0);
  expect(inserts).toBe(0);
});
test("exhausted quota prevents insert and backup", async () => {
  allowed = false;
  const response = await POST(request(valid));
  expect(response.status).toBe(429);
  expect(response.headers.get("Retry-After")).toBe("3600");
  expect(inserts).toBe(0);
  expect(backups).toBe(0);
});
test("quota failure prevents insert and backup", async () => {
  quotaFails = true;
  const response = await POST(request(valid));
  expect(response.status).toBe(503);
  expect(inserts).toBe(0);
  expect(backups).toBe(0);
});
test("available quota permits an enquiry and backup", async () => {
  expect((await POST(request(valid))).status).toBe(201);
  expect(quotaChecks).toBe(1);
  expect(inserts).toBe(1);
  expect(backups).toBe(1);
});

test("rejects streamed bodies over the byte limit before quota or insert", async () => {
  const encoder = new TextEncoder();
  const chunks = [encoder.encode('{"message":"'), encoder.encode("é".repeat(5000)), encoder.encode('"}')];
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { controller.enqueue(chunks.shift()); },
    cancel() { cancelled = true; },
  });
  const response = await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: stream, duplex: "half" }));
  expect(response.status).toBe(413);
  expect(cancelled).toBe(true);
  expect(quotaChecks).toBe(0);
  expect(inserts).toBe(0);
  expect(backups).toBe(0);
});
test("decodes multibyte characters split across chunks", async () => {
  const bytes = new TextEncoder().encode(JSON.stringify({ ...valid, name: "André" }));
  const split = bytes.indexOf(0xc3) + 1;
  const chunks = [bytes.slice(0, split), bytes.slice(split)];
  const stream = new ReadableStream({
    pull(controller) { if (chunks.length) controller.enqueue(chunks.shift()); else controller.close(); },
  });
  expect((await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: stream, duplex: "half" }))).status).toBe(201);
});

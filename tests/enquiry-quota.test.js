import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";
import * as crmDelivery from "../lib/crm-delivery";
import { PgDialect } from "drizzle-orm/pg-core";

let allowed = true;
let quotaFails = false;
let quotaResults = [];
let quotaChecks = [];
let inserts = 0;
let afterCallbacks = [];
let storedRows = [];
let markedIds = [];
let appendRequests = [];
let selectionParams = [];
let insertFails = false;
let sheetsFails = false;
let confirmsAppend = true;
let errorLog;
let warningLog;
const dialect = new PgDialect();
const credentialKeys = [
  "CRM_ENQUIRY_ENABLED",
  "CRM_ENQUIRY_URL",
  "CRM_ENQUIRY_SECRET",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
];
const originalCredentials = Object.fromEntries(
  credentialKeys.map((key) => [key, process.env[key]]),
);
const originalClientIpHeader = process.env.CLIENT_IP_HEADER;
mock.module("@/lib/enquiry-quota", () => ({
  reserveEnquirySlot: async (key, limit) => {
    quotaChecks.push({ key, limit });
    if (quotaFails) throw new Error("unavailable");
    return quotaResults.length ? quotaResults.shift() : allowed;
  },
}));
mock.module("@/lib/db", () => ({
  getDb: () => ({
    insert: () => ({
      values: async (data) => {
        if (insertFails) throw new Error("Database unavailable");
        inserts++;
        storedRows.push({
          ...data,
          createdAt: new Date(),
          sheetsBackedUpAt: null,
        });
      },
    }),
    transaction: async (callback) =>
      callback({
        select: () => ({
          from: () => ({
            where: (condition) => {
              selectionParams = dialect.sqlToQuery(condition).params;
              return {
                orderBy: () => ({
                  limit: (limit) => ({
                    for: async (lock, options) => {
                      expect(lock).toBe("update");
                      expect(options).toEqual({ skipLocked: true });
                      return storedRows
                        .filter(
                          (row) =>
                            !markedIds.includes(row.id) &&
                            (!selectionParams.length ||
                              row.id === selectionParams[0]),
                        )
                        .slice(0, limit);
                    },
                  }),
                }),
              };
            },
          }),
        }),
        update: () => ({
          set: () => ({
            where: async (condition) => {
              markedIds.push(...dialect.sqlToQuery(condition).params);
            },
          }),
        }),
      }),
  }),
}));
mock.module("google-auth-library", () => ({
  JWT: class {
    async request(options) {
      appendRequests.push(options);
      if (sheetsFails) throw new Error("Google Sheets is unavailable");
      return {
        status: 200,
        data: {
          updates: {
            updatedRows: confirmsAppend ? options.data.values.length : 0,
          },
        },
      };
    }
  },
}));
mock.module("next/server", () => ({
  after: (callback) => {
    afterCallbacks.push(callback);
  },
}));
let crmCalls = [];
let crmFails = false;
let crmSpy;
const { POST } = await import("../app/api/enquiries/route");
const { backupEnquiries } = await import("../lib/sheets");
const valid = {
  name: "Test User",
  email: "test@example.com",
  phone: "+91 98765 43210",
  address: "Test Society",
  apartmentType: "2-bhk",
  budget: "10-20-lakh",
  message: "A project",
};
const request = (body, headers = {}) =>
  new Request("http://localhost/api/enquiries", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
beforeEach(() => {
  crmSpy = spyOn(crmDelivery, "deliverCrmEnquiry").mockImplementation(async (options) => {
    crmCalls.push(options);
    if (crmFails) throw new Error("unavailable");
  });
  crmCalls = [];
  crmFails = false;
  delete process.env.CRM_ENQUIRY_ENABLED;
  allowed = true;
  quotaFails = false;
  quotaResults = [];
  quotaChecks = [];
  inserts = 0;
  storedRows = [];
  markedIds = [];
  appendRequests = [];
  selectionParams = [];
  afterCallbacks = [];
  insertFails = false;
  sheetsFails = false;
  confirmsAppend = true;
  process.env.CLIENT_IP_HEADER = "x-real-ip";
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL =
    "backup@example.iam.gserviceaccount.com";
  process.env.GOOGLE_PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\\nexample\\n-----END PRIVATE KEY-----";
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "test-spreadsheet";
  errorLog = spyOn(console, "error").mockImplementation(() => {});
  warningLog = spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  crmSpy.mockRestore();
  errorLog.mockRestore();
  warningLog.mockRestore();
  if (originalClientIpHeader === undefined) delete process.env.CLIENT_IP_HEADER;
  else process.env.CLIENT_IP_HEADER = originalClientIpHeader;
  for (const key of credentialKeys) {
    if (originalCredentials[key] === undefined) delete process.env[key];
    else process.env[key] = originalCredentials[key];
  }
});

test("client quota uses only the configured ingress header", async () => {
  process.env.CLIENT_IP_HEADER = "X-Real-IP";
  await POST(request(valid, { "x-real-ip": "192.0.2.1", "cf-connecting-ip": "198.51.100.1", "x-forwarded-for": "203.0.113.1" }));
  const firstKey = quotaChecks[0].key;
  await POST(request(valid, { "x-real-ip": "192.0.2.1", "cf-connecting-ip": "198.51.100.2", "x-forwarded-for": "203.0.113.2" }));
  expect(quotaChecks[2].key).toBe(firstKey);
  await POST(request(valid, { "x-real-ip": "192.0.2.2" }));
  expect(quotaChecks[4].key).not.toBe(firstKey);
  expect(warningLog).not.toHaveBeenCalled();
});

test("missing or invalid configuration and empty headers share a quota", async () => {
  delete process.env.CLIENT_IP_HEADER;
  await POST(request(valid, { "user-agent": "first", "x-real-ip": "192.0.2.1" }));
  expect(warningLog).toHaveBeenCalledTimes(1);
  expect(warningLog.mock.calls[0][0]).toContain("CLIENT_IP_HEADER is unset or invalid");
  const fallbackKey = quotaChecks[0].key;
  process.env.CLIENT_IP_HEADER = "invalid header";
  await POST(request(valid, { "user-agent": "second" }));
  process.env.CLIENT_IP_HEADER = "x-real-ip";
  await POST(request(valid, { "user-agent": "third", "x-forwarded-for": "203.0.113.1" }));
  expect(quotaChecks[2].key).toBe(fallbackKey);
  expect(quotaChecks[4].key).toBe(fallbackKey);
  expect(warningLog).toHaveBeenCalledTimes(1);
});

test("invalid requests do not consume quota", async () => {
  expect((await POST(request({ ...valid, email: "invalid" }))).status).toBe(
    400,
  );
  expect(quotaChecks).toHaveLength(0);
  expect(inserts).toBe(0);
});
test("empty fields are rejected before quota or storage", async () => {
  const response = await POST(request({}));
  const result = await response.json();
  expect(response.status).toBe(400);
  expect(result.fields).toEqual({
    name: "Enter your full name.",
    email: "Enter your email address.",
    phone: "Enter your phone number.",
    address: "Enter your apartment address.",
    apartmentType: "Select your apartment type.",
    budget: "Select your budget range.",
  });
  expect(quotaChecks).toHaveLength(0);
  expect(inserts).toBe(0);
});
test.each(["", "   ", undefined])("blank or omitted requirements are saved successfully (%s)", async (message) => {
  const response = await POST(request({ ...valid, message }));
  expect(response.status).toBe(201);
  expect(storedRows[0].message).toBeNull();
  expect(afterCallbacks).toHaveLength(1);
  await Promise.all(afterCallbacks.map((callback) => callback()));
  expect(appendRequests).toHaveLength(1);
  expect(markedIds).toEqual([storedRows[0].id]);
});
test("honeypot submissions receive a neutral success without storage", async () => {
  const response = await POST(
    request({ ...valid, companyWebsite: "https://spam.example" }),
  );
  expect(response.status).toBe(201);
  expect(quotaChecks).toHaveLength(0);
  expect(inserts).toBe(0);
  expect(appendRequests).toHaveLength(0);
});
test("exhausted client quota prevents insert and backup", async () => {
  quotaResults = [false];
  const response = await POST(request(valid));
  expect(response.status).toBe(429);
  expect(response.headers.get("Retry-After")).toBe("3600");
  expect(quotaChecks).toHaveLength(1);
  expect(inserts).toBe(0);
  expect(appendRequests).toHaveLength(0);
});
test("exhausted global quota prevents insert and backup", async () => {
  quotaResults = [true, false];
  expect((await POST(request(valid))).status).toBe(429);
  expect(quotaChecks).toHaveLength(2);
  expect(quotaChecks[1]).toEqual({ key: "global", limit: 100 });
  expect(inserts).toBe(0);
});
test("quota failure prevents insert and backup", async () => {
  quotaFails = true;
  const response = await POST(request(valid));
  expect(response.status).toBe(503);
  expect(inserts).toBe(0);
  expect(appendRequests).toHaveLength(0);
});
test("each database insert schedules an append for that exact enquiry", async () => {
  const response = await POST(request(valid));
  const { id } = await response.json();
  expect(response.status).toBe(201);
  expect(quotaChecks).toHaveLength(2);
  expect(quotaChecks[0].key).toStartWith("client:");
  expect(quotaChecks[0].limit).toBe(5);
  expect(inserts).toBe(1);
  expect(appendRequests).toHaveLength(0);
  await Promise.all(afterCallbacks.map((callback) => callback()));
  expect(appendRequests).toHaveLength(1);
  expect(selectionParams).toEqual([id]);
  expect(appendRequests[0].data.values[0][0]).toBe(id);
  expect(appendRequests[0].url).toContain("valueInputOption=RAW");
  expect(markedIds).toEqual([id]);
});

test("missing optional Sheets credentials leaves the enquiry saved without CRM delivery", async () => {
  for (const key of credentialKeys) delete process.env[key];
  expect((await POST(request(valid))).status).toBe(201);
  expect(inserts).toBe(1);
  expect(afterCallbacks).toHaveLength(0);
  expect(crmCalls).toHaveLength(0);
  expect(appendRequests).toHaveLength(0);
});

test("a new enquiry is appended directly even when more than a batch is pending", async () => {
  storedRows = Array.from({ length: 51 }, (_, index) => ({
    ...valid,
    id: `older-${index}`,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    sheetsBackedUpAt: null,
  }));
  const response = await POST(request(valid));
  const { id } = await response.json();
  await Promise.all(afterCallbacks.map((callback) => callback()));

  expect(appendRequests).toHaveLength(1);
  expect(appendRequests[0].data.values).toHaveLength(1);
  expect(appendRequests[0].data.values[0][0]).toBe(id);
  expect(markedIds).toEqual([id]);
});

test("a failed database insert never schedules a Sheets append", async () => {
  insertFails = true;
  expect((await POST(request(valid))).status).toBe(500);
  expect(afterCallbacks).toHaveLength(0);
  expect(appendRequests).toHaveLength(0);
});

test("a Sheets failure keeps a saved enquiry pending for a successful retry", async () => {
  sheetsFails = true;
  const response = await POST(request(valid));
  const { id } = await response.json();
  expect(response.status).toBe(201);
  await Promise.all(afterCallbacks.map((callback) => callback()));
  expect(markedIds).toHaveLength(0);
  expect(storedRows).toHaveLength(1);

  sheetsFails = false;
  expect(await backupEnquiries()).toBe(1);
  expect(markedIds).toEqual([id]);
  expect(await backupEnquiries(id)).toBe(0);
  expect(appendRequests).toHaveLength(2);
});

test("an unconfirmed append is never marked as backed up", async () => {
  confirmsAppend = false;
  await POST(request(valid));
  await Promise.all(afterCallbacks.map((callback) => callback()));
  expect(appendRequests).toHaveLength(1);
  expect(markedIds).toHaveLength(0);
});

test("rejects streamed bodies over the byte limit before quota or insert", async () => {
  const encoder = new TextEncoder();
  const chunks = [
    encoder.encode('{"message":"'),
    encoder.encode("é".repeat(5000)),
    encoder.encode('"}'),
  ];
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) {
      controller.enqueue(chunks.shift());
    },
    cancel() {
      cancelled = true;
    },
  });
  const response = await POST(
    new Request("http://localhost/api/enquiries", {
      method: "POST",
      body: stream,
      duplex: "half",
    }),
  );
  expect(response.status).toBe(413);
  expect(cancelled).toBe(true);
  expect(quotaChecks).toHaveLength(0);
  expect(inserts).toBe(0);
  expect(appendRequests).toHaveLength(0);
});
test("decodes multibyte characters split across chunks", async () => {
  const bytes = new TextEncoder().encode(
    JSON.stringify({ ...valid, name: "André" }),
  );
  const split = bytes.indexOf(0xc3) + 1;
  const chunks = [bytes.slice(0, split), bytes.slice(split)];
  const stream = new ReadableStream({
    pull(controller) {
      if (chunks.length) controller.enqueue(chunks.shift());
      else controller.close();
    },
  });
  expect(
    (
      await POST(
        new Request("http://localhost/api/enquiries", {
          method: "POST",
          body: stream,
          duplex: "half",
        }),
      )
    ).status,
  ).toBe(201);
});

test("CRM failure preserves local success and independent Sheets backup", async () => {
  process.env.CRM_ENQUIRY_ENABLED = "true";
  crmFails = true;
  const response = await POST(request(valid));
  const result = await response.json();
  expect(response.status).toBe(201);
  expect(Object.keys(result)).toEqual(["id"]);
  await Promise.all(afterCallbacks.map((callback) => callback()));
  expect(crmCalls).toEqual([{ enquiryId: result.id }]);
  expect(storedRows).toHaveLength(1);
  expect(markedIds).toEqual([result.id]);
});

test.each([undefined, "false"])("Sheets submission skips CRM even with credentials present (%s)", async (enabled) => {
  if (enabled !== undefined) process.env.CRM_ENQUIRY_ENABLED = enabled;
  process.env.CRM_ENQUIRY_URL = "https://crm.example/api/integrations/enquiries";
  process.env.CRM_ENQUIRY_SECRET = "s".repeat(32);
  const response = await POST(request(valid));
  expect(response.status).toBe(201);
  const { id } = await response.json();
  expect(afterCallbacks).toHaveLength(1);
  await Promise.all(afterCallbacks.map((callback) => callback()));
  expect(crmCalls).toHaveLength(0);
  expect(appendRequests).toHaveLength(1);
  expect(markedIds).toEqual([id]);
});

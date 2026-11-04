import { expect, test } from "bun:test";
import {
  getSheetsConfig,
  hasSheetsCredentials,
} from "../lib/sheets-config";
import {
  ENQUIRY_SHEET_HEADERS,
  toEnquirySheetRow,
} from "../lib/sheets-row";

const validEnvironment = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL:
    "homliv-backup@example-project.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY:
    "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n",
  GOOGLE_SHEETS_SPREADSHEET_ID: "sheet-id_123",
  GOOGLE_SHEETS_TAB: "Enquiries",
};

test("Sheets integration stays disabled when credentials are absent", () => {
  expect(hasSheetsCredentials({})).toBe(false);
  expect(getSheetsConfig({})).toBeNull();
});

test("partial Sheets credentials fail with a useful configuration error", () => {
  expect(() =>
    getSheetsConfig({
      GOOGLE_SERVICE_ACCOUNT_EMAIL:
        "homliv-backup@example-project.iam.gserviceaccount.com",
    }),
  ).toThrow("Invalid Google Sheets configuration");
});

test("Sheets credentials are validated and private-key newlines normalized", () => {
  const config = getSheetsConfig(validEnvironment);

  expect(config).not.toBeNull();
  expect(config?.privateKey).toContain("PRIVATE KEY-----\nabc123\n-----END");
  expect(config?.tab).toBe("Enquiries");
});

test("enquiry rows retain the documented A:J sheet column order", () => {
  const row = toEnquirySheetRow({
    id: "11111111-1111-4111-8111-111111111111",
    createdAt: new Date("2026-11-02T10:00:00.000Z"),
    name: "Test User",
    email: "test@example.com",
    phone: "+91 98765 43210",
    message: "Kitchen and wardrobes",
    address: "Test Society",
    apartmentType: "2-bhk",
    budget: "10-20-lakh",
    sheetsBackedUpAt: null,
  });

  expect(ENQUIRY_SHEET_HEADERS).toHaveLength(10);
  expect(row).toHaveLength(ENQUIRY_SHEET_HEADERS.length);
  expect(row).toEqual([
    "11111111-1111-4111-8111-111111111111",
    "2026-11-02T10:00:00.000Z",
    "Test User",
    "test@example.com",
    "+91 98765 43210",
    "Kitchen and wardrobes",
    "Test Society",
    "2 BHK",
    "₹10–20 lakh",
    "Website",
  ]);
});

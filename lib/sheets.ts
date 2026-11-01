import { inArray, isNull } from "drizzle-orm";
import { JWT } from "google-auth-library";
import { getDb } from "./db";
import { enquiries } from "./schema";

/** An interrupted append may result in a duplicate; the enquiry ID identifies it. */
export async function backupEnquiries() {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEETS_SPREADSHEET_ID } = process.env;
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error("Google Sheets credentials are not configured");
  }
  const auth = new JWT({ email: GOOGLE_SERVICE_ACCOUNT_EMAIL, key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  return getDb().transaction(async (tx) => {
    const rows = await tx.select().from(enquiries).where(isNull(enquiries.sheetsBackedUpAt))
      .orderBy(enquiries.createdAt).limit(50).for("update", { skipLocked: true });
    if (!rows.length) return 0;
    const tab = (process.env.GOOGLE_SHEETS_TAB || "Enquiries").replace(/'/g, "''");
    const range = encodeURIComponent(`'${tab}'!A:F`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(GOOGLE_SHEETS_SPREADSHEET_ID)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
    const response = await auth.request({ url, method: "POST", data: { values: rows.map((row) => [row.id, row.createdAt.toISOString(), row.name, row.email, row.phone ?? "", row.message]) }, timeout: 10000 });
    if (response.status !== 200) throw new Error(`Sheets returned ${response.status}`);
    await tx.update(enquiries).set({ sheetsBackedUpAt: new Date() }).where(inArray(enquiries.id, rows.map((row) => row.id)));
    return rows.length;
  });
}

import { and, eq, inArray, isNull } from "drizzle-orm";
import { JWT } from "google-auth-library";
import { getDb } from "./db";
import { enquiries } from "./schema";
import { getSheetsConfig, hasSheetsCredentials } from "./sheets-config";
import { toEnquirySheetRow } from "./sheets-row";

export { hasSheetsCredentials };

/** Pass an ID after an insert, or omit it to retry a batch of pending rows. */
export async function backupEnquiries(enquiryId?: string) {
  const config = getSheetsConfig();
  if (!config) {
    throw new Error("Google Sheets credentials are not configured");
  }
  const auth = new JWT({
    email: config.serviceAccountEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return getDb().transaction(async (tx) => {
    // Row locks coordinate the immediate append and retry job for the same ID.
    const rows = await tx
      .select()
      .from(enquiries)
      .where(
        and(
          isNull(enquiries.sheetsBackedUpAt),
          enquiryId ? eq(enquiries.id, enquiryId) : undefined,
        ),
      )
      .orderBy(enquiries.createdAt)
      .limit(enquiryId ? 1 : 50)
      .for("update", { skipLocked: true });
    if (!rows.length) return 0;
    const tab = config.tab.replace(/'/g, "''");
    const range = encodeURIComponent(`'${tab}'!A:J`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
    const response = await auth.request<{ updates?: { updatedRows?: number } }>(
      {
        url,
        method: "POST",
        data: {
          values: rows.map(toEnquirySheetRow),
        },
        timeout: 10000,
      },
    );
    if (
      response.status !== 200 ||
      response.data.updates?.updatedRows !== rows.length
    ) {
      throw new Error(
        "Google Sheets did not confirm every appended enquiry. Backup is pending.",
      );
    }
    await tx
      .update(enquiries)
      .set({ sheetsBackedUpAt: new Date() })
      .where(
        inArray(
          enquiries.id,
          rows.map((row) => row.id),
        ),
      );
    return rows.length;
  });
}

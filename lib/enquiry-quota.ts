import { sql } from "drizzle-orm";
import { getDb } from "./db";

/** Atomically reserve one of the shared hourly slots across all instances. */
export async function reserveEnquirySlot(): Promise<boolean> {
  const result = await getDb().execute(sql`
    INSERT INTO enquiry_quota (key, window_started_at, count)
    VALUES ('global', now(), 1)
    ON CONFLICT (key) DO UPDATE SET
      window_started_at = CASE
        WHEN enquiry_quota.window_started_at <= now() - interval '1 hour' THEN now()
        ELSE enquiry_quota.window_started_at END,
      count = CASE
        WHEN enquiry_quota.window_started_at <= now() - interval '1 hour' THEN 1
        ELSE enquiry_quota.count + 1 END
    WHERE enquiry_quota.window_started_at <= now() - interval '1 hour'
       OR enquiry_quota.count < 100
    RETURNING key
  `);
  return result.rows.length > 0;
}

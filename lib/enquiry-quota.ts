import { sql } from "drizzle-orm";
import { getDb } from "./db";

/** Atomically reserve one hourly slot for a hashed client or the global cap. */
export async function reserveEnquirySlot(
  key: string,
  limit: number,
): Promise<boolean> {
  const db = getDb();

  // Client keys are pseudonymous and only useful for the active rate window.
  await db.execute(sql`
    DELETE FROM enquiry_quota
    WHERE key <> 'global'
      AND window_started_at <= now() - interval '24 hours'
  `);

  const result = await db.execute(sql`
    INSERT INTO enquiry_quota (key, window_started_at, count)
    VALUES (${key}, now(), 1)
    ON CONFLICT (key) DO UPDATE SET
      window_started_at = CASE
        WHEN enquiry_quota.window_started_at <= now() - interval '1 hour' THEN now()
        ELSE enquiry_quota.window_started_at END,
      count = CASE
        WHEN enquiry_quota.window_started_at <= now() - interval '1 hour' THEN 1
        ELSE enquiry_quota.count + 1 END
    WHERE enquiry_quota.window_started_at <= now() - interval '1 hour'
       OR enquiry_quota.count < ${limit}
    RETURNING key
  `);
  return result.rows.length > 0;
}

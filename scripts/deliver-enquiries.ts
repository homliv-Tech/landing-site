import { loadEnvConfig } from "@next/env";
import { deliverCrmEnquiry } from "../lib/crm-delivery";
import { getCrmConfig } from "../lib/crm-enquiry";
import { getPool } from "../lib/db";

loadEnvConfig(process.cwd());
let opened = false;
try {
  const args = process.argv.slice(2);
  const backfillLegacy = args.includes("--backfill-legacy");
  const limitArg = args.find((arg) => arg.startsWith("--limit="));
  if (args.some((arg) => arg !== "--backfill-legacy" && arg !== limitArg)) {
    throw new Error("Use --limit=1..500 and optionally --backfill-legacy");
  }
  const limit = limitArg ? Number(limitArg.slice(8)) : 25;
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error("Limit must be 1..500");
  if (!getCrmConfig()) throw new Error("CRM enquiry delivery is not configured");
  const counts = { delivered: 0, pending: 0, blocked: 0 };
  for (let i = 0; i < limit; i++) {
    opened = true;
    const result = await deliverCrmEnquiry({ backfillLegacy });
    if (result === "idle" || result === "disabled") break;
    counts[result]++;
  }
  console.log("CRM delivery results", counts);
  if (counts.blocked) process.exitCode = 1;
} catch {
  console.error("CRM delivery job failed; check configuration and safe delivery state in PostgreSQL");
  process.exitCode = 1;
} finally {
  if (opened) await getPool().end();
}

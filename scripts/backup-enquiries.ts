import { backupEnquiries } from "../lib/sheets";
import { getPool } from "../lib/db";

try {
  let count: number;
  do {
    count = await backupEnquiries();
    console.log(`Backed up ${count} enquiries`);
  } while (count === 50);
} catch (error) {
  console.error("Backup failed", error);
  process.exitCode = 1;
} finally {
  await getPool().end();
}

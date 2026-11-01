import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & { enquiryPool?: Pool };

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return (globalForDb.enquiryPool ??= new Pool({ connectionString: process.env.DATABASE_URL }));
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

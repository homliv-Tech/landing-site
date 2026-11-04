import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/schema.ts",
  out: "./drizzle",
  // Use a separate journal when sharing a database with another application.
  migrations: { schema: process.env.DATABASE_MIGRATIONS_SCHEMA || "drizzle" },
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});

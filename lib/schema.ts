import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  // Kept nullable during the expand phase so the previous app version can
  // continue writing while the new form is rolled out. The API requires it.
  phone: text("phone"),
  address: text("address"),
  apartmentType: text("apartment_type"),
  budget: text("budget"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sheetsBackedUpAt: timestamp("sheets_backed_up_at", { withTimezone: true }),
}, (table) => [
  index("enquiries_pending_sheets_idx").on(table.createdAt).where(sql`${table.sheetsBackedUpAt} IS NULL`),
]);

// One shared window across all application instances; no client IP is trusted.
export const enquiryQuota = pgTable("enquiry_quota", {
  key: text("key").primaryKey(),
  windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull().defaultNow(),
  count: integer("count").notNull(),
}, (table) => [
  index("enquiry_quota_window_started_at_idx").on(table.windowStartedAt),
]);

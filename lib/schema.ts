import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
  crmState: text("crm_state").notNull().default("pending"),
  crmDeliveredAt: timestamp("crm_delivered_at", { withTimezone: true }),
  crmCompanyId: uuid("crm_company_id"),
  crmAttempts: integer("crm_attempts").notNull().default(0),
  crmNextAttemptAt: timestamp("crm_next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  crmDiagnostic: text("crm_diagnostic"),
  crmPayload: jsonb("crm_payload"),
}, (table) => [
  index("enquiries_pending_sheets_idx").on(table.createdAt).where(sql`${table.sheetsBackedUpAt} IS NULL`),
  index("enquiries_pending_crm_idx").on(table.crmState, table.crmNextAttemptAt).where(sql`${table.crmDeliveredAt} IS NULL`),
]);

// One shared window across all application instances; no client IP is trusted.
export const enquiryQuota = pgTable("enquiry_quota", {
  key: text("key").primaryKey(),
  windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull().defaultNow(),
  count: integer("count").notNull(),
}, (table) => [
  index("enquiry_quota_window_started_at_idx").on(table.windowStartedAt),
]);

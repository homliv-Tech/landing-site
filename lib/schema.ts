import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sheetsBackedUpAt: timestamp("sheets_backed_up_at", { withTimezone: true }),
}, (table) => [
  index("enquiries_pending_sheets_idx").on(table.createdAt).where(sql`${table.sheetsBackedUpAt} IS NULL`),
]);

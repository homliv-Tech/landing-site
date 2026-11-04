CREATE TABLE IF NOT EXISTS "enquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sheets_backed_up_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enquiries_pending_sheets_idx" ON "enquiries" USING btree ("created_at") WHERE "enquiries"."sheets_backed_up_at" IS NULL;
ALTER TABLE "enquiries" ADD COLUMN "crm_state" text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "crm_delivered_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "crm_company_id" uuid;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "crm_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "crm_next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "crm_diagnostic" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "crm_payload" jsonb;--> statement-breakpoint
CREATE INDEX "enquiries_pending_crm_idx" ON "enquiries" USING btree ("crm_state","crm_next_attempt_at") WHERE "enquiries"."crm_delivered_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "enquiries" ALTER COLUMN "crm_state" SET DEFAULT 'pending';

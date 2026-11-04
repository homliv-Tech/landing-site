ALTER TABLE "enquiries" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "enquiries" ALTER COLUMN "message" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "apartment_type" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "budget" text;--> statement-breakpoint
CREATE INDEX "enquiry_quota_window_started_at_idx" ON "enquiry_quota" USING btree ("window_started_at");

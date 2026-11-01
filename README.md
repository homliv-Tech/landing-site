# Homliv landing site

Run `bun install` and `bun dev` for local development.

## Enquiry storage

PostgreSQL is the source of truth for enquiries. To configure it:

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your PostgreSQL connection string. Use the connection and TLS settings required by your database provider.
2. Run `bun run db:migrate` to apply the Drizzle migrations. The initial migration also accepts an existing database created with the earlier `db/001_initial.sql` setup. For future CRM schema changes, edit `lib/schema.ts`, run `bun run db:generate`, review the generated SQL, and run `bun run db:migrate`. Commit the generated migrations and metadata.
3. Enable the Google Sheets API in a Google Cloud project, create a service account and key, and share the spreadsheet with the service account email as an editor. Create a tab named `Enquiries` (or set `GOOGLE_SHEETS_TAB`) and add these headers in row 1: `ID`, `Created at`, `Name`, `Email`, `Phone`, `Message`.
4. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` and `GOOGLE_SHEETS_SPREADSHEET_ID` in `.env.local` and in your deployment's server-side environment. The spreadsheet ID is the portion of its URL between `/d/` and `/edit`. Keep credentials private. The private key may use escaped `\n` line breaks.

A future form can POST JSON to `/api/enquiries` with `name`, `email`, optional `phone`, and `message`. A successful response is `201` with the enquiry `id`. No form is connected yet. The endpoint validates input and saves it before attempting a Sheets backup; a Sheets outage does not lose the database record. Failed or unconfigured backups remain pending. Run `bun run backup:enquiries` to retry all pending rows, and schedule that command in your hosting environment if automatic retries are needed. Bun loads `.env.local` locally; configure the same environment variables for the scheduled job. A process interruption after a Sheets append can produce duplicates; use the enquiry ID to identify them. Sheets is a secondary copy, so maintain independent PostgreSQL backups as well.

The public endpoint allows 100 valid enquiry attempts per shared one-hour window across all visitors and application instances. Once exhausted it returns HTTP 429; quota checks fail closed if PostgreSQL is unavailable. Run migrations before enabling the endpoint. This global limit can be exhausted by one visitor, so add ingress-level per-client rate limiting and spam protection before connecting a public form. Quotation generation and its data model are not implemented yet.

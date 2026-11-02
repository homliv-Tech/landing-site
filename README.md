# Homliv landing site

Run `bun install` and `bun dev` for local development.

## Enquiry storage

PostgreSQL is the source of truth for enquiries. To configure it:

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your PostgreSQL connection string. Use the connection and TLS settings required by your database provider. For hosted databases using the current strict `pg` behavior, prefer an explicit `sslmode=verify-full`; use weaker libpq-compatible modes only when your provider requires them and you understand the certificate requirements.
2. Run `bun run db:migrate` to apply the Drizzle migrations before deploying the matching application version. The enquiry-form migration is expand-compatible, so the previous application can keep writing while a rolling deployment completes. The initial migration also accepts an existing database created with the earlier `db/001_initial.sql` setup. For future CRM schema changes, edit `lib/schema.ts`, run `bun run db:generate`, review the generated SQL, and run `bun run db:migrate`. Commit the generated migrations and metadata.
3. Enable the Google Sheets API in a Google Cloud project, create a service account and key, and share the spreadsheet with the service account email as an editor. Create a tab named `Enquiries` (or set `GOOGLE_SHEETS_TAB`) and add these headers in row 1: `ID`, `Created at`, `Name`, `Email`, `Phone`, `Requirements`, `Address`, `Apartment type`, `Budget`, `Source`.
4. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` and `GOOGLE_SHEETS_SPREADSHEET_ID` in `.env.local` and in your deployment's server-side environment. The spreadsheet ID is the portion of its URL between `/d/` and `/edit`. Keep credentials private. The private key may use escaped `\n` line breaks.

The homepage consultation form posts JSON to `/api/enquiries`. Every visible field is required. React Hook Form uses `zodResolver(enquirySchema)` for validation on blur and while correcting a touched field. The API independently validates the same schema. A successful response is `201` with the saved enquiry ID.

Each successful API insert schedules `backupEnquiries(id)` after the response. This appends that exact enquiry to Google Sheets, even if older rows are pending. PostgreSQL row locks prevent the immediate append and a retry job from processing the same record concurrently. A row is marked backed up only when Google confirms the expected number of appended rows. If credentials are absent or Google is unavailable, the database entry remains pending.

Run `bun run backup:enquiries` after configuring credentials to export existing pending rows. Schedule the same command in your hosting environment for durable retries; it also picks up enquiries inserted directly into the database. The automatic append is triggered by this application's API, not by an external SQL insert. The explicit backup command reports missing or invalid credentials and exits with an error. Bun loads `.env.local` locally; configure the same environment variables for the scheduled job.

A process interruption after a Sheets append can produce duplicates; use the enquiry ID to identify them. Sheets is a secondary copy, so maintain independent PostgreSQL backups as well.

## Form code structure

| File | Responsibility |
| --- | --- |
| `lib/enquiry.ts` | Shared Zod schema and inferred form/request types |
| `lib/enquiry-options.ts` | Apartment and budget dropdown values and labels |
| `components/consultation-form.tsx` | `useForm`, `zodResolver`, submission and pending/success state |
| `components/consultation/consultation-fields.tsx` | Explicit `FormField`, `FormLabel`, `FormControl` and `FormMessage` markup |
| `components/consultation/consultation-success.tsx` | Success confirmation and reset action |
| `components/ui/form.tsx` | Reusable React Hook Form adapters for the existing Shadcn/Base UI controls |
| `lib/enquiry-client.ts` | HTTP submission and typed server errors |
| `lib/sheets.ts` | Append one saved enquiry or retry a batch of pending enquiries |

Run `bun test`, `bun run lint`, and `bun run build` to verify changes. Form interaction tests use Happy DOM with mocked network requests. Backup tests use mocked PostgreSQL and Google clients; they do not write to a live spreadsheet.

## Public endpoint limits

The public endpoint includes a honeypot, permits five valid attempts per hashed client identity per hour, and retains the shared 100-attempt hourly cap across all application instances. Once a limit is exhausted it returns HTTP 429; quota checks fail closed if PostgreSQL is unavailable. The client identity comes from proxy forwarding headers, so the production ingress must replace—not append user-supplied—client IP headers. For higher-risk campaigns, add a managed bot challenge at the edge. Quotation generation and its data model are not implemented yet.

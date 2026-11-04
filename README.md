# Homliv landing site

Run `bun install` and `bun dev` for local development.

## Enquiry storage

PostgreSQL is the source of truth for enquiries. The landing site can share the
CRM's PostgreSQL database: enquiry storage uses `enquiries` and `enquiry_quota`,
while the CRM owns its client tables. Before the landing site's first migration
in a shared database, set `DATABASE_MIGRATIONS_SCHEMA=landing_migrations` so its
migration journal stays separate from CRM's `drizzle` journal. Keep this setting
identical on every deployment and migration job. Existing standalone databases
default to `drizzle`; do not change their journal schema after applying migrations.

To configure it:

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

The public endpoint includes a honeypot, permits five valid attempts per hashed client identity per hour, and retains the shared 100-attempt hourly cap across all application instances. Once a limit is exhausted it returns HTTP 429; quota checks fail closed if PostgreSQL is unavailable. Set `CLIENT_IP_HEADER` to exactly one of `cf-connecting-ip`, `x-real-ip`, or `x-forwarded-for`, chosen for your ingress. The ingress must replace the entire selected header with the client IP, never append to a client-supplied value, and direct access bypassing the ingress must be blocked. Other headers are ignored. If the setting is absent, invalid, or the header is empty, all such requests share one client quota. For higher-risk campaigns, add a managed bot challenge at the edge. Quotation generation and its data model are not implemented yet.

## CRM enquiry delivery

The landing enquiry tables remain the durable source of truth and may live in the
same PostgreSQL database as CRM. Deploy the CRM endpoint first, then apply the
landing migrations with `bun run db:migrate`. When sharing CRM's database, configure
the separate migration journal described above before the first landing migration.
Review SQL before applying it. Landing migrations manage its enquiry tables only;
CRM's client records are created through the authenticated integration endpoint.

Configure these **server-only** variables on both the Next.js server and scheduled worker:

- `CRM_ENQUIRY_URL`: full HTTPS URL ending in `/api/integrations/enquiries`.
  HTTP is permitted only for localhost development.
- `CRM_ENQUIRY_SECRET`: the same secret as CRM's `LANDING_ENQUIRY_SECRET`, at least
  32 characters. Store it in the deployment secret manager. Never use a
  `NEXT_PUBLIC_` prefix or print the secret. With a shared database, both servers
  may connect to it; a dedicated role restricted to the landing tables can be
  used for the public application's runtime access.

If both variables are absent, delivery is disabled and new rows remain pending.
Partial or invalid configuration is an error; local submission success is preserved.
The API schedules an initial attempt with Next.js `after()` independently of Sheets.
Use a hosting adapter that supports `after()` and allow at least 15 seconds of
post-response execution. The scheduled worker remains necessary even with that support.

New rows default to `pending` in the same insert that stores the enquiry. The migration
marks pre-existing rows `legacy`, excluding them from routine delivery until explicitly
selected. Each claim commits a payload snapshot, attempt count, and a 60-second lease
before HTTP; a crash leaves it discoverable when the lease expires. PostgreSQL row
locks with `SKIP LOCKED` coordinate claims. Attempt numbers fence off stale results
from expired workers. CRM's UUID idempotency handles uncertain delivery and expired
leases; retries never change the ID, timestamp, or snapshot values. An empty stored
message maps to the form's empty string. Incomplete legacy data is never fabricated.

The request has a 10-second timeout and cannot follow redirects. Only validated
200/201 acknowledgements with the original enquiry UUID, a valid client UUID and
matching duplicate flag count as success. Successful rows are permanently excluded
from routine jobs, including legacy backfill. Network failures, timeouts, invalid
acknowledgements, 429 and 5xx remain pending, with exponential backoff and jitter
(30–60 seconds initially, capped at 30–60 minutes). A longer `Retry-After` takes
precedence, capped at 24 hours for both numeric and HTTP-date values to keep
untrusted headers from overflowing the stored retry timestamp. Other responses
block automatic delivery for correction: in particular,
409 is a UUID/data conflict, 401 requires credential correction, and 400/413/415
require data or implementation correction. Redirects are blocked too.

Schedule this command every minute from the deployed landing project directory,
with the same server environment and an installed Bun runtime:

```sh
bun run deliver:enquiries --limit=25
```

For example, a cron entry (adjust paths to the deployment):

```cron
* * * * * cd /srv/landing-site && /usr/local/bin/bun run deliver:enquiries --limit=25
```

The command processes at most 25 claims by default, accepts `--limit=1..500`, then
closes its database pool. At the default limit, HTTP work can take roughly 250
seconds during an outage; allow that duration in your scheduler or lower the limit.
Overlapping jobs are safe. It reports aggregate delivered/pending/blocked counts,
without personal data, response bodies, or credentials. Blocked rows or job errors
exit nonzero; retryable failures remain durably pending. Configure alerting on job
errors, blocked rows, and growing pending counts. Sheets scheduling is separate and
continues to use `bun run backup:enquiries`.

For a deliberate, bounded import of pre-existing rows, first review the eligible
records privately, then run:

```sh
bun run deliver:enquiries --backfill-legacy --limit=25
```

This includes due pending rows as well as legacy rows. Invalid rows become blocked
with `invalid_saved_enquiry`; use the following metadata-only query to locate work
requiring correction (inspect personal fields only through authorized tooling):

```sql
SELECT id, crm_state, crm_attempts, crm_next_attempt_at, crm_diagnostic,
       crm_delivered_at, crm_company_id
FROM enquiries
WHERE crm_delivered_at IS NULL
ORDER BY crm_state, crm_next_attempt_at;
```

After correcting configuration or an incomplete row, explicitly requeue only the
reviewed unsent IDs by setting `crm_state = 'pending'`, `crm_next_attempt_at = now()`,
and `crm_diagnostic = NULL`, with a `crm_delivered_at IS NULL` condition. Keep any
existing `crm_payload` snapshot: changing live fields must not silently change a
retry. A 409 needs manual reconciliation with CRM; never generate a replacement
UUID or clear the snapshot to bypass it. Do not reset successful rows, since a CRM
client deleted later could otherwise be recreated by a replay.

For a staging end-to-end smoke test:

1. Apply migrations on staging only and configure the matching endpoint and secret.
2. Submit one valid form and confirm the existing `201 {id}` browser response,
   local row, Sheets append (if configured), and CRM client/contact/Note/receipt.
3. Check that `crm_delivered_at` and `crm_company_id` are stored. Run a bounded
   worker and confirm it does not resend the successful row.
4. Simulate a CRM outage on staging, submit another form, and confirm it still
   succeeds locally and in Sheets while CRM state remains pending. Restore CRM,
   wait until the retry is due, and run the bounded worker. Confirm exactly one
   CRM client and a delivered timestamp, including after an uncertain/repeated send.
5. Verify a legacy incomplete row is skipped/blocked without a CRM import when
   explicitly backfilled. Restore normal staging configuration after testing.

`bun test` includes isolated PostgreSQL-compatible PGlite migration/state tests,
HTTP contract/classification/timeout tests, overlapping lease and stale-result tests,
and form/Sheets regressions. These tests use no deployment database or CRM service.

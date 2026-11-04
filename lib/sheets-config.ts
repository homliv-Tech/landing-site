import { z } from "zod";

const sheetsConfigSchema = z.object({
  serviceAccountEmail: z
    .string()
    .trim()
    .email("GOOGLE_SERVICE_ACCOUNT_EMAIL must be a valid email address."),
  privateKey: z
    .string()
    .trim()
    .transform((value) => value.replace(/\\n/g, "\n"))
    .refine(
      (value) =>
        value.includes("-----BEGIN PRIVATE KEY-----") &&
        value.includes("-----END PRIVATE KEY-----"),
      "GOOGLE_PRIVATE_KEY must be a PEM private key.",
    ),
  spreadsheetId: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "GOOGLE_SHEETS_SPREADSHEET_ID is not valid.",
    ),
  tab: z
    .string()
    .trim()
    .min(1, "GOOGLE_SHEETS_TAB cannot be empty.")
    .max(100, "GOOGLE_SHEETS_TAB is too long."),
});

export type SheetsConfig = z.infer<typeof sheetsConfigSchema>;
type SheetsEnvironment = Readonly<Record<string, string | undefined>>;

const credentialKeys = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
] as const;

export function hasSheetsCredentials(
  environment: SheetsEnvironment = process.env,
): boolean {
  return credentialKeys.some((key) => Boolean(environment[key]?.trim()));
}

export function getSheetsConfig(
  environment: SheetsEnvironment = process.env,
): SheetsConfig | null {
  if (!hasSheetsCredentials(environment)) return null;

  const result = sheetsConfigSchema.safeParse({
    serviceAccountEmail: environment.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: environment.GOOGLE_PRIVATE_KEY,
    spreadsheetId: environment.GOOGLE_SHEETS_SPREADSHEET_ID,
    tab: environment.GOOGLE_SHEETS_TAB || "Enquiries",
  });

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => issue.message)
      .join(" ");
    throw new Error(`Invalid Google Sheets configuration. ${details}`);
  }

  return result.data;
}

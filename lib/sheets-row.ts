import { getApartmentTypeLabel, getBudgetRangeLabel } from "./enquiry-options";
import type { enquiries } from "./schema";

type EnquiryRow = typeof enquiries.$inferSelect;

export const ENQUIRY_SHEET_HEADERS = [
  "ID",
  "Created at",
  "Name",
  "Email",
  "Phone",
  "Requirements",
  "Address",
  "Apartment type",
  "Budget",
  "Source",
] as const;

export function toEnquirySheetRow(row: EnquiryRow): string[] {
  return [
    row.id,
    row.createdAt.toISOString(),
    row.name,
    row.email ?? "",
    row.phone ?? "",
    row.message ?? "",
    row.address ?? "",
    row.apartmentType ? getApartmentTypeLabel(row.apartmentType) : "",
    row.budget ? getBudgetRangeLabel(row.budget) : "",
    "Website",
  ];
}

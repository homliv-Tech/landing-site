import { z } from "zod";
import {
  isEnquiryField,
  type EnquiryFieldErrors,
  type EnquiryRequest,
} from "./enquiry";

const successResponseSchema = z.object({ id: z.uuid() });
const errorResponseSchema = z.object({
  error: z.string().optional(),
  fields: z.record(z.string(), z.string()).optional(),
});

export class EnquirySubmissionError extends Error {
  constructor(
    message: string,
    public readonly fields: EnquiryFieldErrors = {},
  ) {
    super(message);
    this.name = "EnquirySubmissionError";
  }
}

export async function submitEnquiry(
  data: EnquiryRequest,
  companyWebsite: string,
) {
  let response: Response;
  try {
    response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, companyWebsite }),
    });
  } catch {
    throw new EnquirySubmissionError(
      "We couldn’t connect right now. Check your connection and try again.",
    );
  }

  const body: unknown = await response.json().catch(() => null);
  if (response.ok) {
    const result = successResponseSchema.safeParse(body);
    if (result.success) return result.data;
    throw new EnquirySubmissionError(
      "We couldn’t confirm your request. Please try again.",
    );
  }

  const result = errorResponseSchema.safeParse(body);
  const fields: EnquiryFieldErrors = {};
  if (result.success) {
    for (const [field, message] of Object.entries(result.data.fields ?? {})) {
      if (isEnquiryField(field)) fields[field] = message;
    }
  }

  throw new EnquirySubmissionError(
    (result.success && result.data.error) ||
      "We couldn’t send your request. Please try again in a moment.",
    fields,
  );
}

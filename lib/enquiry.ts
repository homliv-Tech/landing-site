import { z } from "zod";
import { APARTMENT_TYPE_VALUES, BUDGET_RANGE_VALUES } from "./enquiry-options";

// Shared by the browser's zodResolver and the POST endpoint.
export const enquirySchema = z.object({
  name: z
    .string({ error: "Enter your full name." })
    .trim()
    .min(2, "Enter your full name.")
    .max(200, "Keep your name under 200 characters."),
  email: z
    .string({ error: "Enter your email address." })
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Enter a valid email address.")
    .email("Enter a valid email address."),
  phone: z
    .string({ error: "Enter your phone number." })
    .trim()
    .min(1, "Enter your phone number.")
    .max(50, "Enter a valid phone number.")
    .regex(/^\+?[\d\s().-]+$/, "Enter a valid phone number.")
    .refine((value) => {
      const digitCount = value.replace(/\D/g, "").length;
      return digitCount >= 8 && digitCount <= 15;
    }, "Enter a valid phone number."),
  address: z
    .string({ error: "Enter your apartment address." })
    .trim()
    .min(1, "Enter your apartment address.")
    .max(500, "Keep the address under 500 characters."),
  apartmentType: z
    .string({ error: "Select your apartment type." })
    .trim()
    .pipe(
      z.enum(APARTMENT_TYPE_VALUES, { error: "Select your apartment type." }),
    ),
  budget: z
    .string({ error: "Select your budget range." })
    .trim()
    .pipe(z.enum(BUDGET_RANGE_VALUES, { error: "Select your budget range." })),
  message: z
    .string({ error: "Tell us about your requirements." })
    .trim()
    .max(5000, "Keep your requirements under 5,000 characters.")
    .default(""),
});

export type EnquiryFormValues = z.input<typeof enquirySchema>;
export type EnquiryRequest = z.infer<typeof enquirySchema>;
export type EnquiryField = keyof EnquiryRequest;
export type EnquiryFieldErrors = Partial<Record<EnquiryField, string>>;

export function isEnquiryField(value: string): value is EnquiryField {
  return Object.hasOwn(enquirySchema.shape, value);
}

export function zodErrorToFieldErrors(error: z.ZodError): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};

  for (const issue of error.issues) {
    const candidate = issue.path[0];
    if (typeof candidate !== "string") continue;
    const field = candidate as EnquiryField;
    if (!isEnquiryField(field) || errors[field]) continue;
    errors[field] = issue.message;
  }

  return errors;
}

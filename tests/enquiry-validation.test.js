import { expect, test } from "bun:test";
import {
  enquirySchema,
  zodErrorToFieldErrors,
} from "../lib/enquiry";

const validEnquiry = {
  name: "Test User",
  email: "test@example.com",
  phone: "+91 98765 43210",
  address: "Test Society, Bengaluru",
  apartmentType: "2-bhk",
  budget: "10-20-lakh",
  message: "Modular kitchen and wardrobes",
};

test("Zod normalizes valid enquiry values and strips unknown fields", () => {
  const result = enquirySchema.safeParse({
    ...validEnquiry,
    name: "  Test User  ",
    email: "  test@example.com ",
    companyWebsite: "",
  });

  expect(result.success).toBe(true);
  if (!result.success) return;
  expect(result.data.name).toBe("Test User");
  expect(result.data.email).toBe("test@example.com");
  expect("companyWebsite" in result.data).toBe(false);
});

test("Zod rejects empty required fields", () => {
  const result = enquirySchema.safeParse({
    name: "",
    email: "",
    phone: "",
    address: "",
    apartmentType: "",
    budget: "",
    message: "",
  });

  expect(result.success).toBe(false);
  if (result.success) return;
  expect(zodErrorToFieldErrors(result.error)).toEqual({
    name: "Enter your full name.",
    email: "Enter your email address.",
    phone: "Enter your phone number.",
    address: "Enter your apartment address.",
    apartmentType: "Select your apartment type.",
    budget: "Select your budget range.",
  });
});

test.each(["", "   ", undefined])("Zod accepts blank or omitted requirements (%s)", (message) => {
  const result = enquirySchema.parse({ ...validEnquiry, message });
  expect(result.message).toBe("");
});

test.each([42, null, "a".repeat(5001)])("Zod rejects invalid or oversized requirements", (message) => {
  expect(enquirySchema.safeParse({ ...validEnquiry, message }).success).toBe(false);
});

test("Zod returns the form's field-level validation messages", () => {
  const result = enquirySchema.safeParse({
    ...validEnquiry,
    name: "A",
    email: "invalid",
    phone: "123",
    apartmentType: "studio",
    budget: "unlimited",
  });

  expect(result.success).toBe(false);
  if (result.success) return;
  expect(zodErrorToFieldErrors(result.error)).toEqual({
    name: "Enter your full name.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
    apartmentType: "Select your apartment type.",
    budget: "Select your budget range.",
  });
});

test("Zod rejects non-string API values with safe field errors", () => {
  const result = enquirySchema.safeParse({
    ...validEnquiry,
    name: 42,
    phone: null,
  });

  expect(result.success).toBe(false);
  if (result.success) return;
  expect(zodErrorToFieldErrors(result.error)).toMatchObject({
    name: "Enter your full name.",
    phone: "Enter your phone number.",
  });
});

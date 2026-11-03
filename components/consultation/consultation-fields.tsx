"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APARTMENT_TYPES, BUDGET_RANGES } from "@/lib/enquiry-options";
import type { EnquiryFormValues, EnquiryRequest } from "@/lib/enquiry";

const inputClassName =
  "h-12 rounded-xl border-[#7c8578] bg-white px-4 text-base text-[#343a30] shadow-none placeholder:text-[#687064] focus-visible:border-[#087443] focus-visible:ring-[#087443]/15";

function Required() {
  return (
    <>
      <span aria-hidden="true">*</span>
      <span className="sr-only">(required)</span>
    </>
  );
}

export function ConsultationFields({ pending }: { pending: boolean }) {
  const form = useFormContext<EnquiryFormValues, unknown, EnquiryRequest>();

  return (
    <div className="consultation-fields">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="consultation-field consultation-field-full">
            <FormLabel>
              Full name <Required />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={200}
                required
                disabled={pending}
                className={inputClassName}
                {...field}
              />
            </FormControl>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="consultation-field">
            <FormLabel>
              Email address <Required />
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={254}
                required
                disabled={pending}
                className={inputClassName}
                {...field}
              />
            </FormControl>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="consultation-field">
            <FormLabel>
              Phone number <Required />
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                maxLength={50}
                required
                disabled={pending}
                className={inputClassName}
                {...field}
              />
            </FormControl>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="consultation-field consultation-field-full">
            <FormLabel>
              Apartment address <Required />
            </FormLabel>
            <FormControl>
              <Input
                autoComplete="street-address"
                placeholder="Society name, locality, city"
                maxLength={500}
                required
                disabled={pending}
                className={inputClassName}
                {...field}
              />
            </FormControl>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="apartmentType"
        render={({ field }) => (
          <FormItem className="consultation-field">
            <FormLabel>
              Apartment type <Required />
            </FormLabel>
            <Select
              name={field.name}
              value={field.value || null}
              items={APARTMENT_TYPES}
              onValueChange={(value) => {
                field.onChange(value ?? "");
                form.clearErrors("root.server");
              }}
              onOpenChangeComplete={(open) => {
                if (!open) field.onBlur();
              }}
              disabled={pending}
              required
            >
              <FormControl>
                <SelectTrigger
                  ref={field.ref}
                  onBlur={(event) => {
                    if (
                      event.currentTarget.getAttribute("aria-expanded") !==
                      "true"
                    )
                      field.onBlur();
                  }}
                  aria-required="true"
                  className="consultation-select-trigger"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                align="start"
                className="consultation-select-content"
              >
                {APARTMENT_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem className="consultation-field">
            <FormLabel>
              Budget range <Required />
            </FormLabel>
            <Select
              name={field.name}
              value={field.value || null}
              items={BUDGET_RANGES}
              onValueChange={(value) => {
                field.onChange(value ?? "");
                form.clearErrors("root.server");
              }}
              onOpenChangeComplete={(open) => {
                if (!open) field.onBlur();
              }}
              disabled={pending}
              required
            >
              <FormControl>
                <SelectTrigger
                  ref={field.ref}
                  onBlur={(event) => {
                    if (
                      event.currentTarget.getAttribute("aria-expanded") !==
                      "true"
                    )
                      field.onBlur();
                  }}
                  aria-required="true"
                  className="consultation-select-trigger"
                >
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                align="start"
                className="consultation-select-content"
              >
                {BUDGET_RANGES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem className="consultation-field consultation-field-full">
            <FormLabel>
              Tell us about your requirements (optional)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="E.g. modular kitchen, two wardrobes, false ceiling, painting…"
                maxLength={5000}
                rows={5}
                disabled={pending}
                className={`${inputClassName} min-h-32 resize-y py-3 leading-6`}
                {...field}
              />
            </FormControl>
            <FormMessage className="consultation-field-error" />
          </FormItem>
        )}
      />
    </div>
  );
}

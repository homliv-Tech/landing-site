"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import posthog from "posthog-js";
import { ConsultationFields } from "@/components/consultation/consultation-fields";
import { ConsultationSuccess } from "@/components/consultation/consultation-success";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnquirySubmissionError, submitEnquiry } from "@/lib/enquiry-client";
import {
  enquirySchema,
  isEnquiryField,
  type EnquiryFormValues,
  type EnquiryRequest,
} from "@/lib/enquiry";

export default function ConsultationForm() {
  const form = useForm<EnquiryFormValues, unknown, EnquiryRequest>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      apartmentType: "",
      budget: "",
      message: "",
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const requestInFlight = useRef(false);
  const pending = form.formState.isSubmitting;

  async function onSubmit(data: EnquiryRequest) {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    form.clearErrors("root.server");

    try {
      await submitEnquiry(data, honeypotRef.current?.value ?? "");
    } catch (error) {
      const failure = error instanceof EnquirySubmissionError ? error : null;
      form.setError("root.server", {
        message: failure?.message ?? "Something went wrong. Please try again.",
      });
      const fields = Object.entries(failure?.fields ?? {});
      for (const [name, message] of fields) {
        if (isEnquiryField(name))
          form.setError(name, { type: "server", message });
      }
      const firstField = fields[0]?.[0];
      if (firstField && isEnquiryField(firstField)) {
        window.requestAnimationFrame(() => form.setFocus(firstField));
      }
      return;
    } finally {
      requestInFlight.current = false;
    }

    form.reset();
    setSubmitted(true);
    if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
      posthog.capture("enquiry_submitted", {
        location: "homepage_contact",
        page_path: "/",
      });
    }
  }

  if (submitted) {
    return (
      <ConsultationSuccess
        onReset={() => {
          setSubmitted(false);
          window.requestAnimationFrame(() => form.setFocus("name"));
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        onChange={() => form.clearErrors("root.server")}
        className="consultation-card consultation-form"
        aria-label="Book free consultation"
        aria-busy={pending}
        noValidate
      >
        <div className="consultation-honeypot" aria-hidden="true">
          <Label htmlFor="enquiry-company-website">Company website</Label>
          <Input
            id="enquiry-company-website"
            name="companyWebsite"
            ref={honeypotRef}
            type="text"
            autoComplete="off"
            tabIndex={-1}
            disabled={pending}
          />
        </div>

        <div className="consultation-form-heading">
          <p className="consultation-kicker">Book free consultation</p>
          <h3>Tell us about your home.</h3>
          <p>We’ll get back to you within two business hours.</p>
        </div>

        <ConsultationFields pending={pending} />

        {form.formState.errors.root?.server?.message && (
          <p className="consultation-submit-error" role="alert">
            {form.formState.errors.root.server.message}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="consultation-submit"
        >
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Sending your request…
            </>
          ) : (
            <>
              Book free consultation
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>

        <p className="consultation-privacy">
          <ShieldCheck aria-hidden="true" />
          Your details stay private and are only used to discuss your project.
        </p>
      </form>
    </Form>
  );
}

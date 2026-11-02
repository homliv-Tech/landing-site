"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConsultationSuccess({ onReset }: { onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="consultation-card consultation-success" role="status">
      <span className="consultation-success-icon" aria-hidden="true">
        <Check />
      </span>
      <p className="consultation-kicker">Request received</p>
      <h3 ref={headingRef} tabIndex={-1} className="outline-none">
        Thank you for sharing your project.
      </h3>
      <p>
        Our design team will review your requirements and get back to you within
        two business hours.
      </p>
      <Button
        type="button"
        variant="outline"
        className="consultation-secondary-button"
        onClick={onReset}
      >
        Send another enquiry
      </Button>
    </div>
  );
}

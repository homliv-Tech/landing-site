import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatINR } from "@/lib/calculator/engine";
import type { Estimate } from "@/lib/calculator/types";
import { cn } from "@/lib/utils";

type BudgetSummaryProps = {
  estimate: Estimate;
  subtitle: string;
  ctaLocation: string;
  onReset: () => void;
  isReady?: boolean;
};

/** Show ₹0 until a real selection, then one indicative total with its itemized scope. */
export default function BudgetSummary({
  estimate,
  subtitle,
  ctaLocation,
  onReset,
  isReady = true,
}: BudgetSummaryProps) {
  return (
    <aside className="calc-summary" aria-label="Your estimate">
      <span className="calc-summary-eyebrow">Your indicative estimate</span>
      <output className="calc-summary-total" aria-live="polite">
        {formatINR(isReady ? estimate.total : 0)}
      </output>
      <p className="calc-summary-subtitle">
        {isReady ? subtitle : "Make a selection to see your estimate."}
      </p>

      {isReady ? (
        <>
          <Separator className="calc-summary-separator" />

          <div className="calc-summary-lines">
            {estimate.lines.map((line) => (
              <div
                className="calc-summary-line"
                key={`${line.label}-${line.amount}`}
              >
                <span className="calc-summary-line-copy">
                  <span>{line.label}</span>
                  {line.detail ? <small>{line.detail}</small> : null}
                </span>
                <span className="calc-summary-line-amount">
                  {formatINR(line.amount)}
                </span>
              </div>
            ))}
          </div>

          <p className="calc-summary-note">{estimate.notes[0]}</p>
        </>
      ) : (
        <p className="calc-summary-note">
          Choose your space details and finish to see your detailed breakdown.
        </p>
      )}

      {isReady ? (
        <Link
          className={cn(
            buttonVariants(),
            "calc-btn calc-btn--accent calc-summary-cta",
          )}
          href="/#contact"
          data-enquiry-location={ctaLocation}
        >
          Get an exact quote
          <ArrowRight aria-hidden="true" />
        </Link>
      ) : (
        <Button
          type="button"
          disabled
          className={cn(
            "calc-btn calc-btn--accent calc-summary-cta",
          )}
          aria-label="Make a selection to get an exact quote"
        >
          Get an exact quote
          <ArrowRight aria-hidden="true" />
        </Button>
      )}

      <p className="calc-summary-fine">
        Indicative only. Excludes GST and site-specific work. Final quote
        follows a site visit.
      </p>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="calc-summary-reset"
        onClick={onReset}
      >
        <RotateCcw aria-hidden="true" />
        Start over
      </Button>
    </aside>
  );
}

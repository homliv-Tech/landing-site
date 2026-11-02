"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalculatorStep = {
  id: string;
  label: string;
  title: string;
  description: string;
};

type StepFlowProps = {
  steps: CalculatorStep[];
  current: number;
  children: ReactNode;
  canContinue?: boolean;
  isReady?: boolean;
  onBack: () => void;
  onContinue: () => void;
  ctaLocation: string;
};

/** Render accessible progress and navigation, scrolling obscured steps below sticky tabs. */
export default function StepFlow({
  steps,
  current,
  children,
  canContinue = true,
  isReady = true,
  onBack,
  onContinue,
  ctaLocation,
}: StepFlowProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const headingId = useId();
  const step = steps[current];
  const isLast = current === steps.length - 1;

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    const stickyHeight =
      document.querySelector<HTMLElement>(".calc-tabs-wrap")?.offsetHeight ?? 0;
    const panelTop = panel.getBoundingClientRect().top;

    if (panelTop >= stickyHeight + 12) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [current]);

  return (
    <div className="calc-flow">
      <ol className="calc-progress" aria-label="Calculator progress">
        {steps.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "calc-progress-step",
              index === current && "is-current",
              index < current && "is-done",
            )}
            aria-current={index === current ? "step" : undefined}
          >
            <span className="calc-progress-number">{index + 1}</span>
            <span className="calc-progress-label">{item.label}</span>
          </li>
        ))}
      </ol>

      <div
        className="calc-panel"
        ref={panelRef}
        role="region"
        aria-labelledby={headingId}
      >
        <div className="calc-panel-head">
          <Badge variant="outline" className="calc-step-count">
            Step {current + 1} of {steps.length}
          </Badge>
          <h2 id={headingId}>{step.title}</h2>
          <p>{step.description}</p>
        </div>

        <div className="calc-panel-body">{children}</div>

        <div className="calc-panel-footer">
          <Button
            type="button"
            variant="ghost"
            className="calc-btn calc-btn--ghost"
            onClick={onBack}
            disabled={current === 0}
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>

          {isLast ? (
            isReady ? (
              <Link
                className={cn(
                  buttonVariants(),
                  "calc-btn calc-btn--accent",
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
                className="calc-btn calc-btn--accent"
                disabled
                aria-label="Make a selection to get an exact quote"
              >
                Get an exact quote
                <ArrowRight aria-hidden="true" />
              </Button>
            )
          ) : (
            <Button
              type="button"
              className="calc-btn"
              onClick={onContinue}
              disabled={!canContinue}
            >
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

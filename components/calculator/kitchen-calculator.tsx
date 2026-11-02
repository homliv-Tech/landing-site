"use client";

import { useState } from "react";
import BudgetSummary from "@/components/calculator/budget-summary";
import ChoiceCard from "@/components/calculator/choice-card";
import KitchenLayoutDiagram from "@/components/calculator/kitchen-layout-diagram";
import MeasurementFields from "@/components/calculator/measurement-fields";
import PackageCards from "@/components/calculator/package-cards";
import StepFlow, { type CalculatorStep } from "@/components/calculator/step-flow";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  KITCHEN_ADD_ONS,
  KITCHEN_LAYOUTS,
  PACKAGE_MEDIA,
  defaultKitchenMeasurements,
} from "@/lib/calculator/config";
import {
  calculateKitchen,
  formatINR,
  getKitchenLayout,
  getKitchenRunFeet,
  getPackage,
} from "@/lib/calculator/engine";
import type {
  KitchenLayoutId,
  MeasurementKey,
  PackageId,
} from "@/lib/calculator/types";

const steps: CalculatorStep[] = [
  {
    id: "layout",
    label: "Layout",
    title: "Select the layout of your kitchen",
    description:
      "The layout lets us understand the scope of work and how we could design your kitchen around the way you cook.",
  },
  {
    id: "measurements",
    label: "Measurements",
    title: "Choose the measurements",
    description:
      "This helps us estimate the size of your kitchen and give you a more accurate price.",
  },
  {
    id: "package",
    label: "Package",
    title: "Pick a package",
    description:
      "Our packages offer a choice of finishes and accessories. Choose the one that matches your everyday needs.",
  },
];

const initialLayout = KITCHEN_LAYOUTS[0];

/** Manage the kitchen steps and reveal estimates only after the first real selection. */
export default function KitchenCalculator() {
  const [step, setStep] = useState(0);
  const [layoutId, setLayoutId] = useState<KitchenLayoutId>("l-shaped");
  const [measurements, setMeasurements] = useState<
    Partial<Record<MeasurementKey, number>>
  >(() => defaultKitchenMeasurements(initialLayout));
  const [packageId, setPackageId] = useState<PackageId>("premium");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const layout = getKitchenLayout(layoutId);
  const pkg = getPackage(packageId);
  const runFeet = getKitchenRunFeet(layoutId, measurements);
  const estimate = calculateKitchen({
    layoutId,
    measurements,
    packageId,
    addOnIds,
  });

  const selectLayout = (value: KitchenLayoutId) => {
    setHasStarted(true);
    setLayoutId(value);
    setMeasurements(defaultKitchenMeasurements(getKitchenLayout(value)));
  };

  const toggleAddOn = (id: string) => {
    setHasStarted(true);
    setAddOnIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const goNext = () => {
    setStep((current) => Math.min(steps.length - 1, current + 1));
  };

  const reset = () => {
    setStep(0);
    setLayoutId("l-shaped");
    setMeasurements(defaultKitchenMeasurements(initialLayout));
    setPackageId("premium");
    setAddOnIds([]);
    setHasStarted(false);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector<HTMLElement>(".calc-tabs-root")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="calc-layout">
      <StepFlow
        steps={steps}
        current={step}
        canContinue
        isReady={hasStarted}
        onBack={() => setStep((current) => Math.max(0, current - 1))}
        onContinue={goNext}
        ctaLocation="price_calculator_kitchen"
      >
        {step === 0 ? (
          <RadioGroup
            value={hasStarted ? layoutId : ""}
            onValueChange={(next) =>
              selectLayout(String(next) as KitchenLayoutId)
            }
            className="calc-choice-grid calc-choice-grid--layouts"
            aria-label="Kitchen layout"
          >
            {KITCHEN_LAYOUTS.map((option) => (
              <ChoiceCard
                key={option.id}
                value={option.id}
                checked={hasStarted && layoutId === option.id}
                title={option.name}
                description={option.summary}
                media={<KitchenLayoutDiagram layout={option.id} />}
              />
            ))}
          </RadioGroup>
        ) : null}

        {step === 1 ? (
          <MeasurementFields
            layout={layout}
            values={measurements}
            onChange={(key, value) => {
              setHasStarted(true);
              setMeasurements((current) => ({ ...current, [key]: value }));
            }}
          />
        ) : null}

        {step === 2 ? (
          <div className="calc-package-step">
            <PackageCards
              calculator="kitchen"
              media={PACKAGE_MEDIA.kitchen}
              value={hasStarted ? packageId : ""}
              onChange={(next) => {
                setHasStarted(true);
                setPackageId(next);
              }}
            />

            <fieldset className="calc-addons">
              <legend>
                Add appliances and services <span>(optional)</span>
              </legend>
              <div className="calc-addon-grid">
                {KITCHEN_ADD_ONS.map((addOn) => (
                  <Label
                    className="calc-addon"
                    htmlFor={`addon-${addOn.id}`}
                    key={addOn.id}
                  >
                    <Checkbox
                      id={`addon-${addOn.id}`}
                      className="calc-checkbox"
                      checked={addOnIds.includes(addOn.id)}
                      onCheckedChange={() => toggleAddOn(addOn.id)}
                    />
                    <span className="calc-addon-copy">
                      <span className="calc-addon-head">
                        <span>{addOn.name}</span>
                        <span>+{formatINR(addOn.price)}</span>
                      </span>
                      <span className="calc-addon-description">
                        {addOn.description}
                      </span>
                    </span>
                  </Label>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}
      </StepFlow>

      <BudgetSummary
        estimate={estimate}
        subtitle={`${layout.name} · ${runFeet} running ft · ${pkg.name}`}
        ctaLocation="price_calculator_kitchen"
        onReset={reset}
        isReady={hasStarted}
      />
    </div>
  );
}

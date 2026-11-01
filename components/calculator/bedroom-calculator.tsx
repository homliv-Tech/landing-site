"use client";

import { useState } from "react";
import BudgetSummary from "@/components/calculator/budget-summary";
import ChoiceCard from "@/components/calculator/choice-card";
import PackageCards from "@/components/calculator/package-cards";
import RangeField from "@/components/calculator/range-field";
import StepFlow, { type CalculatorStep } from "@/components/calculator/step-flow";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  BEDROOM_SCOPES,
  BEDROOM_TYPES,
  PACKAGE_MEDIA,
} from "@/lib/calculator/config";
import {
  calculateBedroom,
  getBedroomScope,
  getBedroomType,
  getPackage,
} from "@/lib/calculator/engine";
import type {
  BedroomScopeId,
  BedroomTypeId,
  PackageId,
} from "@/lib/calculator/types";

const steps: CalculatorStep[] = [
  {
    id: "type",
    label: "Bedroom",
    title: "What kind of bedroom is this?",
    description:
      "We use this to set a typical wardrobe size. You can adjust the measurements in the next step.",
  },
  {
    id: "measurements",
    label: "Measurements",
    title: "Choose the measurements",
    description:
      "A wardrobe is priced by its front area. Share the wall length you can dedicate to it and the height you prefer.",
  },
  {
    id: "scope",
    label: "Scope",
    title: "What should we design?",
    description:
      "Start with the wardrobe, or complete the room with a study, bed, dresser and TV unit.",
  },
  {
    id: "package",
    label: "Package",
    title: "Pick a package",
    description:
      "Choose the finish level that matches the way you want the room to feel.",
  },
];

const initialType = BEDROOM_TYPES[0];

export default function BedroomCalculator() {
  const [step, setStep] = useState(0);
  const [typeId, setTypeId] = useState<BedroomTypeId>("master");
  const [wardrobeWidthFt, setWardrobeWidthFt] = useState(initialType.defaultWallFt);
  const [wardrobeHeightFt, setWardrobeHeightFt] = useState(
    initialType.defaultHeightFt,
  );
  const [scopeId, setScopeId] = useState<BedroomScopeId>("wardrobe");
  const [packageId, setPackageId] = useState<PackageId>("premium");

  const type = getBedroomType(typeId);
  const scope = getBedroomScope(scopeId);
  const pkg = getPackage(packageId);
  const area = Math.round(wardrobeWidthFt * wardrobeHeightFt);
  const estimate = calculateBedroom({
    typeId,
    wardrobeWidthFt,
    wardrobeHeightFt,
    scopeId,
    packageId,
  });

  const selectType = (value: BedroomTypeId) => {
    const nextType = getBedroomType(value);
    setTypeId(value);
    setWardrobeWidthFt(nextType.defaultWallFt);
    setWardrobeHeightFt(nextType.defaultHeightFt);
  };

  const reset = () => {
    setStep(0);
    setTypeId("master");
    setWardrobeWidthFt(initialType.defaultWallFt);
    setWardrobeHeightFt(initialType.defaultHeightFt);
    setScopeId("wardrobe");
    setPackageId("premium");
  };

  return (
    <div className="calc-layout">
      <StepFlow
        steps={steps}
        current={step}
        canContinue
        onBack={() => setStep((current) => Math.max(0, current - 1))}
        onContinue={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
        ctaLocation="price_calculator_bedroom"
      >
        {step === 0 ? (
          <RadioGroup
            value={typeId}
            onValueChange={(next) => selectType(String(next) as BedroomTypeId)}
            className="calc-choice-grid calc-choice-grid--three"
            aria-label="Bedroom type"
          >
            {BEDROOM_TYPES.map((option) => (
              <ChoiceCard
                key={option.id}
                value={option.id}
                checked={typeId === option.id}
                title={option.name}
                description={option.summary}
              />
            ))}
          </RadioGroup>
        ) : null}

        {step === 1 ? (
          <div className="calc-bedroom-measure">
            <WardrobeDiagram width={wardrobeWidthFt} height={wardrobeHeightFt} />
            <div className="calc-bedroom-fields">
              <RangeField
                id="wardrobe-width"
                label="Wardrobe wall length"
                value={wardrobeWidthFt}
                min={4}
                max={14}
                step={1}
                unit="ft"
                hint="The wall the wardrobe will sit on"
                onChange={setWardrobeWidthFt}
              />
              <RangeField
                id="wardrobe-height"
                label="Wardrobe height"
                value={wardrobeHeightFt}
                min={7}
                max={12}
                step={1}
                unit="ft"
                hint="Floor to ceiling is usually 9–10 ft"
                onChange={setWardrobeHeightFt}
              />
              <p className="calc-hint">
                Front area: <strong>{area} sq ft</strong>. The loft is included
                in the estimate.
              </p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <RadioGroup
            value={scopeId}
            onValueChange={(next) => setScopeId(String(next) as BedroomScopeId)}
            className="calc-choice-grid calc-choice-grid--three"
            aria-label="Bedroom scope"
          >
            {BEDROOM_SCOPES.map((option) => (
              <ChoiceCard
                key={option.id}
                value={option.id}
                checked={scopeId === option.id}
                title={option.name}
                description={option.summary}
              />
            ))}
          </RadioGroup>
        ) : null}

        {step === 3 ? (
          <div className="calc-package-step">
            <PackageCards
              calculator="bedroom"
              media={PACKAGE_MEDIA.bedroom}
              value={packageId}
              onChange={setPackageId}
            />
            <p className="calc-note">
              Your estimate includes {scope.inclusions.join(", ").toLowerCase()}.
              Mattress, soft furnishings, appliances and civil work are quoted
              separately.
            </p>
          </div>
        ) : null}
      </StepFlow>

      <BudgetSummary
        estimate={estimate}
        subtitle={`${type.name} · ${wardrobeWidthFt} × ${wardrobeHeightFt} ft wardrobe · ${pkg.name}`}
        ctaLocation="price_calculator_bedroom"
        onReset={reset}
      />
    </div>
  );
}

function WardrobeDiagram({ width, height }: { width: number; height: number }) {
  const maxWidth = 14;
  const maxHeight = 12;
  const boxWidth = 64 + (width / maxWidth) * 120;
  const boxHeight = 44 + (height / maxHeight) * 76;
  const x = (240 - boxWidth) / 2;
  const y = 20;
  const loftHeight = Math.min(18, boxHeight * 0.22);
  const doorCount = Math.max(2, Math.min(5, Math.round(width / 2.4)));
  const doorWidth = boxWidth / doorCount;

  return (
    <svg
      className="calc-wardrobe-diagram"
      viewBox="0 0 240 160"
      role="img"
      aria-label={`Wardrobe ${width} feet wide and ${height} feet tall`}
    >
      <rect className="wardrobe-loft" x={x} y={y} width={boxWidth} height={loftHeight} />
      <rect
        className="wardrobe-body"
        x={x}
        y={y + loftHeight}
        width={boxWidth}
        height={boxHeight - loftHeight}
      />
      {Array.from({ length: doorCount - 1 }, (_, index) => (
        <line
          key={index}
          className="wardrobe-door"
          x1={x + doorWidth * (index + 1)}
          y1={y + loftHeight}
          x2={x + doorWidth * (index + 1)}
          y2={y + boxHeight}
        />
      ))}
      <line
        className="wardrobe-shelf"
        x1={x}
        y1={y + loftHeight}
        x2={x + boxWidth}
        y2={y + loftHeight}
      />
      <line
        className="wardrobe-dimension"
        x1={x}
        y1={y + boxHeight + 14}
        x2={x + boxWidth}
        y2={y + boxHeight + 14}
      />
      <text
        className="wardrobe-label"
        x={x + boxWidth / 2}
        y={y + boxHeight + 27}
        textAnchor="middle"
      >
        {width} ft
      </text>
      <line
        className="wardrobe-dimension"
        x1={x - 12}
        y1={y}
        x2={x - 12}
        y2={y + boxHeight}
      />
      <text
        className="wardrobe-label"
        x={x - 20}
        y={y + boxHeight / 2}
        textAnchor="middle"
        transform={`rotate(-90 ${x - 20} ${y + boxHeight / 2})`}
      >
        {height} ft
      </text>
    </svg>
  );
}

"use client";

import { useState } from "react";
import BhkSelector from "@/components/calculator/bhk-selector";
import BudgetSummary from "@/components/calculator/budget-summary";
import PackageCards from "@/components/calculator/package-cards";
import RangeField from "@/components/calculator/range-field";
import RoomCounterList from "@/components/calculator/room-counter-list";
import StepFlow, { type CalculatorStep } from "@/components/calculator/step-flow";
import {
  PACKAGE_MEDIA,
  ROOMS,
  defaultRoomsForBhk,
  findBhkOption,
  findBhkVariant,
} from "@/lib/calculator/config";
import { calculateFullHome, getPackage } from "@/lib/calculator/engine";
import type { PackageId, RoomId } from "@/lib/calculator/types";

const steps: CalculatorStep[] = [
  {
    id: "bhk",
    label: "Home type",
    title: "Select your BHK type",
    description:
      "The type of house helps us understand the configuration of your home and set sensible room counts.",
  },
  {
    id: "size",
    label: "Size",
    title: "Select the size of your house",
    description:
      "This helps us give you a more accurate estimate for your interiors. Move the slider if your carpet area differs.",
  },
  {
    id: "rooms",
    label: "Rooms",
    title: "Pick the rooms to be designed",
    description:
      "This helps us understand the scope of work for your home interiors. Add or remove rooms to match your plan.",
  },
  {
    id: "package",
    label: "Package",
    title: "Pick a package",
    description:
      "This helps us fine-tune the calculation based on the products and accessories that match your lifestyle.",
  },
];

const defaultBhk = findBhkOption("2");
const defaultVariant = findBhkVariant(defaultBhk, "small");

/** Coordinate BHK, floor area, bounded room counts and package selections. */
export default function FullHomeCalculator() {
  const [step, setStep] = useState(0);
  const [bhkId, setBhkId] = useState(defaultBhk.id);
  const [variantId, setVariantId] = useState(defaultVariant.id);
  const [area, setArea] = useState(defaultVariant.area);
  const [rooms, setRooms] = useState<Record<RoomId, number>>(() =>
    defaultRoomsForBhk(2),
  );
  const [packageId, setPackageId] = useState<PackageId>("premium");
  const [hasStarted, setHasStarted] = useState(false);

  const bhkOption = findBhkOption(bhkId);
  const variant = findBhkVariant(bhkOption, variantId);
  const bhkCount = Number.parseInt(bhkOption.id, 10) || 1;
  const pkg = getPackage(packageId);
  const maxes = Object.fromEntries(
    ROOMS.map((room) => [room.id, room.maxForBhk(bhkCount)]),
  ) as Record<RoomId, number>;
  const totalRooms = Object.values(rooms).reduce(
    (total, count) => total + count,
    0,
  );
  const isEstimateReady = hasStarted && totalRooms > 0;
  const estimate = calculateFullHome({
    bhkId,
    variantId,
    area,
    rooms,
    packageId,
  });

  const selectBhk = (next: { bhkId: string; variantId: string }) => {
    const nextOption = findBhkOption(next.bhkId);
    const nextVariant = findBhkVariant(nextOption, next.variantId);
    const nextCount = Number.parseInt(nextOption.id, 10) || 1;
    setHasStarted(true);
    setBhkId(nextOption.id);
    setVariantId(nextVariant.id);
    setArea(nextVariant.area);
    setRooms(defaultRoomsForBhk(nextCount));
  };

  const updateRoom = (room: RoomId, count: number) => {
    setHasStarted(true);
    setRooms((current) => ({
      ...current,
      [room]: Math.min(maxes[room] ?? 0, Math.max(0, count)),
    }));
  };

  const goNext = () => {
    setStep((current) => Math.min(steps.length - 1, current + 1));
  };

  const reset = () => {
    setStep(0);
    setBhkId(defaultBhk.id);
    setVariantId(defaultVariant.id);
    setArea(defaultVariant.area);
    setRooms(defaultRoomsForBhk(2));
    setPackageId("premium");
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
        canContinue={step !== 2 || totalRooms > 0}
        isReady={isEstimateReady}
        onBack={() => setStep((current) => Math.max(0, current - 1))}
        onContinue={goNext}
        ctaLocation="price_calculator_full_home"
      >
        {step === 0 ? (
          <BhkSelector
            value={hasStarted ? { bhkId, variantId } : { bhkId: "", variantId: "" }}
            onChange={selectBhk}
          />
        ) : null}

        {step === 1 ? (
          <div className="calc-area-step">
            <RangeField
              id="home-area"
              label="Carpet area"
              value={area}
              min={variant.minArea}
              max={variant.maxArea}
              step={25}
              unit="sq ft"
              hint={`Typical for a ${bhkOption.label.toLowerCase()} ${variant.label.toLowerCase()} home: ${variant.area.toLocaleString("en-IN")} sq ft`}
              onChange={(value) => {
                setHasStarted(true);
                setArea(value);
              }}
            />
            <div className="calc-area-context">
              <span>{bhkOption.label}</span>
              <span>{variant.label}</span>
              <span>{area.toLocaleString("en-IN")} sq ft</span>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="calc-rooms-step">
            <RoomCounterList
              rooms={ROOMS}
              counts={rooms}
              maxes={maxes}
              onChange={updateRoom}
            />
            <p className="calc-hint">
              {totalRooms} {totalRooms === 1 ? "room" : "rooms"} selected. Bedroom
              and bathroom counts are capped to suit a {bhkOption.label} home.
            </p>
            {totalRooms === 0 ? (
              <p className="calc-error" role="status">
                Select at least one room to continue.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="calc-package-step">
            <PackageCards
              calculator="full-home"
              media={PACKAGE_MEDIA["full-home"]}
              value={hasStarted ? packageId : ""}
              onChange={(next) => {
                setHasStarted(true);
                setPackageId(next);
              }}
            />
            <p className="calc-note">
              Room estimates include modular cabinetry, finishes and standard
              hardware. Furniture, appliances, painting and civil work are
              additional.
            </p>
          </div>
        ) : null}
      </StepFlow>

      <BudgetSummary
        estimate={estimate}
        subtitle={`${bhkOption.label} ${variant.label.toLowerCase()} · ${area.toLocaleString("en-IN")} sq ft · ${totalRooms} rooms · ${pkg.name}`}
        ctaLocation="price_calculator_full_home"
        onReset={reset}
        isReady={isEstimateReady}
      />
    </div>
  );
}

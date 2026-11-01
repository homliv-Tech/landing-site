import {
  BEDROOM_ADD_ON_MULTIPLIERS,
  BEDROOM_RATES,
  BEDROOM_SCOPES,
  BEDROOM_TYPES,
  BHK_OPTIONS,
  KITCHEN_ADD_ONS,
  KITCHEN_LAYOUTS,
  KITCHEN_RATES,
  PACKAGES,
  ROOMS,
  ROOM_RATES,
  findBhkOption,
  findBhkVariant,
} from "./config";
import type {
  BedroomInput,
  BedroomScopeId,
  BedroomTypeId,
  Estimate,
  FullHomeInput,
  KitchenInput,
  KitchenLayoutId,
  PackageId,
} from "./types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const roundTo = (value: number, nearest = 500) =>
  Math.round(value / nearest) * nearest;

export function formatINR(value: number): string {
  return inr.format(Math.round(value));
}

export function getPackage(id: PackageId) {
  return PACKAGES.find((item) => item.id === id) ?? PACKAGES[1];
}

export function getKitchenLayout(id: KitchenLayoutId) {
  return KITCHEN_LAYOUTS.find((item) => item.id === id) ?? KITCHEN_LAYOUTS[0];
}

export function getBedroomType(id: BedroomTypeId) {
  return BEDROOM_TYPES.find((item) => item.id === id) ?? BEDROOM_TYPES[0];
}

export function getBedroomScope(id: BedroomScopeId) {
  return BEDROOM_SCOPES.find((item) => item.id === id) ?? BEDROOM_SCOPES[0];
}

export function getKitchenRunFeet(
  layoutId: KitchenLayoutId,
  measurements: Partial<Record<"A" | "B" | "C", number>>,
): number {
  const layout = getKitchenLayout(layoutId);
  return layout.measurements.reduce((total, measurement) => {
    const raw = measurements[measurement.key] ?? measurement.defaultFt;
    return total + clamp(raw, measurement.minFt, measurement.maxFt);
  }, 0);
}

export function calculateKitchen(input: KitchenInput): Estimate {
  const layout = getKitchenLayout(input.layoutId);
  const pkg = getPackage(input.packageId);
  const rate = KITCHEN_RATES[input.packageId];
  const runFeet = getKitchenRunFeet(input.layoutId, input.measurements);
  const cabinetry = roundTo(runFeet * rate, 500);
  const addOns = KITCHEN_ADD_ONS.filter((addOn) =>
    input.addOnIds.includes(addOn.id),
  );

  const lines = [
    {
      label: `${pkg.name} kitchen`,
      detail: `${runFeet} running ft × ${formatINR(rate)} per ft`,
      amount: cabinetry,
    },
    ...addOns.map((addOn) => ({
      label: addOn.name,
      detail: addOn.description,
      amount: addOn.price,
    })),
  ];

  return {
    total: lines.reduce((total, line) => total + line.amount, 0),
    lines,
    notes: [
      `${layout.name} layout with base units, wall units, countertop and standard hardware.`,
      "Appliance prices are indicative and depend on the model you choose.",
      "Final quote may vary with site measurements and civil work.",
    ],
  };
}

export function calculateBedroom(input: BedroomInput): Estimate {
  const type = getBedroomType(input.typeId);
  const scope = getBedroomScope(input.scopeId);
  const pkg = getPackage(input.packageId);
  const width = clamp(input.wardrobeWidthFt, 4, 14);
  const height = clamp(input.wardrobeHeightFt, 7, 12);
  const area = Math.round(width * height);
  const rate = BEDROOM_RATES[input.packageId];
  const multiplier = BEDROOM_ADD_ON_MULTIPLIERS[input.packageId];
  const wardrobe = roundTo(area * rate, 500);

  const lines = [
    {
      label: "Wardrobe with loft",
      detail: `${type.name} · ${width} × ${height} ft (${area} sq ft)`,
      amount: wardrobe,
    },
    ...scope.addOns.map((addOn) => ({
      label: addOn.label,
      detail: `Included in ${scope.name.toLowerCase()}`,
      amount: roundTo(addOn.price * multiplier, 500),
    })),
  ];

  return {
    total: lines.reduce((total, line) => total + line.amount, 0),
    lines,
    notes: [
      `${pkg.name} finishes, standard hardware and installation included.`,
      "Wardrobe pricing is based on the front area (width × height).",
      "Mattress, soft furnishings, appliances and civil work are not included.",
    ],
  };
}

export function calculateFullHome(input: FullHomeInput): Estimate {
  const bhk = findBhkOption(input.bhkId);
  const variant = findBhkVariant(bhk, input.variantId);
  const pkg = getPackage(input.packageId);
  const bhkCount = Number.parseInt(bhk.id, 10) || 1;
  const area = clamp(input.area, variant.minArea, variant.maxArea);

  const roomLines = ROOMS.flatMap((room) => {
    const max = room.maxForBhk(bhkCount);
    const count = clamp(Math.round(input.rooms[room.id] ?? 0), 0, max);
    if (count === 0) return [];
    const rate = ROOM_RATES[room.id][input.packageId];
    return [
      {
        label: count > 1 ? `${room.name} × ${count}` : room.name,
        detail:
          count > 1
            ? `${formatINR(rate)} per room`
            : room.description,
        amount: rate * count,
      },
    ];
  });

  const subtotal = roomLines.reduce((total, line) => total + line.amount, 0);
  const sizeFactor = clamp(area / variant.area, 0.9, 1.15);
  const sizeAdjustment = roundTo(subtotal * (sizeFactor - 1), 500);

  const lines =
    sizeAdjustment === 0
      ? roomLines
      : [
          ...roomLines,
          {
            label: "Home size adjustment",
            detail: `${area.toLocaleString("en-IN")} sq ft against a ${variant.area.toLocaleString("en-IN")} sq ft baseline`,
            amount: sizeAdjustment,
          },
        ];

  return {
    total: lines.reduce((total, line) => total + line.amount, 0),
    lines,
    notes: [
      `${pkg.name} package for a ${bhk.label} ${variant.label.toLowerCase()} home.`,
      `${Object.values(input.rooms).reduce((total, count) => total + count, 0)} rooms included in this estimate.`,
      "Furniture, appliances, painting and civil work are priced separately.",
      "Final quote follows a site visit and detailed measurements.",
    ],
  };
}

export const ALL_BHK_OPTIONS = BHK_OPTIONS;

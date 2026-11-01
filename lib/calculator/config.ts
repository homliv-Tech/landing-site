import type {
  BedroomScope,
  BedroomType,
  BhkOption,
  CalculatorId,
  KitchenAddOn,
  KitchenLayoutDefinition,
  PackageDefinition,
  PackageId,
  RoomDefinition,
  RoomId,
} from "./types";

export const PACKAGES: PackageDefinition[] = [
  {
    id: "essentials",
    name: "Essentials",
    tier: "₹",
    summary: "A considered starting point with the essentials done well.",
    features: [
      "Affordable pricing",
      "Essential units and storage",
      "Standard finishes and hardware",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tier: "₹₹",
    summary: "More choice, better finishes and hardware that lasts.",
    features: [
      "Mid-range pricing",
      "Premium finishes and hardware",
      "Wider range of accessories",
    ],
  },
  {
    id: "luxe",
    name: "Luxe",
    tier: "₹₹₹",
    summary: "Our most refined palette of finishes, hardware and detailing.",
    features: [
      "Elite pricing",
      "Lavish finishes and detailing",
      "Extensive accessory range",
    ],
  },
  {
    id: "custom",
    name: "Build your own",
    tier: "₹₹₹₹",
    summary: "A directional estimate you tailor with our design team.",
    features: [
      "Customised pricing",
      "Flexible scope and design",
      "Pick individual materials",
    ],
  },
];

export const PACKAGE_MEDIA: Record<CalculatorId, Record<PackageId, string>> = {
  kitchen: {
    essentials:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80",
    premium:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80",
    luxe:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    custom:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  },
  bedroom: {
    essentials:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    premium:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    luxe:
      "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1200&q=80",
    custom:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
  },
  "full-home": {
    essentials:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    premium:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    luxe:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    custom:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  },
};

export const KITCHEN_LAYOUTS: KitchenLayoutDefinition[] = [
  {
    id: "l-shaped",
    name: "L-shaped",
    summary: "Two adjoining runs that make the most of a corner.",
    measurements: [
      { key: "A", label: "Short wall", helper: "The shorter return", defaultFt: 3, minFt: 1, maxFt: 10 },
      { key: "B", label: "Long wall", helper: "The main counter run", defaultFt: 8, minFt: 3, maxFt: 20 },
    ],
  },
  {
    id: "straight",
    name: "Straight",
    summary: "A single, efficient run along one wall.",
    measurements: [
      { key: "A", label: "Counter run", helper: "The full wall length", defaultFt: 8, minFt: 3, maxFt: 20 },
    ],
  },
  {
    id: "u-shaped",
    name: "U-shaped",
    summary: "Three connected runs for generous storage.",
    measurements: [
      { key: "A", label: "Left wall", helper: "The left return", defaultFt: 3, minFt: 1, maxFt: 10 },
      { key: "B", label: "Back wall", helper: "The main counter run", defaultFt: 8, minFt: 3, maxFt: 20 },
      { key: "C", label: "Right wall", helper: "The right return", defaultFt: 3, minFt: 1, maxFt: 10 },
    ],
  },
  {
    id: "parallel",
    name: "Parallel",
    summary: "Two facing runs with a clear work aisle.",
    measurements: [
      { key: "A", label: "First run", helper: "The first counter wall", defaultFt: 8, minFt: 3, maxFt: 20 },
      { key: "B", label: "Second run", helper: "The facing counter wall", defaultFt: 8, minFt: 3, maxFt: 20 },
    ],
  },
];

export const KITCHEN_RATES: Record<PackageId, number> = {
  essentials: 16000,
  premium: 24000,
  luxe: 34000,
  custom: 28000,
};

export const KITCHEN_ADD_ONS: KitchenAddOn[] = [
  {
    id: "tall-unit",
    name: "Tall unit",
    description: "Full-height storage with pull-out baskets",
    price: 28000,
  },
  {
    id: "hob-chimney",
    name: "Hob and chimney",
    description: "Built-in hob with a matching chimney",
    price: 34000,
  },
  {
    id: "built-in-oven",
    name: "Built-in oven",
    description: "Oven built into the tall unit",
    price: 46000,
  },
  {
    id: "dishwasher",
    name: "Dishwasher",
    description: "Integrated dishwasher with plumbing",
    price: 42000,
  },
  {
    id: "extra-drawers",
    name: "Extra drawer set",
    description: "Three additional soft-close drawers",
    price: 14000,
  },
  {
    id: "false-ceiling",
    name: "False ceiling and lights",
    description: "Kitchen ceiling with task lighting",
    price: 22000,
  },
  {
    id: "services",
    name: "Electrical and plumbing",
    description: "New points and plumbing connections",
    price: 24000,
  },
];

export const BEDROOM_TYPES: BedroomType[] = [
  {
    id: "master",
    name: "Master bedroom",
    summary: "A larger wardrobe wall with room for a dresser or seating.",
    defaultWallFt: 8,
    defaultHeightFt: 9,
  },
  {
    id: "guest",
    name: "Guest bedroom",
    summary: "Efficient storage for occasional use, without overbuilding.",
    defaultWallFt: 6,
    defaultHeightFt: 9,
  },
  {
    id: "kids",
    name: "Kids bedroom",
    summary: "Smart, flexible storage that grows with the room.",
    defaultWallFt: 6,
    defaultHeightFt: 9,
  },
];

export const BEDROOM_SCOPES: BedroomScope[] = [
  {
    id: "wardrobe",
    name: "Wardrobe only",
    summary: "A full-height wardrobe with loft and standard internal fittings.",
    inclusions: ["Wardrobe with loft", "Standard internal fittings", "Installation"],
    addOns: [],
  },
  {
    id: "wardrobe-study",
    name: "Wardrobe + study",
    summary: "The wardrobe, plus a study desk and a TV unit on the opposite wall.",
    inclusions: ["Wardrobe with loft", "Study desk", "TV unit"],
    addOns: [
      { label: "Study desk", price: 34000 },
      { label: "TV unit", price: 28000 },
    ],
  },
  {
    id: "full-bedroom",
    name: "Full bedroom",
    summary: "A complete room: wardrobe, bed, side tables, dresser and TV unit.",
    inclusions: ["Wardrobe with loft", "Bed with storage", "Side tables", "Dresser", "TV unit"],
    addOns: [
      { label: "Bed with storage", price: 55000 },
      { label: "Two side tables", price: 18000 },
      { label: "Dresser", price: 32000 },
      { label: "TV unit", price: 28000 },
    ],
  },
];

export const BEDROOM_RATES: Record<PackageId, number> = {
  essentials: 1500,
  premium: 2200,
  luxe: 3200,
  custom: 2500,
};

export const BEDROOM_ADD_ON_MULTIPLIERS: Record<PackageId, number> = {
  essentials: 1,
  premium: 1.35,
  luxe: 1.8,
  custom: 1.5,
};

const roomMax = (value: number) => () => value;

export const ROOMS: RoomDefinition[] = [
  {
    id: "living",
    name: "Living room",
    description: "TV unit, seating and storage",
    maxForBhk: roomMax(1),
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Modular cabinets and countertop",
    maxForBhk: roomMax(1),
  },
  {
    id: "bedroom",
    name: "Bedroom",
    description: "Wardrobe and bedroom storage",
    maxForBhk: (bhk) => bhk,
  },
  {
    id: "bathroom",
    name: "Bathroom",
    description: "Vanity, mirror and storage",
    maxForBhk: (bhk) => bhk + 1,
  },
  {
    id: "dining",
    name: "Dining",
    description: "Crockery unit and dining storage",
    maxForBhk: roomMax(1),
  },
];

export const ROOM_RATES: Record<RoomId, Record<PackageId, number>> = {
  living: { essentials: 60000, premium: 110000, luxe: 190000, custom: 230000 },
  kitchen: { essentials: 180000, premium: 300000, luxe: 450000, custom: 520000 },
  bedroom: { essentials: 120000, premium: 200000, luxe: 320000, custom: 380000 },
  bathroom: { essentials: 45000, premium: 75000, luxe: 120000, custom: 145000 },
  dining: { essentials: 55000, premium: 95000, luxe: 160000, custom: 190000 },
};

export const BHK_OPTIONS: BhkOption[] = [
  {
    id: "1",
    label: "1 BHK",
    variants: [
      { id: "standard", label: "Standard", note: "Up to 700 sq ft", area: 600, minArea: 350, maxArea: 900 },
    ],
  },
  {
    id: "2",
    label: "2 BHK",
    variants: [
      { id: "small", label: "Small", note: "Below 800 sq ft", area: 750, minArea: 500, maxArea: 950 },
      { id: "large", label: "Large", note: "Above 800 sq ft", area: 1000, minArea: 800, maxArea: 1300 },
    ],
  },
  {
    id: "3",
    label: "3 BHK",
    variants: [
      { id: "small", label: "Small", note: "Below 1,200 sq ft", area: 1150, minArea: 900, maxArea: 1350 },
      { id: "large", label: "Large", note: "Above 1,200 sq ft", area: 1500, minArea: 1200, maxArea: 2000 },
    ],
  },
  {
    id: "4",
    label: "4 BHK",
    variants: [
      { id: "small", label: "Small", note: "Below 1,800 sq ft", area: 1700, minArea: 1400, maxArea: 2000 },
      { id: "large", label: "Large", note: "Above 1,800 sq ft", area: 2200, minArea: 1800, maxArea: 3000 },
    ],
  },
  {
    id: "5",
    label: "5 BHK+",
    variants: [
      { id: "standard", label: "Standard", note: "Above 2,500 sq ft", area: 2800, minArea: 2200, maxArea: 5000 },
    ],
  },
];

export function defaultKitchenMeasurements(
  layout: KitchenLayoutDefinition,
): Record<string, number> {
  return Object.fromEntries(
    layout.measurements.map((measurement) => [measurement.key, measurement.defaultFt]),
  );
}

export function defaultRoomsForBhk(bhk: number): Record<RoomId, number> {
  return {
    living: 1,
    kitchen: 1,
    bedroom: bhk,
    bathroom: bhk,
    dining: 1,
  };
}

export function findBhkOption(bhkId: string): BhkOption {
  return BHK_OPTIONS.find((option) => option.id === bhkId) ?? BHK_OPTIONS[1];
}

export function findBhkVariant(bhk: BhkOption, variantId: string) {
  return bhk.variants.find((variant) => variant.id === variantId) ?? bhk.variants[0];
}

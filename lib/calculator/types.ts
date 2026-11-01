export type CalculatorId = "kitchen" | "bedroom" | "full-home";

export type PackageId = "essentials" | "premium" | "luxe" | "custom";

export type MeasurementKey = "A" | "B" | "C";

export type BreakdownLine = {
  label: string;
  detail?: string;
  amount: number;
};

export type Estimate = {
  total: number;
  lines: BreakdownLine[];
  notes: string[];
};

export type PackageDefinition = {
  id: PackageId;
  name: string;
  tier: string;
  summary: string;
  features: string[];
};

export type KitchenLayoutId = "l-shaped" | "straight" | "u-shaped" | "parallel";

export type KitchenMeasurement = {
  key: MeasurementKey;
  label: string;
  helper: string;
  defaultFt: number;
  minFt: number;
  maxFt: number;
};

export type KitchenLayoutDefinition = {
  id: KitchenLayoutId;
  name: string;
  summary: string;
  measurements: KitchenMeasurement[];
};

export type KitchenAddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type BedroomTypeId = "master" | "guest" | "kids";

export type BedroomType = {
  id: BedroomTypeId;
  name: string;
  summary: string;
  defaultWallFt: number;
  defaultHeightFt: number;
};

export type BedroomScopeId = "wardrobe" | "wardrobe-study" | "full-bedroom";

export type BedroomScope = {
  id: BedroomScopeId;
  name: string;
  summary: string;
  inclusions: string[];
  addOns: { label: string; price: number }[];
};

export type RoomId = "living" | "kitchen" | "bedroom" | "bathroom" | "dining";

export type RoomDefinition = {
  id: RoomId;
  name: string;
  description: string;
  maxForBhk: (bhk: number) => number;
};

export type BhkVariant = {
  id: string;
  label: string;
  note: string;
  area: number;
  minArea: number;
  maxArea: number;
};

export type BhkOption = {
  id: string;
  label: string;
  variants: BhkVariant[];
};

export type KitchenInput = {
  layoutId: KitchenLayoutId;
  measurements: Partial<Record<MeasurementKey, number>>;
  packageId: PackageId;
  addOnIds: string[];
};

export type BedroomInput = {
  typeId: BedroomTypeId;
  wardrobeWidthFt: number;
  wardrobeHeightFt: number;
  scopeId: BedroomScopeId;
  packageId: PackageId;
};

export type FullHomeInput = {
  bhkId: string;
  variantId: string;
  area: number;
  rooms: Record<RoomId, number>;
  packageId: PackageId;
};

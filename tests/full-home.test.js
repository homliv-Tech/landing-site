import { expect, test } from "bun:test";
import { getHomeBedroomCount, ROOM_RATES } from "../lib/calculator/config";
import { calculateFullHome } from "../lib/calculator/engine";

const input = {
  bhkId: "5",
  bedroomCount: 6,
  variantId: "standard",
  area: 2800,
  rooms: { living: 0, kitchen: 0, bedroom: 6, bathroom: 0, dining: 0 },
  packageId: "premium",
};

test("5 BHK+ prices all six bedrooms when six is the actual bedroom count", () => {
  const result = calculateFullHome(input);
  expect(result.total).toBe(6 * ROOM_RATES.bedroom.premium);
  expect(result.lines[0].label).toBe("Bedroom × 6");
  expect(result.notes[0]).toContain("6 bedrooms");
});

test("room limits use actual bedrooms and one additional bathroom", () => {
  const result = calculateFullHome({
    ...input,
    rooms: { ...input.rooms, bedroom: 7, bathroom: 8 },
  });
  expect(result.total).toBe(
    6 * ROOM_RATES.bedroom.premium + 7 * ROOM_RATES.bathroom.premium,
  );
  expect(result.lines.map((line) => line.label)).toEqual([
    "Bedroom × 6",
    "Bathroom × 7",
  ]);
});

test("fixed BHK categories keep their own limits", () => {
  expect(getHomeBedroomCount("2", 6)).toBe(2);
  expect(getHomeBedroomCount("4", 6)).toBe(4);
  expect(getHomeBedroomCount("5", 12)).toBe(12);
});

test.each([undefined, 0, 4, 6.5, NaN, Infinity])(
  "invalid 5 BHK+ bedroom count %s falls back to five",
  (count) => {
    expect(getHomeBedroomCount("5", count)).toBe(5);
  },
);

import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Slider } from "../components/ui/slider";

test.each([
  ["controlled scalar", { value: 40 }, 1],
  ["zero scalar", { value: 0 }, 1],
  ["default scalar", { defaultValue: 40 }, 1],
  ["controlled range", { value: [20, 80] }, 2],
  ["default range", { defaultValue: [20, 80] }, 2],
  [
    "controlled scalar overrides a default range",
    { value: 40, defaultValue: [20, 80] },
    1,
  ],
  ["default minimum", {}, 1],
  ["custom minimum", { min: 25 }, 1],
])(
  "%s renders the correct number of slider thumbs",
  (_name, props, expected) => {
    const html = renderToStaticMarkup(
      createElement(Slider, { ...props, "aria-label": "Measurement" }),
    );
    expect([...html.matchAll(/data-slot="slider-thumb"/g)]).toHaveLength(
      expected,
    );
  },
);

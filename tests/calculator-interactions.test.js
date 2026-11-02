import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

const capture = mock(() => {});
mock.module("posthog-js", () => ({ default: { capture } }));
const { default: CalculatorPage } =
  await import("../components/calculator/calculator-page");
const { default: FullHomeCalculator } =
  await import("../components/calculator/full-home-calculator");

const originalToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
let root;
let container;
let animationFrame;
let frames;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  frames = [];
  animationFrame = spyOn(window, "requestAnimationFrame").mockImplementation(
    (callback) => {
      frames.push(callback);
      return frames.length;
    },
  );
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "test-token";
  capture.mockClear();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  animationFrame.mockRestore();
  window.history.replaceState(null, "", "/");
  if (originalToken === undefined)
    delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  else process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = originalToken;
});

test("a bedroom deep link emits only its actual initial view, then subsequent tab views", async () => {
  window.history.replaceState(null, "", "/price-calculator#bedroom");
  await act(async () => root.render(createElement(CalculatorPage)));
  expect(capture).not.toHaveBeenCalled();

  await act(async () => {
    for (const callback of frames.splice(0)) callback(0);
  });
  expect(capture.mock.calls.map((args) => args[1].calculator)).toEqual([
    "bedroom",
  ]);

  const fullHomeTab = [...container.querySelectorAll('[role="tab"]')].find(
    (tab) => tab.textContent.includes("Full home"),
  );
  await act(async () => fullHomeTab.click());
  expect(capture.mock.calls.map((args) => args[1].calculator)).toEqual([
    "bedroom",
    "full-home",
  ]);
});

test("a 5 BHK+ user can enter six bedrooms and include the sixth room", async () => {
  await act(async () => root.render(createElement(FullHomeCalculator)));
  const choice = [...container.querySelectorAll("label")].find((label) =>
    label.textContent.includes("5 BHK+"),
  );
  await act(async () => choice.click());
  const count = document.getElementById("home-bedroom-count");
  expect(count).not.toBeNull();

  await act(async () => {
    count.focus();
    count.value = "6";
    count.blur();
  });
  expect(
    container.querySelector(".calc-summary-subtitle").textContent,
  ).toContain("6 bedrooms");

  for (let index = 0; index < 2; index++) {
    const next = [...container.querySelectorAll("button")].find(
      (button) => button.textContent.trim() === "Continue",
    );
    await act(async () => next.click());
  }
  const bedroom = [...container.querySelectorAll(".calc-room")].find(
    (room) => room.querySelector(".calc-room-name").textContent === "Bedroom",
  );
  expect(bedroom.querySelector("output").textContent).toBe("6");
  expect(
    bedroom.querySelector('button[aria-label="Add one bedroom"]').disabled,
  ).toBe(true);
});

import { expect, mock, test } from "bun:test";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import StepFlow from "../components/calculator/step-flow";

test("moving to a step scrolls an obscured panel below the sticky tabs", async () => {
  const container = document.createElement("div");
  const tabs = document.createElement("div");
  tabs.className = "calc-tabs-wrap";
  tabs.getBoundingClientRect = () => ({ bottom: 140 });
  document.body.append(tabs, container);
  const root = createRoot(container);
  const originalScrollBy = window.scrollBy;
  window.scrollBy = mock(() => {});
  const steps = ["First", "Second"].map((title) => ({ id: title, label: title, title, description: title }));
  const render = (current) => createElement(StepFlow, {
    steps, current, onBack: () => {}, onContinue: () => {}, ctaLocation: "test",
  });

  try {
    await act(async () => root.render(render(0)));
    container.querySelector(".calc-panel").getBoundingClientRect = () => ({ top: 100 });
    await act(async () => root.render(render(1)));
    expect(window.scrollBy).toHaveBeenCalledWith({ top: -52, behavior: "smooth" });
  } finally {
    await act(async () => root.unmount());
    window.scrollBy = originalScrollBy;
    tabs.remove();
    container.remove();
  }
});

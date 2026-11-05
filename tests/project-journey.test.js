import { afterEach, expect, spyOn, test } from "bun:test";
import { act, createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JourneyExplorer } from "../components/project-journey/journey-explorer";
import { getFlowPosition } from "../components/project-journey/flow-layout";
import { journeyStages } from "../components/project-journey/journey-stages";

let focusSpy;

afterEach(() => {
  cleanup();
  focusSpy?.mockRestore();
  focusSpy = undefined;
});

function supportPreventScroll() {
  const focus = HTMLElement.prototype.focus;
  // Happy DOM does not read focus options; emulate browsers supporting preventScroll.
  focusSpy = spyOn(HTMLElement.prototype, "focus").mockImplementation(function (options) {
    void options?.preventScroll;
    focus.call(this, options);
  });
}

test("hover previews wait briefly, stay open over the details and close on leaving", async () => {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer, { stages: journeyStages }));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  const originalFocus = document.activeElement;

  await user.hover(first);
  expect(screen.queryByRole("dialog") === null).toBe(true);
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 250)); });
  const details = await screen.findByRole("dialog", { name: journeyStages[0].title });
  expect(details.textContent).toContain(journeyStages[0].description);
  expect(document.activeElement === originalFocus).toBe(true);

  await user.hover(details);
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 250)); });
  expect(screen.getByRole("dialog", { name: journeyStages[0].title }) === details).toBe(true);
  await user.unhover(details);
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
});

test("hovering another step replaces the preview and its close button dismisses it", async () => {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer, { stages: journeyStages }));
  const process = within(screen.getByRole("list", { name: "Homliv’s 60-day project process" }));
  const first = process.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  const second = process.getByRole("button", { name: `Step 2: ${journeyStages[1].title}` });

  expect(process.getAllByRole("listitem")).toHaveLength(journeyStages.length);
  await user.hover(first);
  expect(screen.queryByRole("dialog") === null).toBe(true);
  expect((await screen.findByRole("dialog", { name: journeyStages[0].title })).textContent)
    .toContain(journeyStages[0].description);

  await user.hover(second);
  const details = await screen.findByRole("dialog", { name: journeyStages[1].title });
  expect(details.textContent).toContain(journeyStages[1].description);
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(first.getAttribute("aria-expanded")).toBe("false");
  expect(second.getAttribute("aria-expanded")).toBe("true");

  await user.click(within(details).getByRole("button", { name: "Close step details" }));
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
});

test("Tab focus previews a step, Escape dismisses it, and Enter still opens it", async () => {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer, { stages: journeyStages }));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  await user.tab();
  expect(document.activeElement === first).toBe(true);
  await screen.findByRole("dialog", { name: journeyStages[0].title });
  expect(document.activeElement === first).toBe(true);
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  await waitFor(() => expect(document.activeElement === first).toBe(true));
  await user.keyboard("{Enter}");
  await screen.findByRole("dialog", { name: journeyStages[0].title });
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  await user.tab();
  expect(document.activeElement === screen.getByRole("button", { name: `Step 2: ${journeyStages[1].title}` })).toBe(true);
  await screen.findByRole("dialog", { name: journeyStages[1].title });
});

test("keyboard focus opens the matching preview before Tab is released", async () => {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer, { stages: journeyStages }));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  await user.keyboard("{Tab>}");
  expect(document.activeElement === first).toBe(true);
  expect(first.getAttribute("aria-expanded")).toBe("true");
  await user.keyboard("{/Tab}");
});

test("pointer movement within a pending hover cannot replace keyboard focus", async () => {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer, { stages: journeyStages }));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  const second = screen.getByRole("button", { name: `Step 2: ${journeyStages[1].title}` });
  await user.hover(second);
  await user.keyboard("{Tab>}");
  fireEvent.pointerMove(second, { pointerType: "mouse", clientX: 1, clientY: 1 });
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 250)); });
  expect(document.activeElement === first).toBe(true);
  expect(first.getAttribute("aria-expanded")).toBe("true");
  expect(second.getAttribute("aria-expanded")).toBe("false");
  await user.keyboard("{/Tab}");
});

test("pressing an outside form field preserves focus on that field", async () => {
  supportPreventScroll();
  const user = userEvent.setup();
  render(createElement("div", null,
    createElement(JourneyExplorer, { stages: journeyStages }),
    createElement("input", { "aria-label": "Contact name" }),
  ));
  await user.tab();
  const details = await screen.findByRole("dialog", { name: journeyStages[0].title });
  await user.tab();
  expect(document.activeElement === within(details).getByRole("button", { name: "Close step details" })).toBe(true);
  const contact = screen.getByRole("textbox", { name: "Contact name" });
  await user.click(contact);
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  expect(document.activeElement === contact).toBe(true);

  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  await act(async () => { first.focus(); });
  await screen.findByRole("dialog", { name: journeyStages[0].title });
});

test("pressing nonfocusable page content restores focus to the step without reopening", async () => {
  supportPreventScroll();
  const user = userEvent.setup();
  render(createElement("div", null,
    createElement(JourneyExplorer, { stages: journeyStages }),
    createElement("p", null, "Outside page content"),
  ));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  await user.tab();
  const details = await screen.findByRole("dialog", { name: journeyStages[0].title });
  await user.tab();
  expect(document.activeElement === within(details).getByRole("button", { name: "Close step details" })).toBe(true);
  await user.click(screen.getByText("Outside page content"));
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  await waitFor(() => expect(document.activeElement === first).toBe(true));
  expect(first.getAttribute("aria-expanded")).toBe("false");
  await user.tab();
  expect(document.activeElement === screen.getByRole("button", { name: `Step 2: ${journeyStages[1].title}` })).toBe(true);
});

test("outside-dismissed hover does not prevent focus restoration on a later preview", async () => {
  supportPreventScroll();
  const user = userEvent.setup();
  render(createElement("div", null,
    createElement(JourneyExplorer, { stages: journeyStages }),
    createElement("input", { "aria-label": "Contact name" }),
  ));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  await user.hover(first);
  await screen.findByRole("dialog", { name: journeyStages[0].title });
  const contact = screen.getByRole("textbox", { name: "Contact name" });
  await user.click(contact);
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  const last = screen.getByRole("button", { name: `Step ${journeyStages.length}: ${journeyStages.at(-1).title}` });
  await act(async () => { last.focus(); });
  expect(document.activeElement === last).toBe(true);
  await screen.findByRole("dialog", { name: journeyStages.at(-1).title });
  await user.tab();
  await user.keyboard("{Enter}");
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  await waitFor(() => expect(document.activeElement === last).toBe(true));
});

test("closing details with the keyboard does not reopen them when focus returns", async () => {
  const user = userEvent.setup();
  render(createElement(JourneyExplorer, { stages: journeyStages }));
  const first = screen.getByRole("button", { name: `Step 1: ${journeyStages[0].title}` });
  await user.tab();
  const details = await screen.findByRole("dialog", { name: journeyStages[0].title });
  const close = within(details).getByRole("button", { name: "Close step details" });
  await user.tab();
  expect(document.activeElement === close).toBe(true);
  await user.keyboard("{Enter}");
  await waitFor(() => expect(screen.queryByRole("dialog") === null).toBe(true));
  await waitFor(() => expect(document.activeElement === first).toBe(true));
});

test("touch users can explore an added stage without changing the component", async () => {
  const user = userEvent.setup();
  const extra = { ...journeyStages[0], id: "aftercare", title: "Aftercare", description: "Support after handover." };
  render(createElement(JourneyExplorer, { stages: [...journeyStages, extra] }));
  await user.pointer({ keys: "[TouchA]", target: screen.getByRole("button", { name: "Step 7: Aftercare" }) });
  const details = await screen.findByRole("dialog", { name: "Aftercare" });
  expect(details.textContent).toContain("Step 07 / 07");
  expect(details.textContent).toContain(extra.description);
  await waitFor(() => expect(details.contains(document.activeElement)).toBe(true));
});

test("flowchart steps remain adjacent and distinct across tablet and desktop rows", () => {
  for (const columns of [2, 3]) {
    const positions = Array.from({ length: 10 }, (_, index) => getFlowPosition(index, columns));
    expect(new Set(positions.map(({ row, column }) => `${row}:${column}`)).size).toBe(positions.length);
    for (let index = 0; index < positions.length - 1; index++) {
      const current = positions[index];
      const next = positions[index + 1];
      expect(Math.abs(next.row - current.row) + Math.abs(next.column - current.column)).toBe(1);
      const expectedDirection = next.row > current.row ? "down" : next.column > current.column ? "right" : "left";
      expect(current.direction).toBe(expectedDirection);
    }
  }
});

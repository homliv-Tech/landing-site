import { expect, test } from "bun:test";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import ProjectIndex from "../components/projects/project-index";
import { projects } from "../lib/projects";

test("project filters restrict gallery links and All spaces restores every collection", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(ProjectIndex, { projects, inspirationOnly: true })));
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(projects.length);
    const filter = [...container.querySelectorAll("button")].find((button) => button.textContent === projects[0].category);
    await act(async () => filter.click());
    expect(filter.getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(1);
    expect(container.querySelector('a[href^="/projects/"]').getAttribute("href")).toBe(`/projects/${projects[0].slug}`);
    expect(container.querySelector('[aria-live="polite"]').textContent).toContain("01 collection");
    await act(async () => container.querySelector("button").click());
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(projects.length);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});

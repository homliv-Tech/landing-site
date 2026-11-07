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
    await act(async () => root.render(createElement(ProjectIndex, { projects })));
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(projects.length);
    const filter = [...container.querySelectorAll("button")].find((button) => button.textContent === projects[0].category);
    await act(async () => filter.click());
    expect(filter.getAttribute("aria-pressed")).toBe("true");
    const matching = projects.filter((project) => project.category === projects[0].category);
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(matching.length);
    expect(container.querySelector('a[href^="/projects/"]').getAttribute("href")).toBe(`/projects/${projects[0].slug}`);
    expect(container.querySelector('[aria-live="polite"]').textContent).toBe(`${String(matching.length).padStart(2, "0")} ${matching.length === 1 ? "project" : "projects"}`);
    await act(async () => container.querySelector("button").click());
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(projects.length);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});

// Keep mixed-catalogue coverage independent of the live portfolio.
const inspirationProject = { ...projects[0], category: "Design references", inspiration: true };
const approved = {
  ...projects[0],
  slug: "approved-home", title: "Approved home", category: "Built homes",
  inspiration: false,
  photos: [{ objectKey: "images/projects/approved-home/01.webp", alt: "Approved home", width: 1600, height: 1200 }],
};

test("mixed catalogue keeps inspiration labels and updates wording when filtering", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(ProjectIndex, { projects: [approved, inspirationProject] })));
    expect(container.querySelector("h2").textContent).toBe("Projects and inspiration");
    expect(container.querySelector('[aria-live="polite"]').textContent).toBe("02 entries");
    const inspiration = container.querySelector(`a[href="/projects/${projects[0].slug}"]`);
    expect(inspiration.textContent).toContain("Design inspiration");
    expect(inspiration.getAttribute("aria-label")).toContain("design inspiration");
    const realProject = container.querySelector('a[href="/projects/approved-home"]');
    expect(realProject.textContent).not.toContain("Design inspiration");
    expect(realProject.getAttribute("aria-label")).not.toContain("design inspiration");

    const filter = (label) => [...container.querySelectorAll("button")].find((button) => button.textContent === label);
    await act(async () => filter("Built homes").click());
    expect(container.querySelector("h2").textContent).toBe("All projects");
    expect(container.querySelector('[aria-live="polite"]').textContent).toBe("01 project");
    await act(async () => filter(inspirationProject.category).click());
    expect(container.querySelector("h2").textContent).toBe("The collections");
    expect(container.querySelector('[aria-live="polite"]').textContent).toBe("01 collection");
    await act(async () => filter("All spaces").click());
    expect(container.querySelector("h2").textContent).toBe("Projects and inspiration");
    expect(container.querySelectorAll('a[href^="/projects/"]').length).toBe(2);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});

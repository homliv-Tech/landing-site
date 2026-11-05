import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FeaturedProjects from "../components/projects/featured-projects";
import ProjectsPage from "../app/projects/page";
import { projects, projectPhotoUrl } from "../lib/projects";

const inspiration = projects[0];
const approved = {
  ...inspiration,
  slug: "approved-home", title: "Approved home", inspiration: false,
  photos: [{ objectKey: "images/projects/approved-home/01.webp", alt: "Approved home", width: 1600, height: 1200 }],
};

function withCatalogue(entries, run) {
  const original = [...projects];
  try {
    projects.splice(0, projects.length, ...entries);
    run();
  } finally {
    projects.splice(0, projects.length, ...original);
  }
}

test.each([
  ["single-photo", approved],
  ["multi-photo", inspiration],
])("projects hero uses the cover of a %s project", (_name, project) => {
  withCatalogue([project], () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(createElement(ProjectsPage));
    const hero = container.querySelector('section[aria-labelledby="projects-heading"]');
    const image = hero.querySelector("img");
    const source = new URL(image.getAttribute("src"), "http://localhost");
    const cover = project.photos[0];
    expect(source.searchParams.get("url")).toBe(projectPhotoUrl(cover));
    expect(image.getAttribute("alt")).toBe(cover.alt);
    expect(image.getAttribute("width")).toBe(String(cover.width));
    expect(image.getAttribute("height")).toBe(String(cover.height));
    expect(hero.querySelector('a[href^="/projects/"]').getAttribute("href")).toBe(`/projects/${project.slug}`);
  });
});

test.each([
  ["inspiration", [inspiration], "Design inspiration", "inspiration collections"],
  ["approved work", [approved], "Featured projects", "selected projects"],
  ["mixed work", [approved, inspiration], "Projects and inspiration", "projects and inspiration collections"],
])("homepage and index describe %s accurately", (_name, entries, featuredHeading, indexLabel) => {
  withCatalogue(entries, () => {
    const featured = renderToStaticMarkup(createElement(FeaturedProjects));
    const index = renderToStaticMarkup(createElement(ProjectsPage));
    expect(featured).toContain(featuredHeading);
    expect(index).toContain(indexLabel);
    if (entries.some((project) => project.inspiration)) {
      expect(featured).not.toContain("homes and interiors we design");
      expect(index).not.toContain("Our architectural projects, from the overall space");
      expect(featured).toContain("(design inspiration)");
      expect(index).toContain("(design inspiration)");
    } else {
      expect(featured).toContain("homes and interiors we design");
      expect(index).toContain("Our architectural projects, from the overall space");
      expect(featured).not.toContain("(design inspiration)");
    }
  });
});

test("an approved entry outside the featured selection cannot relabel inspiration as Homliv work", () => {
  for (const featured of [false, true]) {
    withCatalogue([inspiration, { ...inspiration, slug: "other-inspiration" }, { ...approved, featured }], () => {
      const homepage = renderToStaticMarkup(createElement(FeaturedProjects));
      expect(homepage).toContain("Design inspiration");
      expect(homepage).toContain("Spaces, materials and ideas");
      expect(homepage).not.toContain("homes and interiors we design");
      expect(homepage).not.toContain("Approved home");
    });
  }
});

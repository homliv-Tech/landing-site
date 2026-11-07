import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectPage from "../app/projects/[slug]/page";
import { projects } from "../lib/projects";

test.each([
  [1, 0],
  [2, 0],
  [2, 1],
])("detail page keeps its closing enquiry for %i projects at index %i", async (count, index) => {
  const original = [...projects];
  try {
    projects.splice(0, projects.length, ...original.slice(0, count));
    const page = await ProjectPage({ params: Promise.resolve({ slug: projects[index].slug }) });
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(page);
    const images = container.querySelectorAll('section[aria-label$="photo gallery"] img');
    expect(images.length).toBe(projects[index].photos.length);
    for (const image of images) {
      expect(image.getAttribute("referrerPolicy")).toBe("no-referrer");
      expect(image.getAttribute("src")).toStartWith("https://assets.homliv.co.in/images/portfolio/");
      expect(image.closest("a").getAttribute("referrerPolicy")).toBe("no-referrer");
    }
    const closing = container.querySelector("main > section:last-child");
    const enquiries = closing.querySelectorAll('[data-enquiry-location="project_close"]');
    expect(enquiries.length).toBe(1);
    expect(enquiries[0].getAttribute("href")).toBe("/#contact");
    expect(enquiries[0].textContent).toContain("Start your project");

    const nextLink = closing.querySelector('a[href^="/projects/"]');
    if (count === 1) {
      expect(nextLink).toBeNull();
      expect(closing.textContent).not.toContain("Next collection");
    } else {
      const next = projects[(index + 1) % count];
      expect(nextLink.getAttribute("href")).toBe(`/projects/${next.slug}`);
      expect(nextLink.textContent).toContain(next.title);
    }
  } finally {
    projects.splice(0, projects.length, ...original);
  }
});

import { expect, test } from "bun:test";
import { projects, projectPhotoUrl, getProject } from "../lib/projects";

test("R2 project photos resolve against the custom domain with encoded object keys", () => {
  expect(projectPhotoUrl({ objectKey: "images/projects/courtyard home/01.webp", alt: "Courtyard", width: 1600, height: 1000 })).toBe("https://assets.homliv.co.in/images/projects/courtyard%20home/01.webp");
});

test("catalogue slugs are unique, every gallery has multiple photos and unknown projects are absent", () => {
  expect(new Set(projects.map(({ slug }) => slug)).size).toBe(projects.length);
  for (const project of projects) {
    expect(getProject(project.slug)).toBe(project);
    expect(project.photos.length).toBeGreaterThan(1);
    expect(new Set(project.photos.map(projectPhotoUrl)).size).toBe(project.photos.length);
    for (const photo of project.photos) {
      expect(photo.alt.length).toBeGreaterThan(0);
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
    if (project.photos.some((photo) => photo.previewSrc)) expect(project.inspiration).toBe(true);
  }
  expect(getProject("not-a-project")).toBeUndefined();
});

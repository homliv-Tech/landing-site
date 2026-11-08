import type { MetadataRoute } from "next";
import { projects, projectPhotoUrl } from "@/lib/projects";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/", "/projects", "/team", "/price-calculator", "/careers"].map((path) => ({
      url: new URL(path, siteUrl).href,
    })),
    ...projects.filter((project) => !project.inspiration).map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      images: project.photos.map(projectPhotoUrl),
    })),
  ];
}

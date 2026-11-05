import { assetUrl } from "@/lib/assets";

export type ProjectPhoto = {
  alt: string;
  width: number;
  height: number;
} & ({ objectKey: string; previewSrc?: never } | { previewSrc: string; objectKey?: never });

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  /** Remove inspiration status only when the images show Homliv's own work. */
  inspiration: boolean;
  featured: boolean;
  location?: string;
  year?: string;
  photos: [ProjectPhoto, ...ProjectPhoto[]];
};

/** Temporary inspiration collections; replace these with approved Homliv projects.
 * For R2 images use { objectKey: "images/projects/<slug>/01.webp", ... }.
 * Array order controls photo order; the first photo is the cover. No bucket credentials needed.
 */
export const projects: Project[] = [
  {
    slug: "a-place-to-gather", title: "A place to gather", category: "Living spaces",
    description: "Living rooms, open spaces and places to come together. A collection of interior references for a home centred on everyday life.",
    inspiration: true, featured: true,
    photos: [
      { previewSrc: "/project-inspiration/living.jpg", alt: "Open living room with warm timber furniture and neutral seating", width: 1600, height: 1200 },
      { previewSrc: "/project-inspiration/detail.jpg", alt: "Light-filled interior with natural materials and an open layout", width: 1600, height: 1088 },
    ],
  },
  {
    slug: "light-in-every-detail", title: "Light in every detail", category: "Considered interiors",
    description: "Natural light, quiet finishes and a considered material palette. Interior references for the smaller details that shape a room.",
    inspiration: true, featured: true,
    photos: [
      { previewSrc: "/project-inspiration/interior.jpg", alt: "Bright interior with soft neutral finishes and timber accents", width: 1600, height: 1067 },
      { previewSrc: "/project-inspiration/living.jpg", alt: "Neutral living space with layered textures and timber details", width: 1600, height: 1200 },
    ],
  },
  {
    slug: "room-to-breathe", title: "Room to breathe", category: "Contemporary homes",
    description: "Open rooms and connections between living spaces. A collection of references for a home with room for daily routines.",
    inspiration: true, featured: true,
    photos: [
      { previewSrc: "/project-inspiration/home.jpg", alt: "Contemporary home interior with an open-plan kitchen and living space", width: 1600, height: 1067 },
      { previewSrc: "/project-inspiration/interior.jpg", alt: "Airy interior with daylight and a restrained palette", width: 1600, height: 1067 },
    ],
  },
];

export function projectPhotoUrl(photo: ProjectPhoto): string {
  return photo.objectKey !== undefined ? assetUrl(photo.objectKey) : photo.previewSrc;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const inspirationOnly = projects.every((project) => project.inspiration);

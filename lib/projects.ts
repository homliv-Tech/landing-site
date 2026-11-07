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

/** Homliv portfolio images served from R2. Array order controls the gallery;
 * the first image is the cover. Dimensions match the original files.
 */
export const projects: Project[] = [
  {
    slug: "mayur", title: "Mayur", category: "Residential interiors",
    description: "Warm timber finishes, green accents and decorative partitions connect the living, dining and bedroom spaces.",
    inspiration: false, featured: true,
    photos: [
      { objectKey: "images/portfolio/MAYUR/L1-2.png", alt: "Living room TV wall with timber panelling and an illuminated display niche", width: 3000, height: 2250 },
      { objectKey: "images/portfolio/MAYUR/L2-1.png", alt: "Dining area with pink chairs and a decorative gold partition", width: 3000, height: 3000 },
      { objectKey: "images/portfolio/MAYUR/G-GP2.png", alt: "Bedroom with green bedcover, timber bedside tables and framed artwork", width: 2500, height: 1625 },
      { objectKey: "images/portfolio/MAYUR/G- GP1.png", alt: "Bedroom with timber headboard, green bedding and full-height curtains", width: 2000, height: 3400 },
      { objectKey: "images/portfolio/MAYUR/KB- 1.png", alt: "Washbasin nook with botanical wallpaper and a round mirror", width: 1500, height: 2250 },
      { objectKey: "images/portfolio/MAYUR/f89f95ba-8b76-4323-9de2-f7576c5361ee-0007.png", alt: "Illuminated prayer alcove with a carved timber backdrop", width: 2479, height: 3508 },
      { objectKey: "images/portfolio/MAYUR/f89f95ba-8b76-4323-9de2-f7576c5361ee-0009.png", alt: "Sunlit seating area with timber furniture and indoor plants", width: 3508, height: 2479 },
      { objectKey: "images/portfolio/MAYUR/f89f95ba-8b76-4323-9de2-f7576c5361ee-0013.png", alt: "Decorative arched partition with coloured panels", width: 2479, height: 3508 },
      { objectKey: "images/portfolio/MAYUR/f89f95ba-8b76-4323-9de2-f7576c5361ee-0015.png", alt: "Botanical washbasin nook beside an arched timber partition", width: 2479, height: 3508 },
    ],
  },
  {
    slug: "shindes", title: "Shinde’s", category: "Residential interiors",
    description: "Arched details, patterned surfaces and window-side seating bring character to compact living and dining spaces.",
    inspiration: false, featured: true,
    photos: [
      { objectKey: "images/portfolio/SHINDE'S/Enscape_2026-01-18-03-55-24.png", alt: "Bench seating against green panelling and patterned wallpaper", width: 2000, height: 2400 },
      { objectKey: "images/portfolio/SHINDE'S/Enscape_2026-01-18-04-02-16.png", alt: "TV console framed by an arched wall detail", width: 1700, height: 1920 },
      { objectKey: "images/portfolio/SHINDE'S/Enscape_2026-01-18-03-49-06.png", alt: "Glass-fronted display cabinet beside a dining chair", width: 1700, height: 2400 },
      { objectKey: "images/portfolio/SHINDE'S/Enscape_2026-01-18-03-53-17.png", alt: "Dining nook with patterned walls and a mirrored arch", width: 1700, height: 2400 },
      { objectKey: "images/portfolio/SHINDE'S/Enscape_2026-01-18-04-09-42.png", alt: "Compact study desk beside a window with patterned floor tiles", width: 1400, height: 2000 },
      { objectKey: "images/portfolio/SHINDE'S/Enscape_2026-01-18-04-12-53.png", alt: "Window-side seating with a lounge chair and indoor plants", width: 1000, height: 1350 },
    ],
  },
  {
    slug: "shuklas", title: "Shukla’s", category: "Residential interiors",
    description: "Soft pink accents, botanical details and white wall panels run through the living spaces and bedrooms.",
    inspiration: false, featured: true,
    photos: [
      { objectKey: "images/portfolio/SHUKLA'S/LIVING 1 -2.png", alt: "Living room TV wall with a floral surround and white console", width: 2500, height: 2350 },
      { objectKey: "images/portfolio/SHUKLA'S/LIVING 2 -2.png", alt: "Grey tufted sofa against white wall panelling", width: 1000, height: 1750 },
      { objectKey: "images/portfolio/SHUKLA'S/LIVING 3 - 1.png", alt: "Living room seating with a grey sofa and a round side table", width: 1500, height: 2500 },
      { objectKey: "images/portfolio/SHUKLA'S/BEDROOM 1 - 6.png", alt: "Bedroom with pink wall panels and a timber ceiling fan", width: 1000, height: 1500 },
      { objectKey: "images/portfolio/SHUKLA'S/BEDROOM 2 - 2.png", alt: "Bedroom with a curved headboard and botanical wall artwork", width: 1000, height: 1500 },
      { objectKey: "images/portfolio/SHUKLA'S/KD - 1.png", alt: "Washbasin nook with pink arches and pendant lighting", width: 1000, height: 1500 },
      { objectKey: "images/portfolio/SHUKLA'S/WARDROBE - 1.png", alt: "Bedroom with pink wall panels and full-height storage", width: 1920, height: 2300 },
    ],
  },
  {
    slug: "wadas", title: "Wada’s", category: "Residential interiors",
    description: "Timber details, cream upholstery and decorative wall and ceiling panels shape the living spaces and bedroom.",
    inspiration: false, featured: true,
    photos: [
      { objectKey: "images/portfolio/WADA'S/L3 - 2.png", alt: "Cream sofa with cushions beside a round coffee table", width: 3000, height: 2500 },
      { objectKey: "images/portfolio/WADA'S/L1-1.png", alt: "Living room TV console with a scalloped wall border", width: 2000, height: 2500 },
      { objectKey: "images/portfolio/WADA'S/L2.png", alt: "Living room with a decorative ceiling panel and timber TV wall", width: 2400, height: 3158 },
      { objectKey: "images/portfolio/WADA'S/DOOR - 1.png", alt: "Arched timber entrance door framed by decorative wall panels", width: 2000, height: 3000 },
      { objectKey: "images/portfolio/WADA'S/PB1.png", alt: "Bedroom with a curved timber headboard and pendant lighting", width: 2500, height: 3000 },
    ],
  },
  {
    slug: "yadav", title: "Yadav", category: "Residential interiors",
    description: "Botanical artwork, pink accents and timber furniture bring distinct details to bedrooms and dressing spaces.",
    inspiration: false, featured: true,
    photos: [
      { objectKey: "images/portfolio/YADAV/MB - 3.png", alt: "Bedroom with botanical artwork and a timber bedside table", width: 1400, height: 2000 },
      { objectKey: "images/portfolio/YADAV/MB - 6.png", alt: "Bedroom dressing mirror and timber vanity", width: 1400, height: 2000 },
      { objectKey: "images/portfolio/YADAV/SB - 2.png", alt: "Bedroom with a pink arch above the headboard", width: 1400, height: 2000 },
      { objectKey: "images/portfolio/YADAV/SB - 3.png", alt: "Pink dressing desk with a round mirror and floral wallpaper", width: 1844, height: 1999 },
      { objectKey: "images/portfolio/YADAV/YR - 5.png", alt: "Window-side seating beside full-height storage and curtains", width: 1400, height: 2000 },
    ],
  },
];

export function projectPhotoUrl(photo: ProjectPhoto): string {
  return photo.objectKey !== undefined ? assetUrl(photo.objectKey) : photo.previewSrc;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** Classify the entries a section actually displays, including filtered subsets. */
export function getProjectCollectionKind(collection: readonly Project[]) {
  if (!collection.some((project) => project.inspiration)) return "projects";
  return collection.every((project) => project.inspiration) ? "inspiration" : "mixed";
}

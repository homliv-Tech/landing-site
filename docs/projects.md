# Project photography and galleries

The home page's “Spaces made for living.” section links to `/projects` and
`/projects/[slug]`. The shared catalogue is `lib/projects.ts`; categories and counts
are derived from it. Every project supports its own ordered array of photos.
The first photo is the cover. `featured: true` includes it in the homepage's first
two featured entries. Filters work without changing gallery order.

The catalogue contains five Homliv projects and 32 images hosted under
`images/portfolio/` on `assets.homliv.co.in`:

- Mayur: 9 images (`MAYUR/`)
- Shinde’s: 6 images (`SHINDE'S/`)
- Shukla’s: 7 images (`SHUKLA'S/`)
- Wada’s: 5 images (`WADA'S/`)
- Yadav: 5 images (`YADAV/`)

All five entries use the supplied project imagery rather than inspiration placeholders.
The images include interior visualisations; no completion dates or locations are assumed.
The homepage features the first two projects, and each project has its own full gallery.
Image dimensions match the original PNGs, and descriptive alt text follows their contents.

## Add or update projects

Upload photographs to the R2 bucket connected to `assets.homliv.co.in`. The public
custom domain is already allowlisted for Next Image. No R2 secrets are required
for displaying public photos; this feature does not upload files to the bucket.

Add or replace an entry in `lib/projects.ts`, for example (use approved details):

```ts
{
  slug: "your-project-slug",
  title: "Approved project title",
  category: "Residential architecture",
  description: "Approved description of the project.",
  inspiration: false,
  featured: true,
  // Optional: location, year. Omit any unconfirmed details.
  photos: [
    {
      objectKey: "images/projects/your-project-slug/01.webp",
      alt: "Describe the actual view in this photograph",
      width: 1800,
      height: 1200,
    },
    {
      objectKey: "images/projects/your-project-slug/02.webp",
      alt: "Describe the second view",
      width: 1200,
      height: 1600,
    },
  ],
}
```

Use object keys, not full URLs, and set the actual image dimensions. The URL
helper encodes spaces and other characters in each path segment. Desktop galleries use a bento grid with cropped frames; each image opens its
full version in a new tab. Mobile galleries retain the original photo proportions. Prefer
WebP/AVIF, around 1600–2400 px wide. Confirm each public asset URL returns an image,
then rebuild/redeploy so static project routes and metadata update together.

The legacy local preview files in `public/project-inspiration/` are no longer used
by the project catalogue. Project pages omit the Unsplash credit for these supplied
images. Other homepage sections still use Unsplash images and retain their credit.

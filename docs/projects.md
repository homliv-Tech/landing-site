# Project photography and galleries

The home page's “Spaces made for living.” section links to `/projects` and
`/projects/[slug]`. The shared catalogue is `lib/projects.ts`; categories and counts
are derived from it. Every project supports its own ordered array of photos.
The first photo is the cover. `featured: true` includes it in the homepage's first
two featured entries. Filters work without changing gallery order.

The initial three entries retain the site's existing design-inspiration titles.
They are **not completed Homliv projects**. Their locally stored Unsplash images
are temporary references. Project detail pages for these entries have `noindex`.
The interface labels them as design inspiration, with a single shared footer credit.
Replace every inspiration entry before presenting the catalogue as Homliv's work.

## Add real work when photos arrive

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

The local preview files are `public/project-inspiration/{living,interior,home,detail}.jpg`.
Remove them, their catalogue entries, and the Unsplash footer credit once no page
uses inspiration photography. The rest of the existing homepage also uses
Unsplash images and must be considered before removing the shared credit.

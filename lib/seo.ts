import type { Metadata } from "next";
import { assetUrl } from "@/lib/assets";

/** Set SITE_URL at build time if the production domain changes. */
export const siteUrl = new URL(process.env.SITE_URL || "https://homliv.co.in").origin;
export const siteDescription =
  "Homliv creates thoughtful architectural designs and residential interiors around the way you live. Explore our work and book a free discovery call.";

const defaultImage = {
  url: assetUrl("images/portfolio/MAYUR/L1-2.webp"),
  width: 3000,
  height: 2250,
  alt: "Homliv residential interior with timber panelling and an illuminated display niche",
};

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: typeof defaultImage;
  noIndex?: boolean;
};

/** Keep search and social metadata aligned; nested metadata replaces parent fields. */
export function pageMetadata({ title, description, path, image = defaultImage, noIndex = false }: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Homliv",
      locale: "en_IN",
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    robots: { index: !noIndex, follow: true },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Homliv",
      url: siteUrl,
      logo: `${siteUrl}/homliv-logo.png`,
      description: siteDescription,
      telephone: "+919324792392",
      sameAs: [
        "https://www.instagram.com/homliv.6/",
        "https://www.linkedin.com/company/homliv-official/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Homliv",
      url: siteUrl,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

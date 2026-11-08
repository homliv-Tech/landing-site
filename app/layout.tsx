import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";
import WhatsAppContact from "@/components/whatsapp-contact";
import { organizationSchema, siteDescription, siteUrl } from "@/lib/seo";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Homliv | Architecture & Residential Interior Design",
  description: siteDescription,
  applicationName: "Homliv",
  keywords: [
    "Homliv",
    "architectural design",
    "residential architecture",
    "interior design",
    "residential interiors",
    "home interior design",
    "modular kitchen design",
    "bedroom interior design",
    "full home interiors",
    "interior design cost calculator",
    // Additional terms from the publicly indexed homliv.in homepage content.
    "premium home services",
    "apartment interiors",
    "villa interiors",
    "modular kitchen installation",
    "full home renovation",
    "painting and flooring",
    "home furnishing",
    "electrical and plumbing services",
    "rental home setup",
    "home maintenance AMC",
    "complete home package",
    "home makeover",
    "Vastu-compliant interiors",
    "Vastu Shastra design",
    "interior cost calculator",
    "living room design",
    "dining room design",
    "puja room design",
    "bathroom interior design",
    "luxury villa interiors",
    "modern minimalist interiors",
    "contemporary home design",
    "interior design Mumbai",
    "interior design Navi Mumbai",
    "interior design Patna",
    // Architecture services and Mumbai-area search terms.
    "architect",
    "architects",
    "architecture studio",
    "architecture firm",
    "architectural consultancy",
    "architectural planning",
    "residential architect",
    "home architect",
    "house design",
    "house planning",
    "floor plan design",
    "space planning",
    "building design",
    "elevation design",
    "facade design",
    "bungalow design",
    "villa architecture",
    "apartment design",
    "home renovation design",
    "architectural visualization",
    "3D architectural design",
    "Vastu house plans",
    "architects in Mumbai",
    "architecture firm in Mumbai",
    "architectural consultants in Mumbai",
    "residential architects in Mumbai",
    "bungalow architects in Mumbai",
    "architects in Maharashtra",
    "architectural design Maharashtra",
    "architects in Navi Mumbai",
    "architects in Thane",
    "architects in Kalyan",
    "architects in Dombivli",
    "architects in Ambernath",
    "architects in Badlapur",
    "architects in Panvel",
    "architects in Vashi",
    "architects in Nerul",
    "architects in Belapur",
    "architects in Kharghar",
    "architects in Airoli",
    "architects in Andheri",
    "architects in Bandra",
    "architects in Borivali",
    "architects in Kandivali",
    "architects in Malad",
    "architects in Goregaon",
    "architects in Powai",
    "architects in Ghatkopar",
    "architects in Chembur",
    "architects in Mulund",
    "architects in Dadar",
    "architects in South Mumbai",
    "architects in Mira Road",
    "architects in Bhayandar",
    "architects in Vasai",
    "architects in Virar",
    "architects in Mumbai Metropolitan Region",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={dmSans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Analytics />
        {children}
        <WhatsAppContact />
      </body>
    </html>
  );
}

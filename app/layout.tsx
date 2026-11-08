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

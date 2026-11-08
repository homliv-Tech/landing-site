import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Homliv | Thoughtful architecture, made for living",
  description: "Considered architecture for the way you live, delivered within 60 days.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={dmSans.variable}>
      <body>
        <Analytics />
        {children}
        <a
          className="whatsapp-contact"
          href="https://wa.me/919324792392"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp at +91 93247 92392 (opens in a new tab)"
          title="Chat with us on WhatsApp"
        >
          <span className="whatsapp-contact-icon" aria-hidden="true" />
          <span className="whatsapp-contact-label" aria-hidden="true">Let’s talk</span>
        </a>
      </body>
    </html>
  );
}

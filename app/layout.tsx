import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";
import WhatsAppContact from "@/components/whatsapp-contact";

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
        <WhatsAppContact />
      </body>
    </html>
  );
}

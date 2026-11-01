import type { Metadata } from "next";
import "./globals.css";
import Analytics from "@/components/analytics";

export const metadata: Metadata = {
  title: "Homliv | Thoughtful architecture, made for living",
  description: "Considered architecture for the way you live, delivered within 60 days.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Analytics />{children}</body></html>;
}

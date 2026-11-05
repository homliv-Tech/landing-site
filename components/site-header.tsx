"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CurrentPage = "home" | "pricing" | "team" | "careers" | "projects";

type SiteHeaderProps = {
  current?: CurrentPage;
  variant?: "overlay" | "solid";
  enquiryLocation?: string;
};

const links: { id: CurrentPage | "contact"; label: string; href: string }[] = [
  { id: "home", label: "Studio", href: "/#studio" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "home", label: "Approach", href: "/#approach" },
  { id: "pricing", label: "Pricing", href: "/price-calculator" },
  { id: "team", label: "Team", href: "/team" },
  { id: "careers", label: "Careers", href: "/careers" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

/** Share desktop/mobile navigation and enquiry tracking across the site's pages. */
export default function SiteHeader({
  current,
  variant = "overlay",
  enquiryLocation = "header",
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "overlay") return;
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [variant]);

  return (
    <header className={`header ${variant === "solid" ? "header--solid" : "header--overlay"}${scrolled ? " header--scrolled" : ""}`}>
      <Link href="/" className="brand" aria-label="Homliv home">
        <img src="/homliv-logo.svg" alt="Homliv" width={210} height={210} />
      </Link>
      <nav aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={`${link.label}-${link.href}`}
            href={link.href}
            aria-current={current === link.id ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link
        className="nav-enquiry"
        data-enquiry-location={enquiryLocation}
        href="/#contact"
      >
        Project enquiry <span aria-hidden="true">↗</span>
      </Link>
      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <span></span>
          <span></span>
        </summary>
        <nav aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={`mobile-${link.label}`}
              href={link.href}
              onClick={(event) => {
                const menu = event.currentTarget.closest("details");
                if (menu) menu.open = false;
              }}
              aria-current={current === link.id ? "page" : undefined}
              data-enquiry-location={
                link.id === "contact" ? `${enquiryLocation}_mobile` : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}

import Link from "next/link";

type CurrentPage = "home" | "pricing" | "team";

type SiteHeaderProps = {
  current?: CurrentPage;
  variant?: "overlay" | "solid";
  enquiryLocation?: string;
};

const links: { id: CurrentPage | "contact"; label: string; href: string }[] = [
  { id: "home", label: "Studio", href: "/#studio" },
  { id: "home", label: "Inspiration", href: "/#inspiration" },
  { id: "home", label: "Approach", href: "/#approach" },
  { id: "pricing", label: "Pricing", href: "/price-calculator" },
  { id: "team", label: "Team", href: "/team" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export default function SiteHeader({
  current,
  variant = "overlay",
  enquiryLocation = "header",
}: SiteHeaderProps) {
  return (
    <header className={variant === "solid" ? "header header--solid" : "header"}>
      <Link href="/" className="brand" aria-label="Homliv home">
        <img src="/homliv-logo.svg" alt="Homliv" />
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

import Link from "next/link";

/** Render shared footer navigation with readable contrast on its dark surface. */
export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-main">
        <Link href="/" className="footer-wordmark">
          homliv
        </Link>
        <p>
          Thoughtful architecture.
          <br />
          Made for living.
        </p>
        <div className="footer-nav">
          <Link href="/">Home</Link>
          <Link href="/#studio">Studio</Link>
          <Link href="/#inspiration">Inspiration</Link>
          <Link href="/#approach">Approach</Link>
          <Link href="/price-calculator">Pricing</Link>
          <Link href="/team">Team</Link>
          <Link href="/#contact">Contact</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 HOMLIV. ALL RIGHTS RESERVED.</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { SocialIcon, type SocialPlatform } from "@/components/ui/svgs/social";
import styles from "./site-footer.module.css";

const socialLinks = [
  { label: "Instagram", platform: "instagram", href: "https://www.instagram.com/homliv.6?mdxt=MTBvNGg5NzM4bXAw" },
  { label: "Facebook", platform: "facebook", href: "https://www.facebook.com/share/19bhXbMsaB/" },
  { label: "Pinterest", platform: "pinterest", href: "https://pin.it/18K1ZyHEI" },
  { label: "LinkedIn", platform: "linkedin", href: "https://www.linkedin.com/company/homliv-official/" },
] satisfies { label: string; platform: SocialPlatform; href: string }[];

/** Render shared footer navigation with readable contrast on its dark surface. */
export default function SiteFooter({ photoCredit = false }: { photoCredit?: boolean }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.wordmark}>homliv</Link>
            <p className={styles.tagline}>Thoughtful architecture.<br />Made for living.</p>
            <nav className={styles.socials} aria-label="Homliv social media">
              {socialLinks.map(({ label, platform, href }) => (
                <a
                  key={platform}
                  className={styles.socialLink}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  title={label}
                >
                  <SocialIcon platform={platform} />
                </a>
              ))}
            </nav>
          </div>
          <nav className={styles.navigation} aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/#studio">Studio</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/#approach">Approach</Link>
            <Link href="/price-calculator">Pricing</Link>
            <Link href="/team">Team</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 HOMLIV. ALL RIGHTS RESERVED.</span>
          {photoCredit && <a href="https://unsplash.com/">Photography via Unsplash</a>}
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}

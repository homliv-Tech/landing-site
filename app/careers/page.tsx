import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import styles from "./careers.module.css";

export const metadata = pageMetadata({
  title: "Careers | Homliv",
  description: "Careers at Homliv, a studio creating thoughtful homes. We have no current openings. Check back here for future opportunities.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <div className={styles.page} id="top">
      {/* Service · split hero · existing Homliv ivory/forest palette and DM Sans · flat ground · hover motion only. */}
      <a href="#careers" className={styles.skipLink}>Skip to careers</a>
      <SiteHeader current="careers" variant="solid" enquiryLocation="careers_header" />
      <main id="careers">
        <section className={`${styles.hero} hero--split`} aria-labelledby="careers-heading" data-analytics-section="careers_intro">
          <div className={`${styles.wrap} wrap`}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>Careers at Homliv</p>
              <h1 id="careers-heading">Careers in<br />thoughtful design.</h1>
              <p className={`${styles.lead} hero__lead`}>We design thoughtful homes around the people who live in them.</p>
              <Link href="/team" className={styles.teamLink}>
                Meet the team
                <svg className={styles.arrow} viewBox="0 0 12 12" aria-hidden="true"><path className={styles.arrowStem} d="M1 6h9" /><path className={styles.arrowHead} d="m6 2 4 4-4 4" /></svg>
              </Link>
              <div className={styles.openings}>
                <div className={styles.statusLine}><span className={styles.statusDot} aria-hidden="true" />Hiring update</div>
                <h2>No current openings</h2>
                <p>We’re not hiring right now. Check back here for future opportunities.</p>
              </div>
            </div>
            {/* Architectural inspiration; replace with a commissioned Homliv project or studio photograph when available. */}
            <div className={styles.photo}>
              <Image
                src="/images/careers/interior.webp"
                alt="A sunlit living room with natural materials, warm wood and generous windows"
                fill
                preload
                sizes="100vw"
                data-source="Unsplash"
                data-subject="architectural interior inspiration"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter photoCredit />
    </div>
  );
}

import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import styles from "@/components/projects/projects.module.css";

// Next.js wraps this segment's page (including its params read) in Suspense.
export default function ProjectLoading() {
  return (
    <div id="top" className={styles.page}>
      <SiteHeader current="projects" variant="solid" enquiryLocation="project_header" />
      <main>
        <section className={styles.detailIntro} aria-busy="true">
          <div className={styles.wrap}>
            <Link className={styles.back} href="/projects">← All projects</Link>
            <p role="status">Loading project…</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

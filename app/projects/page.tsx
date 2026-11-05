import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProjectIndex from "@/components/projects/project-index";
import { inspirationOnly, projects, projectPhotoUrl } from "@/lib/projects";
import styles from "@/components/projects/projects.module.css";
import "@/components/projects/motion.css";

export const metadata: Metadata = {
  title: "Projects | Homliv",
  description: "Explore homes, interiors and design inspiration from Homliv. Open each collection to see every detail.",
};

export default function ProjectsPage() {
  const cover = projects[0].photos[1] ?? projects[0].photos[0];
  return (
    <div id="top" className={styles.page}>
      <SiteHeader current="projects" variant="solid" enquiryLocation="projects_header" />
      <main>
        <section className={styles.hero} aria-labelledby="projects-heading">
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div className={styles.heroText}><p className={styles.eyebrow}>Homliv / {String(projects.length).padStart(2, "0")} {inspirationOnly ? "inspiration collections" : "selected projects"}</p><h1 id="projects-heading">Homes.<br />Interiors.<br />Everyday life.</h1><p>{inspirationOnly ? "A collection of spaces and ideas that inspire our approach to architectural design." : "Our architectural projects, from the overall space to the details that make it home."}</p><a className={styles.textLink} href="#collections">{inspirationOnly ? "See the collections" : "See our projects"}<span aria-hidden="true">↓</span></a></div>
            <Link className={`${styles.heroImage} m-zoom`} href={`/projects/${projects[0].slug}`} aria-label={`View ${projects[0].title}`}><Image src={projectPhotoUrl(cover)} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 900px) 88vw, 70vw" preload /></Link>
          </div>
        </section>
        <ProjectIndex projects={projects} inspirationOnly={inspirationOnly} />
        <section className={styles.enquiry}><div className={styles.wrap}><p className={styles.eyebrow}>Your home, next</p><h2>A space of<br />your own.</h2><Link className={styles.textLink} href="/#contact" data-enquiry-location="projects_close">Start your project<span aria-hidden="true">↗</span></Link></div></section>
      </main>
      <SiteFooter photoCredit />
    </div>
  );
}

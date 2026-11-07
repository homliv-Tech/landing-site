import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProjectIndex from "@/components/projects/project-index";
import { getProjectCollectionKind, projects, projectPhotoUrl } from "@/lib/projects";
import styles from "@/components/projects/projects.module.css";

export const metadata: Metadata = {
  title: "Projects | Homliv",
  description: "Explore Homliv’s residential interior projects, from living spaces and bedrooms to the details that make a home.",
};

export default function ProjectsPage() {
  const kind = getProjectCollectionKind(projects);
  const heroProject = projects[0];
  const cover = heroProject.photos[0];
  return (
    <div id="top" className={styles.page}>
      <SiteHeader current="projects" variant="solid" enquiryLocation="projects_header" />
      <main>
        <section className={styles.hero} aria-labelledby="projects-heading">
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div className={styles.heroText}><p className={styles.eyebrow}>Homliv / {String(projects.length).padStart(2, "0")} {kind === "inspiration" ? "inspiration collections" : kind === "mixed" ? "projects and inspiration collections" : "selected projects"}</p><h1 id="projects-heading">Homes.<br />Interiors.<br />Everyday life.</h1><p>{kind === "inspiration" ? "A collection of spaces and ideas that inspire our approach to architectural design." : kind === "mixed" ? "Our architectural projects alongside design inspiration. Inspiration collections are labelled separately." : "Our architectural projects, from the overall space to the details that make it home."}</p><a className={styles.textLink} href="#collections">{kind === "inspiration" ? "See the collections" : kind === "mixed" ? "See projects and inspiration" : "See our projects"}<span aria-hidden="true">↓</span></a></div>
            <Link className={`${styles.heroImage} ${styles.zoom}`} href={`/projects/${heroProject.slug}`} aria-label={`View ${heroProject.title}${heroProject.inspiration ? " (design inspiration)" : ""}`}>
              <Image unoptimized referrerPolicy="no-referrer" src={projectPhotoUrl(cover)} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 900px) 88vw, 70vw" preload />
              {heroProject.inspiration && <span className={styles.heroImageLabel}>Design inspiration</span>}
            </Link>
          </div>
        </section>
        <ProjectIndex projects={projects} />
        <section className={styles.enquiry}><div className={styles.wrap}><p className={styles.eyebrow}>Your home, next</p><h2>A space of<br />your own.</h2><Link className={styles.textLink} href="/#contact" data-enquiry-location="projects_close">Start your project<span aria-hidden="true">↗</span></Link></div></section>
      </main>
      <SiteFooter photoCredit={projects.some((project) => project.inspiration)} />
    </div>
  );
}

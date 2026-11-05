import Link from "next/link";
import { inspirationOnly, projects } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import styles from "./projects.module.css";

export default function FeaturedProjects() {
  const featured = projects.filter((project) => project.featured).slice(0, 2);
  return (
    <section className={styles.featured} id="inspiration" data-analytics-section="featured_projects" aria-labelledby="featured-heading">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>{inspirationOnly ? "Design inspiration" : "Featured projects"}</p><h2 id="featured-heading">Spaces made<br />for living.</h2></div>
          <div className={styles.sectionAside}><p>{inspirationOnly ? "Spaces, materials and ideas informing the way we think about home." : "A closer look at the homes and interiors we design."}</p><Link className={styles.textLink} href="/projects">{inspirationOnly ? "View the collections" : "View all projects"}<span aria-hidden="true">↗</span></Link></div>
        </div>
        <div className={styles.grid}>{featured.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </div>
    </section>
  );
}

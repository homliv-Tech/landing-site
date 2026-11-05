import Link from "next/link";
import { getProjectCollectionKind, projects } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import styles from "./projects.module.css";

export default function FeaturedProjects() {
  const featured = projects.filter((project) => project.featured).slice(0, 2);
  const kind = getProjectCollectionKind(featured);
  return (
    <section className={styles.featured} id="inspiration" data-analytics-section="featured_projects" aria-labelledby="featured-heading">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div><p className={styles.eyebrow}>{kind === "inspiration" ? "Design inspiration" : kind === "mixed" ? "Projects and inspiration" : "Featured projects"}</p><h2 id="featured-heading">Spaces made<br />for living.</h2></div>
          <div className={styles.sectionAside}><p>{kind === "inspiration" ? "Spaces, materials and ideas informing the way we think about home." : kind === "mixed" ? "Our architectural work alongside spaces and ideas that inspire us." : "A closer look at the homes and interiors we design."}</p><Link className={styles.textLink} href="/projects">{kind === "inspiration" ? "View the collections" : kind === "mixed" ? "View projects and inspiration" : "View all projects"}<span aria-hidden="true">↗</span></Link></div>
        </div>
        <div className={styles.grid}>{featured.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </div>
    </section>
  );
}

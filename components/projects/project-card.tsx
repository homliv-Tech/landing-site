import Image from "next/image";
import Link from "next/link";
import { projectPhotoUrl, type Project } from "@/lib/projects";
import styles from "./projects.module.css";

export function ProjectCard({ project, index, eager = false, wide = false }: { project: Project; index: number; eager?: boolean; wide?: boolean }) {
  const cover = project.photos[0];
  return (
    <Link className={`${styles.card} ${styles.zoom}`} href={`/projects/${project.slug}`} aria-label={`View ${project.title}${project.inspiration ? " (design inspiration)" : ""}`}>
      <div className={styles.cardHeading}>
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <div><span className={styles.category}>{project.inspiration && "Design inspiration · "}{project.category}</span><h3>{project.title}</h3></div>
        <span className={styles.cardArrow} aria-hidden="true">↗</span>
      </div>
      <div className={styles.cardImage}>
        <Image unoptimized referrerPolicy="no-referrer" src={projectPhotoUrl(cover)} alt={cover.alt} width={cover.width} height={cover.height} sizes={wide ? "88vw" : "(max-width: 639px) 88vw, 44vw"} preload={eager} />
      </div>
    </Link>
  );
}

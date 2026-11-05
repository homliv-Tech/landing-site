"use client";

import { useState } from "react";
import { getProjectCollectionKind, type Project } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import styles from "./projects.module.css";

export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(projects.map((project) => project.category))];
  const visible = category === "All" ? projects : projects.filter((project) => project.category === category);
  const kind = getProjectCollectionKind(visible);
  return (
    <section className={styles.index} id="collections" aria-labelledby="collection-heading">
      <div className={styles.wrap}>
        <div className={styles.indexHeading}><h2 id="collection-heading">{kind === "inspiration" ? "The collections" : kind === "mixed" ? "Projects and inspiration" : "All projects"}</h2><span aria-live="polite">{String(visible.length).padStart(2, "0")} {kind === "inspiration" ? (visible.length === 1 ? "collection" : "collections") : kind === "mixed" ? "entries" : (visible.length === 1 ? "project" : "projects")}</span></div>
        <div className={styles.filters} role="group" aria-label="Filter by project type">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item === "All" ? "All spaces" : item}</button>)}</div>
        <div className={`${styles.grid} ${styles.bento}`}>{visible.map((project, index) => <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} wide={index % 3 === 0} />)}</div>
      </div>
    </section>
  );
}

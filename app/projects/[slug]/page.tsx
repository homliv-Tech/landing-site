import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { projects, getProject, projectPhotoUrl } from "@/lib/projects";
import styles from "@/components/projects/projects.module.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: `${project.title} | Homliv`, description: project.description, robots: project.inspiration ? { index: false, follow: true } : undefined } : {};
}
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <div id="top" className={styles.page}>
      <SiteHeader current="projects" variant="solid" enquiryLocation="project_header" />
      <main>
        <section className={styles.detailIntro}><div className={styles.wrap}>
          <Link className={styles.back} href="/projects">← All {project.inspiration ? "collections" : "projects"}</Link>
          <div className={styles.detailHeading}><div><p className={styles.eyebrow}>{project.inspiration ? "Design inspiration" : project.category}</p><h1>{project.title}</h1></div><div><p>{project.description}</p><dl className={styles.facts}><div><dt>Space</dt><dd>{project.category}</dd></div>{project.location && <div><dt>Location</dt><dd>{project.location}</dd></div>}{project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}<div><dt>Gallery</dt><dd>{String(project.photos.length).padStart(2, "0")} images</dd></div></dl></div></div>
        </div></section>
        <section className={styles.gallery} aria-label={`${project.title} photo gallery`}><div className={`${styles.wrap} ${styles.photoBento}`}>
          {project.photos.map((photo, index) => <a className={`${styles.galleryPhoto} ${styles.zoom}`} key={projectPhotoUrl(photo)} href={projectPhotoUrl(photo)} target="_blank" rel="noopener noreferrer" aria-label={`Open image ${index + 1}: ${photo.alt} (new tab)`}><Image src={projectPhotoUrl(photo)} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 639px) 88vw, 60vw" preload={index === 0} /></a>)}
        </div></section>
        <section className={styles.next}>
          <div className={styles.wrap}>
            {projects.length > 1 && <><p className={styles.eyebrow}>Next {next.inspiration ? "collection" : "project"}</p><Link href={`/projects/${next.slug}`}>{next.title}<span aria-hidden="true">↗</span></Link></>}
            <Link className={styles.textLink} href="/#contact" data-enquiry-location="project_close">Start your project<span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter photoCredit={project.inspiration} />
    </div>
  );
}

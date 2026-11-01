import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { publicR2Url } from "@/lib/r2";

export const metadata: Metadata = {
  title: "Our Team | Homliv",
  description: "Meet the people behind Homliv.",
};

// Add names and R2 object keys here as the photos become available.
const team: { role: string; name: string | null; photoKey: string | null }[] = [
  { role: "Founder", name: null, photoKey: null },
  { role: "Co-founder", name: null, photoKey: null },
  { role: "Design", name: null, photoKey: null },
  { role: "Content", name: null, photoKey: null },
  { role: "Technology", name: null, photoKey: null },
];

export default function TeamPage() {
  return (
    <main className="team-page">
      <SiteHeader current="team" variant="solid" enquiryLocation="team_header" />
      <section className="team-intro section-space" data-analytics-section="team_intro"><div className="section-top"><span>Our people</span><span>HOMLIV</span></div><h1>The people behind<br />the places we call home.</h1><p>Thoughtful spaces begin with people. Meet the team bringing ideas, creativity and care to Homliv.</p></section>
      <section className="team-list section-space" data-analytics-section="team_list" aria-labelledby="team-heading"><div className="section-top"><span id="team-heading">Meet the team</span><span>THE PEOPLE OF HOMLIV</span></div><div className="team-grid">{team.map((member) => <article className="team-card" key={member.role}><div className="team-photo">{publicR2Url(member.photoKey) ? <img src={publicR2Url(member.photoKey)!} alt={member.name ? `${member.name}, ${member.role}` : member.role} /> : <span>Photo coming soon</span>}</div><div className="team-meta"><div><h2>{member.name ?? "Name coming soon"}</h2><p>{member.role}</p></div><span aria-hidden="true">↗</span></div></article>)}</div></section>
      <section className="contact section-space" data-analytics-section="team_contact"><span className="small-label">Let’s create together</span><h2>Have a project<br />in mind?</h2><Link href="/#contact" className="round-link" data-enquiry-location="team_contact"><span>Get in touch</span><i aria-hidden="true">↗</i></Link></section>
      <SiteFooter />
    </main>
  );
}

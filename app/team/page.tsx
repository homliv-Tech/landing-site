import type { Metadata } from "next";
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
      <header className="header team-header">
        <a href="/" className="brand" aria-label="Homliv home"><img src="/homliv-logo.svg" alt="Homliv" /></a>
        <nav aria-label="Main navigation"><a href="/#studio">Studio</a><a href="/#inspiration">Inspiration</a><a href="/#approach">Approach</a><a href="/team" aria-current="page">Team</a><a href="/#contact">Contact</a></nav>
        <a className="nav-enquiry" data-enquiry-location="team_header" href="/#contact">Project enquiry <span aria-hidden="true">↗</span></a>
        <details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="/#studio">Studio</a><a href="/#inspiration">Inspiration</a><a href="/#approach">Approach</a><a href="/team" aria-current="page">Team</a><a href="/#contact">Contact</a></nav></details>
      </header>
      <section className="team-intro section-space" data-analytics-section="team_intro"><div className="section-top"><span>Our people</span><span>HOMLIV</span></div><h1>The people behind<br />the places we call home.</h1><p>Thoughtful spaces begin with people. Meet the team bringing ideas, creativity and care to Homliv.</p></section>
      <section className="team-list section-space" data-analytics-section="team_list" aria-labelledby="team-heading"><div className="section-top"><span id="team-heading">Meet the team</span><span>THE PEOPLE OF HOMLIV</span></div><div className="team-grid">{team.map((member) => <article className="team-card" key={member.role}><div className="team-photo">{publicR2Url(member.photoKey) ? <img src={publicR2Url(member.photoKey)!} alt={member.name ? `${member.name}, ${member.role}` : member.role} /> : <span>Photo coming soon</span>}</div><div className="team-meta"><div><h2>{member.name ?? "Name coming soon"}</h2><p>{member.role}</p></div><span aria-hidden="true">↗</span></div></article>)}</div></section>
      <section className="contact section-space" data-analytics-section="team_contact"><span className="small-label">Let’s create together</span><h2>Have a project<br />in mind?</h2><a href="/#contact" className="round-link" data-enquiry-location="team_contact"><span>Get in touch</span><i aria-hidden="true">↗</i></a></section>
      <footer><div className="footer-main"><a href="/" className="footer-wordmark">homliv</a><p>Thoughtful architecture.<br />Made for living.</p><div className="footer-nav"><a href="/">Home</a><a href="/#studio">Studio</a><a href="/#inspiration">Inspiration</a><a href="/#approach">Approach</a><a href="/team">Team</a><a href="/#contact">Contact</a></div></div><div className="footer-bottom"><span>© 2026 HOMLIV. ALL RIGHTS RESERVED.</span><a href="#top">BACK TO TOP ↑</a></div></footer>
    </main>
  );
}

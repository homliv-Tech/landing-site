import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { assetUrl } from "@/lib/assets";

export const metadata = pageMetadata({
  title: "Our Team | Homliv",
  description: "Meet Homliv’s founders and design team, the people bringing ideas, creativity and care to thoughtful homes and residential interiors.",
  path: "/team",
});

const team = [
  { role:"Founder", name: "Vinayak", photo: assetUrl("images/team/homliv-vinayak.png"), crop: "vinayak" },
  { role:"Founder", name: "Aman", photo: assetUrl("images/team/homliv-aman.png"), crop: "aman" },
  { role:"Designer", name: "Budhabushan", photo: assetUrl("images/team/homliv-budhabushan.png"), crop: "budhabushan" },
];

export default function TeamPage() {
  return (
    <main className="team-page">
      <SiteHeader current="team" variant="solid" enquiryLocation="team_header" />
      <section className="team-intro section-space" data-analytics-section="team_intro"><div className="section-top"><span>Our people</span><span>HOMLIV</span></div><h1>The people behind<br />the places we call home.</h1><p>Thoughtful spaces begin with people. Meet the team bringing ideas, creativity and care to Homliv.</p></section>
      <section className="team-list section-space" data-analytics-section="team_list" aria-labelledby="team-heading"><div className="section-top"><span id="team-heading">Meet the team</span><span>THE PEOPLE OF HOMLIV</span></div><div className="team-grid">{team.map((member) => <article className="team-card" key={member.name}><div className="team-photo"><Image className={`team-photo-${member.crop}`} src={member.photo} alt={member.name} fill sizes="(max-width: 700px) 50vw, 33vw" /></div><div className="team-meta"><div><h2>{member.name}</h2><p>{member.role}</p></div><span aria-hidden="true">↗</span></div></article>)}</div></section>
      <section className="contact section-space" data-analytics-section="team_contact"><span className="small-label">Let’s create together</span><h2>Have a project<br />in mind?</h2><Link href="/#contact" className="round-link" data-enquiry-location="team_contact"><span>Get in touch</span><i aria-hidden="true">↗</i></Link></section>
      <SiteFooter />
    </main>
  );
}

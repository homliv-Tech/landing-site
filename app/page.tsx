import { pageMetadata, siteDescription } from "@/lib/seo";
import FeaturedProjects from "@/components/projects/featured-projects";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import TextPreloader from "@/components/prsui/text-preloader";
import ConsultationForm from "@/components/consultation-form";
import { ProjectJourney } from "@/components/project-journey/project-journey";
import VerticalCutReveal from "@/components/fancy/text/vertical-cut-reveal";

export const metadata = pageMetadata({
  title: "Homliv | Architecture & Residential Interior Design",
  description: siteDescription,
  path: "/",
});

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <TextPreloader storageKey="homliv-intro" greetings={[{text:"Welcome"},{text:"To a better way"},{text:"To feel at home"},{text:"Homliv, Make Your Home Livly "}]} greetingHold={850} revealDuration={1500} introClassName="preloader-intro" greetingClassName="preloader-text">
      <main id="home">
        <SiteHeader current="home" enquiryLocation="header" />

        <section className="hero" data-analytics-section="hero">
          <div className="hero-overlay" />
          <div className="hero-content"><p className="eyebrow">HOMLIV / ARCHITECTURAL DESIGN</p><h1><VerticalCutReveal lines={["Thoughtful homes,", "beautifully lived in."]} /></h1><p className="hero-sub">Architectural design delivered within 60 days.</p></div>
          <a href="#studio" className="hero-scroll">SCROLL TO EXPLORE <span>↓</span></a>
          <span className="hero-side">DESIGNED FOR THE WAY YOU LIVE</span>
        </section>

        <section className="studio section-space" id="studio" data-analytics-section="studio">
          <div className="section-top"><span>Our Studio</span><span>HOMLIV</span></div>
          <h2>Every considered home begins with a considered approach to design.</h2>
          <div className="studio-grid"><div className="studio-image image-one" role="img" aria-label="Sunlit contemporary home interior" /><div className="studio-copy"><p className="lead">A home is more than a place. It’s the backdrop to the moments, routines and people that make life yours.</p><div className="studio-image image-two" role="img" aria-label="Warm contemporary home with natural materials" /><p>At Homliv, we create thoughtful architectural designs around the way you live. From your first ideas to a considered design, we keep the journey personal, clear and moving forward.</p><p>And because your plans deserve momentum, we deliver our architectural work within 60 days.</p><a href="#approach" className="round-link"><span>Discover our approach</span><i><Arrow /></i></a></div></div>
        </section>

        <FeaturedProjects />

        <section className="approach" id="approach" data-analytics-section="approach"><div className="approach-image" role="img" aria-label="Bright, open-plan home interior" /><div className="approach-copy"><span className="small-label">Our Approach</span><h2>Thoughtful design.<br />A clearer path forward.</h2><p>Good design begins with listening. We take the time to understand your vision and turn it into a home that feels right for you.</p><p>With architectural work delivered within 60 days, you can move toward what comes next with confidence.</p><a href="#contact" className="round-link" data-enquiry-location="approach"><span>Start your project</span><i><Arrow /></i></a></div></section>

        <ProjectJourney />

        <section className="contact section-space" id="contact" data-analytics-section="contact">
          <div className="contact-layout">
            <div className="contact-intro">
              <span className="small-label">Your next chapter</span>
              <h2>Let’s create a home that feels like yours.</h2>
              <p>Share a few details about your space and priorities. Our design team will call you to understand the project and guide you through the next steps.</p>
              <div className="contact-assurance" aria-label="Consultation details">
                <span><strong>01</strong> Free discovery call</span>
                <span><strong>02</strong> No obligation</span>
                <span><strong>03</strong> Clear next steps</span>
              </div>
            </div>
            <ConsultationForm />
          </div>
        </section>
        <SiteFooter photoCredit />
      </main>
    </TextPreloader>
  );
}

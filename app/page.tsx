import TextPreloader from "@/components/prsui/text-preloader";

const Arrow = () => <span aria-hidden="true">↗</span>;
const inspirations = [
  { title: "A place to gather", type: "Living spaces", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85" },
  { title: "Light in every detail", type: "Considered interiors", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85" },
  { title: "Room to breathe", type: "Contemporary homes", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85" },
];

export default function Home() {
  return (
    <TextPreloader storageKey="homliv-intro" greetings={[{text:"Welcome"},{text:"To a better way"},{text:"To feel at home"},{text:"homliv"}]} greetingHold={550} revealDuration={1100} introClassName="preloader-intro" greetingClassName="preloader-text">
      <main id="home">
        <header className="header">
          <a href="#home" className="brand" aria-label="Homliv home"><img src="/homliv-logo.svg" alt="Homliv" /></a>
          <nav aria-label="Main navigation"><a href="#studio">Studio</a><a href="#inspiration">Inspiration</a><a href="#approach">Approach</a><a href="/team">Team</a><a href="#contact">Contact</a></nav>
          <a className="nav-enquiry" data-enquiry-location="header" href="#contact">Project enquiry <Arrow /></a>
          <details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="#studio">Studio</a><a href="#inspiration">Inspiration</a><a href="#approach">Approach</a><a href="/team">Team</a><a href="#contact" data-enquiry-location="mobile_menu">Contact</a></nav></details>
        </header>

        <section className="hero" data-analytics-section="hero">
          <div className="hero-overlay" />
          <div className="hero-content"><p className="eyebrow">HOMLIV / ARCHITECTURAL DESIGN</p><h1>Thoughtful homes,<br />beautifully lived in.</h1><p className="hero-sub">Architectural design delivered within 60 days.</p></div>
          <a href="#studio" className="hero-scroll">SCROLL TO EXPLORE <span>↓</span></a>
          <span className="hero-side">DESIGNED FOR THE WAY YOU LIVE</span>
        </section>

        <section className="studio section-space" id="studio" data-analytics-section="studio">
          <div className="section-top"><span>Our Studio</span><span>HOMLIV</span></div>
          <h2>Every considered home begins with a considered approach to design.</h2>
          <div className="studio-grid"><div className="studio-image image-one" role="img" aria-label="Sunlit contemporary home interior" /><div className="studio-copy"><p className="lead">A home is more than a place. It’s the backdrop to the moments, routines and people that make life yours.</p><div className="studio-image image-two" role="img" aria-label="Warm contemporary home with natural materials" /><p>At Homliv, we create thoughtful architectural designs around the way you live. From your first ideas to a considered design, we keep the journey personal, clear and moving forward.</p><p>And because your plans deserve momentum, we deliver our architectural work within 60 days.</p><a href="#approach" className="round-link"><span>Discover our approach</span><i><Arrow /></i></a></div></div>
        </section>

        <section className="works section-space" id="inspiration" data-analytics-section="inspiration"><div className="section-top"><span>Design Inspiration</span><span>01 — 03</span></div><div className="works-heading"><h2>Spaces made<br />for living.</h2><p>A glimpse at the spaces, textures and ideas that inspire us.</p></div><div className="work-grid">{inspirations.map((item,index)=><article className="work-card" key={item.title}><div className="work-image" style={{backgroundImage:`url("${item.image}")`}} /><div className="work-meta"><span>0{index+1}</span><div><h3>{item.title}</h3><p>{item.type}</p></div><span>↗</span></div></article>)}</div><p className="image-note">Imagery shown for inspiration.</p></section>

        <section className="approach" id="approach" data-analytics-section="approach"><div className="approach-image" role="img" aria-label="Bright, open-plan home interior" /><div className="approach-copy"><span className="small-label">Our Approach</span><h2>Thoughtful design.<br />A clearer path forward.</h2><p>Good design begins with listening. We take the time to understand your vision and turn it into a home that feels right for you.</p><p>With architectural work delivered within 60 days, you can move toward what comes next with confidence.</p><a href="#contact" className="round-link" data-enquiry-location="approach"><span>Start your project</span><i><Arrow /></i></a></div></section>

        <section className="contact section-space" id="contact" data-analytics-section="contact"><span className="small-label">Your next chapter</span><h2>Tell us about<br />your project.</h2><p>Have an idea for a place to call home? We’d love to hear about it.</p><p className="contact-note">Contact details coming soon.</p></section>
        <footer><div className="footer-main"><a href="#home" className="footer-wordmark">homliv</a><p>Thoughtful architecture.<br />Made for living.</p><div className="footer-nav"><a href="#home">Home</a><a href="#studio">Studio</a><a href="#inspiration">Inspiration</a><a href="#approach">Approach</a><a href="/team">Team</a><a href="#contact">Contact</a></div></div><div className="footer-bottom"><span>© 2026 HOMLIV. ALL RIGHTS RESERVED.</span><a href="#home">BACK TO TOP ↑</a></div></footer>
      </main>
    </TextPreloader>
  );
}

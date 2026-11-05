import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JourneyExplorer } from "./journey-explorer";
import { journeyStages } from "./journey-stages";
import styles from "./project-journey.module.css";

export function ProjectJourney() {
  return (
    <section
      id="journey"
      className={styles.section}
      aria-labelledby="journey-heading"
      data-analytics-section="project_journey"
    >
      <div className={styles.inner}>
        <div className={styles.sectionTop}>
          <span>The Homliv way</span>
          <span>From first idea to finished home</span>
        </div>

        <div className={styles.introduction}>
          <div>
            <p className={styles.eyebrow}>The Homliv 60-day promise</p>
            <h2 id="journey-heading" className={styles.heading}>
              Your dream home.<br />Delivered in <strong>60 days.</strong>
            </h2>
          </div>
          <p className={styles.introDescription}>
            A clear path from your first ideas to a home made for you.
            Follow the steps that turn a design into your everyday life.
          </p>
        </div>

        <JourneyExplorer stages={journeyStages} />

        <div className={styles.sectionBottom}>
          <p>Thoughtfully designed. Carefully brought to life.</p>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<a href="#contact" data-enquiry-location="project_journey" />}
            className={styles.contactLink}
          >
            Let’s talk about your home <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

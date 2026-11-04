import { Clock3, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PopoverClose, PopoverDescription, PopoverTitle } from "@/components/ui/popover";
import type { JourneyStage } from "./journey-stages";
import styles from "./project-journey.module.css";

type JourneyDetailProps = {
  stage: JourneyStage;
  index: number;
  total: number;
};

export function JourneyDetail({ stage, index, total }: JourneyDetailProps) {
  return (
    <>
      <div className={styles.detailHeader}>
        <Badge variant="outline" className={styles.detailLabel}>
          Step {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </Badge>
        <PopoverClose
          aria-label="Close step details"
          render={<Button variant="ghost" size="icon" className={styles.closeButton} />}
        >
          <X aria-hidden="true" />
        </PopoverClose>
      </div>
      <PopoverTitle render={<h3 />} className={styles.detailTitle}>{stage.title}</PopoverTitle>
      <PopoverDescription className={styles.detailDescription}>{stage.description}</PopoverDescription>
      <ul className={styles.highlights} aria-label="What this step includes">
        {stage.highlights.map((highlight) => (
          <li key={highlight}><Badge variant="outline" className={styles.highlight}>{highlight}</Badge></li>
        ))}
      </ul>
      <p className={styles.detailFooter}><Clock3 aria-hidden="true" /> Part of our 60-day journey</p>
    </>
  );
}

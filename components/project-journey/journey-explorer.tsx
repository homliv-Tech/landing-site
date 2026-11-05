"use client";

import {
  ClipboardList,
  Hammer,
  KeyRound,
  MessageSquareText,
  MousePointer2,
  PenTool,
  Plus,
  SwatchBook,
} from "lucide-react";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, createPopoverHandle } from "@/components/ui/popover";
import { getFlowPosition } from "./flow-layout";
import { JourneyDetail } from "./journey-detail";
import type { JourneyIcon, JourneyStage } from "./journey-stages";
import styles from "./project-journey.module.css";

const stageIcons = {
  conversation: MessageSquareText,
  design: PenTool,
  materials: SwatchBook,
  planning: ClipboardList,
  build: Hammer,
  home: KeyRound,
} satisfies Record<JourneyIcon, typeof MessageSquareText>;

type JourneySelection = {
  stage: JourneyStage;
  index: number;
  total: number;
};

/**
 * Render ordered process steps with a shared hover, keyboard and touch preview.
 * Tab previews retain focus on their step; touch activation focuses the details.
 */
export function JourneyExplorer({ stages }: { stages: JourneyStage[] }) {
  const journeyId = useId();
  const [previewHandle] = useState(() => createPopoverHandle<JourneySelection>());
  const pointerFocusTarget = useRef<HTMLElement | null>(null);
  const keyboardPreviewTarget = useRef<HTMLElement | null>(null);
  const restoredFocusTarget = useRef<HTMLElement | null>(null);
  // The shared popover tracks payload identity while switching between triggers.
  const selections = useMemo(
    () => stages.map((stage, index) => ({ stage, index, total: stages.length })),
    [stages],
  );

  if (!stages.length) return null;

  return (
    <div className={styles.explorer}>
      <div className={styles.explorerHeader}>
        <span className={styles.boardLabel}>The path to your new home</span>
        <span className={styles.exploreHint}>
          <MousePointer2 aria-hidden="true" /> Hover or tap a step to explore
        </span>
      </div>

      <Popover<JourneySelection>
        handle={previewHandle}
        onOpenChange={(open, details) => {
          // An older hover timer must not replace a newer keyboard selection.
          const keyboardTarget = keyboardPreviewTarget.current;
          if (open && details.reason === "trigger-hover" && keyboardTarget &&
            document.activeElement === keyboardTarget && details.trigger !== keyboardTarget) {
            details.cancel();
          }
        }}
      >
        {({ payload }) => (
          <>
            <ol className={styles.flowChart} aria-label="Homliv’s 60-day project process">
              {selections.map((selection) => {
                const { stage, index } = selection;
                const wide = getFlowPosition(index, 3);
                const compact = getFlowPosition(index, 2);
                const Icon = stageIcons[stage.icon];
                const final = index === stages.length - 1;

                return (
                  <li
                    key={stage.id}
                    className={styles.flowStep}
                    data-wide-direction={wide.direction}
                    data-compact-direction={compact.direction}
                    data-final={final || undefined}
                    style={{
                      "--flow-row-wide": wide.row,
                      "--flow-column-wide": wide.column,
                      "--flow-row-compact": compact.row,
                      "--flow-column-compact": compact.column,
                    } as CSSProperties}
                  >
                    <PopoverTrigger
                      id={`${journeyId}-${stage.id}`}
                      handle={previewHandle}
                      payload={selection}
                      openOnHover
                      delay={200}
                      closeDelay={150}
                      onPointerEnter={() => { keyboardPreviewTarget.current = null; }}
                      onPointerMove={() => { keyboardPreviewTarget.current = null; }}
                      onPointerDown={(event) => {
                        keyboardPreviewTarget.current = null;
                        pointerFocusTarget.current = event.currentTarget;
                      }}
                      onMouseDown={(event) => {
                        keyboardPreviewTarget.current = null;
                        pointerFocusTarget.current = event.currentTarget;
                      }}
                      onBlur={(event) => {
                        if (pointerFocusTarget.current === event.currentTarget) pointerFocusTarget.current = null;
                      }}
                      onFocus={(event) => {
                        // Dismissal returns focus without reopening the preview.
                        if (restoredFocusTarget.current === event.currentTarget) {
                          restoredFocusTarget.current = null;
                          return;
                        }
                        // Pointer activation is handled by the popover's native press behavior.
                        if (pointerFocusTarget.current === event.currentTarget) {
                          pointerFocusTarget.current = null;
                          return;
                        }
                        const returningFromDetails = event.relatedTarget instanceof Element &&
                          event.relatedTarget.closest('[data-slot="popover-content"]');
                        if (!returningFromDetails && event.currentTarget.matches(":focus-visible")) {
                          keyboardPreviewTarget.current = event.currentTarget;
                          previewHandle.open(event.currentTarget.id);
                        }
                      }}
                      aria-label={`Step ${index + 1}: ${stage.title}`}
                      render={<Button variant="ghost" className={styles.flowButton} />}
                    >
                      <span className={styles.nodeTop} aria-hidden="true">
                        <span className={styles.nodeNumber}>{String(index + 1).padStart(2, "0")}</span>
                        <span className={styles.nodeAction}>View details <Plus /></span>
                      </span>
                      <span className={styles.nodeBody}>
                        <span className={styles.nodeIcon} aria-hidden="true"><Icon /></span>
                        <span className={styles.nodeCopy}>
                          <span className={styles.nodeTitle}>{stage.title}</span>
                          <span className={styles.nodeSummary}>{stage.summary}</span>
                        </span>
                      </span>
                    </PopoverTrigger>
                    {!final && <span className={styles.flowConnector} aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>

            <PopoverContent
              className={styles.stepPopover}
              initialFocus={(interactionType) => interactionType === "touch"}
              finalFocus={() => {
                const trigger = payload ? document.getElementById(`${journeyId}-${payload.stage.id}`) : null;
                if (trigger && document.activeElement !== trigger) restoredFocusTarget.current = trigger;
                return trigger ?? true;
              }}
            >
              {payload && <JourneyDetail {...payload} />}
            </PopoverContent>
          </>
        )}
      </Popover>

      <div className={styles.boardFooter}>
        <span className={styles.footerLine} aria-hidden="true" />
        <span className={styles.completionLabel}><KeyRound aria-hidden="true" /> A complete home. In 60 days.</span>
        <span className={styles.footerLine} aria-hidden="true" />
      </div>
    </div>
  );
}

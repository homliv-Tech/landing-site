# Project journey

The homepage displays this section after the existing approach section. Its
60-day message covers the whole journey; it does not assign deadlines to
individual stages.

- Edit `journey-stages.ts` to add, remove, reorder or rewrite stages. Give each
  stage a unique `id`, a `title`, a short `summary`, a `description`, a list of
  `highlights` and an `icon` from the `JourneyIcon` type. The numbers, arrows
  and layout update automatically.
- `project-journey.tsx` contains the section introduction and contact link.
- `journey-explorer.tsx` renders one ordered list of shadcn buttons. One shared
  shadcn popover previews each step after 200 ms of mouse hover. It remains
  open while the pointer is over the step or its details, with a 150 ms close
  delay for moving between them. Tab focus also previews a step; Enter, Space
  and touch taps continue to work. Escape, the close button or a click outside
  dismisses the preview. Hover previews do not move focus. Tab previews keep
  focus on the step; touch taps move focus into the details.
- `flow-layout.ts` positions the connected steps in alternating rows: three
  columns on desktop, two on tablets and one vertical flow on phones. DOM
  order stays in process order for keyboard and screen-reader users.
- `journey-detail.tsx` renders the popover's content, and
  `project-journey.module.css` contains the section's responsive styles.

Run `bun test tests/project-journey.test.js` to check the flowchart
interactions after changing the journey.

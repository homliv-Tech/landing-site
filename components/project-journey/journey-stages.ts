export type JourneyIcon = "conversation" | "design" | "materials" | "planning" | "build" | "home";

export type JourneyStage = {
  id: string;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  icon: JourneyIcon;
};

// Keep the procedure in order here. The flowchart, arrows and details follow it.
export const journeyStages: JourneyStage[] = [
  {
    id: "discovery",
    title: "Meet your designer",
    summary: "Your ideas. Our starting point.",
    description:
      "We get to know your home, your budget and the way you live. Together, we turn your ideas into a clear brief for your interiors.",
    highlights: ["Your vision", "Your space", "Your budget"],
    icon: "conversation",
  },
  {
    id: "design",
    title: "Design your space",
    summary: "A home shaped around you.",
    description:
      "We explore layouts and design ideas that bring your brief to life. Your feedback helps shape a space that feels right for you.",
    highlights: ["Space planning", "Design ideas", "Your feedback"],
    icon: "design",
  },
  {
    id: "selection",
    title: "Choose the details",
    summary: "Materials that make it yours.",
    description:
      "Choose the materials, colours and finishes that give your home its character. We bring those choices together into a considered design.",
    highlights: ["Materials", "Colours", "Finishes"],
    icon: "materials",
  },
  {
    id: "preparation",
    title: "Plan the project",
    summary: "Every detail, ready to go.",
    description:
      "With the design and selections in place, we coordinate the work and prepare the next steps to bring your interiors to life.",
    highlights: ["Project planning", "Coordination", "Preparation"],
    icon: "planning",
  },
  {
    id: "execution",
    title: "Bring it to life",
    summary: "From drawings to real spaces.",
    description:
      "Your home begins to take shape as the work comes together on site. Installation and finishing details turn the design into a space you can live in.",
    highlights: ["On-site work", "Installation", "Finishing"],
    icon: "build",
  },
  {
    id: "handover",
    title: "Welcome home",
    summary: "Your home, ready to live in.",
    description:
      "We bring the finishing touches together and walk you through your completed space. The final step in Homliv’s 60-day journey: making yourself at home.",
    highlights: ["Finishing touches", "Final walkthrough", "Handover"],
    icon: "home",
  },
];

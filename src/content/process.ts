import type { IconName } from "@/content/services";

/** The engagement process, shown on Home and reused by Why Me and Services. */

export type ProcessStep = {
  step: number;
  title: string;
  text: string;
  icon: IconName;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery & scope",
    text: "We dig into the idea, your users and the business model, then agree the MVP scope, must-have features and how we'll measure success.",
    icon: "Search",
  },
  {
    step: 2,
    title: "UX & prototype",
    text: "User flows, wireframes and a clickable prototype you can put in front of people before a single line of code is written.",
    icon: "PenTool",
  },
  {
    step: 3,
    title: "Build in sprints",
    text: "One- to two-week sprints, each ending with a demo build. Frontend, backend and integrations move forward together.",
    icon: "Code",
  },
  {
    step: 4,
    title: "Test & harden",
    text: "Manual and automated tests, security checks and performance tuning across the devices your users actually have.",
    icon: "ShieldCheck",
  },
  {
    step: 5,
    title: "Launch & measure",
    text: "Release to the cloud or the app stores, with analytics and error tracking switched on from the first day.",
    icon: "Rocket",
  },
  {
    step: 6,
    title: "Support & scale",
    text: "Iterations, new features, performance work and infrastructure scaling as your user base grows.",
    icon: "TrendingUp",
  },
];

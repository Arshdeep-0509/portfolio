/**
 * How a project runs: six steps, shown on Home (StickyScrollStory) and linked from /approach.
 *
 * `duration` is a typical range. Ranges in [BRACKETS] are placeholders the owner must confirm
 * before launch; the others restate figures used elsewhere on the site (scope "within a few
 * days", one- to two-week sprints, ongoing support on a retainer).
 */

export type ProcessStep = {
  id: string;
  title: string;
  /** What happens in the step. */
  text: string;
  /** The single result you can expect when it ends. */
  outcome: string;
  /** Two or three things you receive at this step. */
  receive: string[];
  duration: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "step-discovery",
    title: "Discovery and scope",
    text: "We talk through the idea, the people it serves and how it will make money, then settle what the first release must include and how we'll judge it.",
    outcome: "Everyone agrees on what version one is — and what it isn't.",
    receive: ["Written scope", "Success measures", "Milestone plan"],
    duration: "Within a few days",
  },
  {
    id: "step-prototype",
    title: "Flows and prototype",
    text: "User journeys, wireframes and a clickable prototype you can show to real people before any code exists.",
    outcome: "You've watched people try it before a line of code is written.",
    receive: ["User flows", "Wireframes", "Clickable prototype"],
    duration: "[1–2 weeks]",
  },
  {
    id: "step-build",
    title: "Building in sprints",
    text: "Short sprints, each finishing with a demo build. Screens, server and integrations move forward together.",
    outcome: "A working build lands in your hands every week or two.",
    receive: ["Demo build", "Written update", "Shared board"],
    duration: "1–2 weeks per sprint",
  },
  {
    id: "step-test",
    title: "Testing and hardening",
    text: "Hands-on and automated tests, security checks and speed tuning on the phones and laptops your users really own.",
    outcome: "Problems are found by me, not by your first customers.",
    receive: ["Test results", "Security checks", "Speed report"],
    duration: "[3–5 days]",
  },
  {
    id: "step-launch",
    title: "Launch and measurement",
    text: "The product goes live on the web or in the stores, recording usage and errors from the very first visitor.",
    outcome: "Real people are using it, and you can see what they do.",
    receive: ["Live release", "Analytics", "Error tracking"],
    duration: "[2–3 days]",
  },
  {
    id: "step-grow",
    title: "Support and growth",
    text: "Iterations, new features, speed work and more infrastructure as your user base grows.",
    outcome: "The product keeps improving after launch day.",
    receive: ["Bug-fix window", "Roadmap", "Monthly or hourly help"],
    duration: "Ongoing",
  },
];

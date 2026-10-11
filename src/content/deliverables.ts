/** What every client receives, regardless of service. Reused on Services and Why Me. */

export type Deliverable = {
  title: string;
  /** Short pill next to the title, e.g. "IP". */
  tag: string;
  text: string;
  /** Two short check bullets. */
  points: string[];
};

export const deliverables: Deliverable[] = [
  {
    title: "Working product",
    tag: "Product",
    text: "A live product your users can sign up to and use — not a demo.",
    points: ["Production-ready build", "Key flows tested end to end"],
  },
  {
    title: "Code & IP ownership",
    tag: "IP",
    text: "Everything I write for your project belongs to you.",
    points: ["Private repository transferred to you", "NDA and IP assignment signed upfront"],
  },
  {
    title: "Design files",
    tag: "Design",
    text: "The source design files, so any designer can pick up where I left off.",
    points: ["Figma files and components", "Colour, type and UI kit"],
  },
  {
    title: "Technical documentation",
    tag: "Docs",
    text: "Enough written down that a new developer can be productive in a day.",
    points: ["Architecture and folder guide", "Setup and environment notes"],
  },
  {
    title: "Deployment & CI/CD",
    tag: "Deploy",
    text: "Your product runs on infrastructure you control, with releases automated.",
    points: ["Hosting, domain and SSL configured", "One-click redeploy pipeline"],
  },
  {
    title: "Growth & support plan",
    tag: "Support",
    text: "A clear view of what comes after launch, and help while you get there.",
    points: ["Roadmap for the next release", "Bug-fix window after launch"],
  },
];

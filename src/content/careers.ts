import type { IconName } from "@/content/services";
import type { SectionCopy } from "@/content/home";

/**
 * Careers & collaborations (/careers). Only list roles that genuinely exist and perks that are
 * genuinely offered — never invent team size, salaries, benefits or culture claims.
 *
 * To open a role: set `isOpen: true` and `datePosted`. Open roles appear as cards, become options
 * in the application form and are published as JobPosting structured data. Closed roles appear
 * nowhere on the page.
 */

export type RoleType = "Freelance" | "Contract" | "Internship" | "Full-time";

export type Role = {
  /** Stable id: used in the form (?role=…) and in stored applications. */
  id: string;
  title: string;
  /** One or more engagement types, e.g. ["Internship", "Freelance"]. */
  type: RoleType[];
  location: string;
  experience: string;
  skills: string[];
  summary: string;
  responsibilities: string[];
  requirements: string[];
  /** External application link (e.g. a job board). Default: the form on this page. */
  applyUrl?: string;
  isOpen: boolean;
  /** YYYY-MM-DD. Required for the role's JobPosting structured data once it is open. */
  datePosted?: string;
  /** YYYY-MM-DD. Optional closing date for structured data. */
  validThrough?: string;
};

export const roles: Role[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer (React / Next.js)",
    type: ["Freelance", "Contract"],
    location: "Remote, India",
    experience: "1–3 years",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Accessibility"],
    summary:
      "Build fast, accessible interfaces for client MVPs and marketing sites, from Figma designs to production.",
    responsibilities: [
      "Turn Figma designs into responsive, accessible React and Next.js components",
      "Wire interfaces to APIs, forms and authentication",
      "Keep pages fast: images, bundle size and Core Web Vitals",
      "Open small, well-described pull requests and respond to review",
    ],
    requirements: [
      "Solid React and TypeScript, with work you can show",
      "Comfort with Tailwind CSS or another utility-first approach",
      "A habit of testing on real phones and with a keyboard",
      "Clear written communication in English",
    ],
    isOpen: false,
  },
  {
    id: "backend-developer",
    title: "Backend Developer (Node.js / Python)",
    type: ["Freelance", "Contract"],
    location: "Remote, India",
    experience: "1–3 years",
    skills: ["Node.js", "Python", "PostgreSQL", "REST APIs", "Docker"],
    summary: "Design and build the APIs, data models and integrations behind client products.",
    responsibilities: [
      "Design database schemas and REST or GraphQL APIs",
      "Implement authentication, roles and payment or messaging integrations",
      "Write tests for the parts that matter and keep migrations safe",
      "Document endpoints so frontend and mobile work can move in parallel",
    ],
    requirements: [
      "Production experience with Node.js (Express or NestJS) or Python (FastAPI or Django)",
      "Good SQL and data-modelling instincts",
      "Understanding of security basics: input validation, secrets, permissions",
      "Comfort working from a written spec and asking questions early",
    ],
    isOpen: false,
  },
  {
    id: "full-stack-developer",
    title: "Full-Stack Developer",
    type: ["Contract", "Full-time"],
    location: "Remote, India",
    experience: "2–4 years",
    skills: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    summary:
      "Own features end to end — schema, API, interface and deployment — on MVPs and web apps.",
    responsibilities: [
      "Ship complete features across database, API and interface",
      "Estimate work honestly and flag risks before they become delays",
      "Set up previews, CI checks and production deployments",
      "Pair with founders to turn rough ideas into small, shippable slices",
    ],
    requirements: [
      "Shipped at least one full-stack product that real people use",
      "Strong TypeScript across frontend and backend",
      "Working knowledge of Git workflows, CI and a major cloud provider",
      "Ownership mindset: you notice problems and fix or raise them",
    ],
    isOpen: false,
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    type: ["Internship", "Freelance"],
    location: "Remote, India",
    experience: "Student to 2 years",
    skills: ["Figma", "User flows", "Wireframing", "Design systems", "Prototyping"],
    summary:
      "Shape user flows, wireframes and polished screens for web and mobile products. Open to interns and freelancers.",
    responsibilities: [
      "Map user flows and wireframe key screens with the founder",
      "Design clean, consistent UI in Figma using a shared component library",
      "Build clickable prototypes for user testing and investor demos",
      "Hand off designs developers can build without guessing",
    ],
    requirements: [
      "A portfolio showing your process, not only final screens",
      "Confident with Figma auto layout, components and variants",
      "Basic understanding of accessibility (contrast, touch targets, states)",
      "Openness to feedback and quick iteration",
    ],
    isOpen: false,
  },
  {
    id: "project-coordinator",
    title: "Virtual Assistant / Project Coordinator",
    type: ["Freelance", "Contract"],
    location: "Remote, India",
    experience: "0–2 years",
    skills: ["Communication", "Scheduling", "Documentation", "Notion or Jira", "Google Workspace"],
    summary: "Keep projects organised: schedules, client updates, meeting notes and task boards.",
    responsibilities: [
      "Schedule calls and keep project boards up to date",
      "Write meeting notes and weekly client updates",
      "Track invoices, timelines and follow-ups",
      "Organise documents, credentials hand-over lists and project folders",
    ],
    requirements: [
      "Excellent written English and an eye for detail",
      "Comfort with Google Workspace and a task tool such as Notion, Jira or Trello",
      "Reliable availability during agreed IST working hours",
      "Discretion with client information",
    ],
    isOpen: false,
  },
];

export const openRoles = roles.filter((role) => role.isOpen);

/** "General application" is always available in the form, even when no role is open. */
export const GENERAL_ROLE = { id: "general", title: "General application" } as const;

export const roleOptions = [
  ...openRoles.map((role) => ({ id: role.id, title: role.title })),
  GENERAL_ROLE,
];

export type Benefit = { icon: IconName; title: string; text: string };

/**
 * Only what is genuinely offered today. Uncomment an option ONLY once it truly exists —
 * nothing outside this list may appear on the page.
 */
export const benefits: Benefit[] = [
  {
    icon: "FolderGit2",
    title: "Real client projects",
    text: "Work that ships to real users — and, with client permission, belongs in your portfolio.",
  },
  {
    icon: "GraduationCap",
    title: "Mentorship and code reviews",
    text: "Every pull request gets a thoughtful review, and you can always ask why, not just what.",
  },
  {
    icon: "Laptop",
    title: "Flexible hours, remote work",
    text: "Work from anywhere in India, around a few agreed overlap hours for calls.",
  },
  {
    icon: "Wallet",
    title: "Fair, on-time pay",
    text: "Agreed upfront per project or per month, and paid on the date we agree.",
  },
  {
    icon: "Award",
    title: "A reference for good work",
    text: "Do good work and I'll gladly vouch for you — on LinkedIn, by email or on a call.",
  },
  {
    icon: "Route",
    title: "A path to a long-term role",
    text: "As the practice grows into an agency, the first long-term roles go to people who have already worked well together.",
  },
  // Not offered today — uncomment only when they genuinely exist:
  // { icon: "HeartPulse", title: "Health insurance", text: "[DETAILS OF THE PLAN]" },
  // { icon: "PieChart", title: "ESOPs", text: "[DETAILS OF THE ESOP POOL]" },
  // { icon: "Building2", title: "Office space", text: "[OFFICE LOCATION AND PERKS]" },
  // { icon: "Coffee", title: "Office perks", text: "[DETAILS]" },
];

export type CareersContent = {
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; highlight: string; subtitle: string };
  openings: SectionCopy & {
    empty: string;
    emptyCta: string;
    viewDetails: string;
    hideDetails: string;
    apply: string;
    responsibilitiesLabel: string;
    requirementsLabel: string;
  };
  shortVersion: { title: string; items: { label: string; value: string }[] };
  culture: SectionCopy & {
    text: string;
    points: { icon: IconName; title: string; text: string }[];
  };
  benefits: SectionCopy & { note: string };
  whyJoin: { title: string; highlight: string; text: string };
  tech: SectionCopy & {
    /** techStack.ts category ids to show, in this order. */
    categoryIds: string[];
    collaboration: { title: string; tools: string[] };
  };
  hiring: SectionCopy & { steps: { title: string; text: string }[]; note: string };
  roleTypes: SectionCopy & { items: { icon: IconName; title: string; text: string }[] };
  form: SectionCopy & {
    submit: string;
    privacy: { label: string; href: string };
    successTitle: string;
    successText: string;
    nextSteps: string[];
    another: string;
    error: string;
  };
  faq: SectionCopy & { items: { q: string; a: string }[] };
};

export const careersContent: CareersContent = {
  seo: {
    title: "Careers & Collaborations",
    description:
      "Freelance, contract and internship roles with Arshdeep Singh: remote-first, project-based work on real MVPs, web and mobile apps, AI and DevOps.",
  },
  hero: {
    eyebrow: "Careers",
    title: "Careers & collaborations",
    highlight: "collaborations",
    subtitle:
      "Help build real products for ambitious founders — remote-first, project-based, learning-heavy.",
  },
  openings: {
    id: "openings",
    title: "Open positions",
    highlight: "positions",
    subtitle:
      "A small, growing practice. Roles open when there's real project work for them — never before.",
    empty:
      "No open roles right now — but I'm always happy to meet good people. Send a general application below.",
    emptyCta: "Send a general application",
    viewDetails: "View details",
    hideDetails: "Hide details",
    apply: "Apply",
    responsibilitiesLabel: "What you'll do",
    requirementsLabel: "What you'll need",
  },
  shortVersion: {
    title: "The short version",
    items: [
      { label: "Location", value: "Remote, India (occasional meetups in [CITY])" },
      { label: "Focus", value: "MVPs, web and mobile apps, AI features, DevOps" },
      { label: "Team style", value: "Small, flat, outcome-focused" },
      { label: "Culture", value: "Learning-first, code reviews, mentorship" },
    ],
  },
  culture: {
    id: "culture",
    title: "How we work",
    highlight: "work",
    text: "This is a small, remote practice, not a corporate ladder. Work is planned in short, clear slices, discussed in writing and reviewed with care. You'll talk directly with the person who makes decisions, and your work reaches real users quickly.",
    points: [
      {
        icon: "Network",
        title: "Flat structure",
        text: "No layers of managers — you work directly with me and, often, with the client.",
      },
      {
        icon: "Target",
        title: "Outcomes over hours",
        text: "What matters is what ships and how well it works, not when you're online.",
      },
      {
        icon: "MessagesSquare",
        title: "Open feedback",
        text: "Honest, kind feedback in both directions — including on how I run things.",
      },
      {
        icon: "BookOpen",
        title: "Knowledge sharing",
        text: "Decisions are written down, and what one of us learns gets shared with everyone.",
      },
    ],
  },
  benefits: {
    id: "benefits",
    title: "What you get",
    highlight: "you get",
    subtitle: "An honest list. If something isn't here, it isn't offered yet.",
    note: "If something isn't listed here, it isn't offered yet — this list grows only when the practice genuinely can.",
  },
  whyJoin: {
    title: "Why join now?",
    highlight: "now?",
    text: "Joining a practice early means your work is visible, your opinions shape how things are done, and you learn across the whole product — not one narrow ticket queue. You'll work on real launches for founders who care, with reviews that make you better. And as the practice grows into an agency, the people who helped build it are the ones it grows around.",
  },
  tech: {
    id: "tech",
    title: "What you'll work with",
    highlight: "work with",
    subtitle: "The stack used on client projects, plus the tools we collaborate in.",
    categoryIds: ["frontend", "backend", "mobile", "design", "databases", "cloud", "ai"],
    collaboration: {
      title: "Collaboration",
      tools: ["GitHub", "Jira or Linear", "Slack", "Figma"],
    },
  },
  hiring: {
    id: "hiring-process",
    title: "How hiring works",
    highlight: "hiring works",
    subtitle: "Five simple steps, with no trick questions and no unpaid marathons.",
    steps: [
      { title: "Apply", text: "Send the form below with your resume and work you're proud of." },
      {
        title: "Intro call",
        text: "A relaxed 20-minute chat about you, the work and expectations.",
      },
      {
        title: "Skills task or code walkthrough",
        text: "Walk me through code you've written, or do a small task — paid if it takes over 2 hours.",
      },
      { title: "Final chat", text: "Scope, rates, availability and any questions you still have." },
      {
        title: "Offer & onboarding",
        text: "A written agreement, access to tools and a first small task.",
      },
    ],
    note: "You'll hear back at every step, usually within a week.",
  },
  roleTypes: {
    id: "roles",
    title: "Roles I typically work with",
    highlight: "typically work with",
    subtitle: "Even when nothing is open, these are the skills client projects need most often.",
    items: [
      { icon: "Layers", title: "Full-stack", text: "Features end to end" },
      { icon: "PanelsTopLeft", title: "Frontend", text: "React and Next.js interfaces" },
      { icon: "Server", title: "Backend", text: "APIs, data and integrations" },
      { icon: "Smartphone", title: "Mobile", text: "React Native and Flutter apps" },
      { icon: "PenTool", title: "UI/UX", text: "Flows, wireframes and UI" },
      { icon: "Bug", title: "QA", text: "Manual and automated testing" },
      { icon: "Cloud", title: "DevOps", text: "CI/CD, cloud and monitoring" },
      { icon: "Megaphone", title: "Growth & content", text: "SEO, content and campaigns" },
    ],
  },
  form: {
    id: "apply",
    title: "Apply or introduce yourself",
    highlight: "introduce yourself",
    subtitle:
      "Takes about five minutes. Every application is read by me personally, and you'll get a reply either way.",
    submit: "Send application",
    privacy: { label: "Privacy Policy", href: "/privacy-policy" },
    successTitle: "Application received — thank you!",
    successText: "A confirmation is on its way to your inbox. Here's what happens next:",
    nextSteps: [
      "I read every application personally, usually within a week.",
      "If there's a fit, I'll email you to book a 20-minute intro call.",
      "If not right now, I'll tell you — and keep your details for up to 12 months in case something opens up.",
    ],
    another: "Send another application",
    error: "Something went wrong sending your application. Please try again in a moment.",
  },
  faq: {
    id: "faq",
    title: "Careers FAQ",
    highlight: "FAQ",
    subtitle: "Straight answers to the questions people ask most.",
    items: [
      {
        q: "What's it like to work with you?",
        a: "Calm, direct and written-first. Work is broken into small, clear tasks; you get context on why something matters, a review on every pull request and room to suggest better ways of doing things. I'd rather you ask early than guess.",
      },
      {
        q: "Which roles do you hire for?",
        a: "Mostly frontend, backend and full-stack developers, UI/UX designers and project coordination support — plus occasional mobile, QA, DevOps and growth work, depending on client projects. Open roles are listed above; anything else goes through a general application.",
      },
      {
        q: "Is the work remote?",
        a: "Yes. Everything is remote across India, with a few agreed overlap hours in IST for calls. There may be occasional optional meetups in [CITY].",
      },
      {
        q: "How are freelancers paid?",
        a: "By bank transfer (or UPI) in INR, either per project milestone or monthly, at a rate agreed in writing before work starts. Invoices are paid on the agreed date.",
      },
      {
        q: "Do you hire students or freshers?",
        a: "Yes, for internships and small freelance tasks — especially in design and frontend. Show work you've built or designed, even personal or college projects; that matters more than a degree.",
      },
      {
        q: "How long does the process take?",
        a: "Usually one to three weeks from application to offer, depending on the role and your availability. You'll hear back at every step, usually within a week.",
      },
    ],
  },
};

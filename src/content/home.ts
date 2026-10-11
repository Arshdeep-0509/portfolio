import type { ServiceGroupId } from "@/content/services";
import { bookingHref } from "@/lib/booking";

/**
 * Home page copy, section by section. Shared data (process, handover kit, stack map, lab, FAQs,
 * testimonials) lives in its own content file; this file holds the home-specific words.
 */

export type PickerOption = {
  id: string;
  label: string;
  /** Service slugs this answer points towards. */
  services: string[];
};

export type PickerQuestion = {
  id: "building" | "stage" | "timeline";
  question: string;
  /** How strongly this answer counts when ranking services. */
  weight: number;
  options: PickerOption[];
};

export const homeContent = {
  seo: {
    description:
      "One engineer for the whole build: MVP development and full product builds in India, web and mobile apps and AI integration for startups, from Arshdeep Singh — full-stack, AI and DevOps.",
  },

  hero: {
    label: "Arshdeep Singh — engineer for founders & growing teams",
    title: "I turn early ideas into fast, sturdy software that's ready to grow.",
    emphasis: "fast, sturdy software",
    text: "From the first MVP to the full, finished product — web and mobile apps and AI features, designed and shipped by me: tidy code, steady delivery, real users from the first release.",
    primary: { label: "Book a free call", href: bookingHref },
    secondary: { label: "See selected work", href: "/work" },
    log: [
      "→ scope agreed",
      "→ prototype approved",
      "→ sprint demo shipped",
      "→ tests passing",
      "→ live in production",
    ],
    logTitle: "your-product / build.log",
    facts: ["reply within one business day", "your code, your IP", "a demo every week"],
  },

  build: {
    id: "what-i-build",
    label: "What I build",
    title: "Four kinds of work, one person accountable for all of it",
    emphasis: "one person accountable",
    intro:
      "Pick the group closest to your problem. Each service has its own page with the process, deliverables and honest timelines.",
    /** Bento order and size: AI & Cloud is the large, dark tile. */
    tiles: [
      { group: "build" as ServiceGroupId, area: "build" },
      { group: "design" as ServiceGroupId, area: "design" },
      { group: "grow" as ServiceGroupId, area: "grow" },
      { group: "ai-cloud" as ServiceGroupId, area: "ai" },
    ],
    picker: {
      title: "Not sure where you fit?",
      text: "Three quick taps and I'll point you to a starting place.",
      resultsTitle: "I'd begin here",
      discuss: "Talk this through with me",
      reset: "Clear my answers",
      questions: [
        {
          id: "building",
          question: "What are you making?",
          weight: 3,
          options: [
            {
              id: "web",
              label: "Web app",
              services: ["web-applications", "full-stack-development", "mvp-development"],
            },
            {
              id: "mobile",
              label: "Mobile app",
              services: ["mobile-applications", "mvp-development", "ui-design"],
            },
            { id: "ai", label: "AI feature", services: ["ai-integration", "backend-development"] },
            {
              id: "marketing",
              label: "Marketing & SEO",
              services: ["digital-marketing", "growth-marketing"],
            },
          ],
        },
        {
          id: "stage",
          question: "Where are you today?",
          weight: 2,
          options: [
            { id: "idea", label: "An idea", services: ["mvp-development", "ux-design"] },
            {
              id: "prototype",
              label: "A prototype",
              services: ["full-stack-development", "ui-design", "frontend-development"],
            },
            {
              id: "live",
              label: "Already live",
              services: ["devops-cloud", "growth-marketing", "backend-development"],
            },
          ],
        },
        {
          id: "timeline",
          question: "How soon?",
          weight: 1,
          options: [
            { id: "asap", label: "Right away", services: ["mvp-development"] },
            {
              id: "1-3-months",
              label: "1–3 months",
              services: ["full-stack-development", "ux-design"],
            },
            { id: "later", label: "Later on", services: ["ux-design", "digital-marketing"] },
          ],
        },
      ] satisfies PickerQuestion[],
    },
  },

  principles: {
    id: "principles",
    label: "Principles",
    title: "Six habits that shape every project",
    emphasis: "every project",
    overview: [
      "You work with one engineer across UX, frontend, backend, AI and cloud. Fewer hand-offs mean faster decisions and a product that hangs together.",
      "We begin with the smallest version that can win early users or investors, and scale it once real traction appears.",
    ],
    link: { label: "Read more about my approach", href: "/approach" },
    items: [
      {
        title: "Ship a small first version, soon",
        text: "The features that test your idea go first, so you learn from real users while others are still planning. A big vision becomes a focused release; once it proves itself, I build it out into the complete product.",
      },
      {
        title: "Spend only where it pays back",
        text: "Budget goes to what moves your numbers — no padded scope, no idle hours billed. AI features, chatbots and automations go in only where they help your users or your team.",
      },
      {
        title: "One owner, nothing hidden",
        text: "UX, frontend, backend, AI and DevOps sit with one accountable person. You talk to whoever writes the code, see progress on a shared board and get straight timelines.",
      },
      {
        title: "Screens that earn trust",
        text: "Clean, modern interfaces that feel dependable to the customers you want and the investors you pitch.",
      },
      {
        title: "Foundations for version two",
        text: "Sound architecture, tests, CI/CD, monitoring and backups from the first sprint — so the next release builds on this one instead of replacing it.",
      },
      {
        title: "Still here after launch, in your hours",
        text: "Fixes, iterations and new features as your users grow. IST working hours for Indian founders, with overlap for clients elsewhere.",
      },
    ],
  },

  process: {
    id: "process",
    label: "How a project runs",
    title: "Six steps, and a working build at most two weeks apart",
    emphasis: "a working build",
    intro: "You stay in control throughout: each step ends with something you can see or use.",
    outlineLabel: "Project steps",
    receiveLabel: "You receive",
    durationLabel: "Typical length",
  },

  handover: { id: "handover" },

  stack: {
    id: "stack",
    label: "Stack map",
    title: "The layers under your product, and the tools on each",
    emphasis: "the tools on each",
    intro:
      "Proven, well-supported tools picked per project for speed, security and long-term upkeep. Hover a layer to bring it forward.",
  },

  lab: {
    id: "lab",
    label: "From the lab",
    title: "What I'm building when I'm not building yours",
    emphasis: "building yours",
    intro: "My own product work, built with the same engineering I bring to client work.",
    carouselLabel: "Products and offers",
    caseStudiesTitle: "Two featured case studies",
  },

  questions: {
    id: "faq",
    label: "Questions",
    title: "Things founders usually ask first",
    emphasis: "ask first",
    card: {
      title: "Still unsure? Ask me directly",
      text: "A short message is fine. You'll hear from me within one business day.",
      email: "Email me",
      whatsapp: "Message on WhatsApp",
    },
  },

  testimonials: { id: "testimonials", label: "In their words" },
};

/**
 * Copy for /services and the shared parts of every /services/[slug] page.
 * Per-service content (intro, benefits, FAQs…) lives in services.ts.
 */

type Action = { label: string; href: string };

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

export const servicesPage = {
  seo: {
    title: "MVP, Web, Mobile, AI & DevOps Services",
    description:
      "MVP development, web and mobile apps, UI/UX design, AI integration, DevOps and growth marketing — one engineer from idea to scale.",
  },

  hero: {
    eyebrow: "Services",
    title: "Everything you need to build, launch and grow your product",
    highlight: "build, launch and grow",
    subtitle:
      "From MVP development and UI/UX to AI features, cloud and growth marketing — one partner from idea to scale.",
    primaryCta: { label: "Explore all services", href: "#service-list" } satisfies Action,
    secondaryCta: { label: "Start your project", href: "/contact" } satisfies Action,
    illustration: {
      name: "services-hero.svg",
      width: 480,
      height: 400,
      alt: "",
    },
  },

  navigator: {
    id: "service-list",
    title: "Core services",
    highlight: "services",
    subtitle: "Pick what you need now — add more as you grow.",
    allLabel: "All",
  },

  groupBands: {
    learnMore: "Learn more",
  },

  picker: {
    id: "start",
    title: "Not sure where to start?",
    highlight: "where to start",
    paragraphs: [
      "Most founders don't arrive with a neat list of services — they arrive with an idea and a deadline. That's fine.",
      "Answer three quick questions and I'll suggest where to begin. Or book the free 30-minute scoping call: we'll cut the idea down to a first version you can launch, and you'll leave with a feature shortlist, a suggested stack and a rough timeline — whether or not we work together.",
    ],
    scopingCta: { label: "Book a free scoping call", href: "/contact?topic=mvp-scoping" },
    resultsTitle: "Where I'd start",
    resultsIntro: "Based on your answers, these are the best places to begin:",
    discussCta: "Discuss this with me",
    resetLabel: "Start over",
    questions: [
      {
        id: "building",
        question: "What are you building?",
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
          {
            id: "ai",
            label: "AI feature",
            services: ["ai-integration", "backend-development"],
          },
          {
            id: "marketing",
            label: "Marketing",
            services: ["digital-marketing", "growth-marketing"],
          },
        ],
      },
      {
        id: "stage",
        question: "What stage are you at?",
        weight: 2,
        options: [
          { id: "idea", label: "Idea", services: ["mvp-development", "ux-design"] },
          {
            id: "prototype",
            label: "Prototype",
            services: ["full-stack-development", "ui-design", "frontend-development"],
          },
          {
            id: "live",
            label: "Live product",
            services: ["devops-cloud", "growth-marketing", "backend-development"],
          },
        ],
      },
      {
        id: "timeline",
        question: "When do you need it?",
        weight: 1,
        options: [
          { id: "asap", label: "ASAP", services: ["mvp-development"] },
          {
            id: "1-3-months",
            label: "1–3 months",
            services: ["full-stack-development", "ux-design"],
          },
          { id: "later", label: "Later", services: ["ux-design", "digital-marketing"] },
        ],
      },
    ] satisfies PickerQuestion[],
  },
};

/** Shared by every /services/[slug] page. */
export const serviceDetailCopy = {
  heroCtas: {
    quote: "Get a free quote",
    process: "See the process",
  },
  atAGlance: {
    title: "At a glance",
    timelineLabel: "Typical timeline",
    modelsLabel: "Engagement models",
    idealForLabel: "Ideal for",
    engagementModels: ["Fixed scope", "Monthly retainer", "Hourly"],
  },
  subNavLabel: "On this page",
  sections: {
    overview: { id: "overview", nav: "Overview", title: "Overview" },
    useCases: { id: "use-cases", nav: "Use cases", title: "Example use cases" },
    benefits: { id: "benefits", nav: "Benefits", title: "What you get" },
    whyMe: { id: "why-me", nav: "Why me", title: "Why work with me" },
    tech: { id: "tech", nav: "Tech", title: "Technologies I use" },
    process: { id: "process", nav: "Process", title: "How the work runs" },
    deliverables: { id: "deliverables", nav: "Deliverables", title: "What you walk away with" },
    faq: { id: "faq", nav: "FAQ", title: "Frequently asked questions" },
  },
  quickFacts: {
    title: "Quick facts",
    /** Shown when the service has no typicalTimeline yet. */
    timelineFallback: "[TYPICAL_TIMELINE]",
    items: [
      { label: "Communication", value: "Weekly demo plus async updates" },
      { label: "Code ownership", value: "100% yours, from day one" },
      { label: "Support window", value: "[SUPPORT_WINDOW] after launch" },
    ],
    cta: { label: "Book a free call", href: "/contact" },
  },
  relatedTitle: "Related services",
  caseStudy: {
    /** When a case study lists this service in its frontmatter. */
    title: "From my work",
    /** Otherwise the most recent case study is shown, labelled honestly. */
    fallbackTitle: "Recent work",
    allWork: "See all work",
  },
};

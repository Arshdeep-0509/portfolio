import type { IconName } from "@/content/services";

/**
 * Home page copy and section headings. Nothing on the home page is written inline.
 * Shared data (tech stack, process, deliverables, products, testimonials, FAQs) lives in its own
 * content file; this file holds the home-specific copy and section headings.
 */

type Action = { label: string; href: string };

/** Heading copy for sections whose data lives in its own content file. */
export type SectionCopy = { id: string; title: string; highlight?: string; subtitle?: string };

export type HomeContent = {
  seo: { description: string };
  hero: {
    eyebrow: string;
    /** Rendered on two lines; the second is highlighted. */
    titleLines: [string, string];
    subtitle: string;
    primaryCta: Action;
    secondaryCta: Action;
    trust: string[];
    illustration: { src: string; alt: string; width: number; height: number };
    floatingCards: { icon: IconName; label: string }[];
  };
  techMarquee: {
    label: string;
    /** Edit to match the tools actually used. Icons are generic lucide glyphs, not brand logos. */
    items: { name: string; icon: IconName }[];
  };
  overview: {
    id: string;
    eyebrow: string;
    title: string;
    highlight?: string;
    paragraphs: string[];
    primaryCta: Action;
    secondaryCta: Action;
    card: { title: string; text: string; items: string[] };
  };
  benefits: {
    id: string;
    title: string;
    highlight?: string;
    subtitle: string;
    items: { icon: IconName; title: string; text: string }[];
  };
  why: {
    id: string;
    title: string;
    highlight?: string;
    subtitle: string;
    items: { label: string; icon: IconName; title: string; text: string }[];
  };
  technology: SectionCopy;
  process: SectionCopy;
  deliverables: SectionCopy;
  products: SectionCopy & { eyebrow: string };
  testimonials: SectionCopy;
  faq: SectionCopy;
};

export const homeContent: HomeContent = {
  seo: {
    description:
      "Full-stack, AI and DevOps engineer offering MVP development in India, web app development, mobile apps and AI integration for startups, built to scale.",
  },

  hero: {
    eyebrow: "MVPs · Web & Mobile Apps · AI · DevOps",
    titleLines: ["Turning bold ideas into", "fast, scalable digital products"],
    subtitle:
      "I design, build and ship MVPs, web apps, mobile apps and AI-powered features — clean code, fast delivery, ready for real users.",
    primaryCta: { label: "Start your project", href: "/contact" },
    secondaryCta: { label: "Explore services", href: "/services" },
    trust: [
      "Free 30-min discovery call",
      "You own 100% of the code",
      "Reply within 1 business day",
    ],
    illustration: {
      src: "hero-illustration.svg",
      alt: "Illustration of a developer at a laptop beside a code window and a small rocket",
      width: 560,
      height: 480,
    },
    floatingCards: [
      { icon: "Play", label: "Weekly demo builds" },
      { icon: "Cloud", label: "Cloud-ready from day one" },
    ],
  },

  techMarquee: {
    label: "Tools I build with",
    items: [
      { name: "React", icon: "Atom" },
      { name: "Next.js", icon: "Triangle" },
      { name: "TypeScript", icon: "FileCode" },
      { name: "Node.js", icon: "Hexagon" },
      { name: "Express", icon: "Route" },
      { name: "NestJS", icon: "Boxes" },
      { name: "Python", icon: "Braces" },
      { name: "FastAPI", icon: "Zap" },
      { name: "Django", icon: "Layers" },
      { name: "PostgreSQL", icon: "Database" },
      { name: "MongoDB", icon: "Leaf" },
      { name: "Redis", icon: "Gauge" },
      { name: "Flutter", icon: "Smartphone" },
      { name: "React Native", icon: "TabletSmartphone" },
      { name: "Docker", icon: "Container" },
      { name: "Kubernetes", icon: "Ship" },
      { name: "AWS", icon: "Cloud" },
      { name: "GCP", icon: "CloudCog" },
      { name: "GitHub Actions", icon: "Workflow" },
      { name: "LLM APIs", icon: "Bot" },
      { name: "LangChain", icon: "Link" },
      { name: "Tailwind CSS", icon: "Wind" },
      { name: "Figma", icon: "PenTool" },
    ],
  },

  overview: {
    id: "overview",
    eyebrow: "MVP · Web · Mobile · AI",
    title: "From idea to launch-ready product — without agency overhead",
    highlight: "launch-ready product",
    paragraphs: [
      "I work with founders and growing businesses to scope, design, build and ship digital products. One engineer across UX, frontend, backend, AI and cloud means fewer hand-offs, faster decisions and a product that holds together.",
      "We start with the smallest version of your product that can win early users or investors, then scale it once real traction shows up.",
    ],
    primaryCta: { label: "Start your project", href: "/contact" },
    secondaryCta: { label: "See how I work", href: "#process" },
    card: {
      title: "Built for founder speed",
      text: "Senior-level engineering without the overhead of a big agency.",
      items: [
        "Core features live in weeks, not quarters",
        "Weekly demos and plain-English updates",
        "Architecture that scales from day one",
        "Flexible support once you launch",
      ],
    },
  },

  benefits: {
    id: "benefits",
    title: "Why work with me",
    highlight: "with me",
    subtitle:
      "More than code — a technical partner who cares whether your product works in the market.",
    items: [
      {
        icon: "Rocket",
        title: "Launch in weeks",
        text: "I ship the features that prove your idea first, so you start learning from real users while competitors are still planning.",
      },
      {
        icon: "Wallet",
        title: "Budget-smart builds",
        text: "Your money goes into what moves the needle. No bloated scope, no idle hours billed while work waits.",
      },
      {
        icon: "Layers",
        title: "Full stack, one owner",
        text: "UX, frontend, backend, AI and DevOps handled by one accountable engineer — nothing gets lost between teams.",
      },
      {
        icon: "Palette",
        title: "Design-led interfaces",
        text: "Clean, modern screens that feel trustworthy to the users you're trying to win and the investors you're pitching.",
      },
      {
        icon: "TrendingUp",
        title: "Scalable from day one",
        text: "Solid architecture, tests and CI/CD from the first sprint, so version two is a next step, not a rewrite.",
      },
      {
        icon: "LifeBuoy",
        title: "Support beyond launch",
        text: "Fixes, iterations and new features as your user base grows. Launch is the start of the work, not the end.",
      },
    ],
  },

  why: {
    id: "why",
    title: "Why founders choose to build with me",
    highlight: "build with me",
    subtitle: "Built for startup pace, not corporate process.",
    items: [
      {
        label: "Founder-first",
        icon: "Zap",
        title: "Built around startups",
        text: "I understand urgency, tight budgets and the need to pivot fast — and I plan the work around them.",
      },
      {
        label: "Lean scope",
        icon: "Target",
        title: "Ruthless prioritisation",
        text: "Your big vision becomes a focused first release that tests what matters, without over-engineering the rest.",
      },
      {
        label: "AI-native",
        icon: "Sparkles",
        title: "AI where it pays off",
        text: "LLM features, chatbots and automations go in only where they create real value for your users or your team.",
      },
      {
        label: "DevOps-ready",
        icon: "Cloud",
        title: "Production-grade from day one",
        text: "Docker, CI/CD, monitoring and backups are set up properly from the start, not bolted on after the first outage.",
      },
      {
        label: "Transparent",
        icon: "Eye",
        title: "No black boxes",
        text: "You talk directly to the engineer doing the work, see progress on a shared board and get honest timelines.",
      },
      {
        label: "India + global",
        icon: "Globe",
        title: "Local advantage, global standards",
        text: "IST-friendly collaboration for Indian founders, with overlap hours for clients in other time zones.",
      },
    ],
  },

  // Data for the sections below lives in techStack.ts, process.ts, deliverables.ts, products.ts,
  // testimonials.ts and faqs.ts so other pages can reuse it. Only the headings are here.
  technology: {
    id: "technology",
    title: "The stack behind your product",
    highlight: "your product",
    subtitle:
      "Modern, proven tools chosen for performance, security and long-term maintainability.",
  },
  process: {
    id: "process",
    title: "How we go from idea to launch",
    highlight: "idea to launch",
    subtitle: "A founder-friendly, agile workflow that keeps you in control at every step.",
  },
  deliverables: {
    id: "deliverables",
    title: "What you walk away with",
    highlight: "walk away with",
    subtitle: "Clear deliverables that leave you in full control of your product.",
  },
  products: {
    id: "products",
    eyebrow: "Beyond client work",
    title: "Products I'm building",
    highlight: "I'm building",
    subtitle: "Long-term products where I apply the same engineering I bring to client projects.",
  },
  testimonials: {
    id: "testimonials",
    title: "What clients say",
    highlight: "clients say",
  },
  faq: {
    id: "faq",
    title: "Questions founders ask before we start",
    highlight: "before we start",
  },
};

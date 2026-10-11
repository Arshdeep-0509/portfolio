import type { IconName } from "@/content/services";

/**
 * Copy for /about.
 * Everything in [SQUARE_BRACKETS] must be replaced by the owner with real facts before launch —
 * the page highlights these placeholders so nothing invented goes live by accident.
 */

export const aboutContent = {
  seo: {
    title: "About Me — Full-Stack, AI & DevOps Engineer",
    description:
      "Meet Arshdeep Singh, a full-stack developer in [CITY], India, and AI & DevOps engineer helping founders turn ideas into reliable products.",
  },

  hero: {
    eyebrow: "About",
    title: "Hi, I'm Arshdeep Singh",
    highlight: "Arshdeep Singh",
    intro:
      "I help founders and growing businesses turn ideas into fast, reliable web, mobile and AI products. I work hands-on across design, code and cloud — and I'd rather give you the honest answer than the easy one.",
    primaryCta: { label: "Work with me", href: "/contact" },
    cv: { label: "Download CV", href: "/cv/arshdeep-singh.pdf" },
    currently: "Currently: building MVPs and AI features for startups",
    photoAlt: "Portrait of Arshdeep Singh",
  },

  story: {
    id: "story",
    title: "My story",
    highlight: "story",
    // Owner fills these in. Keep each to a short paragraph, and describe real projects only.
    paragraphs: [
      "[WHERE I STARTED] — Two or three sentences on how you got into software: the first thing you built, what hooked you, and where you learned.",
      "[WHAT I'VE BUILT — real projects only] — Two or three real projects you've shipped: what the product did, your role and the stack. No client names without permission, and no invented results.",
      "[WHY I WORK WITH FOUNDERS] — Why you enjoy early-stage work: the pace, the ownership, and seeing an idea become something people use.",
      "[EDUCATION] — Your degree or training, the institution and year, plus any certifications worth mentioning.",
    ],
    quote: "Build lean. Ship fast. Scale right.",
  },

  missionVision: [
    {
      icon: "Target",
      label: "Mission",
      text: "Help founders and businesses turn ideas into reliable products — quickly and affordably.",
    },
    {
      icon: "Telescope",
      label: "Vision",
      text: "Grow into a product studio known for honest engineering, practical AI and long-term partnerships.",
    },
  ] satisfies { icon: IconName; label: string; text: string }[],

  values: {
    title: "What I value",
    highlight: "value",
    items: [
      {
        icon: "HeartHandshake",
        title: "Ownership",
        text: "I treat your product like my own — if something breaks at launch, it's my problem too.",
      },
      {
        icon: "Eye",
        title: "Clarity",
        text: "Clean code, clean design and plain-English updates, so you always know where things stand.",
      },
      {
        icon: "Gauge",
        title: "Speed with quality",
        text: "Tests, reviews and automation let me move quickly without cutting corners.",
      },
      {
        icon: "Scale",
        title: "Honesty",
        text: "Realistic timelines, open trade-offs and early warnings — no surprises at the end of a sprint.",
      },
      {
        icon: "Sprout",
        title: "Long-term thinking",
        text: "Decisions are made for the product you'll have in two years, not just next week's demo.",
      },
    ] satisfies { icon: IconName; title: string; text: string }[],
  },

  journey: {
    id: "journey",
    title: "The journey so far",
    highlight: "so far",
    // Owner fills in the years and one real sentence for each step.
    milestones: [
      {
        meta: "[YEAR]",
        title: "Started coding",
        text: "[ADD DETAILS] What sparked it and the first thing you built.",
      },
      {
        meta: "[YEAR]",
        title: "First production project",
        text: "[ADD DETAILS] The first thing you shipped that real people used.",
      },
      {
        meta: "[YEAR]",
        title: "Went full-stack",
        text: "[ADD DETAILS] When you started owning both frontend and backend.",
      },
      {
        meta: "[YEAR]",
        title: "Added DevOps",
        text: "[ADD DETAILS] Taking on CI/CD, containers and cloud infrastructure.",
      },
      {
        meta: "[YEAR]",
        title: "Added AI engineering",
        text: "[ADD DETAILS] Your first LLM, RAG or automation work in production.",
      },
      {
        meta: "[YEAR]",
        title: "Launched this practice",
        text: "[ADD DETAILS] Starting to work directly with founders and businesses.",
      },
      {
        meta: "Next",
        title: "Growing into an agency",
        text: "Building a small, senior team around the same honest way of working.",
      },
    ],
  },

  pillars: {
    title: "What I bring",
    highlight: "bring",
    items: [
      {
        icon: "Route",
        title: "Product & UX thinking",
        text: "Turning a big idea into a focused first release that users understand.",
        skills: ["Discovery workshops", "User flows", "Wireframes & prototypes", "MVP scoping"],
      },
      {
        icon: "Layers",
        title: "Full-stack engineering",
        text: "Interfaces, APIs and databases built together, with tests from day one.",
        skills: ["Node.js", "Python", "React", "Next.js"],
      },
      {
        icon: "Bot",
        title: "AI engineering",
        text: "Practical AI features that are measured, monitored and cost-aware.",
        skills: ["LLM APIs", "RAG", "Agents", "Evaluation"],
      },
      {
        icon: "Cloud",
        title: "DevOps & cloud",
        text: "Automated, observable infrastructure that keeps releases boring.",
        skills: ["Docker", "Kubernetes", "CI/CD", "AWS / GCP"],
      },
    ] satisfies { icon: IconName; title: string; text: string; skills: string[] }[],
  },

  products: {
    id: "products",
    eyebrow: "Beyond client work",
    title: "Products & initiatives",
    highlight: "initiatives",
    subtitle: "Long-term products where I apply the same engineering I bring to client projects.",
  },

  workTogether: {
    title: "How we'll work together",
    highlight: "work together",
    tools: [
      { icon: "SquareKanban", label: "Project board", tools: "Notion, Jira or Trello" },
      { icon: "MessageCircle", label: "Chat", tools: "Slack or WhatsApp" },
      { icon: "Video", label: "Calls", tools: "Google Meet or Zoom" },
      { icon: "GitBranch", label: "Code", tools: "GitHub" },
      { icon: "PenTool", label: "Design", tools: "Figma" },
    ] satisfies { icon: IconName; label: string; tools: string }[],
    cadence:
      "During sprints you get a weekly demo build and a short async update every working day — and I use whichever tools your team already prefers.",
  },

  benefits: {
    title: "Benefits of working with me",
    highlight: "working with me",
  },

  faq: {
    id: "faq",
    title: "Questions people ask me",
    highlight: "ask me",
    items: [
      {
        q: "Do you work alone or with a team?",
        a: "The core work — architecture, code and the decisions behind them — is mine, and you always deal with me directly. When a project needs extra capacity or a specialist skill, such as illustration or a second developer, I bring in trusted specialists. I always tell you upfront who is involved and what they're doing.",
      },
      {
        q: "Do you only work with startups?",
        a: "No. Startups are a natural fit, but I also work with small and medium businesses going digital, agencies that need a white-label engineer, and established teams that want help with AI or DevOps. What matters most is a clear goal and someone on your side who can make decisions.",
      },
      {
        q: "What happens after the MVP is delivered?",
        a: "You get the code, documentation and accounts, plus a bug-fix window after launch. Then we look at the data together and decide what's next: new features, performance and scaling work, or a pause while you gather feedback. Ongoing support is available as a monthly retainer or on-demand hours, with no lock-in.",
      },
      {
        q: "Will I own the code and IP?",
        a: "Yes. We sign an NDA and IP assignment before work starts, the code lives in a repository you own, and design files, documentation and cloud accounts are in your name. If you ever want another developer or an in-house team to take over, they'll have everything they need.",
      },
      {
        q: "Can we talk before I pay anything?",
        a: "Yes. The first call is free and comes with no obligation. We'll talk through your idea, users and timeline, and you'll get a written scope and quote afterwards. If I'm not the right fit for your project, I'll tell you so and, where I can, suggest who might be.",
      },
      {
        q: "Which time zones do you work with?",
        a: "I'm based in India and work on IST, which suits Indian clients naturally. For clients in Europe, the Middle East, Australia or the Americas, we agree a few hours of overlap for calls, and everything else runs asynchronously through the shared board and written updates.",
      },
    ],
  },
};

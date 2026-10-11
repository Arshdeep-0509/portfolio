import type { Deliverable } from "@/content/deliverables";
import type { IconName } from "@/content/services";

/**
 * Copy for /why-me. Shared data (tech stack, process, deliverables) is reused from its own
 * content files; this file holds what is specific to this page.
 *
 * Honesty rule for this page: commitments are promises, not achievements. No client counts,
 * ratings, multipliers or percentages.
 */

export type ComparisonStatus = "yes" | "partial" | "no";

export type ComparisonCell = { status: ComparisonStatus; text: string };

export type ComparisonData = {
  caption: string;
  intro: string;
  note: string;
  /** The first column is "Working with me" and is highlighted. */
  columns: string[];
  rows: { label: string; cells: ComparisonCell[] }[];
};

export const whyMeContent = {
  seo: {
    title: "Why Hire an MVP & AI Developer in India",
    description:
      "Why founders hire me over an agency, freelancer or in-house hire: direct access, lean MVP scope, and design, AI and DevOps in one person.",
  },

  hero: {
    eyebrow: "Why me",
    title: "Why build with Arshdeep Singh",
    highlight: "Arshdeep Singh",
    subtitle: "MVP-focused engineering, design, AI and DevOps for startups and growing businesses.",
  },

  intro: {
    title: "Your technical partner from idea to scale",
    highlight: "from idea to scale",
    paragraphs: [
      "Working with me means working with one engineer who stays with your product from the first sketch to real users and beyond. I help you decide what to build, design how it works, write the code, set up the cloud and measure what happens after launch. You always talk to the person doing the work, and you see progress every week rather than at the end.",
      "It suits founders looking for an MVP developer in India they can trust with the whole product, small businesses going digital for the first time, and teams that need extra hands on AI or DevOps. If you want to hire a full-stack developer in [CITY], or an AI developer for your startup, without the overhead of an agency, this is how I work.",
    ],
    cta: { label: "Book a free consultation", href: "/contact" },
    commitmentsLabel: "My commitments to every client",
    commitments: [
      { value: "1 business day", label: "Reply time", icon: "Clock" },
      { value: "Weekly", label: "Demo builds", icon: "MonitorPlay" },
      { value: "100%", label: "Code and IP ownership", icon: "KeyRound" },
      { value: "[30] days", label: "Post-launch bug-fix window", icon: "Wrench" },
    ] satisfies { value: string; label: string; icon: IconName }[],
  },

  different: {
    title: "What makes this different",
    highlight: "different",
    paragraphs: [
      "Most first versions are too big. I help you cut the idea down to the smallest product that can prove it works, then build that slice properly — clean architecture, tests and automated deployments — so the second version builds on the first instead of replacing it.",
      "And because product thinking, design, AI and DevOps sit with one person, decisions take hours rather than meetings. The engineer who designs your onboarding also knows what it costs to host, which model your chatbot should use and how the release pipeline works, so trade-offs are made with the whole picture in view.",
    ],
  },

  benefits: {
    title: "What that means for your product",
    highlight: "your product",
    items: [
      {
        icon: "Rocket",
        title: "Rapid validation",
        text: "A focused first release reaches real users in weeks. You learn what people actually do, not just what they say in surveys.",
      },
      {
        icon: "Wallet",
        title: "Cost efficiency",
        text: "Lean scope means you only pay to build the features that test your idea. Everything else waits until users ask for it, so budget isn't spent on guesses.",
      },
      {
        icon: "MessagesSquare",
        title: "Better feedback from clean UX",
        text: "When the interface is clear, users can focus on whether the product solves their problem. The feedback you collect is about value, not about confusing buttons.",
      },
      {
        icon: "BadgeCheck",
        title: "Investor confidence",
        text: "A working product with real usage tells a stronger story than a slide deck. It shows you can execute, and investors can try it for themselves.",
      },
      {
        icon: "ShieldCheck",
        title: "Lower risk",
        text: "Each sprint tests an assumption before you commit more money to it. If something isn't working, you find out early, while changing course is still cheap.",
      },
    ] satisfies { icon: IconName; title: string; text: string }[],
  },

  comparison: {
    title: "How it compares",
    highlight: "compares",
    intro:
      "Every option has its place, and plenty of great products are built each way. Here's a fair comparison to help you choose.",
    caption:
      "Working with me compared with a typical agency, a marketplace freelancer and an in-house hire",
    note: "These are general patterns, not rules — individual agencies, freelancers and hires vary.",
    columns: ["Working with me", "Typical agency", "Marketplace freelancer", "In-house hire"],
    rows: [
      {
        label: "Time to start",
        cells: [
          { status: "yes", text: "Soon after the scope is agreed" },
          { status: "partial", text: "After proposals, contracts and team allocation" },
          { status: "yes", text: "Often quick to start" },
          { status: "no", text: "After recruiting, interviews and notice periods" },
        ],
      },
      {
        label: "Who you talk to",
        cells: [
          { status: "yes", text: "Directly with the engineer building it" },
          { status: "partial", text: "Usually through an account or project manager" },
          { status: "yes", text: "Directly with the freelancer" },
          { status: "yes", text: "Directly with your employee" },
        ],
      },
      {
        label: "Covers UX + full stack + AI + DevOps",
        cells: [
          { status: "yes", text: "All four, from one person" },
          { status: "yes", text: "Yes, across several specialists" },
          { status: "partial", text: "Often one specialism; the rest sourced separately" },
          { status: "partial", text: "Depends on who you hire; rarely all four in one person" },
        ],
      },
      {
        label: "Cost structure",
        cells: [
          { status: "yes", text: "Fixed scope, monthly retainer or hourly" },
          { status: "partial", text: "Project fees that include team and overheads" },
          { status: "partial", text: "Hourly or fixed; varies widely" },
          { status: "partial", text: "Ongoing salary, benefits and hiring costs" },
        ],
      },
      {
        label: "Code and IP ownership",
        cells: [
          { status: "yes", text: "Yours from day one, in your repository" },
          { status: "partial", text: "Usually transferred at the end — check the contract" },
          { status: "partial", text: "Depends on the contract and platform terms" },
          { status: "yes", text: "Owned by your company" },
        ],
      },
      {
        label: "Post-launch support",
        cells: [
          { status: "yes", text: "Bug-fix window, then a retainer or on-demand hours" },
          { status: "yes", text: "Usually available under a support contract" },
          { status: "partial", text: "Depends on their availability" },
          { status: "yes", text: "Ongoing, as part of their role" },
        ],
      },
      {
        label: "Accountability",
        cells: [
          { status: "yes", text: "One person accountable end to end" },
          { status: "partial", text: "Shared across a team and its processes" },
          { status: "partial", text: "Clear for their part; gaps between freelancers" },
          { status: "yes", text: "Clear, and managed by you" },
        ],
      },
    ],
  } satisfies ComparisonData & { title: string; highlight: string },

  differentiators: {
    title: "Core differentiators",
    highlight: "differentiators",
    items: [
      {
        label: "Startup ecosystem",
        icon: "Compass",
        title: "Startup-ecosystem understanding",
        text: "I plan around the realities of early-stage companies: tight runway, shifting priorities and investors who want to see traction.",
      },
      {
        label: "MVP-first",
        icon: "Zap",
        title: "MVP-first agile process",
        text: "Short sprints, a working build every week and a backlog ordered by what proves the idea. Scope changes are expected and discussed openly.",
      },
      {
        label: "Design-led",
        icon: "Palette",
        title: "Design-led development",
        text: "Flows and screens are designed before they're built, so development follows a clear plan and the product looks credible from day one.",
      },
      {
        label: "One roof",
        icon: "Layers",
        title: "Full stack + AI + DevOps under one roof",
        text: "Frontend, backend, AI features and cloud infrastructure come from one engineer, so nothing falls between separate vendors.",
      },
      {
        label: "Growth",
        icon: "TrendingUp",
        title: "Growth partnership",
        text: "Analytics, funnels and go-to-market are part of the conversation, because a product only succeeds if people find it and stay.",
      },
      {
        label: "Transparent",
        icon: "Eye",
        title: "Transparent collaboration",
        text: "A shared board, weekly demos and written updates mean you always know what's done, what's next and what's at risk.",
      },
    ] satisfies { label: string; icon: IconName; title: string; text: string }[],
  },

  fit: {
    forTitle: "Who this is for",
    forItems: [
      "Founders validating an idea with a first product",
      "Small and medium businesses going digital",
      "Teams that need an AI or DevOps boost",
      "Agencies that need a white-label engineer",
    ],
    notForTitle: "Who it isn't for",
    notForItems: [
      "Projects that need a 20-person team on day one",
      "“Clone this app exactly” requests",
      "Projects with no decision-maker on the client side",
    ],
    notForNote: "If that's you, I'm happy to point you towards a better fit.",
  },

  technology: {
    title: "The tools I use",
    highlight: "tools",
    subtitle: "A practical, proven stack — chosen per project, not by habit.",
  },

  process: {
    id: "process",
    title: "How we'll work together",
    highlight: "work together",
    subtitle: "The same six steps on every project, scaled to its size.",
  },

  deliverables: {
    id: "deliverables",
    title: "What you walk away with",
    highlight: "walk away with",
    subtitle: "Clear deliverables that leave you in full control of your product.",
    /** Shown on this page only, after the shared deliverables. */
    extra: [
      {
        title: "Test reports",
        tag: "QA",
        text: "Evidence that the product works before it reaches your users.",
        points: ["Automated test results for each release", "Manual QA checklist for key flows"],
      },
    ] satisfies Deliverable[],
  },

  faq: {
    id: "faq",
    title: "Questions about working together",
    highlight: "working together",
    items: [
      {
        q: "What should I look for in a tech partner?",
        a: "Look for someone who asks about your users and business before talking technology, explains trade-offs in plain language, shows working software early and often, and puts code ownership in writing. Ask how they communicate and report progress, and be wary of anyone who agrees to every feature without asking whether you need it yet.",
      },
      {
        q: "How does an MVP save me money?",
        a: "By spending only on what tests your idea. Instead of building every feature up front, you launch a focused version, learn from real users and invest in what they actually use. Features that turn out not to matter are never built, and the ones that do matter sit on a foundation you can extend rather than replace.",
      },
      {
        q: "Why does UI/UX matter even for an MVP?",
        a: "Because confusing design hides whether your idea works. If users can't find the main feature, you'll read their silence as lack of interest. A clean, simple interface keeps the feedback about your product's value, and it helps a small product look credible to early customers and investors. It doesn't need to be elaborate — just clear.",
      },
      {
        q: "Do you work with clients outside India and in other time zones?",
        a: "Yes. I'm set up to work with founders in India and abroad, entirely remotely. We agree a few hours of overlap each working day for calls, and everything else runs asynchronously through the shared board and written updates. Contracts, NDAs and invoicing work the same way for international clients.",
      },
      {
        q: "How do I get started?",
        a: "Book a free consultation or send a message through the contact form. We'll talk about your idea, users and timeline for about 30 minutes. Within a few days you'll get a written scope, timeline and quote. If it looks right, we sign an NDA and agreement, and kick off with a discovery session.",
      },
    ],
  },

  ctaBand: {
    title: "Let's see if we're a good fit — the first call is free.",
    highlight: "the first call is free",
  },
};

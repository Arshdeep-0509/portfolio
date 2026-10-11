import { bookingHref } from "@/lib/booking";

/**
 * Copy for /services and the shared parts of every /services/[slug] page.
 * Per-service content (intro, benefits, FAQs…) lives in services.ts.
 */

export const servicesPage = {
  seo: {
    title: "Services: MVP, Web & Mobile Apps, AI, DevOps — India",
    description:
      "Thirteen services from one engineer in India: MVP development, web and mobile apps, UI/UX, AI integration for startups, DevOps and growth marketing.",
  },

  hero: {
    title: "Thirteen ways I can help, one person doing the work",
    emphasis: "one person",
    text: "Product engineering, design, AI, cloud and growth — pick what you need today and add more as the product grows.",
    cta: { label: "Book a free call", href: bookingHref },
  },

  index: {
    id: "service-index",
    label: "Index",
    title: "Every service, like a table of contents",
    emphasis: "table of contents",
    intro: "Point at a service to see its summary, three deliverables and the usual timeline.",
    previewLabel: "Preview",
    deliverablesLabel: "You receive",
    timelineLabel: "Usual timeline",
    readMore: "Read more",
    hint: "Point at, or tab to, a service to preview it here.",
  },

  models: {
    id: "ways-to-work",
    label: "Ways to work together",
    title: "Three ways to engage, no prices hidden in fine print",
    emphasis: "three ways",
    intro: "Quotes follow the actual work, so nothing you don't need ends up on the bill.",
    includedLabel: "What's included",
    suitsLabel: "Who it suits",
    billingLabel: "How billing works",
    items: [
      {
        name: "Fixed-scope project",
        included:
          "A clearly defined build — scope, milestones and deliverables written down before work starts.",
        suits: "First versions, redesigns and well-understood features.",
        billing: "One agreed price, paid in milestones as each part is delivered.",
      },
      {
        name: "Monthly retainer",
        included: "A set amount of my time each month for new features, fixes, upkeep and advice.",
        suits: "Live products that keep changing, or teams needing steady AI or DevOps help.",
        billing: "A fixed monthly fee, reviewed together as priorities shift.",
      },
      {
        name: "Hourly advisory",
        included: "Focused sessions: architecture reviews, scoping, audits or a second opinion.",
        suits: "Founders and teams who need judgement more than hands on the keyboard.",
        billing: "Billed by the hour, agreed in advance, with a short written summary after.",
      },
    ],
  },

  bundles: {
    id: "combinations",
    label: "Popular combinations",
    title: "Services that are often booked together",
    emphasis: "booked together",
    intro:
      "Each bundle pre-fills the contact form, so you can start the conversation in one click.",
    ask: "Ask about this bundle",
    items: [
      {
        id: "launch-kit",
        name: "Launch kit",
        text: "From research to a live first version, with the release pipeline already in place.",
        services: ["ux-design", "ui-design", "mvp-development", "devops-cloud"],
      },
      {
        id: "ai-upgrade",
        name: "AI upgrade",
        text: "Add a dependable AI feature to a product that already exists, and run it properly.",
        services: ["ai-integration", "backend-development", "devops-cloud"],
      },
      {
        id: "growth-engine",
        name: "Growth engine",
        text: "Get found, test what converts and keep fresh creative flowing into your campaigns.",
        services: ["digital-marketing", "growth-marketing", "ai-creative"],
      },
    ],
  },

  faq: {
    id: "faq",
    label: "Questions",
    title: "Before you choose a service",
    emphasis: "choose a service",
    items: [
      {
        q: "Can I combine several services?",
        a: "Yes, and most projects do. Because one person covers design, code, AI, cloud and growth, combining them means fewer hand-offs rather than more coordination. The bundles above are common starting points, but any mix works.",
      },
      {
        q: "Do you publish fixed packages?",
        a: "Not for now. Each job is priced from its real scope; ready-made packages for common builds might appear later. Telling me a rough budget lets me propose the right size of engagement.",
      },
      {
        q: "What if I don't know which service I need?",
        a: "That's normal. Use the three-question picker on the home page, or book the free call — we'll work out the simplest place to begin, and you'll leave with next steps whether or not we work together.",
      },
      {
        q: "Do you work with teams outside India?",
        a: "Yes, entirely online. We pick a few shared hours each working day for calls and handle everything else in writing on a project board. Overseas clients sign the same contracts and NDAs and are invoiced the same way.",
      },
    ],
  },
};

/** Shared by every /services/[slug] page. */
export const serviceDetailCopy = {
  chapters: {
    overview: "Overview",
    useCases: "Example uses",
    benefits: "What you gain",
    whyMe: "Why me",
    process: "How it runs",
    deliverables: "What you receive",
    tech: "Tools",
    faq: "Questions",
  },
  contents: "Contents",
  quickFacts: {
    title: "Quick facts",
    timeline: "Typical timeline",
    models: "Engagement options",
    modelsValue: "Fixed project, monthly retainer or hourly advice",
    idealFor: "Ideal for",
    timelineFallback: "[TYPICAL_TIMELINE]",
  },
  discuss: "Discuss this service",
  whatsapp: "WhatsApp me",
  pairsWith: "Pairs well with",
};

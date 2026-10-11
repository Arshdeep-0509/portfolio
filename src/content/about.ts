import type { IconName } from "@/content/services";

/**
 * Copy for /about.
 * Everything in [SQUARE_BRACKETS] must be replaced by the owner with real facts before launch —
 * the page marks these placeholders so nothing invented goes live by accident.
 */

export const aboutContent = {
  seo: {
    title: "Meet a Full-Stack Developer Based in Bengaluru, India",
    description:
      "Arshdeep Singh is a full-stack developer in Bengaluru, India, and an AI and DevOps engineer who helps founders turn ideas into dependable products.",
  },

  opening: {
    label: "About",
    title: "Arsh means sky. Deep means lamp.",
    // Shown beside the headline until the owner confirms the reading of the name.
    titleNote: "[CONFIRM NAME MEANING]",
    text: "It's a fair description of the job: a steady light that keeps a product moving from first idea to first users.",
    lead: "Founders and growing companies get me in person across design, code and hosting — along with the true answer, even when it isn't the handy one.",
    cta: { label: "Book a free call" },
    cv: { label: "Download my CV", href: "/cv/arshdeep-singh.pdf" },
    photoAlt: "Arshdeep Singh, photographed for this page",
    availability: {
      available: "Available for new projects",
      limited: "Limited availability",
      booked: "Booked for now",
    },
  },

  values: {
    id: "values",
    label: "Values",
    title: "Five things I hold to",
    lines: [
      {
        word: "Ownership.",
        text: "Your product gets treated like mine; if it breaks at launch, it's my problem too.",
      },
      {
        word: "Clarity.",
        text: "Readable code, uncluttered design and straightforward updates — you're never left wondering.",
      },
      {
        word: "Pace with care.",
        text: "Automated checks and careful review are what let me go quickly without skipping steps.",
      },
      {
        word: "Honesty.",
        text: "Dates I can keep, trade-offs out in the open and bad news shared early.",
      },
      {
        word: "The long view.",
        text: "Decisions serve the product two years from now as much as the demo next Friday.",
      },
    ],
  },

  toolbox: {
    id: "toolbox",
    label: "Toolbox",
    title: "Four kinds of skill, in one pair of hands",
    emphasis: "one pair of hands",
    pillars: [
      {
        icon: "Route",
        title: "Product and UX judgement",
        text: "Narrowing an ambitious idea to a first release that makes sense to users.",
        skills: ["Discovery workshops", "User flows", "Wireframes & prototypes", "MVP scoping"],
      },
      {
        icon: "Layers",
        title: "Engineering across the stack",
        text: "Interfaces, APIs and databases built together, tested from day one.",
        skills: ["Node.js", "Python", "React", "Next.js"],
      },
      {
        icon: "Bot",
        title: "AI engineering",
        text: "Useful AI, with its accuracy tested, its behaviour logged and its bill kept low.",
        skills: ["LLM APIs", "RAG", "Agents", "Evaluation"],
      },
      {
        icon: "Cloud",
        title: "DevOps & cloud",
        text: "Self-running, well-instrumented hosting that makes each release a non-event.",
        skills: ["Docker", "Kubernetes", "CI/CD", "AWS / GCP"],
      },
    ] satisfies { icon: IconName; title: string; text: string; skills: string[] }[],
  },

  rhythm: {
    id: "rhythm",
    label: "Working rhythm",
    title: "A typical week on your project",
    emphasis: "typical week",
    week: [
      { day: "Mon", title: "Plan", text: "We agree the week's goals on the shared board." },
      { day: "Daily", title: "Async update", text: "A short written note every working day." },
      { day: "Fri", title: "Demo", text: "A build you can open, click and share." },
    ],
    tools: [
      { label: "Board", tools: "Notion, Jira or Trello" },
      { label: "Chat", tools: "Slack or WhatsApp" },
      { label: "Calls", tools: "Google Meet or Zoom" },
      { label: "Code", tools: "GitHub" },
      { label: "Design", tools: "Figma" },
    ],
    note: "If your team has favourite tools, those are the ones we'll use.",
  },

  faq: {
    id: "faq",
    label: "Questions",
    title: "Things people ask me",
    emphasis: "ask me",
    items: [
      {
        q: "Is it just you, or a team?",
        a: "I do the central work myself — the architecture, the code and the reasoning behind both — and you always talk to me. If a job needs more hands or a niche skill, like illustration or another developer, I call on people I trust, and you're told in advance who they are and what they'll handle.",
      },
      {
        q: "Is it only startups?",
        a: "Not only startups, though they're a natural match. Smaller and mid-sized firms going online, agencies needing an engineer under their own name, and mature teams after AI or DevOps support all work well. What counts is a clear aim and a decision-maker on your side.",
      },
      {
        q: "What happens once the MVP is delivered?",
        a: "Code, documentation and accounts are handed to you, and bugs are fixed free for a set window after launch. Then we go through the numbers and choose: more features, performance and scaling, or a breather while feedback builds up. Further help is there monthly or hourly, and you're never tied in.",
      },
      {
        q: "Who owns the code and IP?",
        a: "You do. An NDA and IP assignment are signed before work begins, the code lives in a repository you own, and design files, docs and cloud accounts are in your name. Another developer or in-house team could take over with everything they need.",
      },
      {
        q: "Is the first conversation free?",
        a: "It is, and there's nothing to sign. We cover the idea, the audience and the timing, and a written scope with a price follows. If someone else would serve you better, I'll tell you — and point you to them where I can.",
      },
      {
        q: "Can you work across time zones?",
        a: "My working day is IST, convenient for clients across India. With Europe, the Gulf, Australia or the Americas we fix a few shared hours for calls and keep the rest in writing on our project board.",
      },
    ],
  },
};

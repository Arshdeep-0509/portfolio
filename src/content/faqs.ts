/** General FAQs, shown on Home (service-specific FAQs live on each service in services.ts). */

export type FaqCategory = "general" | "pricing" | "process" | "support";

export type Faq = { q: string; a: string; category: FaqCategory };

export const faqs: Faq[] = [
  {
    category: "general",
    q: "Why start with an MVP at all?",
    a: "An MVP — minimum viable product — is the smallest version of your product that real people can use and pay for. Instead of a year spent building everything you can imagine, you release the core in weeks, watch what people actually do, and put money into what works. It protects your budget, gives investors something concrete to try, and replaces guesses about your market with evidence before the bigger build.",
  },
  {
    category: "process",
    q: "How long would my MVP take with you?",
    a: "Most land between 6 and 12 weeks. A browser app with a handful of key journeys is at the quicker end; money handling, a phone app, AI or many kinds of user push it out. Lighter jobs — a waitlist page or an in-house tool — can take less. Our first call is followed by a dated milestone plan, so each delivery has a date.",
  },
  {
    category: "general",
    q: "Can you take it beyond the MVP?",
    a: "Yes. The first version uses the same architecture the full product will — clean code, tests and a proper release pipeline — so growing it is the next step, not a rewrite. With real usage data in hand we plan the next releases together, putting first what users ask for and what moves your numbers. If you later hire your own team, I can help them settle in and hand over cleanly.",
  },
  {
    category: "general",
    q: "Do I own the code and the IP?",
    a: "Entirely. An NDA and an IP assignment are signed before any work starts, the code sits in a private repository that is transferred to you, and the design files, documentation and cloud accounts are yours. Nothing ties you to me: another developer or an in-house team can pick it up with everything they need.",
  },
  {
    category: "general",
    q: "I'm not technical. Does that matter?",
    a: "Not in the least — few of the founders I work with are. Your expertise is customers and market; mine is the technology, explained without jargon. A working build reaches you every week or two, so progress is something you click, not something you decode. Where a genuine choice exists — spend versus speed, this feature versus that — I lay out the paths and say which I'd take.",
  },
  {
    category: "pricing",
    q: "How do we begin, and how is the price set?",
    a: "It opens with a free conversation about the idea, the users and what you want to achieve. A few days later you have a written scope, a schedule and a price: fixed for a well-defined build, or staged by milestone when the work will change shape. Once you're comfortable, an NDA and contract are signed and we begin. Payment is only ever for agreed work, and the cost of the next milestone is always known.",
  },
];

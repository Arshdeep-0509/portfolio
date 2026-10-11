/** General FAQs (service-specific FAQs live on each service in services.ts). */

export type FaqCategory = "general" | "pricing" | "process" | "support";

export type Faq = { q: string; a: string; category: FaqCategory };

export const faqs: Faq[] = [
  {
    category: "general",
    q: "What is an MVP, and why should I start with one?",
    a: "An MVP — minimum viable product — is the smallest version of your product that real users can use and pay for. Instead of spending a year building everything you imagine, you launch the core in weeks, see what people actually do with it, and invest in what works. It protects your budget, gives investors something real to look at, and turns guesses about your market into evidence before you commit to the bigger build.",
  },
  {
    category: "process",
    q: "How long does it take to build an MVP with you?",
    a: "Typically 6–12 weeks, depending on scope. A focused web app with a handful of core flows sits at the shorter end; products with payments, mobile apps, AI features or several user roles take longer. Simpler builds, like a landing page with a waitlist or an internal tool, can be faster. After the discovery call I give you a milestone plan with dates, so you know exactly what ships when.",
  },
  {
    category: "general",
    q: "Can you build the full product after the MVP?",
    a: "Yes. The MVP is built on the same architecture the full product will use — clean code, tests and a proper deployment pipeline — so growing it is a next step rather than a rewrite. Once you have real usage data, we plan the next releases together, prioritising what users ask for and what moves your numbers. If you later hire an in-house team, I can help onboard them and hand over cleanly.",
  },
  {
    category: "general",
    q: "Will I own the code and intellectual property?",
    a: "Yes, completely. We sign an NDA and an IP assignment before any work begins, the code lives in a private repository that is transferred to you, and you own the design files, documentation and cloud accounts. There is no lock-in: if you ever want another developer or an internal team to take over, they will have everything they need to continue without me.",
  },
  {
    category: "general",
    q: "I'm not technical — is that a problem?",
    a: "Not at all — most founders I work with aren't. You bring the knowledge of your customers and your market; I handle the technical decisions and explain them in plain English. You'll see working software every week or two, so you never have to judge progress from jargon. When there's a real trade-off — cost against speed, or one feature against another — I lay out the options and recommend one.",
  },
  {
    category: "pricing",
    q: "How do we start, and how is pricing decided?",
    a: "It starts with a free discovery call about your idea, users and goals. Within a few days you receive a written scope, a timeline and a quote — either a fixed price for a clearly defined build or milestone-based pricing for work that will evolve. Once you're happy, we sign an NDA and agreement, and kickoff follows. You only pay for scoped work, and you always know what the next milestone costs.",
  },
];

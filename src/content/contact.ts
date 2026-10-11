import type { IconName } from "@/content/services";

/**
 * Copy for /contact. Business facts (email, phone, city, hours, Calendly link) come from
 * siteConfig in site.ts; form option lists live in src/lib/schemas/contact.ts.
 */

export type ContactContent = {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    titleLines: [string, string];
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    illustration: { src: string; alt: string; width: number; height: number };
    floatingCards: { icon: IconName; label: string }[];
  };
  intro: {
    eyebrow: string;
    title: string;
    highlight: string;
    text: string;
    bullets: string[];
    after: { title: string; steps: string[]; footer: string };
  };
  whyNow: {
    title: string;
    highlight: string;
    items: { icon: IconName; title: string; text: string }[];
  };
  faq: {
    id: string;
    title: string;
    highlight: string;
    subtitle: string;
    items: { label: string; icon: IconName; q: string; a: string }[];
  };
  details: {
    title: string;
    responseNote: string;
    labels: { email: string; phone: string; location: string; hours: string };
  };
  call: { title: string; text: string; cta: string; fallback: string; modalTitle: string };
  tips: { title: string; items: string[] };
  form: {
    id: string;
    title: string;
    subtitle: string;
    detailsHeading: string;
    projectHeading: string;
    messagePlaceholder: string;
    submit: string;
    success: { title: string; text: string; book: string; home: string };
    errorToast: { title: string; fallback: string };
  };
  map: { title: string; show: string; note: string };
};

export const contactContent: ContactContent = {
  seo: {
    title: "Contact — Start Your Project",
    description:
      "Tell me about your MVP, web or mobile app, AI feature or DevOps project. Talk directly to the engineer who'll build it — reply within one business day.",
  },
  hero: {
    eyebrow: "Contact · Projects & consultations",
    titleLines: ["Let's build your", "launch-ready product together"],
    subtitle: "Share your idea, stage and goals — I'll help you plan, design and ship it.",
    primaryCta: { label: "Start a project conversation", href: "#contact-form" },
    secondaryCta: { label: "Read the FAQ", href: "#contact-faq" },
    illustration: {
      src: "contact-illustration.svg",
      alt: "Illustration of a chat conversation, an envelope with a paper plane and a booked call in a calendar",
      width: 560,
      height: 480,
    },
    floatingCards: [
      { icon: "MessageCircle", label: "Reply within 1 business day" },
      { icon: "ShieldCheck", label: "NDA on request" },
    ],
  },
  intro: {
    eyebrow: "For founders & growing businesses",
    title: "Talk directly to the engineer who will build your product — not a sales team.",
    highlight: "the engineer who will build your product",
    text: "When you reach out, you're talking to me — the person who'll scope, design and write the code. No account managers, no hand-offs, no sales scripts. Tell me what you're trying to achieve, even if it's rough, and I'll help you figure out the simplest way to get there.",
    bullets: [
      "Ideal for MVPs, redesigns, new apps, AI features or rescue projects",
      "Plain-English, founder-first communication",
      "Clear scope, budget and timeline before any work starts",
    ],
    after: {
      title: "What happens after you reach out?",
      steps: [
        "I review your message the same or next business day.",
        "You get an email or WhatsApp with a few questions or a call link.",
        "We have a 30–45 minute discovery call.",
        "You receive a written plan: scope, timeline and estimate.",
      ],
      footer: "No pressure, no spam — you decide when to move forward.",
    },
  },
  whyNow: {
    title: "Why reach out now?",
    highlight: "now?",
    items: [
      {
        icon: "Gift",
        title: "Free, no-obligation advice",
        text: "The first conversation is free. You'll leave with honest advice on scope, stack and next steps — even if we don't end up working together.",
      },
      {
        icon: "Scale",
        title: "A lean plan sized to your budget",
        text: "I'll suggest what to build first, what to leave for later and where to save money, so your budget goes into what matters.",
      },
      {
        icon: "ShieldCheck",
        title: "NDA on request, confidential by default",
        text: "Your idea stays yours. I'll happily sign an NDA before you share details, and I treat every conversation as confidential either way.",
      },
    ],
  },
  faq: {
    id: "contact-faq",
    title: "Before you reach out",
    highlight: "reach out",
    subtitle: "Quick answers to the questions founders ask most before getting in touch.",
    items: [
      {
        label: "First steps",
        icon: "Footprints",
        q: "How do I start a project?",
        a: "Send the form below or message me on WhatsApp with a few lines about your idea. I'll reply within one business day with questions or a call link. After a short discovery call, you get a written plan with scope, timeline and estimate.",
      },
      {
        label: "Timelines",
        icon: "CalendarClock",
        q: "How long does an MVP take?",
        a: "Typically 6–12 weeks, depending on scope. A focused web app with a few core flows is at the shorter end; payments, mobile apps, AI features or several user roles take longer. You'll get a milestone plan with dates after the discovery call.",
      },
      {
        label: "Pricing",
        icon: "Wallet",
        q: "Do you have fixed packages?",
        a: "Not yet — every project gets a quote based on its actual scope, so you only pay for what you need. Starter packages for common builds may be added later. Sharing a rough budget range helps me suggest the right plan.",
      },
      {
        label: "Non-technical?",
        icon: "HeartHandshake",
        q: "I'm not technical — is that okay?",
        a: "Absolutely. Most founders I talk to aren't. I explain options in plain English, make the technical decisions with you rather than for you, and keep you updated with demos you can click through, not jargon.",
      },
    ],
  },
  details: {
    title: "Contact details",
    responseNote: "I usually reply within one business day.",
    labels: {
      email: "Email",
      phone: "Phone & WhatsApp",
      location: "Location",
      hours: "Business hours",
    },
  },
  call: {
    title: "Prefer a call?",
    text: "Pick a time that suits you for a free 30-minute call. We'll talk through your idea and next steps.",
    cta: "Book a 30-min call",
    fallback:
      "Online booking isn't set up yet — mention a good time in your message and I'll send a call link.",
    modalTitle: "Book a 30-minute call",
  },
  tips: {
    title: "Tips for a great first message",
    items: [
      "Your idea in 2–3 lines",
      "Who your users are",
      "Your rough timeline",
      "Reference apps or competitors",
      "A budget range, if you have one",
    ],
  },
  form: {
    id: "contact-form",
    title: "Tell me about your project",
    subtitle: "Takes about two minutes. Fields marked * are required.",
    detailsHeading: "Your details",
    projectHeading: "Your project",
    messagePlaceholder:
      "e.g. I run a chain of 3 coaching centres and want an app where students book classes and parents see attendance. We have a Figma draft and would like to launch before June.",
    submit: "Send message",
    success: {
      title: "Thanks, {firstName}! I'll reply within one business day.",
      text: "A confirmation with a copy of your message is on its way to your inbox. If it's not there in a few minutes, check your spam folder.",
      book: "Book a call now",
      home: "Back to home",
    },
    errorToast: {
      title: "Your message couldn't be sent",
      fallback: "Email me directly",
    },
  },
  map: {
    title: "Where I'm based",
    show: "Show map",
    note: "Loads Google Maps. I work remotely with clients everywhere.",
  },
};

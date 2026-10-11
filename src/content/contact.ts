/**
 * Copy for /contact. Business facts (email, phone, city, Calendly link) come from
 * siteConfig in site.ts; form option lists live in src/lib/schemas/contact.ts.
 */

export const contactContent = {
  seo: {
    title: "Contact — Book a Free Call About Your Project",
    description:
      "Describe your MVP, web or phone app, AI feature or DevOps job and speak straight to the engineer who'll build it. Replies come within one business day.",
  },
  intro: {
    label: "Contact",
    title: "Tell me where the idea is today, and where you want it to go",
    emphasis: "where you want it to go",
    text: "You'll be talking to me — the person who scopes, designs and writes the code. No sales team in between.",
    methodsLabel: "Reach me directly",
    methods: { email: "Email", whatsapp: "WhatsApp", book: "Book a free call" },
    detailsLabel: "Details",
    labels: { phone: "Phone", location: "Based in" },
    nextTitle: "What happens next",
    next: [
      "I read your message the same or the next business day.",
      "An email or WhatsApp follows, with a few questions or a link to talk.",
      "We talk for 30–45 minutes about the idea and your users.",
      "A written plan arrives, covering scope, timeline and estimate.",
    ],
    promise: "A reply within one business day. No pressure, no newsletters you didn't ask for.",
  },
  form: {
    id: "contact-form",
    ariaLabel: "Project enquiry",
    steps: {
      need: {
        title: "What do you need?",
        description:
          "Pick everything that applies. The first one you choose leads the conversation.",
      },
      project: {
        title: "About the project",
        description: "Rough answers are fine — they help me prepare.",
      },
      you: { title: "About you", description: "So I know who I'm writing back to." },
    },
    budget: "Budget range",
    currency: "Currency",
    timeline: "Timeline",
    noAnswer: "Undecided",
    message: "Your message",
    messagePlaceholder:
      "For example: Three tuition centres; students should reserve sessions in an app and parents should see who turned up. There's a rough Figma file and we'd like to go live by June.",
    tipsTitle: "A good first message usually covers",
    tips: [
      "the idea in 2–3 lines",
      "who the users are",
      "your timeline",
      "apps you admire, or rivals",
    ],
    counter: {
      need: "{n} more characters, please (at least {min})",
      ok: "That's plenty to start with",
    },
    nda: {
      label: "I'd like an NDA before sharing details",
      description: "I'll send one over first.",
    },
    name: "Full name",
    email: "Email",
    phone: "Phone",
    countryCode: "Country code",
    company: "Company or organisation",
    optional: "Optional",
    heardFrom: "How did you find me?",
    consentBefore: "I accept the",
    consentLink: "Privacy Policy",
    reviewTitle: "Your answers",
    review: {
      services: "Services",
      budget: "Budget",
      timeline: "Timeline",
      nda: "NDA first",
      yes: "Yes",
      no: "No",
    },
    alsoInterested: "Also interested in",
    submit: "Send it over",
    sending: "Sending…",
    reassurance: ["Free advice, no obligation", "A plan sized to your budget", "NDA on request"],
    servicesError: "Pick at least one option to continue.",
    botCheck: "Finish the quick human check above the button first.",
    success: {
      title: "Thank you, {firstName}. Your message is with me.",
      text: "A copy is on its way to your inbox, and you'll hear from me within one business day. If it doesn't arrive, check the spam folder.",
      book: "Pick a time to talk",
      home: "Back to the home page",
    },
    errorToast: {
      title: "Your message didn't go through",
      fallback: "Write to me by email instead",
      offline: "Check your connection, then try again.",
      retry: "Try again in a moment.",
    },
    fixFields: "{n} field(s) need another look before sending.",
  },
  faq: {
    id: "contact-faq",
    label: "Before you write",
    items: [
      {
        q: "How do I get a project started?",
        a: "Fill in the form, or WhatsApp me a few lines on the idea. Within a business day you'll get questions or a link to talk; a brief discovery call then leads to a written plan covering scope, timing and cost.",
      },
      {
        q: "How long does an MVP usually take?",
        a: "Usually 6–12 weeks, depending on scope. A web app with a few core flows lands near the short end; payments, mobile apps, AI features or several user roles take longer. You get a dated milestone plan after the discovery call.",
      },
      {
        q: "Are there fixed packages?",
        a: "Not at present: every quote reflects the real scope, so nothing you don't need is included. Set packages for frequent builds might follow. A ballpark budget helps me shape the right proposal.",
      },
      {
        q: "I'm not technical. Is that all right?",
        a: "Completely. Most founders I speak with aren't. I explain options in everyday language, make technical decisions with you rather than for you, and show progress with demos you can click — not jargon.",
      },
    ],
  },
  calendly: { modalTitle: "Choose a 30-minute slot" },
};

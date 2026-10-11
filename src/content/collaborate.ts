/**
 * Collaborate (/collaborate, formerly /careers). Only list roles that genuinely exist and perks
 * that are genuinely offered — never invent team size, salaries, benefits or culture claims.
 *
 * To open a role: set `isOpen: true` and `datePosted`. Open roles appear as rows under their
 * audience tab, become options in the application form and are published as JobPosting
 * structured data. Closed roles appear nowhere on the page.
 */

export type RoleType = "Freelance" | "Contract" | "Internship" | "Full-time";

export type Audience = "freelancers" | "interns" | "partners";

export type Role = {
  /** Stable id: used in the form (?role=…) and in stored applications. */
  id: string;
  title: string;
  /** One or more engagement types, e.g. ["Internship", "Freelance"]. */
  type: RoleType[];
  /** Which audience tab lists the role. */
  audiences: Audience[];
  location: string;
  experience: string;
  skills: string[];
  summary: string;
  responsibilities: string[];
  requirements: string[];
  /** External application link (e.g. a job board). Default: the form on this page. */
  applyUrl?: string;
  isOpen: boolean;
  /** YYYY-MM-DD. Required for the role's JobPosting structured data once it is open. */
  datePosted?: string;
  /** YYYY-MM-DD. Optional closing date for structured data. */
  validThrough?: string;
};

export const roles: Role[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer (React / Next.js)",
    type: ["Freelance", "Contract"],
    audiences: ["freelancers"],
    location: "Remote, India",
    experience: "1–3 years",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Accessibility"],
    summary:
      "Turn client designs into fast, accessible screens for first versions and marketing pages, all the way to launch.",
    responsibilities: [
      "Build Figma screens as responsive, accessible components in React and Next.js",
      "Connect screens to APIs, forms and sign-in",
      "Watch speed closely: images, bundle weight and Core Web Vitals",
      "Open small, clearly described pull requests and act on review",
    ],
    requirements: [
      "Confident React and TypeScript, with examples to point to",
      "Comfort with Tailwind CSS or a similar utility-first approach",
      "You check your work on actual phones and with only a keyboard",
      "Clear written English",
    ],
    isOpen: false,
  },
  {
    id: "backend-developer",
    title: "Backend Developer (Node.js / Python)",
    type: ["Freelance", "Contract"],
    audiences: ["freelancers"],
    location: "Remote, India",
    experience: "1–3 years",
    skills: ["Node.js", "Python", "PostgreSQL", "REST APIs", "Docker"],
    summary:
      "Shape and build the APIs, data and third-party connections that client products run on.",
    responsibilities: [
      "Plan the tables and the REST or GraphQL endpoints",
      "Wire up log-in, permissions and payment or messaging providers",
      "Test what matters and keep migrations safe",
      "Write up each endpoint so screen and app work need not wait",
    ],
    requirements: [
      "Live systems you've shipped in Node.js (Express, NestJS) or Python (FastAPI, Django)",
      "A feel for SQL and for modelling data well",
      "The security fundamentals — checking input, guarding secrets, limiting access",
      "Happy building from a written brief and raising questions straight away",
    ],
    isOpen: false,
  },
  {
    id: "full-stack-developer",
    title: "Full-Stack Developer",
    type: ["Contract", "Full-time"],
    audiences: ["freelancers"],
    location: "Remote, India",
    experience: "2–4 years",
    skills: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    summary:
      "Own features across every layer — schema, API, screen and deployment — on MVPs and web apps.",
    responsibilities: [
      "Deliver features complete — data, endpoint and screen",
      "Estimate honestly and raise risks before they become delays",
      "Configure preview builds, automated checks and live deploys",
      "Help founders break loose ideas into small pieces that can go live",
    ],
    requirements: [
      "At least one full-stack product shipped that real people use",
      "Strong TypeScript on both frontend and backend",
      "Practical experience with Git branching, CI and one of the big clouds",
      "You spot problems yourself and either solve them or speak up",
    ],
    isOpen: false,
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    type: ["Internship", "Freelance"],
    audiences: ["interns", "freelancers"],
    location: "Remote, India",
    experience: "Student to 2 years",
    skills: ["Figma", "User flows", "Wireframing", "Design systems", "Prototyping"],
    summary:
      "Design journeys, rough layouts and polished screens for web and phone products. Interns and freelancers both welcome.",
    responsibilities: [
      "Work out user flows and sketch the main screens alongside the founder",
      "Design clean, consistent UI in Figma from a shared component library",
      "Build clickable prototypes for user tests and investor demos",
      "Deliver files engineers can implement with no guesswork",
    ],
    requirements: [
      "A portfolio that shows your process, not only final screens",
      "Fluent with auto layout, components and variants in Figma",
      "Accessibility basics: contrast, tap targets, states",
      "Happy to take feedback and try again quickly",
    ],
    isOpen: false,
  },
  {
    id: "project-coordinator",
    title: "Virtual Assistant / Project Coordinator",
    type: ["Freelance", "Contract"],
    audiences: ["freelancers"],
    location: "Remote, India",
    experience: "0–2 years",
    skills: ["Communication", "Scheduling", "Documentation", "Notion or Jira", "Google Workspace"],
    summary: "Keep work running smoothly — calendars, client updates, minutes and task boards.",
    responsibilities: [
      "Book calls and keep project boards current",
      "Take notes in meetings and draft each week's client update",
      "Keep an eye on invoices, deadlines and chasers",
      "Organise documents, credential handover lists and project folders",
    ],
    requirements: [
      "Very good written English and care over small details",
      "At ease in Google Workspace and a task tool like Notion, Jira or Trello",
      "Dependable availability during agreed IST hours",
      "You keep client information to yourself",
    ],
    isOpen: false,
  },
];

export const openRoles = roles.filter((role) => role.isOpen);

/** "General application" is always available in the form, even when no role is open. */
export const GENERAL_ROLE = { id: "general", title: "General application" } as const;

export const roleOptions = [
  ...openRoles.map((role) => ({ id: role.id, title: role.title })),
  GENERAL_ROLE,
];

/**
 * Only what is genuinely offered today. Add an entry ONLY once it truly exists —
 * nothing outside this list may appear on the page.
 */
export const benefits: { title: string; text: string }[] = [
  {
    title: "Work for actual clients",
    text: "Work that reaches real users — and, with the client's permission, belongs in your portfolio.",
  },
  {
    title: "Mentoring and code review",
    text: "Every pull request gets a careful review, and asking why is always welcome.",
  },
  {
    title: "Flexible hours, fully remote",
    text: "Anywhere in India works, as long as we share a few agreed hours for calls.",
  },
  {
    title: "Fair pay, on time",
    text: "A rate fixed in advance, per project or per month, settled on the agreed day.",
  },
  {
    title: "A reference you can use",
    text: "Strong work earns a recommendation from me, whether on LinkedIn, in writing or over the phone.",
  },
  {
    title: "A route to a longer role",
    text: "As the practice grows into a small studio, the first long-term roles go to people who've already worked well together.",
  },
  // Not offered today — add only when they genuinely exist:
  // { title: "Health insurance", text: "[DETAILS OF THE PLAN]" },
  // { title: "ESOPs", text: "[DETAILS OF THE ESOP POOL]" },
];

export const collaborateContent = {
  seo: {
    title: "Collaborate — Freelance, Internship & Partner Work",
    description:
      "Freelance, contract and internship work with Arshdeep Singh, plus partnerships for agencies: remote, project-based work on real MVPs, apps, AI and DevOps.",
  },
  hero: {
    label: "Collaborate",
    title: "Help ship real products for founders who care about them",
    emphasis: "real products",
    facts: ["remote", "India", "project-based", "mentorship"],
    factsLabel: "Key facts",
    cta: "Send an application",
  },
  audiences: {
    id: "audiences",
    label: "Who it's for",
    title: "Three routes into the work",
    emphasis: "routes into the work",
    tabsLabel: "Ways to collaborate",
    rolesLabel: "Open roles",
    noRoles:
      "Nothing open in this group right now. A general application still reaches me, and I keep it on file.",
    apply: "Apply",
    columns: { title: "Role", type: "Type", location: "Location" },
    groups: [
      {
        id: "freelancers" as Audience,
        label: "Freelancers & contractors",
        intro:
          "Project-based work on client builds: a clear slice of a product, written context on why it matters, and a review on every pull request. You talk directly with the person who makes the decisions.",
        points: [
          "Small, well-defined tasks",
          "Outcomes over hours online",
          "Honest feedback both ways",
        ],
        typical: [
          "Full-stack",
          "Frontend",
          "Backend",
          "Mobile",
          "QA",
          "DevOps",
          "Growth & content",
        ],
        typicalLabel: "Skills client work needs most often",
      },
      {
        id: "interns" as Audience,
        label: "Interns",
        intro:
          "Internships and small paid tasks, mostly in design and frontend. What you've built or designed — even personal or college projects — matters more than a degree.",
        points: [
          "Real work that ships",
          "Mentoring and reviews",
          "A reference once you've earned it",
        ],
        typical: ["UI/UX", "Frontend"],
        typicalLabel: "Where interns usually start",
      },
      {
        id: "partners" as Audience,
        label: "Agencies & partners",
        intro:
          "Agencies can bring me in as a white-label engineer for builds, AI features or DevOps, working under your brand with your clients. Send a general application or start a conversation with the details.",
        points: [
          "White-label engineering",
          "AI and DevOps support",
          "Clear scope before work begins",
        ],
        typical: ["MVPs", "Web apps", "AI integration", "DevOps"],
        typicalLabel: "What partners usually ask for",
      },
    ],
  },
  hiring: {
    id: "hiring",
    label: "The process",
    title: "Five steps from hello to first task",
    emphasis: "first task",
    note: "You'll hear back at each step, usually within a week.",
    steps: [
      { title: "Apply", text: "Fill in the form below and attach your resume and your best work." },
      {
        title: "Intro call",
        text: "Twenty easy-going minutes on you, the work and what we each expect.",
      },
      {
        title: "Walkthrough or task",
        text: "Walk me round some code of yours, or take on a short task — paid if it needs more than 2 hours.",
      },
      {
        title: "Final chat",
        text: "Scope, rates, availability and anything you still want to ask.",
      },
      {
        title: "Offer and start",
        text: "A written agreement, tool access and a first small task.",
      },
    ],
  },
  benefits: {
    id: "benefits",
    label: "What's on offer",
    title: "An honest list of what's on offer",
    emphasis: "honest list",
    note: "Anything missing from this list isn't available yet. It gets longer only when the practice can truly afford it.",
  },
  form: {
    id: "apply",
    label: "Apply",
    title: "Introduce yourself in three short steps",
    emphasis: "three short steps",
    intro:
      "About five minutes. I read every application myself, and you'll get a reply either way.",
    steps: {
      role: {
        title: "Role & links",
        description: "Who you are, what you'd like to do and where your work lives.",
      },
      experience: {
        title: "Experience & availability",
        description: "Roughly where you are and when you could begin.",
      },
      message: {
        title: "Resume, message & consent",
        description: "Your resume and a few lines on why this appeals to you.",
      },
    },
    labels: {
      name: "Full name",
      email: "Email",
      phone: "Phone",
      role: "Role",
      rolePlaceholder: "Pick a role",
      portfolio: "Portfolio or GitHub link",
      linkedin: "LinkedIn link",
      experience: "Experience",
      availability: "When could you start?",
      noAnswer: "Rather not say",
      resume: "Resume",
      resumeHelp: "PDF only, up to {mb} MB.",
      message: "Why does this work appeal to you?",
      messageHelp: "At least {min} characters — what draws you in, and what you'd bring.",
      consent: "and agree that my details may be kept for hiring purposes for up to 12 months.",
      consentBefore: "I accept the",
    },
    reviewTitle: "Before you send",
    submit: "Send it over",
    privacy: { label: "Privacy Policy", href: "/privacy-policy" },
    successTitle: "That's arrived — thank you.",
    successText: "You'll find a confirmation in your inbox shortly. From here:",
    nextSteps: [
      "I read each application myself, usually within a week.",
      "Where it looks promising, I'll email to arrange a 20-minute first chat.",
      "If the timing's wrong, you'll hear that from me, and I'll hold your details for up to 12 months should a role appear.",
    ],
    another: "Apply for something else",
    error: "Your application didn't go through. Please try again in a moment.",
    botCheck: "Finish the quick human check above the button first.",
  },
  faq: {
    id: "faq",
    label: "Questions",
    title: "Straight answers before you apply",
    emphasis: "before you apply",
    items: [
      {
        q: "What's working with you like?",
        a: "Steady, straightforward and largely in writing. Tasks arrive small and well-defined, with the reason behind them; every pull request is reviewed, and better ideas are welcome. A question early beats a guess every time.",
      },
      {
        q: "What kind of roles come up?",
        a: "Developers for screens, servers or both; UI/UX designers; and someone to coordinate projects — with mobile, testing, DevOps and growth work now and then, depending on what clients need. Current openings appear in the tabs above; for anything else, use a general application.",
      },
      {
        q: "Is it remote?",
        a: "Yes, entirely remote across India, with a few agreed IST overlap hours for calls. There may be the occasional optional meetup in Bengaluru.",
      },
      {
        q: "How does freelance pay work?",
        a: "In rupees, by bank transfer or UPI, either per milestone or monthly. The rate is put in writing before you start, and invoices are settled on the day we agreed.",
      },
      {
        q: "Do you take students or freshers?",
        a: "Yes — for internships and small paid tasks, mainly in design and frontend. Things you've made, even side or college projects, carry more weight than your degree.",
      },
      {
        q: "How long from applying to starting?",
        a: "Between one and three weeks in most cases, depending on the role and when you're free. Expect a reply at every stage, typically inside a week.",
      },
    ],
  },
};

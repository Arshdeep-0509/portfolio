import type { icons } from "lucide-react";
import { servicesPart2 } from "@/content/servicesPart2";

export type ServiceGroupId = "build" | "design" | "grow" | "ai-cloud";

export type ServiceGroup = {
  id: ServiceGroupId;
  label: string;
  description: string;
};

/** Any lucide-react icon name, e.g. "Rocket". Type-checked against the installed icon set. */
export type IconName = keyof typeof icons;

export type Service = {
  slug: string;
  group: ServiceGroupId;
  icon: IconName;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  intro: string[];
  benefits: { title: string; text: string }[];
  whyMe: { text: string; points: string[] };
  tech: string[];
  /** `duration` only where the figure is grounded elsewhere in this file; otherwise omitted. */
  process: { title: string; text: string; duration?: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  typicalTimeline: string;
  idealFor: string[];
  /** Slugs of related services. */
  related: string[];
  seo: { title: string; description: string };
  /** Optional example use cases, shown as an extra chapter (used by AI Integration). */
  useCases?: { icon: IconName; title: string; text: string }[];
};

/** Every service is complete; the alias remains for code written against the old stub type. */
export type ServiceEntry = Service;

export const serviceGroups: ServiceGroup[] = [
  {
    id: "build",
    label: "Build",
    description: "Products, apps and APIs, written to ship and to last.",
  },
  {
    id: "design",
    label: "Design",
    description: "Screens and flows people get right the first time.",
  },
  {
    id: "grow",
    label: "Grow",
    description: "Be found, turn visits into sign-ups, keep the people you win.",
  },
  {
    id: "ai-cloud",
    label: "AI & Cloud",
    description: "Useful AI and dependable infrastructure, sized to your stage.",
  },
];

const servicesPart1: Service[] = [
  // BUILD
  {
    slug: "mvp-development",
    group: "build",
    icon: "Rocket",
    title: "MVP Development",
    shortTitle: "MVP",
    tagline: "Put a real product in front of users within weeks and learn what works.",
    summary:
      "I scope and build lean first versions that test demand and give investors something to try — then carry on and build the full, final product on the same foundation, with no rebuild.",
    intro: [
      "A minimum viable product is the smallest slice of your idea that people can actually use, and ideally pay for. I help you find that slice, build it with care and get it to users quickly. Together we trim the idea down to the features that test your riskiest assumption, design clean screens for them, and ship something that feels finished, not a demo held together with tape.",
      "Early users in India often arrive on mid-range Android phones over shaky mobile data, so the first versions I build load fast and stay usable on slow connections. Founders abroad get the same benefit: a product that feels quick anywhere. Underneath, the code is organised, tested and written up, so when traction comes you build on it rather than starting over.",
      "The MVP doesn't have to be where we stop. Once the first version has proved itself, I build the complete product on top of it: the remaining features, admin tools, integrations, performance work and polish needed for a full launch. And if your scope is already settled, we can build the full product from the start.",
    ],
    benefits: [
      {
        title: "Users sooner",
        text: "Within weeks the heart of the product is public, and you're learning from behaviour instead of opinion.",
      },
      {
        title: "Money kept for what matters",
        text: "Budget goes to the few features that test demand, not to extras nobody has asked for.",
      },
      {
        title: "Evidence over guesswork",
        text: "Usage data shows what to push further and what to drop.",
      },
      {
        title: "Something investors can open",
        text: "A working product with real sign-ups tells a stronger story than a deck or a mock-up.",
      },
      {
        title: "Weekly changes without fear",
        text: "A clean structure and automated releases make small improvements routine.",
      },
    ],
    whyMe: {
      text: "Early-stage work suits me: decisions come quickly and each one counts. You get a single engineer who can scope, design, code and deploy, so nothing waits on a hand-off. I will argue against features that don't serve the first release, and I'll say so plainly when an idea is wrong for an MVP — even when building it would mean more billable hours.",
      points: [
        "A scoping session that turns a big plan into a first release",
        "A demo build every week that you can click through and share",
        "Automated tests, a release pipeline, monitoring and backups from sprint one",
        "Every repository, design file and cloud account is registered to you",
      ],
    },
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "FastAPI",
      "Flutter",
      "React Native",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "AWS",
      "GCP",
    ],
    process: [
      {
        title: "Unpack the idea",
        text: "We look at your users, the problem and the assumption most likely to be wrong, then agree what version one has to prove.",
      },
      {
        title: "Rough flows",
        text: "Low-detail sketches of the main journeys, shown to a few real users before any visual design.",
      },
      {
        title: "Screen design",
        text: "Finished screens and a small set of reusable components, so the product looks trustworthy from launch.",
      },
      {
        title: "Sprints with demos",
        text: "Short sprints, each closing with a build you can open on your own phone.",
        duration: "1–2 weeks per sprint",
      },
      {
        title: "Testing",
        text: "Hands-on and automated checks across devices, browsers and slow networks.",
      },
      {
        title: "Release with measurement",
        text: "Out in the cloud or on the stores, measuring usage and catching errors from visitor one.",
      },
      {
        title: "Learn and adjust",
        text: "We read the numbers together and plan the next changes around what people actually do.",
      },
    ],
    deliverables: [
      "A working first version, live for real users",
      "Flow sketches and finished screens in Figma",
      "The codebase, plus notes on setup and structure",
      "Hosting, domain and a release pipeline",
      "Usage measurement and crash reporting running",
      "A plan for the next release",
    ],
    faqs: [
      {
        q: "What counts as an MVP?",
        a: "It is the smallest version of your product that gives real value to a specific group of people. It isn't a slide deck or a clickable mock-up — people sign up and use it. Its job is to test the assumption you are least sure about with real behaviour, so the bigger investment rests on evidence instead of hope.",
      },
      {
        q: "How long will mine take?",
        a: "Usually 4–12 weeks. A web app with a few core flows lands near the short end; payments, several user roles, a mobile app or AI features push it longer. After our first call I send a milestone plan with dates, so you know what each sprint delivers and when users can try it.",
      },
      {
        q: "What sort of first versions do you build?",
        a: "Web apps, Android and iOS apps, admin dashboards, two-sided marketplaces, subscription SaaS and tools that replace manual work. If your idea mixes several — say a customer app and an operations panel — I'll suggest which half to build first so the release stays small enough to ship soon.",
      },
      {
        q: "Will it grow into the full product?",
        a: "That is the intention from the first commit. The stack, tests and release pipeline are the ones a mature product needs, so growth means adding features, not rewriting. When you hire your own team, the code and notes are clear enough for them to pick it up without drama.",
      },
    ],
    typicalTimeline: "4–12 weeks",
    idealFor: [
      "First-time founders, technical or not",
      "Startups getting ready to raise",
      "Companies trying out a new product line",
    ],
    related: ["full-stack-development", "ux-design", "mobile-applications"],
    seo: {
      title: "MVP Development in India — First Versions in Weeks",
      description:
        "MVP development in India for founders here and abroad: a lean, investor-friendly first version in 4–12 weeks, designed with care and built to keep growing.",
    },
  },
  {
    slug: "full-stack-development",
    group: "build",
    icon: "Layers",
    title: "Full-Stack Development",
    shortTitle: "Full-Stack",
    tagline: "Interface, APIs, database and hosting, handled by one engineer.",
    summary:
      "Web development across every layer from one accountable person — frontend, backend, data and cloud built together, with no gaps between teams.",
    intro: [
      "Software projects mostly stall between people: the screens wait for an API, the API waits for a data decision, and the deployment belongs to nobody. Full-stack work closes those gaps. I model the data, write the APIs and the interface, and set up the hosting, so every choice is made with the whole system in sight — and you have a single person to ask.",
      "My main languages are TypeScript and Python, and I pick the stack for your product and your future hiring, not for my own taste. For founders watching costs, one engineer across the layers is usually cheaper than coordinating several specialists. For teams abroad, it means one contact who can join your stand-ups, read your current code and make changes anywhere in it.",
    ],
    benefits: [
      {
        title: "One person answerable",
        text: "Someone owns how the whole product behaves, from the button down to the table.",
      },
      {
        title: "Features arrive whole",
        text: "Screens and server logic move together, so nothing lands half finished.",
      },
      {
        title: "Less spent on coordination",
        text: "You don't pay to keep separate frontend, backend and ops contractors in sync.",
      },
      {
        title: "One set of conventions",
        text: "Shared types, tooling and style make the code easier to maintain and to hire for.",
      },
      {
        title: "Quick experiments",
        text: "A fresh idea can be clickable within a few days.",
      },
    ],
    whyMe: {
      text: "I like owning the whole problem. Building both sides of a feature lets me make trade-offs a split team can't: moving a rule to the server for safety, caching only where it pays, or simplifying a data model so the screen stays quick. You get a short written update every week, honest estimates, and code the next developer can read without days of digging.",
      points: [
        "At home in both TypeScript and Python codebases",
        "APIs designed first and documented with OpenAPI",
        "Automated tests and CI/CD running from sprint one",
        "A tidy handover when you build an in-house team",
      ],
    },
    tech: [
      "MERN stack",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "NestJS",
      "Python",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "GitHub Actions",
    ],
    process: [
      {
        title: "Goals and stack",
        text: "We settle goals, limits and a stack that fits the product, the budget and who you'll hire later.",
      },
      {
        title: "Screens and data together",
        text: "Interface, data model and API contracts are drawn up side by side so they fit from day one.",
      },
      {
        title: "Build both halves",
        text: "Frontend and APIs are written in parallel against the agreed contracts, in short sprints.",
      },
      {
        title: "Connect the services",
        text: "Payments, email, sign-in and other providers are wired in and tried against real accounts.",
      },
      {
        title: "Test whole journeys",
        text: "Automated and manual checks cover complete user paths, not just isolated parts.",
      },
      {
        title: "Go live",
        text: "Deployed with monitoring, backups and a way to roll back, then walked through with you.",
      },
    ],
    deliverables: [
      "A finished web application, deployed",
      "A private Git repository with its full history",
      "API documentation and the database schema",
      "Design files, when design was part of the job",
      "Deployment scripts and an environment setup guide",
    ],
    faqs: [
      {
        q: 'What does "full-stack" actually cover?',
        a: "Every layer of a web product: the part people see (frontend), the server rules and APIs (backend), the database, and the infrastructure underneath. Working across all of them, I can take a feature from idea to production alone, which avoids the delays and crossed wires that come from splitting it across specialists.",
      },
      {
        q: "How do you decide on the stack?",
        a: "Mostly TypeScript (React, Next.js, Node.js, NestJS) and Python (FastAPI, Django) on PostgreSQL or MongoDB. The product decides: Python when AI or data work sits at the centre, Next.js for web apps that depend on search traffic, and whatever your current team knows if you plan to hire. I walk you through the trade-offs before we commit.",
      },
      {
        q: "Do I need a separate frontend and backend developer?",
        a: "For most early products, no. One engineer across both usually moves faster and costs less. Later you may want specialists for heavy design or large infrastructure, and because everything is written down, adding people is a smooth step rather than a disruption.",
      },
      {
        q: "How does the work run week to week?",
        a: "We agree a sprint plan and track it on a shared board you can open any time. You get short written updates, a demo at the end of every sprint, and early warning about risks. You can reach me directly in agreed hours — IST for Indian teams, with overlap for other time zones.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "About 6–16 weeks to a first release",
    idealFor: [
      "Founders with no technical partner",
      "Agencies wanting an engineer under their own brand",
      "Businesses moving off spreadsheets",
    ],
    related: ["web-applications", "backend-development", "devops-cloud"],
    seo: {
      title: "Full-Stack Developer for Hire in Bengaluru, India",
      description:
        "Hire a full-stack developer in Bengaluru, India: frontend, backend, database and deployment from one engineer, in TypeScript and Python, for startups anywhere.",
    },
  },
  {
    slug: "frontend-development",
    group: "build",
    icon: "PanelsTopLeft",
    title: "Frontend Development",
    shortTitle: "Frontend",
    tagline: "Quick, accessible, phone-first screens that turn visits into sign-ups.",
    summary:
      "Faithful React and Next.js builds of your designs that load quickly on any phone, meet accessibility standards and help people finish what they came to do.",
    intro: [
      "To most people, the interface simply is the product. If it is slow, crowded or fiddly on their phone, they leave, however solid the backend. I build frontends that are quick, accessible and true to the design, in React and Next.js with reusable components, so each new screen stays consistent with the last.",
      "Most people in India browse on mid-range Android phones over mobile data, so I design for small screens and slow connections first and widen the layout for tablets and desktops after. That means small bundles, compressed images and sensible loading states. Users elsewhere gain too: better Core Web Vitals, stronger search ranking, and pages that work with a keyboard or a screen reader.",
    ],
    benefits: [
      {
        title: "More people finish",
        text: "Clear, fast screens keep visitors moving through sign-up, checkout and onboarding.",
      },
      {
        title: "Right on every screen",
        text: "Layouts start on phones and are checked all the way up to wide monitors.",
      },
      {
        title: "Short load times",
        text: "Split code, lighter images and caching keep pages quick even on weak networks.",
      },
      {
        title: "Search engines can read it",
        text: "Server rendering and meaningful HTML help your pages get indexed and ranked.",
      },
      {
        title: "Accessible from the first build",
        text: "Keyboard use, contrast and screen-reader labels are part of the work, not a patch.",
      },
    ],
    whyMe: {
      text: "I work in the space between design and engineering. I can read a Figma file critically, notice the states nobody drew — empty, loading, error — and build them without a round trip. I care about details people feel: visible focus, smooth transitions, pages that don't jump while loading. And I test on ordinary phones, not only a fast laptop.",
      points: [
        "Component libraries that follow your design system",
        "Accessibility checked against WCAG AA",
        "Speed targets set against Core Web Vitals",
        "Clean connections to any REST or GraphQL API",
      ],
    },
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue",
      "Tailwind CSS",
      "Framer Motion",
      "Storybook",
    ],
    process: [
      {
        title: "Brief",
        text: "We go over goals, audience, target devices and any current code or brand rules.",
      },
      {
        title: "Design review",
        text: "I read the designs, list missing states and agree how screens split into components.",
      },
      {
        title: "Components, then pages",
        text: "Reusable, documented parts are assembled into pages, with a live preview after each sprint.",
      },
      {
        title: "Device checks",
        text: "Checks in several browsers, at many widths, on throttled networks and with screen readers.",
      },
      {
        title: "Connect and release",
        text: "The interface is hooked to your APIs and shipped, with a preview link for every change.",
      },
    ],
    deliverables: [
      "A responsive codebase ready for production",
      "Storybook with every component and its usage notes",
      "A preview link for every release",
      "Accessibility and performance check results",
      "Setup and contribution notes",
    ],
    faqs: [
      {
        q: "What is frontend work, exactly?",
        a: "Building the part of a product people see and touch: pages, forms, menus and motion. It turns designs into code that runs in the browser, talks to your backend and behaves well at every screen size. Done properly it also covers speed, accessibility and search, which together decide how many visitors become users.",
      },
      {
        q: "Which frameworks do you use?",
        a: "Usually React on Next.js, typed with TypeScript and styled with Tailwind CSS; server rendering from Next.js gives search engines tidy pages to read. If a codebase is already in Vue, I'll work in Vue. Storybook holds the component docs, and Framer Motion handles animation — switched off for anyone whose device asks for reduced motion.",
      },
      {
        q: "Why does mobile-first matter so much in India?",
        a: "Because most Indian internet users browse on a phone — often a mid-range Android with little memory and patchy data. A site designed on a desktop and squeezed down feels slow and cramped. Starting from the smallest screen and the slowest network improves the experience for everyone else as well.",
      },
      {
        q: "How long does a frontend build take?",
        a: "It depends on how many distinct screens there are and how complete the designs are. A marketing site or small app often takes two to four weeks; a bigger product with many states and roles takes longer. Once I've seen your designs I'll give you a per-screen estimate and a delivery plan.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–8 weeks",
    idealFor: [
      "Products whose designs are ready to build",
      "Teams with a backend and no frontend developer",
      "Marketing sites that must load quickly",
    ],
    related: ["ui-design", "web-applications", "full-stack-development"],
    seo: {
      title: "React & Next.js Frontend Developer in India",
      description:
        "Frontend development in React and Next.js from India: accessible, phone-first interfaces that load quickly on any device and help your pages rank.",
    },
  },
  {
    slug: "backend-development",
    group: "build",
    icon: "Server",
    title: "Backend & API Development",
    shortTitle: "Backend & APIs",
    tagline: "Safe, sturdy server code — the part your product quietly depends on.",
    summary:
      "Server code in Node.js or Python — APIs, data and background work — that is safe out of the box, written up clearly and able to take more traffic.",
    intro: [
      "Users never see the backend, yet they feel it every time. It decides whether a page appears at once or hangs, whether a payment clears, and whether customer data stays private. I design and build the server side — APIs, databases, sign-in, background jobs and integrations — so it is easy to reason about, well documented and able to grow without constant firefighting.",
      "My tools here are Node.js (Express, NestJS) and Python (FastAPI, Django), on PostgreSQL, MongoDB and Redis. On security I follow OWASP: every input checked, traffic encrypted, secrets hashed, and each part given the least access it needs. Speed comes from sensible indexes, caches and queues rather than larger machines — welcome news for a startup eyeing its cloud invoice, or any product that might see a sudden rush.",
    ],
    benefits: [
      {
        title: "Ready for more users",
        text: "Stateless services, queues and caches absorb growth without a redesign.",
      },
      {
        title: "Security from the start",
        text: "OWASP practice, encryption, hashed secrets and role-based access come as standard.",
      },
      {
        title: "Easy to extend",
        text: "Clear module boundaries make it simple to add a feature or swap a provider.",
      },
      {
        title: "Quick under load",
        text: "Indexes, caching and background queues keep responses fast when traffic rises.",
      },
      {
        title: "Smaller cloud bills",
        text: "Efficient code on right-sized servers means you pay for what you use.",
      },
    ],
    whyMe: {
      text: "I think about backends like the person on call: what happens at 2 a.m. when a payment webhook fails or a queue backs up? So retries, idempotency, logs and alerts go in from the start. I document as I build, because an API nobody understands is a liability, and I explain design choices in plain words so you know what you are paying for.",
      points: [
        "APIs designed first, with OpenAPI documentation",
        "Payments, SMS, email and CRM hooked up",
        "Unit, integration and load tests that run on their own",
        "Monitoring, logs and alerts live before launch",
      ],
    },
    tech: [
      "Node.js",
      "Express",
      "NestJS",
      "Python",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "BullMQ",
      "RabbitMQ",
      "Docker",
      "OpenAPI / Swagger",
      "AWS",
      "GCP",
    ],
    process: [
      {
        title: "Rules and data model",
        text: "We list the entities, roles and business rules, then shape a data model around them.",
      },
      {
        title: "System and API design",
        text: "Endpoints, sign-in flows and integrations are specified first and shared as an OpenAPI contract.",
      },
      {
        title: "Build in small pieces",
        text: "APIs, auth, jobs and integrations are built in short increments, each one tested.",
      },
      {
        title: "Prove it",
        text: "Unit, integration and load tests confirm it works and show how it behaves under pressure.",
      },
      {
        title: "Automated releases",
        text: "Pipelines deploy to staging and production, without downtime wherever that's possible.",
      },
      {
        title: "Watch and maintain",
        text: "Logs, metrics and alerts are connected, with a plan for updates and fixes.",
      },
    ],
    deliverables: [
      "Documented APIs (OpenAPI / Swagger)",
      "The database schema and an admin panel",
      "Live hosting with an automated release pipeline",
      "The repository and a setup guide",
      "Architecture notes and a record of decisions",
    ],
    faqs: [
      {
        q: "Which backend tools do you work with?",
        a: "For the server: Node.js (Express or NestJS) or Python (FastAPI or Django). For data: PostgreSQL, MongoDB and Redis. Queued jobs run on BullMQ or RabbitMQ, services are packaged with Docker, and hosting is AWS or GCP. I lean to Python when AI or data crunching is the heart of it, and to Node.js when one language across the stack matters more.",
      },
      {
        q: "How will my data be protected?",
        a: "Security is designed in, not ticked off at the end. I follow OWASP practice: every input validated, parameterised queries, hashed passwords, encryption in transit, secrets kept out of the code and each service given only the access it needs. Sensitive actions are role-checked and logged, and dependencies are scanned and kept current.",
      },
      {
        q: "Can you connect payments, SMS, email and a CRM?",
        a: "Yes. I integrate gateways such as Razorpay and Stripe — webhooks, refunds and subscriptions included — plus SMS and WhatsApp providers, transactional email and CRMs like HubSpot or Zoho. Each integration retries and logs, so a failed webhook is caught and recovered instead of disappearing.",
      },
      {
        q: "Will it cope as usage grows?",
        a: "It is built to. Services hold no state so they can run on more machines, heavy tasks go to background queues, and the database is indexed and cached for the queries your product really makes. I don't design for millions on day one, but I avoid choices that would block growth, and I load-test before launch.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "3–10 weeks",
    idealFor: [
      "Apps for web or phone that rely on a solid API",
      "Products handling payments, permissions or outside services",
      "Teams that have outgrown a no-code or Firebase backend",
    ],
    related: ["devops-cloud", "ai-integration", "full-stack-development"],
    seo: {
      title: "Backend & API Development in India — Node.js, Python",
      description:
        "Backend and API development from India in Node.js and Python: secure, documented, scalable — with payments, integrations and background jobs included.",
    },
  },
  {
    slug: "web-applications",
    group: "build",
    icon: "AppWindow",
    title: "Web Applications",
    shortTitle: "Web Apps",
    tagline: "Custom browser apps: nothing to install, every update instant.",
    summary:
      "SaaS products, dashboards, portals, booking tools and internal software, shaped around how you work and opened in any browser.",
    intro: [
      "A web application lets customers or staff get real work done in the browser — book, buy, manage, analyse — with nothing to install. I build them around how your business actually runs: SaaS products, client portals, admin dashboards, booking and scheduling tools, internal software that retires the spreadsheet, and online stores that outgrow a template.",
      "For reaching people in India and abroad, a web app is often the most affordable route. One codebase serves phones, tablets and laptops; updates reach everyone at once with no store review; public pages can rank on Google. I make them quick on mobile data, safe by default and easy to connect to the tools you already rely on, from payment gateways to accounting software.",
    ],
    benefits: [
      {
        title: "Runs in any browser",
        text: "Customers and staff open it on whatever device they have, with nothing to download.",
      },
      {
        title: "Found through search",
        text: "Public pages are rendered on the server and structured so Google can index them.",
      },
      {
        title: "Changes reach everyone at once",
        text: "New features go live for every user on deploy, without waiting on an app store.",
      },
      {
        title: "Plays well with your tools",
        text: "Well-designed APIs tie it into payments, your CRM, your accounts and your analytics.",
      },
      {
        title: "Fits how you work",
        text: "Screens and roles follow your team's real process, not a generic template.",
      },
    ],
    whyMe: {
      text: "I begin with your workflow rather than a feature list. Before designing anything I want to know who will use the app, what they need to get done and where today's process breaks down. That is how internal tools end up saving real hours and client portals end up being used. Then I build it to the standard I'd want for my own product.",
      points: [
        "Role-based access for staff, customers and admins",
        "Dashboards and reports that people actually open",
        "Quick on phone data and on older hardware",
        "Measurement set up, so usage is visible from week one",
      ],
    },
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "GCP",
      "Vercel",
      "Docker",
    ],
    process: [
      {
        title: "Users and roles",
        text: "We map who uses the app, what each role may do and the jobs they need done.",
      },
      {
        title: "Wireframes",
        text: "Rough layouts of the key screens are signed off before any styling begins.",
      },
      {
        title: "Design and build",
        text: "Interface and server are built in sprints, each ending with a demo build.",
        duration: "1–2 weeks per sprint",
      },
      {
        title: "Testing",
        text: "Speed, security and cross-browser checks, done on actual devices and connections.",
      },
      {
        title: "Into the cloud",
        text: "Released to AWS, GCP or Vercel on your own domain, with backups and monitoring.",
      },
      {
        title: "Measure and improve",
        text: "Usage data and error reports steer the next round of changes.",
      },
    ],
    deliverables: [
      "The web app, live on your domain",
      "Source code and documentation",
      "An API and architecture guide",
      "Reusable UI parts for the screens still to come",
      "Usage measured with GA4, Mixpanel or PostHog",
    ],
    faqs: [
      {
        q: "What's a realistic timeline for a web app?",
        a: "Expect roughly 6–12 weeks for a tight first version; the number of roles, connected services and screens moves it either way. A plain internal tool can be faster, while multi-tenant SaaS with billing runs longer. Discovery ends with a dated milestone plan, and every sprint closes with something working to try — no single big unveiling at the end.",
      },
      {
        q: "Can it connect to other services?",
        a: "Yes — nearly every web app depends on others: Razorpay or Stripe for money, email and SMS senders, Google or Microsoft log-in, maps, CRMs, accounting software and AI models. Each link I build catches its own errors, tries again and keeps a log, so a wobble at one provider doesn't take your app down with it.",
      },
      {
        q: "What upkeep will it need?",
        a: "Any live app needs regular dependency and security updates, monitoring, backups and the odd fix as browsers and outside APIs change. Beyond that, most products keep evolving with feedback. I offer ongoing help on a monthly retainer or by the hour, and the documentation means another developer could take over if you'd rather.",
      },
      {
        q: "What keeps the app secure?",
        a: "Security is there from the first sprint: HTTPS everywhere, sound authentication, role-based permissions, validated input, protection against XSS, CSRF and SQL injection, and no secrets in the code. Data is backed up automatically, dependencies are scanned for known issues, and admin actions can be logged as an audit trail.",
      },
    ],
    typicalTimeline: "Roughly 6–12 weeks to version one",
    idealFor: [
      "SaaS founders shipping a first version",
      "Businesses tired of spreadsheets and email chains",
      "Service firms that want a client portal",
    ],
    related: ["mvp-development", "digital-marketing", "ui-design"],
    seo: {
      title: "Custom Web App Development in India — SaaS & Portals",
      description:
        "Custom web application development from India: SaaS, dashboards, portals, booking and internal tools built around your workflow — quick, secure and mobile-friendly.",
    },
  },
  {
    slug: "mobile-applications",
    group: "build",
    icon: "Smartphone",
    title: "Mobile Applications",
    shortTitle: "Mobile Apps",
    tagline: "Android and iOS apps tuned for ordinary phones and real networks.",
    summary:
      "Cross-platform apps in React Native or Flutter: quick on budget phones, calm when the signal drops, with native code only where it earns its place.",
    intro: [
      "An app puts your product on the home screens of the people you want to reach, with notifications to bring them back. I build Android and iOS from one cross-platform codebase in React Native or Flutter, which keeps cost and time down, and add native Kotlin or Swift only where a feature truly needs it.",
      "Most users in India are on Android, often mid-range or budget handsets with little storage and patchy data. I design for those conditions: small downloads, screens that work offline, careful image handling and graceful behaviour when the network vanishes. The same care makes apps feel smooth everywhere and keeps your store ratings healthy.",
    ],
    benefits: [
      {
        title: "A direct line to users",
        text: "A timely notification — an update, an offer, a reminder — pulls people back in.",
      },
      {
        title: "Trust from the store listing",
        text: "A polished page on Google Play and the App Store reassures new users.",
      },
      {
        title: "Smooth on modest phones",
        text: "Apps stay quick on budget devices and usable when the connection drops.",
      },
      {
        title: "Insight and income",
        text: "Usage data shows what people value, while in-app purchases and subscriptions bring in money.",
      },
      {
        title: "Reasons to return",
        text: "Saved preferences, offline access and well-timed nudges keep users coming back.",
      },
    ],
    whyMe: {
      text: "I build apps for how people really use them: on a mid-range phone, on a train, with one bar of signal. That shapes everything, from how a screen loads to how a form keeps its draft. I also take on the dull jobs that delay launches — signing keys, store pages, privacy declarations, review feedback — and you get a build on your own phone early and often.",
      points: [
        "Cross-platform first, native modules where needed",
        "Offline-ready data and sensible caching",
        "Store uploads, review responses and each release handled",
        "Crash and usage reporting wired in from build one",
      ],
    },
    tech: ["React Native", "Expo", "Flutter", "Firebase", "SQLite", "Kotlin", "Swift", "Fastlane"],
    process: [
      {
        title: "Journey and sketches",
        text: "We define the core user path and sketch each screen along it.",
      },
      {
        title: "Build",
        text: "Screens, offline data, notifications and APIs come together in sprints, with test builds on your phone.",
      },
      {
        title: "Device testing",
        text: "Trials on old and new Android and iOS, small and large screens, cheap handsets and weak signal.",
      },
      {
        title: "Store submission",
        text: "Listings, screenshots and privacy forms are prepared, and I stay with it until approval.",
      },
      {
        title: "Release and upkeep",
        text: "After launch, crash logs and usage numbers decide what gets fixed and shipped next.",
      },
    ],
    deliverables: [
      "Release builds for both stores (Android AAB/APK, iOS IPA)",
      "Source code and build configuration",
      "Store listing assets and copy",
      "Release and maintenance notes",
      "Analytics and crash reporting set up",
    ],
    faqs: [
      {
        q: "Should I go native or cross-platform?",
        a: "Cross-platform suits most startups: with React Native or Flutter a single codebase reaches both stores, which lowers cost, speeds up releases and keeps behaviour consistent. Going fully native pays off for graphics-heavy work, deep hardware access or features unique to one platform. Frequently the best fit is cross-platform with a handful of native modules — I'll advise on your case.",
      },
      {
        q: "Will you handle publishing?",
        a: "Yes. I work inside your Google Play and Apple developer accounts, prepare listings, screenshots and privacy declarations, and manage submission and any review feedback. The accounts stay in your company's name, so the listing and its reviews belong to you. Apple charges a yearly developer fee and Google a one-off registration fee; you pay both directly.",
      },
      {
        q: "How do you deal with many screen sizes and cheap phones?",
        a: "Layouts flex to fit any screen, and I test on a spread of real and emulated devices, including budget Androids with little memory. Images are compressed and loaded when needed, long lists are virtualised, and the app avoids needless background work. When the network is slow or gone, screens show saved data instead of an endless spinner.",
      },
      {
        q: "How long does a first mobile app take?",
        a: "Usually 8–14 weeks for version one on Android and iOS, depending on payments, chat, maps or offline sync. Store review adds a few days at the end. After discovery you get a milestone plan, and test builds land on your phone in the early sprints, not only at launch.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "About 8–14 weeks to a first store release",
    idealFor: [
      "Consumer apps for India's Android-heavy audience",
      "Businesses adding an app beside their website",
      "Founders who need both platforms on one budget",
    ],
    related: ["mvp-development", "ux-design", "backend-development"],
    seo: {
      title: "Android & iOS App Developer Based in India",
      description:
        "Android and iOS app development from India in React Native and Flutter — fast on budget phones, steady on weak networks, store submission handled.",
    },
  },
];

export const services: Service[] = [...servicesPart1, ...servicesPart2];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServicesByGroup(group: ServiceGroupId): Service[] {
  return services.filter((service) => service.group === group);
}

export function getServiceGroup(id: ServiceGroupId): ServiceGroup | undefined {
  return serviceGroups.find((group) => group.id === id);
}

/** Services listed in `related`, in that order, skipping unknown slugs. */
export function getRelatedServices(service: Service, limit = 3): Service[] {
  return service.related
    .map((slug) => getService(slug))
    .filter((related): related is Service => Boolean(related))
    .slice(0, limit);
}

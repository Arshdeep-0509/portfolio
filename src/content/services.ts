import type { icons } from "lucide-react";

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
  process: { title: string; text: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  typicalTimeline: string;
  idealFor: string[];
  /** Slugs of related services. */
  related: string[];
  seo: { title: string; description: string };
  /** Optional "Example use cases" cards, shown after the overview (used by AI Integration). */
  useCases?: { icon: IconName; title: string; text: string }[];
};

type ServiceStubKeys = "slug" | "group" | "icon" | "title" | "shortTitle" | "tagline";

/**
 * Stub entries carry only the identity fields. Full content arrives in prompts 7 and 8,
 * after which this can be tightened to `Service[]`.
 */
export type ServiceEntry = Pick<Service, ServiceStubKeys> & Partial<Omit<Service, ServiceStubKeys>>;

export const serviceGroups: ServiceGroup[] = [
  { id: "build", label: "Build", description: "Products, apps and APIs, engineered to ship." },
  { id: "design", label: "Design", description: "Interfaces people understand on first use." },
  { id: "grow", label: "Grow", description: "Get found, convert visitors and keep customers." },
  {
    id: "ai-cloud",
    label: "AI & Cloud",
    description: "Practical AI and infrastructure that scales.",
  },
];

export const services: ServiceEntry[] = [
  // BUILD
  {
    slug: "mvp-development",
    group: "build",
    icon: "Rocket",
    title: "MVP Development",
    shortTitle: "MVP",
    tagline: "Validate your idea with a real product in weeks, not months.",
    summary:
      "I design and build lean, launch-ready MVPs that prove demand, impress investors and grow into the full product — without a rewrite.",
    intro: [
      "An MVP is the smallest version of your product that real people can use — and, ideally, pay for. My job is to help you find that version, build it properly and get it in front of users fast. We cut the idea down to the features that test your riskiest assumption, design clean screens around them, and ship something that feels finished rather than a prototype held together with tape.",
      "Most first users in India arrive on mid-range Android phones and patchy mobile data, so I build MVPs that load fast and stay usable on slow networks. For international founders, the same discipline means a product that feels quick everywhere. Under the hood, the code is structured, tested and documented, so when traction arrives you extend what you have instead of starting again.",
    ],
    benefits: [
      {
        title: "Faster time to market",
        text: "Core features go live in weeks, so you start learning from real users while the idea is still fresh.",
      },
      {
        title: "Lean spend",
        text: "Your budget goes into the few features that prove demand, not nice-to-haves nobody has asked for yet.",
      },
      {
        title: "Early validation",
        text: "Real usage data replaces guesswork, showing you what to double down on and what to drop.",
      },
      {
        title: "Investor-ready demo",
        text: "A working product with real users makes a far stronger pitch than slides or mock-ups.",
      },
      {
        title: "Easy iteration",
        text: "Clean architecture and automated deployments make weekly improvements routine instead of risky.",
      },
    ],
    whyMe: {
      text: "I like working with early-stage founders because the pace is fast and every decision matters. You get one engineer who can scope, design, build and deploy, which means fewer hand-offs and quicker decisions. I'll push back on features that don't serve the first release, and I'll tell you plainly when something is a bad idea for an MVP — even if it's more work I could bill for.",
      points: [
        "A scoping workshop that turns a big vision into a first release",
        "Weekly demo builds you can click through and share",
        "Production-grade setup: tests, CI/CD, monitoring and backups",
        "You own the code, designs and cloud accounts from day one",
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
        title: "Idea breakdown",
        text: "We map your users, the problem and your riskiest assumption, then agree what the first release must prove.",
      },
      {
        title: "UX wireframes",
        text: "Low-fidelity flows for the core journeys, checked with a few real users before visual design starts.",
      },
      {
        title: "UI design",
        text: "High-fidelity screens and a small component kit, so the product looks credible from day one.",
      },
      {
        title: "Build in sprints",
        text: "One- to two-week sprints, each ending with a demo build you can try on your own phone.",
      },
      {
        title: "QA",
        text: "Manual and automated testing across devices, browsers and slow network conditions.",
      },
      {
        title: "Launch with analytics",
        text: "Release to the cloud or app stores, with analytics and error tracking live from the first user.",
      },
      {
        title: "Post-launch iteration",
        text: "We review the data together and plan the next improvements around what users actually do.",
      },
    ],
    deliverables: [
      "Working MVP, deployed for real users",
      "Wireframes and high-fidelity designs in Figma",
      "Source code with setup and architecture docs",
      "Hosting, domain and deployment pipeline",
      "Analytics and error tracking configured",
      "Roadmap for the next release",
    ],
    faqs: [
      {
        q: "What exactly is an MVP?",
        a: "A minimum viable product is the smallest version of your product that delivers real value to a specific group of users. It isn't a mock-up or a slide deck — people can sign up and use it. The point is to test your riskiest assumption with real behaviour, so you invest in the full product based on evidence rather than hope.",
      },
      {
        q: "How long does an MVP take?",
        a: "Usually 4–12 weeks. A focused web app with a few core flows sits at the shorter end; products with payments, several user roles, a mobile app or AI features take longer. After the discovery call I send a milestone plan with dates, so you know exactly what ships in each sprint and when you can put it in front of users.",
      },
      {
        q: "What kinds of MVPs can you build?",
        a: "Web apps, Android and iOS apps, admin dashboards, two-sided marketplaces, SaaS products with subscriptions, and automation tools that replace manual work. If your idea combines several of these — say, a customer app plus an operations dashboard — I'll suggest which part to build first so the MVP stays small enough to launch quickly.",
      },
      {
        q: "Can the MVP grow into the full product?",
        a: "Yes, that's the plan from day one. I use the same production stack, tests and deployment pipeline a full product needs, so growing it means adding features rather than rewriting. When you're ready to hire an in-house team, the code and documentation are clear enough for them to take over smoothly.",
      },
    ],
    typicalTimeline: "4–12 weeks",
    idealFor: [
      "First-time and non-technical founders",
      "Startups preparing to raise a round",
      "Businesses testing a new product line",
    ],
    related: ["full-stack-development", "ux-design", "mobile-applications"],
    seo: {
      title: "MVP Development Services in India",
      description:
        "Launch a lean, investor-ready MVP in 4–12 weeks. Design-led, full-stack MVP development for founders in India and worldwide — built to grow.",
    },
  },
  {
    slug: "full-stack-development",
    group: "build",
    icon: "Layers",
    title: "Full-Stack Development",
    shortTitle: "Full-Stack",
    tagline: "One engineer for your UI, APIs, database and deployment.",
    summary:
      "End-to-end web development from one accountable engineer — frontend, backend, database and cloud built together, with no hand-off gaps between teams.",
    intro: [
      "Most delays in software projects happen between people: the frontend waits on the API, the API waits on a database decision, and nobody quite owns the deployment. Full-stack development removes those gaps. I design the data model, build the APIs and the interface, and set up the infrastructure, so every decision is made with the whole system in view — and you have one person to talk to.",
      "I work mainly in TypeScript and Python, choosing a stack that fits your product and your future hiring plans rather than my personal favourites. For budget-conscious founders, one engineer across the stack usually costs less than coordinating separate specialists. For international teams, it means a single point of contact who can join your stand-ups, read your existing codebase and ship across it.",
    ],
    benefits: [
      {
        title: "Unified ownership",
        text: "One person is accountable for how the whole product works, from the button to the database.",
      },
      {
        title: "Faster delivery",
        text: "Frontend and backend move together, so features land complete instead of half-built.",
      },
      {
        title: "Lower overall cost",
        text: "You avoid paying for coordination between separate frontend, backend and DevOps contractors.",
      },
      {
        title: "Consistent stack",
        text: "Shared types, conventions and tooling make the codebase easier to maintain and to hire for.",
      },
      {
        title: "Rapid prototyping",
        text: "New ideas go from sketch to working feature in days, without weeks of hand-offs.",
      },
    ],
    whyMe: {
      text: "I enjoy owning the whole problem. When I build both sides of a feature, I can make trade-offs a split team can't — moving logic to the server for security, caching where it actually helps, or simplifying a data model so the interface stays fast. You get clear weekly updates, honest estimates and code that another developer can pick up without a week of archaeology.",
      points: [
        "Comfortable across TypeScript and Python stacks",
        "API-first design, documented with OpenAPI",
        "Automated tests and CI/CD from the first sprint",
        "A clean hand-over if you hire an in-house team later",
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
        title: "Consultation and stack choice",
        text: "We agree goals, constraints and a stack that suits your product, budget and future hiring.",
      },
      {
        title: "UI and data-flow design",
        text: "Screens, data models and API contracts are designed together, so both sides fit from the start.",
      },
      {
        title: "Parallel build",
        text: "Frontend and APIs are built side by side against the agreed contracts, in short sprints.",
      },
      {
        title: "Integration",
        text: "Payments, email, sign-in and third-party services are wired in and tested against real accounts.",
      },
      {
        title: "End-to-end QA",
        text: "Automated and manual tests cover complete user journeys, not just individual pieces.",
      },
      {
        title: "Production launch",
        text: "Deployment with monitoring, backups and a rollback plan, followed by a hand-over session.",
      },
    ],
    deliverables: [
      "A complete, deployed web application",
      "Private Git repository with full history",
      "API documentation and database schema",
      "Design files, when design is in scope",
      "Deployment scripts and environment setup guide",
    ],
    faqs: [
      {
        q: "What does full-stack mean?",
        a: "Full-stack means working on every layer of a web product: the interface people see (frontend), the server logic and APIs (backend), the database, and the infrastructure it all runs on. As a full-stack engineer I can build a feature end to end, which avoids the delays and miscommunication that come from splitting work across several specialists.",
      },
      {
        q: "Which stacks do you use, and how do you choose?",
        a: "Mostly TypeScript (React, Next.js, Node.js, NestJS) and Python (FastAPI, Django), with PostgreSQL or MongoDB. I choose based on your product, not habit: Python when AI or data work is central, Next.js for SEO-heavy web apps, and whatever your existing team knows if you plan to hire. I explain the trade-offs before we commit.",
      },
      {
        q: "Do I need separate frontend and backend developers?",
        a: "For most MVPs and early-stage products, no. One full-stack engineer usually moves faster and costs less than a split team. As the product grows you may want specialists for heavy design work or large-scale infrastructure, and because everything is documented, adding people later is straightforward rather than disruptive.",
      },
      {
        q: "How do you run the project day to day?",
        a: "We agree a sprint plan and work from a shared board you can check at any time. I post short written updates, run a demo at the end of each sprint and flag risks early. You can reach me directly during agreed overlap hours — IST-friendly for Indian founders, with overlap for teams in other time zones.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "6–16 weeks for a first release",
    idealFor: [
      "Founders without a technical co-founder",
      "Agencies needing a white-label engineer",
      "Businesses replacing spreadsheets with software",
    ],
    related: ["web-applications", "backend-development", "devops-cloud"],
    seo: {
      title: "Full-Stack Development Services in India",
      description:
        "One engineer for frontend, backend, database and deployment. Full-stack web development in TypeScript and Python for startups in India and worldwide.",
    },
  },
  {
    slug: "frontend-development",
    group: "build",
    icon: "PanelsTopLeft",
    title: "Frontend Development",
    shortTitle: "Frontend",
    tagline: "Fast, accessible, mobile-first interfaces that turn visitors into users.",
    summary:
      "Pixel-accurate React and Next.js interfaces that load fast on any phone, meet accessibility standards and help your product convert.",
    intro: [
      "As far as most users are concerned, your interface is the product. If it's slow, cluttered or awkward on their phone, they leave — however good the backend is. I build frontends that are fast, accessible and faithful to the design, using React and Next.js with a component-driven approach, so every screen stays consistent as the product grows.",
      "In India, most people browse on mid-range Android phones over mobile data, so I design for small screens and slow connections first, then scale up to tablets and desktops. That means lean bundles, optimised images and sensible loading states. International users benefit from the same care: better Core Web Vitals, stronger SEO, and an interface that works for people using keyboards and screen readers.",
    ],
    benefits: [
      {
        title: "Higher engagement",
        text: "Fast, clear interfaces keep people moving through sign-up, checkout and onboarding.",
      },
      {
        title: "Works on every screen",
        text: "Layouts are built mobile-first and tested from small Android phones to wide desktop monitors.",
      },
      {
        title: "Fast performance",
        text: "Code-splitting, image optimisation and caching keep load times low, even on slow networks.",
      },
      {
        title: "SEO-friendly markup",
        text: "Server rendering and semantic HTML help search engines read and rank your pages.",
      },
      {
        title: "Accessible by default",
        text: "Keyboard support, colour contrast and screen-reader labels are built in, not bolted on.",
      },
    ],
    whyMe: {
      text: "I sit comfortably between design and engineering. I can read a Figma file critically, spot the states a designer didn't draw — empty, loading, error — and build them without a round of back-and-forth. I care about the details users feel: focus states, smooth transitions and pages that don't jump while loading. And I test on modest, real-world devices, not just a fast laptop.",
      points: [
        "Component libraries that match your design system",
        "Accessibility checked against WCAG AA",
        "Performance budgets for Core Web Vitals",
        "Clean integration with any REST or GraphQL API",
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
        title: "Discovery",
        text: "We review goals, audience, target devices and any existing code or brand guidelines.",
      },
      {
        title: "Design hand-off review",
        text: "I go through the designs, flag missing states and agree component boundaries before building.",
      },
      {
        title: "Component build",
        text: "Reusable, documented components are assembled into pages, with live previews after each sprint.",
      },
      {
        title: "Cross-device testing",
        text: "Testing across browsers, screen sizes, slow connections and assistive technology.",
      },
      {
        title: "Deployment and API integration",
        text: "The frontend is connected to your APIs and released, with preview links for every change.",
      },
    ],
    deliverables: [
      "Responsive, production-ready codebase",
      "Component library and style guide in Storybook",
      "Live preview links for every release",
      "Accessibility and performance check results",
      "Setup and contribution documentation",
    ],
    faqs: [
      {
        q: "What is frontend development?",
        a: "Frontend development is building the part of a product people see and use: pages, forms, navigation and animation. It turns designs into working code that runs in the browser, talks to your backend and behaves well on every screen size. Good frontend work also covers performance, accessibility and SEO, which all affect how many visitors become users.",
      },
      {
        q: "Which frameworks do you use?",
        a: "Mostly React with Next.js, written in TypeScript and styled with Tailwind CSS. Next.js gives fast, server-rendered pages that search engines read well. I also work in Vue when a project already uses it. Components are documented in Storybook, and motion uses Framer Motion — always with reduced-motion support for people who prefer less movement.",
      },
      {
        q: "Why does responsive design matter so much in India?",
        a: "Because most Indian internet users are on phones — often mid-range Android devices with limited memory and patchy mobile data. A site designed on a desktop and squeezed onto a phone feels slow and cramped. I start with the smallest screen and the slowest connection, which also makes the experience better for everyone else.",
      },
      {
        q: "How long does a frontend take?",
        a: "It depends on how many unique screens there are and how complete the designs are. A marketing site or a small app frontend often takes two to four weeks; a larger product with many states and user roles takes longer. After reviewing your designs I give you a screen-by-screen estimate and a delivery plan.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–8 weeks",
    idealFor: [
      "Products with designs ready to build",
      "Teams with a backend but no frontend developer",
      "Marketing sites that need to load fast",
    ],
    related: ["ui-design", "web-applications", "full-stack-development"],
    seo: {
      title: "React & Next.js Frontend Development, India",
      description:
        "Fast, accessible, mobile-first frontends in React and Next.js — pixel-accurate builds that load quickly on any phone and rank well. Based in India.",
    },
  },
  {
    slug: "backend-development",
    group: "build",
    icon: "Server",
    title: "Backend & API Development",
    shortTitle: "Backend & APIs",
    tagline: "Secure, scalable server-side systems — the engine your product runs on.",
    summary:
      "Well-designed APIs, databases and background jobs in Node.js or Python — secure by default, properly documented and ready to scale as users arrive.",
    intro: [
      "The backend is the part of your product users never see but always feel. It decides whether pages load instantly or hang, whether payments go through, and whether customer data stays safe. I design and build server-side systems — APIs, databases, authentication, background jobs and integrations — that are simple to reason about, well documented and built to grow without constant firefighting.",
      "I work in Node.js (Express, NestJS) and Python (FastAPI, Django), with PostgreSQL, MongoDB and Redis. Security follows OWASP practices: validated input, encrypted transport, hashed secrets and least-privilege access. Performance comes from sensible indexing, caching and queues rather than oversized servers — which matters for budget-conscious startups watching their cloud bill, and for any product expecting sudden spikes in traffic.",
    ],
    benefits: [
      {
        title: "Scales with users",
        text: "Stateless services, queues and caching let the system handle growth without a redesign.",
      },
      {
        title: "Security built in",
        text: "OWASP practices, encrypted transport, hashed secrets and role-based access are standard, not extras.",
      },
      {
        title: "Modular and flexible",
        text: "Clear module boundaries make it easy to add features or swap a provider later.",
      },
      {
        title: "High performance",
        text: "Indexing, caching and background queues keep response times low under load.",
      },
      {
        title: "Lower cloud bills",
        text: "Efficient code and right-sized infrastructure mean you pay only for what you use.",
      },
    ],
    whyMe: {
      text: "I think about backends the way an operator does: what happens at 2 a.m. when a payment webhook fails or a job queue backs up? So I build in retries, idempotency, logging and alerts from the start. I write documentation as I go, because an API nobody understands is a liability. And I explain architecture choices in plain English, so you know exactly what you're paying for.",
      points: [
        "API-first design with OpenAPI documentation",
        "Payment, SMS, email and CRM integrations",
        "Automated unit, integration and load tests",
        "Monitoring, logs and alerts in place before launch",
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
        title: "Requirements and data modelling",
        text: "We map entities, user roles and business rules, then design a data model that fits them.",
      },
      {
        title: "System and API design",
        text: "Endpoints, auth flows and integrations are specified up front and shared as an OpenAPI contract.",
      },
      {
        title: "Build",
        text: "APIs, authentication, background jobs and integrations are built in short, tested increments.",
      },
      {
        title: "Testing",
        text: "Unit, integration and load tests confirm correctness and show how the system behaves under pressure.",
      },
      {
        title: "CI/CD deployment",
        text: "Automated pipelines deploy to staging and production, with zero-downtime releases where possible.",
      },
      {
        title: "Monitoring and maintenance",
        text: "Logs, metrics and alerts are wired up, with a maintenance plan for updates and fixes.",
      },
    ],
    deliverables: [
      "Documented APIs (OpenAPI / Swagger)",
      "Database schema and admin panel",
      "Production deployment with CI/CD",
      "Repository and setup guide",
      "Architecture notes and decision log",
    ],
    faqs: [
      {
        q: "Which backend technologies do you use?",
        a: "Node.js with Express or NestJS, and Python with FastAPI or Django, backed by PostgreSQL, MongoDB and Redis. Background work runs on BullMQ or RabbitMQ, everything is containerised with Docker, and deployments go to AWS or GCP. I pick the mix that suits your product: Python when AI or data processing is central, Node.js when you want one language across the stack.",
      },
      {
        q: "How do you keep my data secure?",
        a: "Security is part of the design, not a final checklist. I follow OWASP practices: validating every input, using parameterised queries, hashing passwords, encrypting data in transit, keeping secrets out of code and giving each service only the permissions it needs. Access is role-based and audited where it matters, and dependencies are scanned and updated regularly.",
      },
      {
        q: "Can you integrate payments, SMS, email and CRMs?",
        a: "Yes. I integrate payment gateways such as Razorpay and Stripe — including webhooks, refunds and subscription billing — along with SMS and WhatsApp providers, transactional email services and CRMs like HubSpot or Zoho. Every integration has retries and logging, so a failed webhook is noticed and recovered rather than silently lost.",
      },
      {
        q: "Will it scale as users grow?",
        a: "It's designed to. Services are stateless so they can run on more servers, heavy work moves to background queues, and databases are indexed and cached for the queries your product actually makes. I don't over-engineer for millions of users on day one, but I avoid decisions that would block growth, and I load-test before launch.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "3–10 weeks",
    idealFor: [
      "Web or mobile apps that need a reliable API",
      "Products with payments, roles or integrations",
      "Teams outgrowing a no-code or Firebase backend",
    ],
    related: ["devops-cloud", "ai-integration", "full-stack-development"],
    seo: {
      title: "Backend & API Development in India",
      description:
        "Secure, scalable backends and APIs in Node.js and Python — payments, integrations, background jobs and docs included. For startups in India and beyond.",
    },
  },
  {
    slug: "web-applications",
    group: "build",
    icon: "AppWindow",
    title: "Web Applications",
    shortTitle: "Web Apps",
    tagline: "Custom web apps that run anywhere — no installs, instant updates.",
    summary:
      "SaaS products, dashboards, portals, booking systems and internal tools, built around your workflow and delivered in the browser on any device.",
    intro: [
      "A web application lets your customers or your team do real work in the browser — book, buy, manage, analyse — without installing anything. I build custom web apps shaped around how your business actually operates: SaaS products, customer portals, admin dashboards, booking and scheduling systems, internal tools that replace spreadsheets, and e-commerce that goes beyond a standard template.",
      "Web apps are often the most budget-friendly way to reach users in India and abroad. One codebase works on phones, tablets and laptops, updates ship instantly without app-store reviews, and public pages can be found on Google. I build them to be fast on mobile data, secure by default and easy to connect to the tools you already use, from payment gateways to accounting software.",
    ],
    benefits: [
      {
        title: "Works in any browser",
        text: "Customers and staff use it on any device, with nothing to download or update.",
      },
      {
        title: "Discoverable on Google",
        text: "Public pages are server-rendered and structured so search engines can index them.",
      },
      {
        title: "Instant updates",
        text: "New features reach every user the moment they're deployed, with no app-store approval.",
      },
      {
        title: "Integration-ready",
        text: "Clean APIs connect your app to payments, CRMs, accounting and analytics tools.",
      },
      {
        title: "Tailored to your workflow",
        text: "Screens and roles match how your team really works, not a generic template.",
      },
    ],
    whyMe: {
      text: "I start with your workflow, not a feature list. Before any design, I want to understand who uses the app, what they're trying to get done and where today's process breaks. That's how internal tools end up saving real time and customer portals end up actually being used. Then I build to the same production standards I'd want for a product of my own.",
      points: [
        "Role-based access for teams, customers and admins",
        "Dashboards and reports people actually read",
        "Performance tuned for mobile data and older devices",
        "Analytics set up so you can see how it's used",
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
        title: "Requirements and user roles",
        text: "We map users, permissions and the jobs each role needs to get done.",
      },
      {
        title: "Wireframes",
        text: "Key screens and flows are sketched and agreed before visual design begins.",
      },
      {
        title: "Design and build",
        text: "Interface and backend are built in sprints, with a demo build at the end of each one.",
      },
      {
        title: "Testing",
        text: "Cross-browser, security and performance testing on real devices and networks.",
      },
      {
        title: "Cloud deployment",
        text: "Release to AWS, GCP or Vercel with backups, monitoring and your own domain.",
      },
      {
        title: "Monitoring and improvements",
        text: "Usage data and error tracking guide the next round of improvements.",
      },
    ],
    deliverables: [
      "Deployed web application on your domain",
      "Source code and documentation",
      "API and architecture guide",
      "UI kit for future screens",
      "Analytics set up (GA4, Mixpanel or PostHog)",
    ],
    faqs: [
      {
        q: "How long does a web app take?",
        a: "A focused first version usually takes 6–12 weeks, depending on the number of user roles, integrations and screens. Simple internal tools can be quicker; multi-tenant SaaS with billing takes longer. After discovery you get a milestone plan with dates, and you'll see a working demo at the end of every sprint rather than waiting for one big reveal.",
      },
      {
        q: "Can you integrate third-party APIs?",
        a: "Yes. Most web apps depend on other services: payment gateways like Razorpay or Stripe, email and SMS providers, Google and Microsoft sign-in, maps, CRMs, accounting tools and AI APIs. I build integrations with proper error handling, retries and logging, so your app degrades gracefully when a provider has a bad day.",
      },
      {
        q: "What maintenance will it need?",
        a: "Every live app needs regular dependency and security updates, monitoring, backups and occasional fixes as browsers and third-party APIs change. Beyond that, most products keep evolving with user feedback. I offer ongoing support through a monthly retainer or on-demand hours, and the documentation means another developer could take over if you prefer.",
      },
      {
        q: "How do you keep it secure?",
        a: "Security is built in from the start: HTTPS everywhere, secure authentication, role-based permissions, validated inputs, protection against common attacks such as XSS, CSRF and SQL injection, and secrets kept out of the code. Data is backed up automatically, dependencies are scanned for known vulnerabilities, and admin actions can be logged as an audit trail.",
      },
    ],
    typicalTimeline: "6–12 weeks for a first version",
    idealFor: [
      "SaaS founders launching a first version",
      "Businesses replacing spreadsheets and email threads",
      "Service companies that need a customer portal",
    ],
    related: ["mvp-development", "backend-development", "ui-design"],
    seo: {
      title: "Custom Web Application Development, India",
      description:
        "Web app development for SaaS, dashboards, portals, booking systems and internal tools — built around your workflow. Fast on mobile, secure, India-based.",
    },
  },
  {
    slug: "mobile-applications",
    group: "build",
    icon: "Smartphone",
    title: "Mobile Applications",
    shortTitle: "Mobile Apps",
    tagline: "Android and iOS apps built for real devices and real networks.",
    summary:
      "Cross-platform apps in React Native or Flutter — fast on budget phones, resilient on patchy networks, with native code only where it's genuinely needed.",
    intro: [
      "A mobile app puts your product on the home screen of the people you want to reach, with push notifications to bring them back. I build Android and iOS apps from a single cross-platform codebase in React Native or Flutter, which keeps costs and timelines down, and switch to native Kotlin or Swift modules only when a feature genuinely needs them.",
      "Most Indian users are on Android, often mid-range or budget phones with limited storage and unreliable data. So I design for those conditions: small app sizes, offline-friendly screens, careful image handling and graceful behaviour when the network drops. The same care makes apps feel smooth for users anywhere in the world, and it keeps your store ratings healthy.",
    ],
    benefits: [
      {
        title: "Direct reach through push",
        text: "Push notifications bring users back for updates, offers and reminders.",
      },
      {
        title: "App-store credibility",
        text: "A polished listing on Google Play and the App Store builds trust with new users.",
      },
      {
        title: "Smooth performance",
        text: "Apps stay fast on budget phones and usable when the connection drops.",
      },
      {
        title: "Analytics and monetisation",
        text: "Usage analytics, in-app purchases and subscriptions show what works and earn revenue.",
      },
      {
        title: "Loyalty and retention",
        text: "Saved preferences, offline access and timely nudges keep users coming back.",
      },
    ],
    whyMe: {
      text: "I build apps the way people actually use them — on a mid-range phone, on a train, with one bar of signal. That shapes everything from how screens load to how forms save drafts. I also handle the unglamorous parts that delay launches: signing keys, store listings, privacy declarations and review feedback. You get a working build on your own phone early and often.",
      points: [
        "Cross-platform by default, native modules when needed",
        "Offline-first data and smart caching",
        "Store submission, review fixes and release management",
        "Crash reporting and analytics from the first build",
      ],
    },
    tech: ["React Native", "Expo", "Flutter", "Firebase", "SQLite", "Kotlin", "Swift", "Fastlane"],
    process: [
      {
        title: "Concept and wireframes",
        text: "We define the core user journey and sketch every screen it needs.",
      },
      {
        title: "Build",
        text: "Screens, offline data, push notifications and APIs are built in sprints, with test builds on your phone.",
      },
      {
        title: "Device and OS testing",
        text: "Testing across Android and iOS versions, screen sizes, low-end devices and slow networks.",
      },
      {
        title: "Store submission",
        text: "I prepare listings, screenshots and privacy details, then handle the review process.",
      },
      {
        title: "Launch, monitoring and updates",
        text: "Crash reports and analytics guide fixes and regular updates after release.",
      },
    ],
    deliverables: [
      "Store-ready builds (AAB/APK for Android, IPA for iOS)",
      "Source code and build configuration",
      "Store listing assets and copy",
      "Maintenance and release documentation",
      "Analytics and crash reporting configured",
    ],
    faqs: [
      {
        q: "Native or cross-platform — which should I choose?",
        a: "For most startups, cross-platform. React Native or Flutter lets one codebase serve Android and iOS, which means lower cost, faster releases and consistent behaviour. Native development makes sense for heavy graphics, deep hardware access or very platform-specific features. Often the best answer is cross-platform with a few native modules, and I'll recommend what fits your app.",
      },
      {
        q: "Will you publish the app for me?",
        a: "Yes. I work within your Google Play and Apple developer accounts, prepare store listings, screenshots and privacy declarations, and handle submission and any review feedback. The accounts stay in your company's name, so you own the listing and its reviews. Apple charges an annual developer fee and Google a one-time registration fee, both paid by you.",
      },
      {
        q: "How do you handle many screen sizes and low-end phones?",
        a: "I use flexible layouts that adapt to every screen size and test on a range of real and emulated devices, including budget Android phones with limited memory. Images are compressed and loaded on demand, long lists are virtualised, and the app avoids unnecessary background work. When the network is slow or offline, screens show cached data instead of endless spinners.",
      },
      {
        q: "How long does a mobile MVP take?",
        a: "Typically 8–14 weeks for a first version on both Android and iOS, depending on features such as payments, chat, maps or offline sync. Store review adds a few days at the end. After discovery I share a milestone plan, and you'll have test builds on your own phone from the early sprints, not just at launch.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "8–14 weeks for a first release",
    idealFor: [
      "Consumer apps for India's Android-first users",
      "Businesses adding an app alongside their website",
      "Founders who need Android and iOS on one budget",
    ],
    related: ["mvp-development", "ux-design", "backend-development"],
    seo: {
      title: "Android & iOS App Development in India",
      description:
        "Cross-platform Android and iOS apps in React Native and Flutter, built for budget phones and patchy networks. Store submission included. India-based.",
    },
  },
  // DESIGN
  {
    slug: "ux-design",
    group: "design",
    icon: "Route",
    title: "UX (User Experience) Design",
    shortTitle: "UX Design",
    tagline: "Research-backed user journeys that remove friction and drive sign-ups.",
    summary:
      "I research how your users think, map the journeys that matter and test prototypes with real people — so you build the right thing first.",
    intro: [
      "Good UX is invisible: people find what they need, finish what they started and come back. Bad UX shows up as abandoned sign-ups, support tickets and features nobody uses. I design user experiences starting from evidence — interviews, analytics and observation — and turn it into clear journeys, wireframes and prototypes your team can test before a single screen is built.",
      "Designing for India brings its own patterns: users who switch between English and regional languages, expect OTP sign-in and UPI payments, share phones within families and often decide things on WhatsApp. I factor these into flows when they matter, and follow global conventions when you're targeting international audiences. Either way, decisions come from what users actually do, not from opinions in a meeting.",
    ],
    benefits: [
      {
        title: "User-centred decisions",
        text: "Choices are grounded in research and testing, not the loudest opinion in the room.",
      },
      {
        title: "Less rework",
        text: "Problems are caught in wireframes and prototypes, where fixing them costs hours rather than weeks.",
      },
      {
        title: "Higher engagement",
        text: "Clear journeys help more people sign up, finish tasks and come back.",
      },
      {
        title: "Faster development",
        text: "Developers build from clear flows and specs instead of guessing at edge cases.",
      },
      {
        title: "Fit for Indian users",
        text: "Flows account for OTP sign-in, UPI, regional languages and shared devices where they matter.",
      },
    ],
    whyMe: {
      text: "Because I'm also an engineer, my UX work is grounded in what can be built well and on time. I won't hand you beautiful flows that collapse when they meet real data, slow networks or an API limitation. I keep research proportionate to your budget — a handful of good interviews often beats a big survey — and I explain every recommendation in plain language.",
      points: [
        "Lean research sized to your stage and budget",
        "Prototypes tested with real users, not just stakeholders",
        "Flows checked for technical feasibility as I design",
        "Clear documentation your developers can follow",
      ],
    },
    tech: [
      "Figma",
      "FigJam",
      "User interviews",
      "Surveys",
      "Personas",
      "Journey maps",
      "Usability testing",
      "Analytics review",
    ],
    process: [
      {
        title: "Discovery",
        text: "We align on business goals, target users and what success looks like for the product.",
      },
      {
        title: "Research",
        text: "Interviews, surveys and analytics show how users behave today and where they struggle.",
      },
      {
        title: "Wireframes",
        text: "Low-fidelity layouts for key screens, focused on structure and flow rather than visuals.",
      },
      {
        title: "Interactive prototype",
        text: "A clickable Figma prototype that feels close enough to the real thing to test.",
      },
      {
        title: "Usability testing",
        text: "Real users try key tasks while I watch, note the friction and refine the flows.",
      },
      {
        title: "Final UX documentation",
        text: "Journeys, decisions and guidelines are written up so design and development stay aligned.",
      },
    ],
    deliverables: [
      "Personas and journey maps",
      "Wireframes for key screens",
      "Clickable prototype in Figma",
      "Research findings and recommendations",
      "UX guidelines for your product team",
    ],
    faqs: [
      {
        q: "What is UX design?",
        a: "UX (user experience) design is the work of making a product easy and worthwhile to use. It covers understanding users, structuring information, designing the flow through each task and testing it with real people. It's less about how screens look and more about whether people can achieve what they came for without confusion or frustration.",
      },
      {
        q: "How is UX different from UI?",
        a: "UX is about structure and flow: what happens, in what order, and why. UI is the visual layer: colour, typography, layout, components and how everything looks and feels. A good product needs both. UX usually comes first, so the interface is designed around journeys that already work, and then the two evolve together.",
      },
      {
        q: "Do I need UX for an MVP?",
        a: "Yes, but a lean version. You don't need months of research before launching, but a few user interviews, simple journey maps and a tested prototype can stop you building the wrong features. For an MVP I keep UX work short and focused only on the flows your first release depends on.",
      },
      {
        q: "Can you audit and improve my existing product's UX?",
        a: "Yes. A UX audit combines an expert review against usability principles, your analytics and a few sessions with real users to find where people get stuck or drop off. You receive a prioritised list of problems with recommended fixes, ranked by likely impact and effort, plus redesigned flows for the most important ones.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–6 weeks",
    idealFor: [
      "Founders before building an MVP",
      "Products with low sign-up or activation",
      "Teams redesigning an existing app",
    ],
    related: ["ui-design", "mvp-development", "frontend-development"],
    seo: {
      title: "UX Design & User Research in India",
      description:
        "Research-backed UX design: user interviews, journey maps, wireframes and tested prototypes that cut friction and lift sign-ups. Based in India.",
    },
  },
  {
    slug: "ui-design",
    group: "design",
    icon: "Palette",
    title: "UI (User Interface) Design",
    shortTitle: "UI Design",
    tagline: "Modern, on-brand screens and a design system developers love.",
    summary:
      "Polished, on-brand interfaces in Figma, backed by a reusable design system and developer-ready specs, so your product looks credible and ships faster.",
    intro: [
      "First impressions form in seconds. A clean, consistent interface tells users and investors your product is trustworthy before they've read a word. I design modern, on-brand screens in Figma — from landing pages to complex dashboards — with a strong visual hierarchy, purposeful colour and typography, and small details that make everyday tasks feel effortless rather than decorated.",
      "Every project includes a design system: reusable components, variables for colour, type and spacing, and documented states. That's what turns a set of nice screens into something developers can build quickly and accurately, and what keeps the product consistent as it grows. I design mobile-first, with accessible contrast and comfortable touch targets, then scale layouts up for tablets and desktops.",
    ],
    benefits: [
      {
        title: "Strong brand identity",
        text: "A distinct visual language makes your product recognisable on every screen.",
      },
      {
        title: "Delightful visuals",
        text: "Thoughtful details, motion cues and illustration make the product pleasant to use.",
      },
      {
        title: "Instant credibility",
        text: "A polished interface earns trust from users, partners and investors at first glance.",
      },
      {
        title: "Developer efficiency",
        text: "Components, tokens and specs let developers build faster with fewer questions.",
      },
      {
        title: "Responsive on every device",
        text: "Layouts adapt cleanly from small phones to large desktop screens.",
      },
    ],
    whyMe: {
      text: "I design with the build in mind. As an engineer, I know which visual choices are cheap to implement and which quietly double the effort, and I structure Figma files the way developers think: components, variants and tokens that map straight to code. You get a beautiful interface without the usual friction between the design and what actually ships.",
      points: [
        "Figma files built on components, variables and auto-layout",
        "Accessible contrast, sizing and touch targets",
        "Light and dark themes when you need them",
        "Specs that map directly to code tokens",
      ],
    },
    tech: [
      "Figma",
      "Components & variants",
      "Variables",
      "Auto-layout",
      "Adobe Illustrator",
      "Material-style kits",
      "shadcn-style kits",
      "Custom UI kits",
    ],
    process: [
      {
        title: "Brand brief",
        text: "We capture your brand, audience, competitors and the impression the product should make.",
      },
      {
        title: "Moodboards",
        text: "A few visual directions to choose from before any detailed screens are designed.",
      },
      {
        title: "High-fidelity mockups",
        text: "Pixel-accurate screens for every key flow, including empty, loading and error states.",
      },
      {
        title: "Design system",
        text: "Components, variables and guidelines that keep every future screen consistent.",
      },
      {
        title: "Developer hand-off",
        text: "Annotated specs, exported assets and a walkthrough, so the build matches the design.",
      },
    ],
    deliverables: [
      "Full screen designs for every key flow",
      "Component library in Figma",
      "Exportable assets (SVG icons and images)",
      "Style guide: colour, type, spacing and shadows",
      "Developer-ready specs and hand-off notes",
    ],
    faqs: [
      {
        q: "What is UI design?",
        a: "UI (user interface) design is the visual and interactive layer of a product: layout, colour, typography, icons, buttons and how each element responds when you use it. Good UI makes a product look trustworthy and feel easy, and it works hand in hand with UX, which defines the flows those screens belong to.",
      },
      {
        q: "Do you create custom design systems?",
        a: "Yes. Every project gets a design system scaled to its needs — from a compact UI kit for an MVP to a full library with tokens, variants and documentation for a larger product. I can start from a proven base like Material or a shadcn-style kit to save time, then customise it so it feels unmistakably yours.",
      },
      {
        q: "Will I get developer-friendly files?",
        a: "Yes. Files are organised with named components, variables for colour and spacing, auto-layout throughout and clear annotations. Developers can inspect measurements, export assets and match design tokens directly in code. Because I build frontends myself, I structure files the way I'd want to receive them as a developer.",
      },
      {
        q: "Can you match my existing brand?",
        a: "Absolutely. I start from your logo, colours, typography and any brand guidelines, then extend them into a full interface system, adding the UI colours, states and components most brand guides don't cover. If your brand is still early, I can suggest refinements that work better on screens without losing what's recognisable.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–6 weeks",
    idealFor: [
      "Startups that need to look credible fast",
      "Products with UX flows ready for visual design",
      "Teams building a reusable design system",
    ],
    related: ["ux-design", "frontend-development", "mvp-development"],
    seo: {
      title: "UI Design & Design Systems in India",
      description:
        "Modern, on-brand UI design in Figma with a reusable design system and developer-ready specs. Credible screens that ship faster. Based in India.",
    },
  },
  // GROW
  {
    slug: "digital-marketing",
    group: "grow",
    icon: "Megaphone",
    title: "Digital Marketing",
    shortTitle: "Digital Marketing",
    tagline: "SEO, content, social and ads that bring the right users.",
    summary:
      "Measured digital marketing for startups and SMBs — technical SEO, useful content, social and paid campaigns, with clear monthly reporting on what's working.",
    intro: [
      "A great product still needs people to find it. I help startups and growing businesses reach the right audience through technical SEO, content that answers real questions, focused social media and paid campaigns on Google, Meta and LinkedIn. Everything is tracked from the start, so you can see which channels bring sign-ups and sales — and which only bring clicks.",
      "Because I'm also a developer, I can fix the technical issues that quietly hold rankings back: slow pages, broken structured data, poor mobile layouts and missing tags. For Indian businesses that often means optimising for mobile search and local intent; for international clients, competing in global results. Either way, I don't promise rankings — I commit to sound work and honest reporting.",
    ],
    benefits: [
      {
        title: "Higher visibility",
        text: "Technical fixes and targeted content help your pages appear for the searches that matter.",
      },
      {
        title: "Targeted reach",
        text: "Campaigns focus budget on the audiences most likely to become customers.",
      },
      {
        title: "Analytics-driven",
        text: "Every channel is tracked, so decisions follow data rather than hunches.",
      },
      {
        title: "Authority content",
        text: "Useful articles and landing pages build trust with readers and search engines alike.",
      },
      {
        title: "Compounding growth",
        text: "Good SEO and content keep bringing visitors long after they're published.",
      },
    ],
    whyMe: {
      text: "Most marketers can't change your website, and most developers don't think about marketing. I do both. That means SEO fixes get shipped instead of sitting in a report, landing pages get built and tested quickly, and tracking is set up correctly from day one. I keep reports short and plain: what we did, what moved, and what we'll try next.",
      points: [
        "Technical SEO fixes I can implement myself",
        "Content planned around real search intent",
        "Ad campaigns with conversion tracking set up properly",
        "A monthly report in plain English, not vanity metrics",
      ],
    },
    tech: [
      "Google Analytics 4",
      "Google Search Console",
      "Ahrefs",
      "Semrush",
      "Meta Ads Manager",
      "Google Ads",
      "LinkedIn Ads",
      "Canva",
      "Figma",
    ],
    process: [
      {
        title: "Audit and strategy",
        text: "I review your site, analytics, competitors and audience, then propose channels and goals.",
      },
      {
        title: "Technical SEO fixes",
        text: "Speed, indexing, structured data and on-page issues are fixed directly in the codebase.",
      },
      {
        title: "Content plan",
        text: "A keyword-led calendar of articles and landing pages mapped to your customers' questions.",
      },
      {
        title: "Campaign execution",
        text: "Content goes live and ad campaigns launch with tracked conversions and sensible budgets.",
      },
      {
        title: "Reporting and refinement",
        text: "Monthly reviews show the results and shift effort towards what's working.",
      },
    ],
    deliverables: [
      "Keyword research and topic map",
      "SEO-optimised pages and technical fixes",
      "Content calendar",
      "Blog and landing-page copy",
      "Monthly performance report",
    ],
    faqs: [
      {
        q: "What's included?",
        a: "It depends on your goals, but a typical engagement covers a site audit, technical SEO fixes, keyword research, a content calendar, writing and optimising blog posts and landing pages, and running or improving paid campaigns. We agree the channels and monthly scope up front, so you know exactly what you're paying for and what to expect.",
      },
      {
        q: "How do you measure success?",
        a: "By business outcomes first: qualified leads, sign-ups, sales or booked calls, tracked in Google Analytics 4 and your CRM. Supporting metrics include organic traffic, keyword visibility, click-through rates and cost per acquisition for ads. Each month you get a short report showing what changed, why, and what we'll focus on next.",
      },
      {
        q: "Do you write the content?",
        a: "Yes. I write SEO-focused blog posts, landing pages and ad copy, researched around what your customers search for and reviewed with you for accuracy. For specialist topics I work from your input or a short interview with your team. AI tools may help with research and outlines, but every piece is written and edited by me.",
      },
      {
        q: "Can you run Google and Meta ads?",
        a: "Yes. I set up and manage campaigns on Google Ads, Meta (Facebook and Instagram) and LinkedIn, including audiences, ad copy, landing pages and conversion tracking. Ad spend is paid directly by you to each platform, separately from my fee, and I start with modest test budgets before scaling what proves profitable.",
      },
    ],
    typicalTimeline: "Ongoing, reviewed monthly",
    idealFor: [
      "Startups ready to grow beyond word of mouth",
      "SMBs whose website isn't bringing leads",
      "Products launching into a new market",
    ],
    related: ["growth-marketing", "ai-creative", "web-applications"],
    seo: {
      title: "SEO & Digital Marketing Services, India",
      description:
        "SEO, content, social and paid ads for startups and SMBs — tracked from day one, with plain-English monthly reports. Based in India, working worldwide.",
    },
  },
  {
    slug: "growth-marketing",
    group: "grow",
    icon: "TrendingUp",
    title: "Growth Marketing",
    shortTitle: "Growth Marketing",
    tagline: "Experiments across the funnel: acquisition, activation, retention, revenue.",
    summary:
      "A structured, data-led approach to growth: analyse the funnel, run focused experiments, and improve onboarding and retention so growth compounds instead of leaking.",
    intro: [
      "Growth marketing treats your whole funnel as one system. Instead of only buying more traffic, I look at where users drop off — at sign-up, during onboarding, after the first week — and run focused experiments to fix the biggest leaks. Small gains in activation and retention often matter more than another channel, because every new user then stays longer and is worth more.",
      "I combine product analytics, user research and quick experiments, and because I can change the product myself, tests ship in days rather than waiting in a developer queue. For Indian products that often means WhatsApp journeys, regional onboarding and price-sensitive offers; for international ones, lifecycle email and in-app nudges. Every experiment has a hypothesis, a metric and an honest write-up — including the ones that fail.",
    ],
    benefits: [
      {
        title: "Data-driven decisions",
        text: "Funnel and cohort data show exactly where growth is leaking.",
      },
      {
        title: "Faster, repeatable growth",
        text: "A steady experiment cadence turns lucky wins into a process you can repeat.",
      },
      {
        title: "Better retention",
        text: "Onboarding and lifecycle improvements keep more users active after the first week.",
      },
      {
        title: "Higher-quality acquisition",
        text: "Channels are judged on retained, paying users, not just sign-ups.",
      },
      {
        title: "Revenue optimisation",
        text: "Pricing pages, upgrade prompts and checkout flows are tested to lift revenue per user.",
      },
    ],
    whyMe: {
      text: "Growth work stalls when every test needs a developer. Because I write code, I can instrument events, build landing-page variants, tweak onboarding and set up WhatsApp or email automations myself. I'm also comfortable reading data honestly: if an experiment doesn't move the metric, we say so, learn from it and move on, rather than hunting for a vanity number to celebrate.",
      points: [
        "Clean event tracking in GA4, Mixpanel or PostHog",
        "Experiments shipped in days, not sprints",
        "Onboarding, email and WhatsApp journeys built in-house",
        "Honest experiment logs, including the failures",
      ],
    },
    tech: [
      "Google Analytics 4",
      "Mixpanel",
      "PostHog",
      "Hotjar",
      "Microsoft Clarity",
      "Firebase Analytics",
      "A/B testing tools",
      "Email automation",
      "WhatsApp automation",
    ],
    process: [
      {
        title: "Funnel and cohort analysis",
        text: "We map the funnel, find where users drop off and see which cohorts stick around.",
      },
      {
        title: "Hypotheses and experiments",
        text: "Ideas are prioritised by impact and effort, each with a clear success metric.",
      },
      {
        title: "Acquisition strategy",
        text: "Channels are tested and scaled based on the quality of the users they bring.",
      },
      {
        title: "Onboarding and retention",
        text: "First-run experience, lifecycle messages and nudges are improved to keep users active.",
      },
      {
        title: "Continuous optimisation",
        text: "Results feed a growth roadmap that we review together every few weeks.",
      },
    ],
    deliverables: [
      "Funnel analysis and growth roadmap",
      "Experiment designs and results log",
      "Segmentation and cohort insights",
      "Retention and lifecycle plan",
      "Campaign and experiment reports",
    ],
    faqs: [
      {
        q: "How is growth marketing different from digital marketing?",
        a: "Digital marketing focuses mainly on attracting visitors through SEO, content, social and ads. Growth marketing covers the whole funnel — acquisition, activation, retention, referral and revenue — and works through measured experiments, often inside the product itself. Many businesses need both: digital marketing to fill the top of the funnel, and growth work to keep those users.",
      },
      {
        q: "Do you run experiments?",
        a: "Yes, that's the core of the work. Each experiment starts with a hypothesis, a target metric and a minimum run time, then ships as an A/B test or a staged rollout. When traffic is too low for statistical tests, I use qualitative signals and before-and-after comparisons, and I'm clear about how confident we can be in the result.",
      },
      {
        q: "Can you improve my onboarding?",
        a: "Usually, yes — onboarding is often where the biggest gains are. I review session recordings, funnel data and user feedback to find where new users stall, then simplify steps, add helpful defaults, improve empty states and set up timely nudges by email, push or WhatsApp. Each change is measured against activation, not just clicks.",
      },
      {
        q: "Which metrics do you track?",
        a: "It depends on your business model, but typically activation rate, retention by cohort, conversion to paid, revenue per user, churn and acquisition cost by channel. We agree one north-star metric and a few supporting ones at the start, so everyone knows what success means and experiments are judged consistently.",
      },
    ],
    typicalTimeline: "Ongoing, in experiment cycles",
    idealFor: [
      "Products with users but flat growth",
      "Apps losing users after the first week",
      "Teams that want a repeatable growth process",
    ],
    related: ["digital-marketing", "ai-creative", "ai-integration"],
    seo: {
      title: "Growth Marketing & Retention, India",
      description:
        "Funnel analysis, A/B experiments, onboarding and retention work that turns sign-ups into loyal, paying users. Growth marketing from India.",
    },
  },
  // AI & CLOUD
  {
    slug: "ai-integration",
    group: "ai-cloud",
    icon: "Bot",
    title: "AI Integration & Automation",
    shortTitle: "AI Integration",
    tagline: "Practical AI in your product and operations — accurate, private, affordable.",
    summary:
      "Chatbots, smart search, document processing, agents and workflow automation, built into your product with accuracy, privacy and running costs kept firmly under control.",
    intro: [
      "AI is worth it when it removes real work: answering the same customer questions at midnight, pulling data out of invoices, finding the right paragraph in a hundred documents, or routing leads before anyone has had their coffee. I build those features into your product and operations using models from OpenAI, Anthropic and Google — or open-source models when privacy or cost demands it.",
      "The hard part isn't calling an API; it's making the result dependable. I start with a cheap prototype, test it against real examples from your business, and only then integrate it properly — with guardrails, human review where it matters, usage logs and spending limits. For Indian businesses that often means WhatsApp-first automation and bilingual support; global teams get the same rigour.",
    ],
    useCases: [
      {
        icon: "MessagesSquare",
        title: "Support chatbot on your docs",
        text: "Answers customer questions from your help centre and policies, cites its sources and hands off to your team when unsure.",
      },
      {
        icon: "MessageCircle",
        title: "Lead qualification on WhatsApp",
        text: "Asks the right questions, scores each lead and books calls, so sales only spends time on serious prospects.",
      },
      {
        icon: "ScanText",
        title: "Invoice and document extraction",
        text: "Pulls structured data from invoices, forms and PDFs into your systems, flagging low-confidence fields for review.",
      },
      {
        icon: "Search",
        title: "Internal knowledge search",
        text: "Lets your team ask questions across wikis, contracts and SOPs, with the source paragraph shown alongside each answer.",
      },
      {
        icon: "PenLine",
        title: "Content drafting with review",
        text: "Drafts product descriptions, emails and replies in your voice, always approved by a person before anything is sent.",
      },
      {
        icon: "ChartColumn",
        title: "Report automation",
        text: "Turns raw data from your tools into scheduled summaries and dashboards, delivered by email, Slack or WhatsApp.",
      },
    ],
    benefits: [
      {
        title: "Automate repetitive work",
        text: "Data entry, triage, summaries and follow-ups run automatically, freeing your team for judgement calls.",
      },
      {
        title: "24/7 customer support",
        text: "An assistant grounded in your docs answers common questions instantly and hands off to a human when needed.",
      },
      {
        title: "Answers from your data",
        text: "Retrieval-augmented generation grounds responses in your own documents, policies and product data.",
      },
      {
        title: "Faster document decisions",
        text: "Contracts, invoices and reports are read, extracted and summarised in seconds instead of hours.",
      },
      {
        title: "Controlled cost, safe outputs",
        text: "Guardrails, evaluation sets, human review and spending caps keep quality high and bills predictable.",
      },
    ],
    whyMe: {
      text: "I treat AI features like any other production software: measured, monitored and boring in the best way. Before building anything, I'll tell you honestly whether AI is the right tool or whether a simple rule would do the job. I build evaluation sets from your real examples, so we know how accurate a feature is before customers see it, and I design for cost from day one.",
      points: [
        "An honest use-case and ROI check before any build",
        "Evaluation against your real examples, not cherry-picked demos",
        "Privacy first: data minimisation and provider terms reviewed",
        "Usage logs, cost caps and model fallbacks in production",
      ],
    },
    tech: [
      "OpenAI API",
      "Anthropic Claude API",
      "Google Gemini API",
      "Open-source models",
      "LangChain",
      "LlamaIndex",
      "pgvector",
      "Pinecone",
      "Qdrant",
      "Python",
      "FastAPI",
      "Node.js",
      "n8n",
      "Make",
      "Zapier",
      "WhatsApp Business API",
    ],
    process: [
      {
        title: "Use-case discovery and ROI check",
        text: "We find the tasks where AI saves real time or money, and drop the ones a simple rule would handle.",
      },
      {
        title: "Data and privacy review",
        text: "We decide what data the AI may see, how it's protected and which provider terms fit.",
      },
      {
        title: "Prototype in 1–2 weeks",
        text: "A working prototype on your real data, cheap enough to throw away if it doesn't earn its keep.",
      },
      {
        title: "Evaluation against real examples",
        text: "The prototype is scored on a set of your real cases, so accuracy is measured rather than assumed.",
      },
      {
        title: "Production integration with monitoring",
        text: "The feature is built into your product or workflows with logging, guardrails and alerts.",
      },
      {
        title: "Ongoing tuning",
        text: "Prompts, retrieval and model choice are refined to improve accuracy and lower cost over time.",
      },
    ],
    deliverables: [
      "A working AI feature or automation in production",
      "Prompt and retrieval pipeline with an evaluation set",
      "Admin controls and usage logs",
      "Cost and latency report",
      "Documentation and a hand-over session",
    ],
    faqs: [
      {
        q: "Which AI use cases actually pay off for small businesses?",
        a: "The best returns usually come from narrow, repetitive tasks with clear right answers: answering common support questions from your docs, qualifying leads, extracting data from invoices or forms, searching internal knowledge and drafting routine content for review. Open-ended “AI that does everything” projects rarely pay off. I'll help you pick one or two high-value tasks to start with.",
      },
      {
        q: "Is my data safe — will it be used to train models?",
        a: "Under their current business API terms, OpenAI, Anthropic and Google say they don't use API data to train their models by default; I confirm the terms for the provider and plan we choose. On top of that, I send only the data a task needs, mask personal details where possible, and can use self-hosted open-source models for sensitive work.",
      },
      {
        q: "How do you stop the AI from making things up?",
        a: "By grounding it and testing it. Answers are generated from your own documents through retrieval, with instructions to say “I don't know” rather than guess. Each feature is scored against an evaluation set of real questions before launch, answers can show their sources, and high-stakes actions go through human review. Monitoring flags weak answers so we can improve them.",
      },
      {
        q: "What will it cost to run each month?",
        a: "It depends on volume, the model you use and how much text each request handles. During the prototype I log real usage and give you a cost estimate before launch. In production I keep costs down with smaller models where they're good enough, caching and sensible limits, while spending caps and alerts prevent surprises on your bill.",
      },
    ],
    typicalTimeline: "Prototype in 1–2 weeks, then production rollout",
    idealFor: [
      "Support teams answering the same questions daily",
      "Operations buried in documents and data entry",
      "SaaS products adding AI features users will pay for",
    ],
    related: ["web-applications", "devops-cloud", "backend-development"],
    seo: {
      title: "AI Integration & Automation in India",
      description:
        "AI integration for startups and SMBs: chatbots, RAG search, document extraction, agents and workflow automation — accurate, private and cost-controlled.",
    },
  },
  {
    slug: "ai-creative",
    group: "ai-cloud",
    icon: "Sparkles",
    title: "AI Creative & Ad Generation",
    shortTitle: "AI Creative",
    tagline: "On-brand ad creatives and short videos, made faster with AI.",
    summary:
      "Ad creatives, product visuals and short-form video made with AI tools and human art direction — more variations to test, faster launches and lower production cost.",
    intro: [
      "Paid campaigns live or die on their creative, and ad platforms reward advertisers who test many variations. Traditional shoots make that slow and expensive. I combine AI image and video generation with human art direction to produce on-brand ad creatives, product visuals and short-form videos for Reels, Shorts, feeds and stories — in the volume modern campaigns actually need.",
      "AI does the heavy lifting on drafts, backgrounds, variations and voice-overs; I handle the concept, scripting, editing and brand consistency. Every generated asset is reviewed by a human for accuracy, likeness and licensing before delivery. That matters for small Indian brands stretching a modest budget across Meta and Google, and for international teams that need localised variants quickly.",
    ],
    benefits: [
      {
        title: "More creatives to test",
        text: "Several concepts and hooks per batch help you find winning ads faster.",
      },
      {
        title: "Faster campaign launches",
        text: "Creatives arrive in days, without waiting on shoots and studio time.",
      },
      {
        title: "Consistent brand look",
        text: "Brand guidelines and reference images keep every asset recognisably yours.",
      },
      {
        title: "Lower production cost",
        text: "AI replaces much of the cost of shoots, models and locations for routine assets.",
      },
      {
        title: "Every format covered",
        text: "Reels, Shorts, feed, stories and display sizes are delivered from each concept.",
      },
    ],
    whyMe: {
      text: "AI tools make it easy to produce a lot of mediocre content quickly. My job is the opposite: fewer, better ideas, executed in every format you need. I start from your brand, audience and campaign goal, write hooks and scripts that suit how people actually scroll, and check every asset for odd details, misleading claims and licensing issues. Nothing ships straight from a generator.",
      points: [
        "Concepts and hooks written for each platform",
        "Art direction that keeps visuals on-brand",
        "Ad specs for Meta and Google checked per format",
        "Platform ad and AI-disclosure policies checked per campaign",
      ],
    },
    tech: [
      "Image generation models",
      "Video generation models",
      "AI voice-over",
      "Figma",
      "CapCut",
      "Adobe Premiere Pro",
      "Meta ad specifications",
      "Google ad specifications",
    ],
    process: [
      {
        title: "Brand and campaign brief",
        text: "We set the goal, audience, offer and brand guardrails for the batch.",
      },
      {
        title: "Concepts and scripts",
        text: "I propose angles, hooks and short scripts for you to approve before production.",
      },
      {
        title: "AI generation with art direction",
        text: "Visuals, video and voice-over are generated and steered to match the brief and brand.",
      },
      {
        title: "Human edit and brand check",
        text: "Every asset is edited and checked for accuracy, likeness, licensing and brand fit.",
      },
      {
        title: "Delivery in all formats",
        text: "Final files are exported in the sizes and specs each platform requires.",
      },
      {
        title: "Performance review and next batch",
        text: "We look at what performed and use it to brief the next round.",
      },
    ],
    deliverables: [
      "Ad creative sets (static and video)",
      "Product visuals and lifestyle images",
      "Captions and hooks for each variant",
      "Editable source files",
      "Usage notes covering tools and licences",
    ],
    faqs: [
      {
        q: "Can AI-generated ads run on Meta and Google?",
        a: "Yes — both platforms allow ads made or edited with AI, subject to their current advertising policies, which cover misleading content and, in some cases, disclosure of AI use. Those policies change, so I check the latest requirements for each platform on every campaign, and I avoid riskier formats such as realistic depictions of real people.",
      },
      {
        q: "Who owns the creatives?",
        a: "You do. The final creatives I deliver are yours to use in your campaigns, and I only use tools whose terms allow commercial use. Copyright law on purely AI-generated material is still evolving in many countries, so I note which tools were used for each asset and add human design and editing work on top.",
      },
      {
        q: "How do you keep them on-brand?",
        a: "I build a brief from your brand guidelines, colours, fonts, product photos and past ads, and use reference images to guide generation. Logos, typography and layouts are added in design tools rather than generated, so they're always correct. Each asset is checked against the brief before it reaches you, and off-brand outputs never leave my desk.",
      },
      {
        q: "How many variations do I get?",
        a: "We agree the batch size in the brief, based on your budget and how much testing your ad spend can support. A batch usually covers a few concepts, each with several hooks and every format you need. Once the first results come in, we focus the next batch on the angles that performed best.",
      },
    ],
    typicalTimeline: "First batch within days of an approved brief",
    idealFor: [
      "D2C brands running Meta and Google ads",
      "Startups without budget for regular shoots",
      "Teams needing localised ad variants",
    ],
    related: ["digital-marketing", "growth-marketing", "ui-design"],
    seo: {
      title: "AI Ad Creatives & Product Visuals, India",
      description:
        "On-brand AI ad creatives, product visuals and short-form video with human art direction — more variants to test, faster launches, lower cost.",
    },
  },
  {
    slug: "devops-cloud",
    group: "ai-cloud",
    icon: "Cloud",
    title: "DevOps & Cloud",
    shortTitle: "DevOps & Cloud",
    tagline: "Automated, reliable infrastructure — boring releases, rare outages, sensible bills.",
    summary:
      "CI/CD, containers, monitoring, security and cost control on AWS or GCP — so shipping is routine, incidents are rare and your cloud bill makes sense.",
    intro: [
      "If deployments are nerve-racking, servers are configured by hand, or nobody notices an outage until a customer complains, your infrastructure is costing you more than the bill suggests. I set up reliable, automated infrastructure: CI/CD pipelines that test and deploy every change, containerised apps, infrastructure as code, monitoring with useful alerts, and backups that have actually been restored.",
      "I work mainly on AWS and GCP, with Docker, Terraform and Kubernetes when the scale justifies them, and simpler managed services when it doesn't. Cost matters as much as uptime, especially for startups in India watching every rupee and for any team surprised by last month's invoice. You get right-sized resources, clear documentation and runbooks your team can follow without me.",
    ],
    benefits: [
      {
        title: "Faster, safer releases",
        text: "Automated tests and pipelines make deploying a routine, reversible step.",
      },
      {
        title: "Fewer outages",
        text: "Monitoring, alerts and health checks catch problems before your customers do.",
      },
      {
        title: "Lower cloud bills",
        text: "Right-sized resources, autoscaling and clean-up of idle services cut waste.",
      },
      {
        title: "Security and backups",
        text: "Least-privilege access, secrets management and tested backups are standard, not extras.",
      },
      {
        title: "Scale on demand",
        text: "Containers and autoscaling absorb traffic spikes without manual firefighting.",
      },
    ],
    whyMe: {
      text: "I'm a developer who does DevOps, so I build infrastructure developers actually enjoy using: fast pipelines, preview environments and clear logs. I'm pragmatic about tools — I'll only recommend Kubernetes when it earns its complexity — and I document everything, because infrastructure that only one person understands is a risk. The aim is that you need me less over time, not more.",
      points: [
        "Infrastructure as code, so environments are reproducible",
        "Alerts tuned to be actionable, not noisy",
        "Backups tested with real restores",
        "Runbooks and a hand-over so your team can run it",
      ],
    },
    tech: [
      "AWS",
      "GCP",
      "Azure (basics)",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "GitLab CI",
      "Nginx",
      "Prometheus",
      "Grafana",
      "Sentry",
      "Cloudflare",
    ],
    process: [
      {
        title: "Infrastructure audit",
        text: "I review your current setup, costs, deployment process and biggest risks.",
      },
      {
        title: "Target architecture and cost plan",
        text: "We agree a right-sized architecture and an estimate of monthly cloud spend.",
      },
      {
        title: "Containerise and automate CI/CD",
        text: "Apps are containerised, and every change is tested and deployed by a pipeline.",
      },
      {
        title: "Monitoring, logging and alerts",
        text: "Dashboards, structured logs, error tracking and alerts that point to the real problem.",
      },
      {
        title: "Security hardening and backups",
        text: "Access, secrets, network rules and backups are tightened and restore-tested.",
      },
      {
        title: "Hand-over with runbooks",
        text: "Documentation and runbooks so your team can deploy, debug and recover with confidence.",
      },
    ],
    deliverables: [
      "CI/CD pipelines for every service",
      "Dockerfiles and infrastructure as code (Terraform)",
      "Monitoring dashboards and alerts",
      "Backup and disaster-recovery plan",
      "Runbooks for common operations and incidents",
    ],
    faqs: [
      {
        q: "Do I actually need Kubernetes?",
        a: "Often not, at least at first. For many startups a managed container service, a platform like Vercel or a couple of well-configured servers is simpler and cheaper. Kubernetes earns its complexity when you run many services, need fine-grained autoscaling or have strict portability requirements. I'll recommend the simplest setup that meets your needs and leaves room to grow.",
      },
      {
        q: "Can you reduce my cloud bill?",
        a: "Usually, yes. Common savings come from right-sizing over-provisioned servers and databases, removing idle resources, autoscaling, reserved or committed-use pricing where it fits, caching and a CDN, and tidying storage and logs. I start with an audit and a prioritised list of savings, so you can see the expected impact before anything changes.",
      },
      {
        q: "Can you migrate my app to AWS or GCP without downtime?",
        a: "In most cases, yes, or with only a brief planned window. I build the new environment in parallel, sync the data, test thoroughly, then switch traffic using DNS or a load balancer while keeping a rollback path ready. Some database moves need a short maintenance window; if so, we schedule it together for a quiet time.",
      },
      {
        q: "Do you offer ongoing DevOps support?",
        a: "Yes. After setup I offer ongoing support on a monthly retainer or as on-demand hours: monitoring, updates, security patches, cost reviews, incident response during agreed hours and help scaling as you grow. Because everything is documented and defined in code, you're never locked in — your own team or another engineer can take over at any time.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–6 weeks to set up, then ongoing support",
    idealFor: [
      "Startups still deploying by hand",
      "Teams facing rising cloud bills",
      "Products preparing for a launch or traffic spike",
    ],
    related: ["ai-integration", "backend-development", "web-applications"],
    seo: {
      title: "DevOps & Cloud Services (AWS, GCP), India",
      description:
        "CI/CD, Docker, Kubernetes, monitoring and cloud cost control on AWS and GCP — reliable releases, fewer outages and sensible bills. Based in India.",
    },
  },
];

export function getService(slug: string): ServiceEntry | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServicesByGroup(group: ServiceGroupId): ServiceEntry[] {
  return services.filter((service) => service.group === group);
}

export function getServiceGroup(id: ServiceGroupId): ServiceGroup | undefined {
  return serviceGroups.find((group) => group.id === id);
}

/** Services listed in `related`, in that order, skipping unknown slugs. */
export function getRelatedServices(service: ServiceEntry, limit = 3): ServiceEntry[] {
  return (service.related ?? [])
    .map((slug) => getService(slug))
    .filter((related): related is ServiceEntry => Boolean(related))
    .slice(0, limit);
}

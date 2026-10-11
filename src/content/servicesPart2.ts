import type { Service } from "@/content/services";

/**
 * Services in the Design, Grow and AI & Cloud groups. Split from services.ts only to keep each
 * file a readable length; import from "@/content/services".
 */
export const servicesPart2: Service[] = [
  // DESIGN
  {
    slug: "ux-design",
    group: "design",
    icon: "Route",
    title: "UX (User Experience) Design",
    shortTitle: "UX Design",
    tagline: "Journeys shaped by research, so fewer people give up at sign-up.",
    summary:
      "Through interviews, journey maps and prototype sessions with actual people, I find out how your users decide — so your first build is aimed correctly.",
    intro: [
      "When UX works nobody notices it: people find what they need, finish what they began and return. When it doesn't, you see abandoned sign-ups, support tickets and features no one touches. I start from evidence — interviews, analytics, watching people use things — and turn it into clear journeys, wireframes and prototypes you can test before a single screen is coded.",
      "Designing for India brings its own patterns: people switch between English and regional languages, expect OTP sign-in and UPI, share a phone across the family and often decide things over WhatsApp. I build these into flows where they matter and follow international conventions when your audience is abroad. Either way, choices follow what users actually do, not the loudest voice in a meeting.",
    ],
    benefits: [
      {
        title: "Decisions grounded in users",
        text: "Choices rest on research and testing rather than opinion.",
      },
      {
        title: "Fewer rebuilds",
        text: "Problems surface in sketches and prototypes, where fixing them costs hours, not weeks.",
      },
      {
        title: "More people get through",
        text: "Clear journeys help more visitors sign up, finish tasks and come back.",
      },
      {
        title: "Quicker development",
        text: "Engineers build from settled flows and written specs, not hunches about corner cases.",
      },
      {
        title: "Built for Indian habits",
        text: "Where it applies, journeys allow for OTP log-in, UPI payment, local languages and a phone used by the whole family.",
      },
    ],
    whyMe: {
      text: "Writing code myself keeps my UX honest about what can ship well and on schedule. No beautiful journey that breaks the moment it meets live data, a weak connection or an API ceiling. Research is scaled to what you can spend — five well-chosen interviews often teach more than a large survey — and each recommendation comes with a plain reason.",
      points: [
        "Lean research matched to your stage and budget",
        "Prototypes tried by real users, not only the team",
        "Flows checked for buildability while I design",
        "Documentation your developers can follow",
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
        title: "Goals",
        text: "We agree business aims, target users and what a good outcome looks like.",
      },
      {
        title: "Research",
        text: "Interviews, surveys and analytics show how people behave today and where they get stuck.",
      },
      {
        title: "Wireframes",
        text: "Plain layouts for the key screens, about structure and order rather than looks.",
      },
      {
        title: "Clickable prototype",
        text: "A Figma prototype close enough to the real thing to put in front of people.",
      },
      {
        title: "Usability sessions",
        text: "People from your audience try the main tasks; I observe, log where they hesitate and adjust.",
      },
      {
        title: "Write it up",
        text: "Journeys, decisions and guidelines are documented so design and code stay aligned.",
      },
    ],
    deliverables: [
      "Personas and journey maps",
      "Wireframes for the key screens",
      "A clickable prototype in Figma",
      "Research findings with recommendations",
      "A UX rulebook your team can keep using",
    ],
    faqs: [
      {
        q: "What does UX design involve?",
        a: "User-experience design makes a product straightforward and rewarding to use. It means learning who your users are, arranging information sensibly, planning the route through each task and trying it out on real people. The question it answers isn't 'does this look good?' but 'can people get done what they came for, without getting lost?'",
      },
      {
        q: "Where does UX end and UI begin?",
        a: "UX is the structure and flow: what happens, in which order and why. UI is the visual layer: colour, type, layout, components and the feel of each interaction. A good product needs both. UX usually comes first so the interface is drawn around journeys that already work, then the two develop together.",
      },
      {
        q: "Does an MVP need UX work?",
        a: "Yes, in a lighter form. You don't need months of research before launch, but a few interviews, simple journey maps and a tested prototype can stop you building the wrong things. For a first version I keep UX short and aimed only at the flows that release depends on.",
      },
      {
        q: "Can you review the UX of a product I already have?",
        a: "Yes. An audit pairs a heuristic review with your analytics and a few short sessions with real users, to pinpoint where people hesitate or give up. The output is a prioritised list of issues — each with a proposed fix, sorted by expected impact and effort — and reworked journeys for the most pressing ones.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–6 weeks",
    idealFor: [
      "Founders about to build a first version",
      "Products with weak sign-up or activation",
      "Teams reworking an existing app",
    ],
    related: ["ui-design", "mvp-development", "frontend-development"],
    seo: {
      title: "UX Design & User Research Services in India",
      description:
        "UX design from India grounded in research: interviews, journey maps, wireframes and tested prototypes that reduce friction and lift sign-ups.",
    },
  },
  {
    slug: "ui-design",
    group: "design",
    icon: "Palette",
    title: "UI (User Interface) Design",
    shortTitle: "UI Design",
    tagline: "Clean, on-brand screens plus a design system developers can build from.",
    summary:
      "Polished interfaces in Figma that fit your brand, backed by reusable components and specs ready for developers — so the product looks credible and ships sooner.",
    intro: [
      "People judge a product in seconds. A clean, consistent interface tells users and investors it can be trusted before they have read a word. I design modern, on-brand screens in Figma — landing pages through to dense dashboards — with clear hierarchy, purposeful colour and type, and small touches that make daily tasks feel easy rather than decorated.",
      "A design system is part of every job: shared components, tokens for colour, type and spacing, and each state written down. It's the difference between a pretty mock-up and something engineers can implement fast and faithfully — and it keeps new screens in step with old ones. Phones come first, with readable contrast and tap targets big enough for thumbs; tablet and desktop layouts follow.",
    ],
    benefits: [
      {
        title: "A look that's yours",
        text: "A distinct visual language makes the product recognisable on every screen.",
      },
      {
        title: "Pleasant to use",
        text: "Considered details, motion cues and imagery make the product enjoyable.",
      },
      {
        title: "Credible at a glance",
        text: "A polished interface wins trust from users, partners and investors quickly.",
      },
      {
        title: "Faster for developers",
        text: "Components, tokens and specs mean fewer questions and quicker builds.",
      },
      {
        title: "Fits every screen",
        text: "Layouts adjust cleanly from small phones to big monitors.",
      },
    ],
    whyMe: {
      text: "Because I'll often be the one coding it, I design with implementation in view. I can tell which visual ideas cost an afternoon and which secretly cost a fortnight, and I lay out Figma the way engineers read it — components, variants and tokens that line up one-to-one with code. The result looks polished, with none of the usual friction between mock-up and finished build.",
      points: [
        "Figma organised around components, variables and auto layout",
        "Accessible contrast, sizes and tap targets",
        "A dark theme alongside the light one, if you want it",
        "Specs that map directly onto code tokens",
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
        text: "We write down your brand, who it's for, who you compete with and the feeling it should give.",
      },
      {
        title: "Directions",
        text: "A few visual routes to choose between before detailed screens begin.",
      },
      {
        title: "Finished screens",
        text: "Precise screens for every key flow, empty, loading and error states included.",
      },
      {
        title: "Design system",
        text: "Components, variables and rules that keep future screens consistent.",
      },
      {
        title: "Handover to developers",
        text: "Marked-up specs, exported files and a guided tour, so what gets built is what was drawn.",
      },
    ],
    deliverables: [
      "Screens for every key flow",
      "A component library in Figma",
      "Icons and images exported as SVG and ready to use",
      "A visual rulebook covering colour, type, spacing and depth",
      "Specs and handover notes for developers",
    ],
    faqs: [
      {
        q: "What is UI design?",
        a: "Interface design is everything you see and touch: arrangement, colour, lettering, icons, controls and the way each one reacts. Done well, it makes a product seem dependable and effortless. It pairs with UX, which decides the journeys those screens sit inside.",
      },
      {
        q: "Do you make custom design systems?",
        a: "Yes. Each project gets a system sized to it — from a compact kit for a first version to a full library with tokens, variants and documentation for a larger product. I can begin from a proven base such as Material or a shadcn-style kit to save time, then shape it until it feels clearly your own.",
      },
      {
        q: "Will developers find the files easy to use?",
        a: "Yes. Files use named components, variables for colour and spacing, auto-layout throughout and clear notes. Developers can inspect sizes, export assets and match tokens directly in code. Since I build frontends myself, I lay files out the way I'd want to receive them.",
      },
      {
        q: "Can you work within my current brand?",
        a: "Of course. I start from your logo, colours, type and any guidelines, then extend them into a full interface system, adding the UI colours, states and components most brand guides leave out. If the brand is still young, I can suggest screen-friendly refinements that keep what people recognise.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "2–6 weeks",
    idealFor: [
      "Young companies that must look established, fast",
      "Products whose UX flows are ready for visuals",
      "Teams after a design system they can reuse",
    ],
    related: ["ux-design", "frontend-development", "mvp-development"],
    seo: {
      title: "UI Design & Design Systems Studio in India",
      description:
        "Figma UI design from India — branded screens, a reusable component system and specs engineers can work from, so the product earns trust and reaches users faster.",
    },
  },
  // GROW
  {
    slug: "digital-marketing",
    group: "grow",
    icon: "Megaphone",
    title: "Digital Marketing & SEO",
    shortTitle: "Digital Marketing & SEO",
    tagline: "Search, content, social and ads that reach the people you want.",
    summary:
      "Measured marketing for startups and small businesses: technical SEO, useful content, social and paid campaigns, with a clear monthly report on what moved.",
    intro: [
      "Being good isn't the same as being found. I help young and growing companies get in front of the right audience with technical SEO, articles that answer what people actually search, considered social posts and paid campaigns across Google, Meta and LinkedIn. Measurement goes in before anything else, so you can tell the channels that produce sign-ups and sales from those that only produce clicks.",
      "Being a developer as well, I can repair the hidden faults that drag rankings: sluggish pages, faulty structured data, poor phone layouts, absent tags. In India that tends to mean phone searches with local intent; abroad, holding your own in international results. Wherever you are, I won't guarantee positions — I'll guarantee careful work and straight reporting.",
    ],
    benefits: [
      {
        title: "Seen more often",
        text: "Repairs under the hood plus focused articles get your pages seen for the queries that matter.",
      },
      {
        title: "Budget on the right people",
        text: "Campaigns aim spend at the audiences most likely to buy.",
      },
      {
        title: "Led by the numbers",
        text: "Every channel is tracked, so choices follow data instead of hunches.",
      },
      {
        title: "Content people trust",
        text: "Helpful articles and landing pages earn credibility with readers and search engines.",
      },
      {
        title: "Growth that builds on itself",
        text: "Good SEO and content keep attracting visitors long after they're published.",
      },
    ],
    whyMe: {
      text: "Most marketers can't edit your website, and most developers don't think about marketing. I do both. SEO fixes get shipped instead of waiting in a report, landing pages are built and tested quickly, and tracking is right from the first day. Reports stay short and plain: what we did, what changed and what we'll try next.",
      points: [
        "Technical SEO fixes I can make myself",
        "Articles planned from what people genuinely search for",
        "Ad campaigns that track real conversions",
        "A plain-English monthly report, no vanity numbers",
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
        title: "Audit and plan",
        text: "I study your website, numbers, competitors and audience, then suggest where to focus and what to aim for.",
      },
      {
        title: "Technical fixes",
        text: "I correct load times, indexing, schema markup and page-level faults inside the codebase itself.",
      },
      {
        title: "Content plan",
        text: "A publishing schedule of posts and landing pages, each built on a question customers ask.",
      },
      {
        title: "Campaigns go live",
        text: "Content is published and ads launch with tracked conversions and sensible budgets.",
      },
      {
        title: "Report and refine",
        text: "Monthly reviews show results and move effort toward what's working.",
      },
    ],
    deliverables: [
      "Keyword research and a topic map",
      "Optimised pages and technical fixes",
      "A content calendar",
      "Blog and landing-page copy",
      "A monthly performance report",
    ],
    faqs: [
      {
        q: "What does it include?",
        a: "Your goals decide it. Usually it means auditing the site, fixing technical SEO, researching keywords, drawing up a publishing calendar, writing and refreshing posts and landing pages, and launching or improving paid ads. Channels and the monthly workload are agreed in advance, so the invoice holds no surprises.",
      },
      {
        q: "How is success measured?",
        a: "Outcomes for the business come first — good leads, sign-ups, sales and booked calls, measured in Google Analytics 4 and your CRM. Behind those sit organic visits, keyword reach, click-through rates and what each ad conversion costs. A brief monthly note explains what moved, the likely reason, and next month's focus.",
      },
      {
        q: "Will you write the content?",
        a: "I do. Posts, landing pages and ad text are researched against real customer searches and shown to you to confirm the facts. On specialist subjects I start from your notes or a quick chat with your team. AI may assist with research or outlines, but I write and edit every piece myself.",
      },
      {
        q: "Do you manage Google and Meta ads?",
        a: "Yes. I set up and run campaigns on Google Ads, Meta (Facebook and Instagram) and LinkedIn: audiences, copy, landing pages and conversion tracking. You pay ad spend straight to each platform, separate from my fee, and I begin with small test budgets before scaling whatever proves profitable.",
      },
    ],
    typicalTimeline: "Ongoing, reviewed monthly",
    idealFor: [
      "Startups ready to grow past word of mouth",
      "Small businesses whose site brings few leads",
      "Products entering a new market",
    ],
    related: ["growth-marketing", "ai-creative", "web-applications"],
    seo: {
      title: "SEO & Digital Marketing for Startups in India",
      description:
        "SEO, content, social and paid ads for startups and small businesses — tracked from day one and reported monthly in plain English. India-based, working worldwide.",
    },
  },
  {
    slug: "growth-marketing",
    group: "grow",
    icon: "TrendingUp",
    title: "Growth Marketing",
    shortTitle: "Growth Marketing",
    tagline: "Experiments at every stage: acquisition, activation, retention, revenue.",
    summary:
      "A structured, data-led way to grow: study the funnel, run focused experiments and fix onboarding and retention so gains add up instead of leaking away.",
    intro: [
      "Growth marketing treats the whole funnel as one system. Rather than only buying more traffic, I look for where people drop away — at sign-up, during onboarding, after the first week — and run focused experiments on the biggest leaks. Small lifts in activation and retention often beat a new channel, because every user then stays longer and is worth more.",
      "Product data, conversations with users and small tests feed the work — and since I can edit the product directly, a test goes live in days rather than queuing for an engineer. For Indian products that may be WhatsApp flows, onboarding in local languages or offers tuned to price-conscious buyers; elsewhere, lifecycle emails and in-app nudges. Each test carries a hypothesis, a target number and a frank summary, even when it fails.",
    ],
    benefits: [
      {
        title: "Decisions from data",
        text: "Funnel and cohort numbers show exactly where growth is slipping.",
      },
      {
        title: "Growth you can repeat",
        text: "A steady rhythm of experiments turns lucky wins into a process.",
      },
      {
        title: "People stay longer",
        text: "Better onboarding and lifecycle messages keep more users active past week one.",
      },
      {
        title: "Better users, not just more",
        text: "A channel is scored by the paying customers who stay, not by headline sign-up counts.",
      },
      {
        title: "More revenue per user",
        text: "Pricing pages, upgrade prompts and checkout are tested to raise what each user is worth.",
      },
    ],
    whyMe: {
      text: "Growth slows to a crawl when each test waits on an engineer. I write the code, so tracking, alternative landing pages, onboarding tweaks and WhatsApp or email sequences all happen without a hand-off. I also read results without spin: if a test changes nothing, we note it, take the lesson and move on — no digging for a prettier number.",
      points: [
        "Tidy events tracked in GA4, Mixpanel or PostHog",
        "Tests live within days rather than sprints",
        "Onboarding, email and WhatsApp flows built by me",
        "Honest experiment logs, failures included",
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
        title: "Funnel and cohorts",
        text: "We map the funnel, find where people leave and see which groups stick.",
      },
      {
        title: "Ideas and tests",
        text: "Each idea is scored for payoff and effort, and given one number that defines success.",
      },
      {
        title: "Acquisition",
        text: "Channels are trialled and scaled by the quality of users they bring.",
      },
      {
        title: "Onboarding and retention",
        text: "The first session, follow-up messages and gentle prompts are redone so people keep coming back.",
      },
      {
        title: "Keep improving",
        text: "What we learn shapes a growth plan we revisit together every few weeks.",
      },
    ],
    deliverables: [
      "A study of your funnel and a plan for growth",
      "Experiment designs and a results log",
      "Segment and cohort insights",
      "A retention and lifecycle plan",
      "Campaign and experiment reports",
    ],
    faqs: [
      {
        q: "How does growth marketing differ from digital marketing?",
        a: "Digital marketing is mainly about attracting visitors — search, articles, social, ads. Growth marketing covers every stage from first visit to repeat payment, and progresses by measured tests, frequently inside the product itself. Most businesses benefit from both: one brings people in, the other holds on to them.",
      },
      {
        q: "Do you actually run experiments?",
        a: "Constantly — it's the core of the job. Every test begins with a prediction, one number to watch and a minimum duration, then goes out as a split test or a gradual release. When there aren't enough visitors for statistics, I rely on qualitative evidence and before/after comparisons, and I'm explicit about how sure we can be.",
      },
      {
        q: "Can you fix my onboarding?",
        a: "Most of the time — the first few minutes are where the largest wins tend to sit. Recordings, funnel numbers and user comments show me where newcomers get stuck; then I remove steps, pre-fill sensible defaults, make empty screens helpful and line up reminders by email, push or WhatsApp. I judge each change by how many people reach their first success, not by clicks.",
      },
      {
        q: "Which numbers do you track?",
        a: "That follows from how you make money, but common ones are activation, retention per cohort, free-to-paid conversion, revenue per user, churn and cost to acquire per channel. Early on we pick one headline number plus a few secondary ones, so the whole team shares a definition of success and every test is scored alike.",
      },
    ],
    typicalTimeline: "Ongoing, in experiment cycles",
    idealFor: [
      "Products that have users but have stopped growing",
      "Apps losing people after the first week",
      "Teams wanting a repeatable way to grow",
    ],
    related: ["digital-marketing", "ai-creative", "ai-integration"],
    seo: {
      title: "Growth Marketing, Onboarding & Retention — India",
      description:
        "Growth marketing from India — funnel studies, split tests and onboarding and retention fixes that turn new sign-ups into customers who stay and pay.",
    },
  },
  // AI & CLOUD
  {
    slug: "ai-integration",
    group: "ai-cloud",
    icon: "Bot",
    title: "AI Integration & Automation",
    shortTitle: "AI Integration",
    tagline:
      "AI that earns its place in your product and your processes — correct, private, reasonably priced.",
    summary:
      "Assistants, search that understands questions, document reading, agents and automated workflows — built into your product while accuracy, privacy and monthly cost stay under control.",
    intro: [
      "AI earns its keep when it takes real work off people: answering the same customer question at midnight, lifting figures out of invoices, finding the right paragraph in a hundred files, or routing leads before anyone is at their desk. I build those features into your product and processes with models from OpenAI, Anthropic and Google — or open-source models when privacy or cost calls for it.",
      "Calling an API is the easy part; making the answer dependable is the work. I begin with a cheap prototype, test it on real examples from your business, and only then integrate it properly — with guardrails, human review where it matters, usage logs and spending limits. Indian businesses often want WhatsApp-first automation and bilingual support; teams elsewhere get the same rigour.",
    ],
    useCases: [
      {
        icon: "MessagesSquare",
        title: "A support assistant that reads your docs",
        text: "Answers customers from your help pages and policies, shows where each answer came from, and passes to your team when unsure.",
      },
      {
        icon: "MessageCircle",
        title: "Lead screening on WhatsApp",
        text: "Puts the qualifying questions, rates each enquiry and schedules calls, so your sellers only talk to likely buyers.",
      },
      {
        icon: "ScanText",
        title: "Pulling data from invoices and forms",
        text: "Extracts structured fields from invoices, forms and PDFs into your systems and flags anything it's unsure of.",
      },
      {
        icon: "Search",
        title: "Search across company knowledge",
        text: "Lets staff ask questions over wikis, contracts and SOPs, with the source paragraph shown beside each answer.",
      },
      {
        icon: "PenLine",
        title: "Drafts that a person approves",
        text: "Writes product descriptions, emails and replies in your voice; nothing is sent until someone signs it off.",
      },
      {
        icon: "ChartColumn",
        title: "Reports that write themselves",
        text: "Turns raw numbers from your tools into scheduled summaries, sent by email, Slack or WhatsApp.",
      },
    ],
    benefits: [
      {
        title: "Repetitive work handled",
        text: "Data entry, triage, summaries and follow-ups run on their own, leaving people the judgement calls.",
      },
      {
        title: "Support at any hour",
        text: "An assistant that reads only your documentation replies at once to everyday questions and passes harder ones to a person.",
      },
      {
        title: "Answers from your own material",
        text: "Retrieval-augmented generation bases replies on your documents, policies and product data.",
      },
      {
        title: "Paperwork in seconds",
        text: "Agreements, bills and reports get read, mined for data and summarised in a fraction of the manual time.",
      },
      {
        title: "Costs and outputs under control",
        text: "Safety rules, scored test cases, a person in the loop and hard spending limits keep answers good and costs steady.",
      },
    ],
    whyMe: {
      text: "An AI feature gets the same treatment as any live software: measured, watched and reassuringly uneventful. Before anything is built I'll say plainly whether AI fits, or whether an ordinary rule would serve better. Test cases come from your own data, so accuracy is known before customers rely on it, and running cost is designed in from day one.",
      points: [
        "A frank use-case and return check before any build",
        "Testing on your real examples, not hand-picked demos",
        "Privacy first: minimal data, provider terms reviewed",
        "Live logging, spending ceilings and backup models",
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
        title: "Find the payoff",
        text: "We hunt for jobs where AI clearly saves hours or money, and leave out anything a plain rule handles.",
      },
      {
        title: "Data and privacy",
        text: "We decide what the model may see, how it is protected and which provider terms fit.",
      },
      {
        title: "Quick prototype",
        text: "A working version on your real data, cheap enough to discard if it doesn't pay its way.",
        duration: "1–2 weeks",
      },
      {
        title: "Score it on real cases",
        text: "The prototype is measured against a set of your own examples, so accuracy is known, not assumed.",
      },
      {
        title: "Ship it with monitoring",
        text: "It's built into your product or processes, complete with logs, safety rules and alerts.",
      },
      {
        title: "Keep tuning",
        text: "Prompts, retrieval and model choice are refined to raise accuracy and cut cost over time.",
      },
    ],
    deliverables: [
      "A live AI feature or automated workflow",
      "The prompt and retrieval pipeline, with a test set",
      "Admin controls and usage logs",
      "A cost and latency report",
      "Documentation and a handover session",
    ],
    faqs: [
      {
        q: "Which AI uses pay off for a small business?",
        a: "The payoff is biggest on tight, repeated jobs with an obvious correct outcome: replying to routine support questions using your documentation, qualifying enquiries, lifting data from invoices and forms, searching company knowledge, and drafting everyday text for someone to approve. Sweeping 'AI for everything' schemes seldom repay the cost. I'll help you pick one or two valuable jobs to begin with.",
      },
      {
        q: "Is my data safe, and will it train someone's model?",
        a: "OpenAI, Anthropic and Google say in their current business API terms that API data isn't used for training by default, and I confirm the terms for whichever provider and plan we choose. Beyond that, each request carries only the data it needs, personal details are masked where possible, and sensitive work can run on open-source models that you host yourself.",
      },
      {
        q: "How do you stop it making things up?",
        a: "Two things: grounding and testing. Replies are assembled from your own documents via retrieval, and the model is told to admit when it doesn't know instead of guessing. Before launch each feature is scored on genuine questions, answers can point to their sources, and anything consequential needs a person's sign-off. Ongoing monitoring flags shaky answers for improvement.",
      },
      {
        q: "What does it cost to run, month to month?",
        a: "It turns on how many requests you get, which model answers them and how long each one is. The prototype stage records genuine usage, so you get a figure before go-live. Once live, I hold spending down with lighter models where they're adequate, cached results and sensible limits, and caps plus alerts rule out nasty surprises.",
      },
    ],
    typicalTimeline: "A prototype in 1–2 weeks, then a measured rollout",
    idealFor: [
      "Support desks fielding identical questions daily",
      "Back offices drowning in paperwork and typing",
      "SaaS products adding AI that users will pay for",
    ],
    related: ["web-applications", "devops-cloud", "backend-development"],
    seo: {
      title: "AI Integration for Startups & SMBs — India",
      description:
        "AI integration for startups and small businesses: chatbots, RAG search, document extraction, agents and automation — accurate, private and cost-controlled.",
    },
  },
  {
    slug: "ai-creative",
    group: "ai-cloud",
    icon: "Sparkles",
    title: "AI Creative & Ad Generation",
    shortTitle: "AI Creative",
    tagline: "On-brand ads and short videos, produced faster with AI.",
    summary:
      "Ad creatives, product imagery and short video made with AI tools under human art direction — more variants to test, quicker launches and smaller production bills.",
    intro: [
      "Paid campaigns rise or fall on their creative, and ad platforms favour advertisers who test many versions. Traditional shoots make that slow and costly. I pair AI image and video generation with human art direction to produce on-brand ads, product visuals and short video for Reels, Shorts, feeds and stories — in the quantity modern campaigns need.",
      "AI handles drafts, backgrounds, variations and voice-overs; I handle the idea, script, edit and brand consistency. Every generated asset is checked by a person for accuracy, likeness and licensing before it reaches you. That matters to small Indian brands stretching a modest budget across Meta and Google, and to teams abroad who need local variants quickly.",
    ],
    benefits: [
      {
        title: "More versions to test",
        text: "Each batch tries several ideas and openings, so the ads that work show up sooner.",
      },
      {
        title: "Campaigns out sooner",
        text: "Creatives arrive in days, without waiting for shoots and studio time.",
      },
      {
        title: "A steady brand look",
        text: "Your brand rules and sample images make each piece unmistakably yours.",
      },
      {
        title: "Lower production spend",
        text: "For everyday assets, AI removes most of the spend on photographers, talent and venues.",
      },
      {
        title: "Every format delivered",
        text: "One idea yields Reels, Shorts, feed posts, stories and display banners.",
      },
    ],
    whyMe: {
      text: "AI makes it easy to churn out a lot of forgettable content. I aim the other way: fewer, stronger ideas carried out in every format you need. I start from your brand, audience and campaign goal, write hooks and scripts for how people really scroll, and check each asset for odd details, misleading claims and licensing problems. Nothing goes straight from a generator to you.",
      points: [
        "Concepts and hooks written per platform",
        "Creative direction that holds visuals to your brand",
        "Meta and Google ad specs checked for each format",
        "Platform ad and AI-disclosure rules checked every campaign",
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
        title: "Brief",
        text: "We agree the aim, the audience, the offer and the brand boundaries for this round.",
      },
      {
        title: "Ideas and scripts",
        text: "You approve my proposed angles, openings and brief scripts before anything is made.",
      },
      {
        title: "Generate and direct",
        text: "Stills, clips and narration are generated, then guided until they suit the brief and the brand.",
      },
      {
        title: "Edit and check",
        text: "Every file is polished and reviewed for correctness, resemblance, usage rights and brand fit.",
      },
      {
        title: "Deliver every size",
        text: "Final files are exported in the dimensions and specs each platform asks for.",
      },
      {
        title: "Review results, brief the next round",
        text: "The winners from this round set the direction for the next.",
      },
    ],
    deliverables: [
      "Sets of ad creatives (still and video)",
      "Product images and lifestyle visuals",
      "Opening lines and captions per version",
      "Editable source files",
      "Notes on the tools and licences used",
    ],
    faqs: [
      {
        q: "Will Meta and Google accept ads made with AI?",
        a: "Yes — both allow ads made or edited with AI, subject to their current ad policies, which cover misleading content and sometimes require disclosing AI use. Those rules change, so I check the latest for each platform on every campaign, and I steer clear of risky formats such as realistic portrayals of real people.",
      },
      {
        q: "Who owns the finished creatives?",
        a: "You. The finished files are yours to run in your campaigns, and I only pick tools whose licences permit commercial work. Because copyright for wholly machine-made material remains unclear in many places, I keep a record of the tools behind each piece and add human design and editing on top.",
      },
      {
        q: "How do they stay true to my brand?",
        a: "The brief is assembled from your brand guide, palette, fonts, product shots and earlier ads, and sample images steer what gets generated. Logos, lettering and layout are placed by hand in design software rather than generated, so they're never wrong. I compare each piece with the brief before you see it, and anything that drifts never leaves my desk.",
      },
      {
        q: "How many variations come in a batch?",
        a: "The brief fixes the batch size, matched to your budget and how much testing your ad spend allows. Typically a batch holds a handful of ideas, each with several openings and every format required. When the first numbers come in, the following batch doubles down on the strongest angles.",
      },
    ],
    typicalTimeline: "A first batch a few days after the brief is signed off",
    idealFor: [
      "Direct-to-consumer brands advertising on Meta and Google",
      "Startups without a budget for regular shoots",
      "Teams that need local ad variants",
    ],
    related: ["digital-marketing", "growth-marketing", "ui-design"],
    seo: {
      title: "AI-Made Ad Creative & Product Imagery, India",
      description:
        "Ads, product imagery and short video produced with AI and directed by a person — more versions to test, faster campaigns and lower production costs.",
    },
  },
  {
    slug: "devops-cloud",
    group: "ai-cloud",
    icon: "Cloud",
    title: "DevOps & Cloud",
    shortTitle: "DevOps & Cloud",
    tagline: "Automated, steady infrastructure: dull releases, rare outages, fair bills.",
    summary:
      "Release pipelines, containers, monitoring, security and spending control on AWS or GCP — so releases are routine, outages are rare and the cloud invoice adds up.",
    intro: [
      "If releases make people nervous, servers are set up by hand, or nobody hears about an outage until a customer complains, your infrastructure costs more than its invoice. I put dependable automation in place: pipelines that test and deploy each change, containerised apps, infrastructure as code, monitoring with useful alerts, and backups that have actually been restored.",
      "My usual clouds are AWS and GCP. Docker, Terraform and Kubernetes come in when the scale warrants them; when it doesn't, plainer managed services do the job. Spend gets as much attention as availability — whether you're an Indian startup watching each rupee or a team shocked by last month's bill. You end up with resources sized to need, clear documentation and step-by-step runbooks your people can use on their own.",
    ],
    benefits: [
      {
        title: "Safer, quicker releases",
        text: "With tests and pipelines doing the work, a release is routine and easy to undo.",
      },
      {
        title: "Fewer outages",
        text: "Monitoring, alerts and health checks catch trouble before customers do.",
      },
      {
        title: "A smaller cloud bill",
        text: "Right-sized resources, autoscaling and removing idle services cut waste.",
      },
      {
        title: "Security and backups covered",
        text: "Least-privilege access, managed secrets and tested backups are standard.",
      },
      {
        title: "Room for spikes",
        text: "Containers and autoscaling absorb traffic surges without manual firefighting.",
      },
    ],
    whyMe: {
      text: "I'm a developer who does DevOps, so I build infrastructure developers enjoy: quick pipelines, preview environments and readable logs. I'm practical about tools — Kubernetes only when it earns its complexity — and I document everything, because infrastructure one person understands is a risk. The goal is for you to need me less over time, not more.",
      points: [
        "Infrastructure as code, so environments can be rebuilt",
        "Alerts that call for action, not ones you learn to ignore",
        "Backups proven with real restores",
        "Runbooks and a handover so your team can run it",
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
        title: "Audit",
        text: "I review your current setup, spend, release process and biggest risks.",
      },
      {
        title: "Target design and budget",
        text: "Together we settle on an architecture of the right size and a forecast of the monthly bill.",
      },
      {
        title: "Containers and pipelines",
        text: "Services move into containers, and a pipeline tests and ships each change.",
      },
      {
        title: "Monitoring and alerts",
        text: "Dashboards, searchable logs, error capture and alerts that lead straight to the root cause.",
      },
      {
        title: "Hardening and backups",
        text: "Permissions, secrets and network rules get locked down, and backups are proven by restoring them.",
      },
      {
        title: "Handover with runbooks",
        text: "Written guides and runbooks that let your team release, troubleshoot and recover without me.",
      },
    ],
    deliverables: [
      "CI/CD pipelines for each service",
      "Container definitions and Terraform for every environment",
      "Monitoring dashboards and alerts",
      "A plan for backups and for getting back up after failure",
      "Runbooks for routine work and incidents",
    ],
    faqs: [
      {
        q: "Do I really need Kubernetes?",
        a: "Frequently not, especially early. Plenty of startups do better with a managed container service, a host such as Vercel or two well-configured servers — less to run and less to pay. Kubernetes justifies its overhead once you have lots of services, need precise autoscaling or must stay portable between clouds. I'll suggest the least complicated option that covers you today and can grow with you.",
      },
      {
        q: "Can you lower my cloud bill?",
        a: "In most cases. The usual savings are downsizing oversized servers and databases, switching off unused resources, scaling automatically, using reserved or committed pricing where sensible, adding caching and a CDN, and cleaning up storage and logs. An audit comes first, with savings ranked by size, so you know the likely result before a thing is touched.",
      },
      {
        q: "Could my app move to AWS or GCP with no outage?",
        a: "Usually, or with just a brief scheduled pause. The new setup is built next to the current one, data is kept in sync and everything is tested, then traffic is moved over by DNS or a load balancer — with a route back prepared. A few database migrations need a short maintenance slot, which we'd book together for a quiet time.",
      },
      {
        q: "Is ongoing DevOps support available?",
        a: "Yes. After setup I offer continuing help on a monthly retainer or by the hour: monitoring, updates, security patches, cost reviews, incident response in agreed hours and help as you scale. Since everything is documented and defined in code, there's no lock-in — your team or another engineer can take over whenever you like.",
      },
    ],
    // Confirm before launch: estimated range, not a figure from the brief.
    typicalTimeline: "Set-up in roughly 2–6 weeks, then continuing support",
    idealFor: [
      "Startups still deploying by hand",
      "Teams facing a rising cloud bill",
      "Products bracing for a launch or a surge of visitors",
    ],
    related: ["ai-integration", "backend-development", "web-applications"],
    seo: {
      title: "DevOps & Cloud Engineering (AWS, GCP) — India",
      description:
        "DevOps and cloud from India: CI/CD, Docker, Kubernetes, monitoring and cost control on AWS and GCP — steady releases, fewer outages, sensible bills.",
    },
  },
];

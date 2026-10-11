/**
 * Copy for /approach (formerly /why-me).
 *
 * Honesty rule for this page: commitments are promises, not achievements. No client counts,
 * ratings, multipliers or percentages.
 */

export type ComparisonStatus = "yes" | "partial" | "no";

export type ComparisonCell = { status: ComparisonStatus; text: string };

export type ComparisonData = {
  caption: string;
  intro: string;
  note: string;
  /** The first column is "Working with me" and is marked. */
  columns: string[];
  rows: { label: string; cells: ComparisonCell[] }[];
};

export const approachContent = {
  seo: {
    title: "How I Work — MVP & AI Developer for Hire, India",
    description:
      "How I work, and why founders hire one engineer over an agency, a freelancer or an in-house hire: direct contact, a lean first release, and design, AI and DevOps in one person.",
  },

  manifesto: {
    label: "Approach",
    title: "How I work, in three sentences",
    statements: [
      { text: "Build the smallest thing that can prove the idea.", emphasis: "smallest thing" },
      { text: "Build that small thing so it lasts.", emphasis: "so it lasts" },
      { text: "Say plainly what each choice costs.", emphasis: "what each choice costs" },
    ],
    note: "Every project, whatever its size, is run on those three.",
    intro:
      "Searching for an MVP developer in India to own the whole build, a full-stack developer in Bengaluru, or an AI developer for your startup without paying for an agency? Here is exactly how working together goes.",
  },

  commitments: {
    id: "commitments",
    label: "My commitments",
    title: "Four promises in writing, on every project",
    emphasis: "in writing",
    items: [
      {
        term: "reply_time",
        value: "≤ 1 business day",
        text: "Every message gets an answer within one business day.",
      },
      {
        term: "demo_builds",
        value: "weekly",
        text: "During sprints you get a build you can open and click through each week.",
      },
      {
        term: "code_and_ip",
        value: "100% yours",
        text: "Code, designs and accounts belong to you from the first day.",
      },
      {
        term: "bug_fix_window",
        value: "[30] days",
        text: "After launch, bugs in delivered work are fixed at no extra charge for this window.",
      },
    ],
  },

  fit: {
    id: "fit",
    label: "Is this a fit?",
    title: "Who I work best with, and who I don't",
    emphasis: "who I don't",
    forTitle: "A good fit",
    forItems: [
      "Founders putting a first product to the test",
      "Small and mid-sized businesses moving online",
      "Teams short of AI or DevOps capacity",
      "Agencies looking for a white-label engineer",
    ],
    notForTitle: "Probably not a fit",
    notForItems: [
      "Work that needs twenty people from the first week",
      "Requests to copy an existing app screen for screen",
      "Projects without a decision-maker on your side",
    ],
    notForNote: "If that's you, I'll gladly suggest someone better suited.",
  },

  comparison: {
    id: "options",
    label: "Your options, honestly",
    title: "How one engineer compares with the other routes",
    emphasis: "the other routes",
    criteriaLabel: "Compared on",
    data: {
      caption:
        "Hiring me set beside an agency, a marketplace freelancer and an employee of your own",
      intro:
        "Each route has its place, and good products get built every way. This is a fair side-by-side to help you choose.",
      note: "These are broad patterns, not rules — agencies, freelancers and hires all vary.",
      columns: ["Me, directly", "An agency", "A marketplace freelancer", "Your own hire"],
      rows: [
        {
          label: "How soon work begins",
          cells: [
            { status: "yes", text: "Shortly after we agree the scope" },
            { status: "partial", text: "After proposals, contracts and staffing" },
            { status: "yes", text: "Often quick to begin" },
            { status: "no", text: "Once hiring, interviews and notice periods are over" },
          ],
        },
        {
          label: "Your day-to-day contact",
          cells: [
            { status: "yes", text: "The engineer writing the code" },
            { status: "partial", text: "Normally via an account or project lead" },
            { status: "yes", text: "The freelancer directly" },
            { status: "yes", text: "Your employee directly" },
          ],
        },
        {
          label: "Design, code, AI and operations together",
          cells: [
            { status: "yes", text: "Every one of them, in a single person" },
            { status: "yes", text: "Yes, spread across specialists" },
            { status: "partial", text: "Often one skill; the rest found elsewhere" },
            { status: "partial", text: "Depends on the hire; rarely all four" },
          ],
        },
        {
          label: "How you pay",
          cells: [
            { status: "yes", text: "A fixed scope, a monthly retainer or by the hour" },
            { status: "partial", text: "Project fees that carry team and overhead" },
            { status: "partial", text: "Hourly or fixed; varies a lot" },
            { status: "partial", text: "Salary, benefits and hiring costs" },
          ],
        },
        {
          label: "Code and IP",
          cells: [
            { status: "yes", text: "In your own repository from the first commit" },
            { status: "partial", text: "Often handed over at the end — read the contract" },
            { status: "partial", text: "Depends on contract and platform terms" },
            { status: "yes", text: "Belongs to your company" },
          ],
        },
        {
          label: "After launch",
          cells: [
            { status: "yes", text: "Free fixes for a set period, then monthly or hourly support" },
            { status: "yes", text: "Usually under a support contract" },
            { status: "partial", text: "Hinges on whether they're free" },
            { status: "yes", text: "Ongoing, as part of the job" },
          ],
        },
        {
          label: "Accountability",
          cells: [
            { status: "yes", text: "One person answerable for all of it" },
            { status: "partial", text: "Spread over a team and its procedures" },
            { status: "partial", text: "Clear for their slice; gaps where freelancers meet" },
            { status: "yes", text: "Clear, with you as the manager" },
          ],
        },
      ],
    } satisfies ComparisonData,
  },

  why: {
    id: "why-it-works",
    label: "Why it works",
    title: "What this way of working does for your product",
    emphasis: "for your product",
    items: [
      {
        title: "You learn fast",
        text: "A focused first release reaches real users in weeks, so you see what people do, not only what they tell a survey.",
      },
      {
        title: "You spend less to learn it",
        text: "A lean scope means paying only for the features that test your idea. Everything else waits until users ask, so no budget goes on guesses.",
      },
      {
        title: "Feedback is about value, not confusion",
        text: "When the interface is clear, people judge whether the product solves their problem — not whether they can find the button.",
      },
      {
        title: "Investors see proof",
        text: "Live software with real customers beats any pitch deck. It proves you can execute — and investors can poke at it themselves.",
      },
      {
        title: "Risk stays small",
        text: "Every sprint checks a guess before you spend further. Problems surface early, when a change of direction still costs little.",
      },
    ],
  },

  links: {
    id: "more",
    label: "More detail",
    title: "The process and the handover, in full",
    items: [
      {
        label: "How a project runs, step by step",
        href: "/#process",
        text: "Six steps, what you receive at each, and how long they usually take.",
      },
      {
        label: "The handover kit",
        href: "/#handover",
        text: "Every file, account and document you own at the end.",
      },
    ],
  },

  faq: {
    id: "faq",
    label: "Questions",
    title: "On working together",
    emphasis: "working together",
    items: [
      {
        q: "How do I judge a technical partner?",
        a: "Look for questions about your customers and model before any talk of frameworks, trade-offs explained without jargon, running software shown early and regularly, and ownership of the code written into the contract. Ask how progress gets reported — and be wary of anyone who says yes to every feature without asking if it's needed now.",
      },
      {
        q: "How does starting with an MVP save money?",
        a: "You only spend on what tests the idea. Instead of building every feature up front, you release a focused version, learn from real users and invest in what they use. Features that turn out not to matter never get built, and the ones that do sit on a base you can extend instead of replace.",
      },
      {
        q: "Does design really matter for a first version?",
        a: "Yes, because confusing screens hide whether the idea works. If people can't find the main feature, you'll mistake their silence for disinterest. A clean, simple interface keeps feedback about value and helps a small product look credible to early customers and investors. It needn't be elaborate — just clear.",
      },
      {
        q: "Do you work with clients abroad and in other time zones?",
        a: "Yes, fully remotely, with founders in India and elsewhere. We agree a few overlapping hours each working day for calls; everything else runs in writing on the shared board. Contracts, NDAs and invoices work the same for international clients.",
      },
      {
        q: "How do we get going?",
        a: "Either book the free call or use the contact form. Half an hour covers the idea, the users and the timing; a few days later a written scope, schedule and price land in your inbox. If you're happy, an NDA and agreement are signed and a discovery session kicks things off.",
      },
    ],
  },
};

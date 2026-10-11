import type { LegalDocument } from "@/content/legal/types";

/**
 * Privacy Policy. A starting template written for this site's actual data flows — not legal
 * advice. Have a lawyer review it before launch, and update `lastUpdated` with every change.
 */
export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  path: "/privacy-policy",
  description:
    "How I collect, use, share and protect your personal data when you visit this site, contact me or apply to work with me — in plain English.",
  lastUpdated: "2026-10-10",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      blocks: [
        {
          type: "p",
          text: 'This website is run by Arshdeep Singh, trading as [LEGAL_ENTITY], an IT services business based in Bengaluru, [STATE], India ("I", "me"). I build MVPs, web and mobile apps, AI features and cloud infrastructure, and offer design and growth marketing services.',
        },
        {
          type: "p",
          text: "This policy explains what personal data I collect when you visit this website, contact me, book a call, apply for a role or become a client — and what I do with it. It applies to this website and to the conversations and projects that start from it.",
        },
        {
          type: "p",
          text: "I aim to handle your data in line with India's Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 and its rules. If you visit from the European Union or the United Kingdom, I also follow the principles of the GDPR and UK GDPR: collect only what I need, use it for clear purposes, keep it safe and delete it when it's no longer needed.",
        },
        {
          type: "note",
          text: "In short: I only collect what I need to reply to you, do the work and run this site. I never sell your data. Analytics run only if you say yes.",
        },
      ],
    },
    {
      id: "definitions",
      title: "Definitions",
      blocks: [
        {
          type: "ul",
          items: [
            "**Personal data** — any information about an identifiable person, such as your name, email address, phone number or IP address.",
            "**Processing** — anything done with personal data: collecting, storing, using, sharing or deleting it.",
            "**Data Fiduciary** (DPDP Act) or **controller** (GDPR) — the person who decides why and how personal data is processed. For this website, that's me, [LEGAL_ENTITY].",
            "**Data Principal** (DPDP Act) or **data subject** (GDPR) — the person the data is about: you.",
            "**Data Processor** — a service provider that processes personal data on my behalf, such as my email or hosting provider.",
            '**Consent** — your free, specific, informed and unambiguous agreement, given by a clear action such as ticking a box or clicking "Accept".',
          ],
        },
      ],
    },
    {
      id: "information-i-collect",
      title: "Information I collect",
      blocks: [
        { type: "h3", text: "(a) Information you give me" },
        {
          type: "ul",
          items: [
            "**Contact form:** your name, email, phone number, company (optional), the service you're interested in, budget range, timeline, your message, how you heard about me and whether you need an NDA.",
            "**Careers form:** your name, email, phone number, the role, experience, availability, portfolio and LinkedIn links, your resume (PDF) and your message.",
            "**Newsletter:** your email address.",
            "**Emails, WhatsApp messages and calls:** whatever you choose to share with me, including project details and files.",
            "**Client work:** billing details (name, company, address, GSTIN if any) and the materials you share for your project.",
          ],
        },
        { type: "h3", text: "(b) Information collected automatically" },
        {
          type: "ul",
          items: [
            "**Server logs:** your IP address, browser type, device, pages requested and the time of the request — kept by my hosting provider for security and troubleshooting.",
            "**Cookies:** a necessary cookie that remembers your cookie choices. Only if you agree: analytics cookies (Google Analytics 4 and Microsoft Clarity) and a cookie that remembers which campaign first brought you here. See the [Cookie Policy](/cookie-policy).",
            "**Usage data (with consent only):** pages you visit, how long you stay, clicks and scrolling, approximate location from your IP address, and device and browser details.",
            "**Spam protection:** Cloudflare Turnstile checks that form submissions come from a person, using signals from your browser.",
          ],
        },
        { type: "h3", text: "(c) Information from third parties" },
        {
          type: "ul",
          items: [
            "**Referrals:** if someone introduces you, they may share your name and contact details with me.",
            "**LinkedIn and other professional networks:** public profile information if you contact me there or apply for a role.",
            "**Scheduling tools:** when you book a call through Calendly, I receive your name, email, the time you chose and any answers you give.",
            "**Payments:** when you pay through Razorpay, I receive a confirmation with your name, email, phone, amount and payment reference — never your full card or bank details.",
          ],
        },
      ],
    },
    {
      id: "how-i-use-it",
      title: "How I use your information",
      blocks: [
        {
          type: "ul",
          items: [
            "To reply to your enquiry, schedule calls and prepare proposals or estimates.",
            "To deliver the services you've asked for, communicate during projects and provide support.",
            "To send invoices, take payments and meet tax, accounting and other legal obligations.",
            "To review job and collaboration applications and contact you about them.",
            "To send the newsletter you subscribed to (you can unsubscribe at any time).",
            "To keep this website secure, prevent spam and abuse, and fix problems.",
            "With your consent, to understand how visitors use this site and which campaigns work, so I can improve it.",
          ],
        },
        {
          type: "p",
          text: "For visitors covered by the GDPR, my legal bases are: taking steps at your request before a contract and performing it (enquiries and client work); legal obligation (invoices and tax records); legitimate interests (security, spam prevention, replying to messages you send); and consent (analytics cookies, the newsletter and careers applications).",
        },
        {
          type: "p",
          text: "I don't use your data for automated decisions that have legal or similarly significant effects on you, and I don't build advertising profiles.",
        },
      ],
    },
    {
      id: "consent",
      title: "Consent, and how to withdraw it",
      blocks: [
        {
          type: "p",
          text: "Where I rely on your consent — for example when you tick the consent box on a form, subscribe to the newsletter or accept analytics cookies — you can withdraw it at any time, as easily as you gave it:",
        },
        {
          type: "ul",
          items: [
            '**Cookies:** use "Cookie settings" in the footer of any page, or on the [Cookie Policy](/cookie-policy) page.',
            "**Newsletter:** use the unsubscribe link in any email, or write to me.",
            "**Forms and applications:** email arshdeepsinghdev96@gmail.com and ask me to stop using or to delete your data.",
          ],
        },
        {
          type: "p",
          text: "Withdrawing consent doesn't affect processing that already happened, and it doesn't stop me keeping data I'm legally required to keep (such as invoices).",
        },
      ],
    },
    {
      id: "sharing",
      title: "Sharing your information",
      blocks: [
        {
          type: "p",
          text: "**I never sell your personal data**, and I don't share it with anyone for their own marketing. I share it only with service providers (data processors) that help me run this site and my business, under contracts or terms that require them to protect it and use it only on my instructions:",
        },
        {
          type: "ul",
          items: [
            "**Hosting and infrastructure:** [HOSTING_PROVIDER] — serves this website and its server logs.",
            "**Database and file storage:** [DATABASE_PROVIDER] for enquiries, and [STORAGE_PROVIDER] for resumes, kept in private storage.",
            "**Email delivery:** [EMAIL_PROVIDER] — sends form notifications and confirmations.",
            "**Analytics (only with your consent):** Google Analytics 4 (Google) and Microsoft Clarity (Microsoft).",
            "**Spam protection:** Cloudflare Turnstile (Cloudflare).",
            "**Error monitoring:** Sentry — technical error reports (page, browser and error details). Form contents aren't included, and IP addresses aren't stored.",
            "**Scheduling:** Calendly — when you book a call.",
            "**Payments:** Razorpay — when you pay an invoice.",
            "**Professional advisers:** my accountant or lawyer, where needed and under confidentiality.",
          ],
        },
        {
          type: "p",
          text: "I may also disclose personal data when the law requires it — for example to comply with a court order or a lawful request from a government authority — or to protect my rights, property or safety, or those of others. If my business is ever transferred or merged, your data may move with it, under this same policy.",
        },
      ],
    },
    {
      id: "cookies-and-analytics",
      title: "Cookies and analytics",
      blocks: [
        {
          type: "p",
          text: "On your first visit you'll see a cookie banner. Only a necessary cookie that remembers your choice is set until you decide. **Google Analytics 4 and Microsoft Clarity load only after you accept analytics cookies** — if you reject them, no requests are sent to Google or Microsoft for analytics. I use Google Consent Mode, so Google is told about your choice whenever it changes.",
        },
        {
          type: "p",
          text: "Full details of every cookie, and how to change your choice at any time, are in the [Cookie Policy](/cookie-policy).",
        },
      ],
    },
    {
      id: "data-security",
      title: "Data security",
      blocks: [
        {
          type: "p",
          text: "I use reasonable security practices in line with the IT Act and the DPDP Act, including:",
        },
        {
          type: "ul",
          items: [
            "HTTPS encryption for everything sent to and from this site.",
            "Resumes stored in private storage, accessible only through time-limited signed links.",
            "Access to data limited to me (and anyone I engage under a confidentiality agreement), protected with strong passwords and two-factor authentication.",
            "Card and bank details handled only by Razorpay — this site never sees or stores them.",
            "Spam protection and rate limiting on every form.",
          ],
        },
        {
          type: "p",
          text: "No system is perfectly secure. If a personal data breach happens, I'll notify the Data Protection Board of India and affected people as the DPDP Act requires, and any other authority where the law requires it.",
        },
      ],
    },
    {
      id: "retention",
      title: "How long I keep your data",
      blocks: [
        {
          type: "table",
          caption: "Retention periods",
          head: ["Data", "Kept for"],
          rows: [
            [
              "Enquiries from the contact form, email or WhatsApp",
              "[24] months after our last contact",
            ],
            ["Job and collaboration applications", "[12] months after you apply"],
            [
              "Client project communications and files",
              "For the project, plus [24] months for support",
            ],
            [
              "Invoices and payment records",
              "As long as Indian tax and accounting laws require (currently up to [8] years)",
            ],
            ["Newsletter subscription", "Until you unsubscribe"],
            [
              "Analytics data (with consent)",
              "[14] months, then deleted automatically by the provider",
            ],
            ["Server logs", "Up to [30] days"],
          ],
        },
        {
          type: "p",
          text: "After these periods I delete your data or anonymise it so it can no longer identify you. You can ask me to delete it sooner — see the next section.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      blocks: [
        { type: "p", text: "Under the DPDP Act you have the right to:" },
        {
          type: "ul",
          items: [
            "**Access** — a summary of the personal data I hold about you and how I've used it, and who I've shared it with.",
            "**Correction** — have inaccurate or incomplete data corrected, completed or updated.",
            "**Erasure** — have your data deleted when it's no longer needed for the purpose you gave it for, unless the law requires me to keep it.",
            "**Withdraw consent** — at any time, for anything that relies on your consent.",
            "**Grievance redressal** — have your complaint handled by my Grievance Officer (see below), and, if you're not satisfied, complain to the Data Protection Board of India.",
            "**Nomination** — nominate someone to exercise these rights on your behalf if you die or become unable to.",
          ],
        },
        {
          type: "p",
          text: "If the GDPR or UK GDPR applies to you, you also have the right to object to processing based on legitimate interests, to restrict processing, to data portability, and to complain to your local data protection authority.",
        },
        {
          type: "p",
          text: "**How to exercise them:** email arshdeepsinghdev96@gmail.com with the subject \"Privacy request\" and tell me what you'd like. I may ask you to confirm your identity before acting on the request. There's no charge, and I'll respond within [X] days.",
        },
      ],
    },
    {
      id: "childrens-data",
      title: "Children's data",
      blocks: [
        {
          type: "p",
          text: "This website and my services are meant for adults and businesses. I don't knowingly collect personal data from anyone under 18. If you believe a child has sent me their data, email arshdeepsinghdev96@gmail.com and I'll delete it. Applicants for internships must be 18 or older.",
        },
      ],
    },
    {
      id: "international-transfers",
      title: "International transfers",
      blocks: [
        {
          type: "p",
          text: "Some of my service providers (such as Google, Microsoft, Cloudflare and Calendly) may store or process data outside India, including in the United States and the European Union. I only transfer data to countries that are not restricted by the Government of India under the DPDP Act.",
        },
        {
          type: "p",
          text: "For visitors from the EU or UK, transfers out of your region rely on adequacy decisions or the providers' Standard Contractual Clauses, which require them to protect your data to European standards.",
        },
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      blocks: [
        {
          type: "p",
          text: "This site links to other websites and services, such as LinkedIn, GitHub, WhatsApp, Calendly, Google Maps and Razorpay. They have their own privacy policies, which I don't control — please read them before giving them your data. Embedded content such as the map or the booking calendar loads only when you click to open it.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "I'll update this policy when my services, tools or the law change. The \"Last updated\" date at the top shows when it last changed. If a change materially affects how I use data you've already given me, I'll tell you by email or with a notice on this site, and ask for fresh consent where the law requires it.",
        },
      ],
    },
    {
      id: "contact-grievance-officer",
      title: "Contact and Grievance Officer",
      blocks: [
        {
          type: "p",
          text: "For any question, request or complaint about your personal data, contact my Grievance Officer:",
        },
        {
          type: "ul",
          items: [
            "**Name:** [NAME]",
            "**Email:** arshdeepsinghdev96@gmail.com",
            "**Address:** [LEGAL_ENTITY], [ADDRESS], Bengaluru, [STATE], India",
          ],
        },
        {
          type: "p",
          text: "I'll acknowledge your message promptly and respond within [X] days. If you're not satisfied with the response, you can complain to the Data Protection Board of India (or, in the EU/UK, to your local data protection authority).",
        },
      ],
    },
  ],
};

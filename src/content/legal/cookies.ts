import type { LegalDocument } from "@/content/legal/types";

/**
 * Cookie Policy, built from the inventory below. Keep the inventory in sync with what the site
 * really sets: rows for tools that aren't configured (no GA / Clarity / Turnstile key) are left
 * out automatically. A starting template — not legal advice.
 */

type CookieCategory = "Necessary" | "Analytics" | "Marketing";

type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: CookieCategory;
  /** Only listed when this tool is configured. */
  requires?: "ga" | "clarity" | "turnstile";
};

const inventory: CookieRow[] = [
  {
    name: "consent",
    provider: "This site",
    purpose: "Remembers your cookie choices so the banner isn't shown again.",
    duration: "180 days",
    category: "Necessary",
  },
  {
    name: "announcement-seen:<id> (local storage)",
    provider: "This site",
    purpose: "Remembers that you've seen the current announcement, so it isn't shown twice.",
    duration: "Until you clear site data",
    category: "Necessary",
  },
  {
    name: "Turnstile (no cookie on this site)",
    provider: "Cloudflare",
    purpose:
      "Checks that form submissions come from a person. May store data on challenges.cloudflare.com while a form is open.",
    duration: "Session",
    category: "Necessary",
    requires: "turnstile",
  },
  {
    name: "utm",
    provider: "This site",
    purpose:
      "Remembers which campaign or link first brought you here; saved with a contact enquiry if you send one.",
    duration: "90 days",
    category: "Analytics",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Distinguishes one visitor from another to count visits.",
    duration: "2 years",
    category: "Analytics",
    requires: "ga",
  },
  {
    name: "_ga_<ID>",
    provider: "Google Analytics",
    purpose: "Keeps track of your current session.",
    duration: "2 years",
    category: "Analytics",
    requires: "ga",
  },
  {
    name: "_clck",
    provider: "Microsoft Clarity",
    purpose: "Keeps the same Clarity ID across visits to this site.",
    duration: "1 year",
    category: "Analytics",
    requires: "clarity",
  },
  {
    name: "_clsk",
    provider: "Microsoft Clarity",
    purpose: "Joins page views into a single session recording.",
    duration: "1 day",
    category: "Analytics",
    requires: "clarity",
  },
  {
    name: "CLID",
    provider: "Microsoft Clarity (clarity.ms)",
    purpose: "Identifies the first time Clarity saw this browser.",
    duration: "1 year",
    category: "Analytics",
    requires: "clarity",
  },
  {
    name: "MUID",
    provider: "Microsoft (clarity.ms)",
    purpose: "Identifies the browser across Microsoft services; set by Clarity's script.",
    duration: "1 year",
    category: "Analytics",
    requires: "clarity",
  },
];

const configured = {
  ga: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  clarity: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
  turnstile: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
};

const rows = inventory
  .filter((row) => !row.requires || configured[row.requires])
  .map((row) => [row.name, row.provider, row.purpose, row.duration, row.category]);

export const COOKIE_SETTINGS_SECTION = "your-choices";

export const cookiePolicy: LegalDocument = {
  title: "Cookie Policy",
  path: "/cookie-policy",
  description:
    "Which cookies this site uses, why, for how long — and how to change your choice at any time.",
  lastUpdated: "2026-10-10",
  sections: [
    {
      id: "what-are-cookies",
      title: "What cookies are",
      blocks: [
        {
          type: "p",
          text: "Cookies are small text files a website stores in your browser so it can remember something between pages or visits — like your cookie choice. Similar technologies, such as your browser's local storage, work the same way, and this policy covers them too.",
        },
        {
          type: "p",
          text: "**First-party** cookies are set by this site. **Third-party** cookies are set by another service, such as Google Analytics. Some cookies last only until you close your browser (session cookies); others stay for a set time.",
        },
      ],
    },
    {
      id: "how-i-use-cookies",
      title: "How I use cookies",
      blocks: [
        {
          type: "ul",
          items: [
            "**Necessary** — needed for the site to work, such as remembering your cookie choice and protecting forms from spam. They can't be switched off.",
            "**Analytics** — help me understand which pages are useful and which campaigns bring visitors, using Google Analytics 4 and Microsoft Clarity. **These are set only if you allow them.**",
            "**Marketing** — let Google measure advertising. **No marketing cookies are set today**; if you allow this category, Google Analytics may use advertising signals (through Google Consent Mode).",
          ],
        },
        {
          type: "p",
          text: "Until you make a choice, only necessary cookies are used. If you reject non-essential cookies, Google Analytics and Microsoft Clarity aren't loaded at all, so no analytics requests are sent to Google or Microsoft.",
        },
      ],
    },
    {
      id: "cookies-this-site-sets",
      title: "Cookies this site sets",
      blocks: [
        {
          type: "table",
          caption: "Cookies and similar technologies used on this site",
          head: ["Name", "Provider", "Purpose", "Duration", "Category"],
          rows,
        },
        {
          type: "p",
          text: "Google and Microsoft may change their cookie names or durations; their current details are in their own documentation.",
        },
      ],
    },
    {
      id: "third-party-content",
      title: "Embedded third-party content",
      blocks: [
        {
          type: "p",
          text: "Some features load content from other services only when you choose to use them. Those services may set their own cookies under their own policies:",
        },
        {
          type: "ul",
          items: [
            '**Calendly** — when you open "Book a call".',
            '**Google Maps** — when you click "Show map" on the contact page.',
            "**WhatsApp** — when you start a chat (opens WhatsApp).",
            "**Razorpay** — on the payment page, to process your payment securely.",
          ],
        },
      ],
    },
    {
      id: COOKIE_SETTINGS_SECTION,
      title: "Your choices",
      blocks: [
        {
          type: "p",
          text: 'You can change or withdraw your consent at any time — use the button below or "Cookie settings" in the footer of any page. If you withdraw analytics consent, I stop loading the analytics tools and remove their cookies from this site.',
        },
        {
          type: "p",
          text: "You can also block or delete cookies in your browser settings. Blocking necessary cookies means the site can't remember your choices.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "When I add or remove a tool that uses cookies, I'll update this page and, where needed, ask for your consent again. See also the [Privacy Policy](/privacy-policy).",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [{ type: "p", text: "Questions about cookies? Email [EMAIL]." }],
    },
  ],
};

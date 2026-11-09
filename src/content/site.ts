/**
 * Single source of truth for business facts.
 * Anything in [SQUARE_BRACKETS] is a placeholder — search for "[" before launch.
 * Components must read these values from here and never hard-code them.
 */

export type Availability = "available" | "limited" | "booked";

export type SocialKey = "linkedin" | "github" | "x" | "instagram" | "clutch";

export type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  /** What the name stands for. */
  meaning: string;
  description: string;
  positioning: string;
  /** Public origin with no trailing slash. */
  url: string;
  contact: { email: string; whatsapp: string; phone: string };
  location: {
    city: string;
    region: string;
    /** ISO 3166-1 code, for structured data. */
    country: string;
    /** The name shown on the page. */
    countryName: string;
    timezone: string;
  };
  /** Open Graph form (en_IN). LOCALE in lib/constants.ts is the BCP 47 form (en-IN). */
  locale: string;
  /** Empty means no profile yet: the link and its icon stay hidden. */
  social: Record<SocialKey, string>;
  calendlyUrl: string;
  /** Optional. Only shown once a real GSTIN exists. */
  gstin?: string;
  availability: Availability;
  brand: { wordmark: string };
  founder: { name: string; role: string; photo: string; education: string };
  featureFlags: {
    testimonials: boolean;
    blog: boolean;
    /** Cookie banner, consent panel and the "Cookie settings" footer button. */
    cookieConsent: boolean;
  };
  announcement: Announcement;
  payments: {
    /** Razorpay Payment Button id (starts with "pl_"), embedded on /pay. */
    razorpayPaymentButtonId: string;
    /** Fallback: a Razorpay Payment Link (https://rzp.io/…) shown when there is no button id. */
    paymentLinkUrl: string;
  };
};

/**
 * Site-wide announcement, shown as a corner card. Shown once per visitor per `id` — change the id to show an
 * updated announcement to everyone again. Set `enabled: false` to switch it off. Never shown on /contact, /pay or legal pages, or while
 * the cookie banner is open.
 */
export type Announcement = {
  enabled: boolean;
  id: string;
  badge: string;
  title: string;
  description: string;
  bullets: [string, string, string];
  /** A [CALENDLY_URL] placeholder falls back to the contact form (MVP scoping topic). */
  primaryCta: { label: string; href: string };
  secondaryLabel: string;
  footnote: string;
  /** YYYY-MM-DD, inclusive, in IST. Leave empty for no limit. */
  startDate: string;
  endDate: string;
};

const phone = "+91 8284031374";

/** wa.me needs digits only, with country code (e.g. 91XXXXXXXXXX). */
function buildWhatsappUrl(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "[WHATSAPP_URL]";
}

const name = "Polestride";

export const siteConfig: SiteConfig = {
  name,
  // TODO: confirm the registered entity name. It appears in the footer, legal pages and JSON-LD.
  legalName: "Polestride",
  tagline: "Business automation that frees you to grow.",
  meaning: "Moving forward, guided by the north star.",
  description:
    "One engineer for the whole build: MVP development and full product builds in India, web and mobile apps and AI integration for startups, from Polestride — full-stack, AI and DevOps.",
  positioning:
    "One engineer for the whole build: I plan, design, code and run web, mobile and AI products for founders and growing teams.",
  // Production sets NEXT_PUBLIC_SITE_URL; next.config.ts fills it in with VERCEL_URL on previews
  // (src/lib/deployUrl.ts). `||`, not `??`: an unset build arg arrives as an empty string.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://polestride.com").replace(/\/+$/, ""),
  contact: {
    // TODO: moving to hello@polestride.com? Set up the mailbox, then SPF, DKIM and DMARC for
    // polestride.com first (LAUNCH_CHECKLIST.md, section 4), and only then change this address.
    email: "arshdeepsinghdev96@gmail.com",
    whatsapp: buildWhatsappUrl(phone),
    phone,
  },
  location: {
    city: "Bengaluru",
    region: "Karnataka",
    country: "IN",
    countryName: "India",
    timezone: "Asia/Kolkata",
  },
  locale: "en_IN",
  social: {
    linkedin: "",
    github: "",
    x: "",
    instagram: "",
    clutch: "",
  },
  calendlyUrl: "[CALENDLY_URL]",
  // gstin: "[GSTIN]",
  availability: "available",
  brand: {
    wordmark: name,
  },
  founder: {
    name: "Arshdeep Singh",
    role: "Founder & lead engineer",
    photo: "/images/arshdeep-singh.jpg",
    education: "[EDUCATION]",
  },
  featureFlags: {
    testimonials: false,
    blog: false,
    cookieConsent: true,
  },
  announcement: {
    enabled: true,
    id: "scope-call-2026-10",
    badge: "A few slots each month",
    title: "A free 30-minute idea-to-scope call",
    description:
      "Bring a rough idea. We'll shape it into a first version together: what to build now, what can wait and what it is likely to take.",
    bullets: [
      "Name the handful of features your first users really need",
      "Hear a straight answer on stack, timeline and budget",
      "Walk away with next steps, whether we work together or not",
    ],
    primaryCta: { label: "Book a free call", href: "[CALENDLY_URL]" },
    secondaryLabel: "Not now",
    footnote: "Only a few of these calls fit into each month.",
    startDate: "",
    endDate: "",
  },
  payments: {
    razorpayPaymentButtonId: "[RAZORPAY_PAYMENT_BUTTON_ID]",
    paymentLinkUrl: "[RAZORPAY_PAYMENT_LINK]",
  },
};

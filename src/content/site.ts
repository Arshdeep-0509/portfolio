/**
 * Single source of truth for business facts.
 * Anything in [SQUARE_BRACKETS] is a placeholder — search for "[" before launch.
 * Components must read these values from here and never hard-code them.
 */

export type Availability = "available" | "limited" | "booked";

export type SocialKey = "linkedin" | "github" | "x" | "instagram" | "youtube";

export type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  positioning: string;
  url: string;
  email: string;
  phone: string;
  whatsappUrl: string;
  location: { city: string; state: string; country: string };
  businessHours: string;
  social: Record<SocialKey, string>;
  calendlyUrl: string;
  /** Optional. Only shown once a real GSTIN exists. */
  gstin?: string;
  availability: Availability;
  brand: { monogram: string; wordmark: string; microTagline: string };
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
 * Site-wide announcement popup. Shown once per visitor per `id` — change the id to show an
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

const phone = "[PHONE_WHATSAPP]";

/** wa.me needs digits only, with country code (e.g. 91XXXXXXXXXX). */
function buildWhatsappUrl(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "[WHATSAPP_URL]";
}

export const siteConfig: SiteConfig = {
  name: "Arshdeep Singh",
  legalName: "[LEGAL_ENTITY]",
  tagline: "Web, mobile, AI and DevOps — from MVP to scale.",
  description:
    "Full-stack engineer helping founders and growing businesses build fast, scalable web, mobile and AI products. Node.js, Python, AI integration and DevOps.",
  positioning:
    "I help founders and growing businesses turn ideas into fast, scalable web, mobile and AI products — from MVP to scale.",
  url: "https://[DOMAIN]",
  email: "[EMAIL]",
  phone,
  whatsappUrl: buildWhatsappUrl(phone),
  location: { city: "[CITY]", state: "[STATE]", country: "India" },
  businessHours: "[BUSINESS_HOURS]",
  social: {
    linkedin: "[LINKEDIN_URL]",
    github: "[GITHUB_URL]",
    x: "[X_URL]",
    instagram: "[INSTAGRAM_URL]",
    youtube: "[YOUTUBE_URL]",
  },
  calendlyUrl: "[CALENDLY_URL]",
  // gstin: "[GSTIN]",
  availability: "available",
  brand: {
    monogram: "AS",
    wordmark: "Arshdeep Singh",
    microTagline: "WEB · MOBILE · AI · DEVOPS",
  },
  founder: {
    name: "Arshdeep Singh",
    role: "Full-Stack, AI & DevOps Engineer",
    photo: "[PHOTO]",
    education: "[EDUCATION]",
  },
  featureFlags: {
    testimonials: false,
    blog: true,
    cookieConsent: true,
  },
  announcement: {
    enabled: true,
    id: "mvp-scoping-2026-10",
    badge: "Limited slots",
    title: "Free 30-minute MVP scoping call",
    description:
      "Have a product idea? In 30 minutes we'll turn it into a clear first version — what to build, what to skip and roughly what it will take.",
    bullets: [
      "Pin down the core features your first users actually need",
      "Get an honest view of the right stack, timeline and budget",
      "Leave with next steps — whether or not we work together",
    ],
    primaryCta: { label: "Book your slot", href: "[CALENDLY_URL]" },
    secondaryLabel: "Maybe later",
    footnote: "Slots are limited each month.",
    startDate: "",
    endDate: "",
  },
  payments: {
    razorpayPaymentButtonId: "[RAZORPAY_PAYMENT_BUTTON_ID]",
    paymentLinkUrl: "[RAZORPAY_PAYMENT_LINK]",
  },
};

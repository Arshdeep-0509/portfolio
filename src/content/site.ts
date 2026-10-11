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
  social: Record<SocialKey, string>;
  calendlyUrl: string;
  /** Optional. Only shown once a real GSTIN exists. */
  gstin?: string;
  availability: Availability;
  brand: { wordmark: string; microTagline: string };
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

export const siteConfig: SiteConfig = {
  name: "Arshdeep Singh",
  legalName: "[LEGAL_ENTITY]",
  tagline: "I automate businesses, so you can focus on growing them.",
  description:
    "Arshdeep Singh, a full-stack, AI and DevOps engineer in India, builds web apps, mobile apps and AI features for founders and small teams — tidy code, steady releases.",
  positioning:
    "One engineer for the whole build: I plan, design, code and run web, mobile and AI products for founders and growing teams.",
  url: "https://[DOMAIN]",
  email: "arshdeepsinghdev96@gmail.com",
  phone,
  whatsappUrl: buildWhatsappUrl(phone),
  location: { city: "Bengaluru", state: "[STATE]", country: "India" },
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
    wordmark: "Arshdeep Singh",
    microTagline: "ENGINEER · BUILDER · AI & CLOUD",
  },
  founder: {
    name: "Arshdeep Singh",
    role: "Full-Stack, AI & DevOps Engineer",
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

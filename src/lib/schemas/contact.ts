import { z } from "zod";
import "@/lib/schemas/zodJitless";

/**
 * Shared by the contact form (client) and POST /api/contact (server). Strict objects: any field
 * that isn't listed here is rejected. Option lists live here (not in src/content) because both
 * validation and the email templates depend on their ids.
 */

export const MESSAGE_MIN = 30;
export const MESSAGE_MAX = 3000;
/** Submissions faster than this after the form appeared are treated as bots. */
export const MIN_FILL_MS = 3000;

export const serviceOptions = [
  { id: "mvp", label: "Build an MVP" },
  { id: "web-app", label: "Web application" },
  { id: "mobile-app", label: "Mobile app" },
  { id: "ui-ux", label: "UI/UX design" },
  { id: "ai", label: "AI integration or automation" },
  { id: "devops", label: "DevOps / cloud setup" },
  { id: "marketing", label: "Digital or growth marketing" },
  { id: "consultation", label: "Product / tech consultation" },
  { id: "maintenance", label: "Bug fixing or maintenance" },
  { id: "other", label: "Other" },
] as const;

export const currencies = ["INR", "USD"] as const;
export type Currency = (typeof currencies)[number];

// USD ranges are rounded approximations of the INR ranges, not separate price points.
export const budgetOptions = [
  { id: "under-50k", INR: "Under ₹50k", USD: "Under $600" },
  { id: "50k-1.5l", INR: "₹50k – ₹1.5L", USD: "$600 – $1,800" },
  { id: "1.5l-5l", INR: "₹1.5L – ₹5L", USD: "$1,800 – $6,000" },
  { id: "5l-plus", INR: "₹5L+", USD: "$6,000+" },
  { id: "not-sure", INR: "Not sure yet", USD: "Not sure yet" },
] as const;

export const timelineOptions = [
  { id: "asap", label: "ASAP" },
  { id: "1-3-months", label: "1–3 months" },
  { id: "3-6-months", label: "3–6 months" },
  { id: "exploring", label: "Just exploring" },
] as const;

export const heardFromOptions = [
  { id: "google", label: "Google search" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "github", label: "GitHub" },
  { id: "referral", label: "Referral from someone" },
  { id: "article", label: "An article or post" },
  { id: "other", label: "Somewhere else" },
] as const;

export const countryCodes = [
  { code: "+91", label: "+91 India" },
  { code: "+1", label: "+1 US / Canada" },
  { code: "+44", label: "+44 UK" },
  { code: "+61", label: "+61 Australia" },
  { code: "+64", label: "+64 New Zealand" },
  { code: "+971", label: "+971 UAE" },
  { code: "+966", label: "+966 Saudi Arabia" },
  { code: "+974", label: "+974 Qatar" },
  { code: "+65", label: "+65 Singapore" },
  { code: "+49", label: "+49 Germany" },
  { code: "+33", label: "+33 France" },
  { code: "+31", label: "+31 Netherlands" },
  { code: "+353", label: "+353 Ireland" },
] as const;

type Ids<T extends readonly { id: string }[]> = [T[number]["id"], ...T[number]["id"][]];
const ids = <T extends readonly { id: string }[]>(options: T) =>
  options.map((option) => option.id) as Ids<T>;

/** Optional select: one of the ids, or "" for "not chosen". */
const optionalChoice = <T extends readonly { id: string }[]>(options: T) =>
  z.union([z.enum(ids(options)), z.literal("")]).optional();

export const contactFormSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Please keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(254, "That email address is too long.")
    .email("Please enter a valid email address."),
  phoneCountry: z.enum(
    countryCodes.map((country) => country.code) as [string, ...string[]],
    "Please choose a country code.",
  ),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .regex(/^[\d\s()-]{6,18}$/, "Please enter a valid phone number, digits only."),
  company: z.string().trim().max(120, "Please keep this under 120 characters.").optional(),
  service: z.enum(ids(serviceOptions), "Please choose what you need help with."),
  budgetCurrency: z.enum(currencies),
  budget: optionalChoice(budgetOptions),
  timeline: optionalChoice(timelineOptions),
  message: z
    .string()
    .trim()
    .min(
      MESSAGE_MIN,
      `Please write at least ${MESSAGE_MIN} characters so I understand the project.`,
    )
    .max(MESSAGE_MAX, `Please keep your message under ${MESSAGE_MAX} characters.`),
  heardFrom: optionalChoice(heardFromOptions),
  nda: z.boolean(),
  consent: z.literal(true, "Please agree to the Privacy Policy so I can reply to you."),
  /** Honeypot — see newsletterSchema. */
  website: z.string().max(500).optional(),
});

/** What the browser actually POSTs: the form plus anti-spam and attribution metadata. */
export const contactRequestSchema = contactFormSchema.extend({
  /** Epoch ms when the visitor first focused the form; 0 if never (time-to-submit check). */
  startedAt: z.number().int().nonnegative(),
  turnstileToken: z.string().max(4096).optional(),
  /** Path (and query) of the page the form was sent from. */
  sourcePage: z.string().max(300).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;

export type ContactErrorCode =
  "bad_request" | "invalid" | "rate_limited" | "bot_check_failed" | "server_error";

/** Typed response of POST /api/contact. */
export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      code: ContactErrorCode;
      error: string;
      fieldErrors?: Partial<Record<keyof ContactFormInput, string>>;
    };

/** Maps ?service=<service slug> or ?topic=<topic> from links around the site to a form option. */
const prefillMap: Record<string, ContactFormInput["service"]> = {
  // Service page slugs (src/content/services.ts)
  "mvp-development": "mvp",
  "full-stack-development": "web-app",
  "frontend-development": "web-app",
  "backend-development": "web-app",
  "web-applications": "web-app",
  "mobile-applications": "mobile-app",
  "ux-design": "ui-ux",
  "ui-design": "ui-ux",
  "digital-marketing": "marketing",
  "growth-marketing": "marketing",
  "ai-integration": "ai",
  "ai-creative": "ai",
  "devops-cloud": "devops",
  // Topics used in links (products.ts, servicesPage.ts)
  "mvp-scoping": "mvp",
  "school-platform": "consultation",
  consultation: "consultation",
  maintenance: "maintenance",
  "bug-fix": "maintenance",
};

export function serviceFromQuery(
  service: string | null,
  topic: string | null,
): ContactFormInput["service"] | undefined {
  const valid = new Set<string>(ids(serviceOptions));
  for (const value of [service, topic]) {
    if (!value) continue;
    if (prefillMap[value]) return prefillMap[value];
    if (valid.has(value)) return value as ContactFormInput["service"];
  }
  return undefined;
}

export function optionLabel(
  options: readonly { id: string; label: string }[],
  id: string | undefined | null,
) {
  return options.find((option) => option.id === id)?.label ?? null;
}

export function budgetLabel(id: string | undefined | null, currency: Currency) {
  return budgetOptions.find((option) => option.id === id)?.[currency] ?? null;
}

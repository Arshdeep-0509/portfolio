import { z } from "zod";
import "@/lib/schemas/zodJitless";

/**
 * Shared by the contact forms (client) and POST /api/contact (server). Strict objects: any field
 * that isn't listed here is rejected. Option lists live here (not in src/content) because both
 * validation and the email templates depend on their ids.
 *
 * Two forms post here: the full project form on /contact, and the short QuickStart form at the
 * foot of every other page, which sends service "quick" — the only case where the phone number
 * may be left out and a one-line message is enough.
 */

export const MESSAGE_MIN = 30;
/** QuickStart asks for a one-line idea. */
export const QUICK_MESSAGE_MIN = 10;
export const MESSAGE_MAX = 3000;
/** Submissions faster than this after the form appeared are treated as bots. */
export const MIN_FILL_MS = 3000;

export const QUICK_SERVICE = "quick";

export const serviceOptions = [
  { id: "mvp", label: "A first version (MVP)" },
  { id: "web-app", label: "A web application" },
  { id: "mobile-app", label: "A mobile app" },
  { id: "ui-ux", label: "UI or UX design" },
  { id: "ai", label: "AI features or automation" },
  { id: "devops", label: "DevOps or cloud setup" },
  { id: "marketing", label: "Digital marketing, SEO or growth" },
  { id: "consultation", label: "Advice on product or tech" },
  { id: "maintenance", label: "Fixes or maintenance" },
  { id: "other", label: "Something else" },
  { id: QUICK_SERVICE, label: "Quick enquiry" },
] as const;

/** The options a visitor picks from on /contact (QuickStart sets "quick" itself). */
export const selectableServiceOptions = serviceOptions.filter(
  (option) => option.id !== QUICK_SERVICE,
);

export const currencies = ["INR", "USD"] as const;
export type Currency = (typeof currencies)[number];

// USD ranges are rounded approximations of the INR ranges, not separate price points.
export const budgetOptions = [
  { id: "under-50k", INR: "Under ₹50k", USD: "Under $600" },
  { id: "50k-1.5l", INR: "₹50k – ₹1.5L", USD: "$600 – $1,800" },
  { id: "1.5l-5l", INR: "₹1.5L – ₹5L", USD: "$1,800 – $6,000" },
  { id: "5l-plus", INR: "₹5L+", USD: "$6,000+" },
  { id: "not-sure", INR: "Undecided", USD: "Undecided" },
] as const;

export const timelineOptions = [
  { id: "asap", label: "As soon as possible" },
  { id: "1-3-months", label: "1–3 months" },
  { id: "3-6-months", label: "3–6 months" },
  { id: "exploring", label: "Only exploring" },
] as const;

export const heardFromOptions = [
  { id: "google", label: "A Google search" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "github", label: "GitHub" },
  { id: "referral", label: "Someone recommended you" },
  { id: "article", label: "An article or post" },
  { id: "other", label: "Elsewhere" },
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

const PHONE_PATTERN = /^[\d\s()-]{6,18}$/;

const contactFields = {
  name: z
    .string()
    .trim()
    .min(2, "Add your name so I know who I'm writing to.")
    .max(100, "Names need to stay under 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "An email address is needed for my reply.")
    .max(254, "That address is longer than email allows.")
    .email("That email address doesn't look right."),
  phoneCountry: z.enum(
    countryCodes.map((country) => country.code) as [string, ...string[]],
    "Pick a country code.",
  ),
  /** Required for project enquiries; may be empty on a quick enquiry (checked below). */
  phone: z.string().trim().max(18, "Phone numbers need to stay under 18 digits."),
  company: z.string().trim().max(120, "Keep this under 120 characters.").optional(),
  service: z.enum(ids(serviceOptions), "Tell me what you need help with."),
  budgetCurrency: z.enum(currencies),
  budget: optionalChoice(budgetOptions),
  timeline: optionalChoice(timelineOptions),
  message: z
    .string()
    .trim()
    .min(QUICK_MESSAGE_MIN, `A few more words, please — at least ${QUICK_MESSAGE_MIN} characters.`)
    .max(MESSAGE_MAX, `Messages need to stay under ${MESSAGE_MAX} characters.`),
  heardFrom: optionalChoice(heardFromOptions),
  nda: z.boolean(),
  consent: z.literal(true, "Tick the box to accept the Privacy Policy so I can reply."),
  /** Honeypot — see newsletterSchema. */
  website: z.string().max(500).optional(),
};

/** Rules that depend on the kind of enquiry: project enquiries need a phone and more detail. */
function enquiryRules(
  value: { service: string; phone: string; message: string },
  ctx: z.RefinementCtx,
) {
  const quick = value.service === QUICK_SERVICE;
  if (!quick && value.phone.length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["phone"],
      message: "Add a phone number for a quick call.",
    });
  } else if (value.phone.length > 0 && !PHONE_PATTERN.test(value.phone)) {
    ctx.addIssue({
      code: "custom",
      path: ["phone"],
      message: "Use digits only for the phone number.",
    });
  }
  if (!quick && value.message.length < MESSAGE_MIN) {
    ctx.addIssue({
      code: "custom",
      path: ["message"],
      message: `Write at least ${MESSAGE_MIN} characters so I can picture the project.`,
    });
  }
}

export const contactFormSchema = z.strictObject(contactFields).superRefine(enquiryRules);

/** What the browser actually POSTs: the form plus anti-spam and attribution metadata. */
export const contactRequestSchema = z
  .strictObject({
    ...contactFields,
    /** Epoch ms when the visitor first focused the form; 0 if never (time-to-submit check). */
    startedAt: z.number().int().nonnegative(),
    turnstileToken: z.string().max(4096).optional(),
    /** Path (and query) of the page the form was sent from. */
    sourcePage: z.string().max(300).optional(),
  })
  .superRefine(enquiryRules);

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

type ServiceId = ContactFormInput["service"];

/** Maps ?service=<service slug> or ?topic=<topic> from links around the site to a form option. */
const prefillMap: Record<string, ServiceId> = {
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
  // Topics used in links (products.ts, the service picker, the corner card)
  "mvp-scoping": "mvp",
  "trading-platform": "consultation",
  "pharma-inventory": "consultation",
  consultation: "consultation",
  maintenance: "maintenance",
  "bug-fix": "maintenance",
};

/** ?bundle=<id> from the "Popular combinations" cards on /services pre-selects several options. */
export const bundlePrefill: Record<string, ServiceId[]> = {
  "launch-kit": ["mvp", "ui-ux", "devops"],
  "ai-upgrade": ["ai", "web-app", "devops"],
  "growth-engine": ["marketing", "ai"],
};

export function serviceFromQuery(
  service: string | null,
  topic: string | null,
): ServiceId | undefined {
  const valid = new Set<string>(ids(selectableServiceOptions));
  for (const value of [service, topic]) {
    if (!value) continue;
    if (prefillMap[value]) return prefillMap[value];
    if (valid.has(value)) return value as ServiceId;
  }
  return undefined;
}

/**
 * Every option a contact link asks for, in order: ?bundle=, then ?services=a,b (service slugs
 * from the picker), then ?service= / ?topic=. Unknown values are ignored; duplicates removed.
 */
export function servicesFromQuery(params: URLSearchParams): ServiceId[] {
  const picked: ServiceId[] = [...(bundlePrefill[params.get("bundle") ?? ""] ?? [])];
  for (const slug of (params.get("services") ?? "").split(",")) {
    const id = serviceFromQuery(slug.trim(), null);
    if (id) picked.push(id);
  }
  const single = serviceFromQuery(params.get("service"), params.get("topic"));
  if (single) picked.push(single);
  return [...new Set(picked)];
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

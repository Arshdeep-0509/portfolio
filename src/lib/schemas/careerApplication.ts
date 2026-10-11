import { z } from "zod";
import "@/lib/schemas/zodJitless";

/**
 * Shared by the application form (client) and POST /api/careers (server), so both reject the same
 * things with the same messages. The server additionally checks the PDF's magic bytes and that the
 * chosen role is open.
 */

export const RESUME_MAX_MB = 5;
export const RESUME_MAX_BYTES = RESUME_MAX_MB * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,application/pdf";
export const MESSAGE_MIN = 50;
export const MESSAGE_MAX = 2000;

export const experienceOptions = [
  "Student",
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5+ years",
] as const;

export const availabilityOptions = [
  "Right away",
  "In 2 weeks",
  "In 1 month",
  "Part-time only",
] as const;

// Scheme optional ("github.com/you" is fine); the server adds https:// when storing.
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export const careerApplicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Add your full name.")
    .max(100, "Names need to stay under 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "An email address is needed for my reply.")
    .max(254, "That address is longer than email allows.")
    .email("That email address doesn't look right."),
  phone: z
    .string()
    .trim()
    .min(1, "Add a phone number.")
    .regex(/^\+?[\d\s()-]{7,20}$/, "Use a format like +91 98765 43210."),
  role: z.string().trim().min(1, "Pick the role you're applying for.").max(100),
  experience: z.union([z.enum(experienceOptions), z.literal("")]).optional(),
  portfolio: z
    .string()
    .trim()
    .min(1, "Add a link to your portfolio or GitHub.")
    .max(300, "Links need to stay under 300 characters.")
    .regex(URL_PATTERN, "Use a full link, like https://github.com/you."),
  linkedin: z
    .string()
    .trim()
    .max(300, "Links need to stay under 300 characters.")
    .regex(URL_PATTERN, "Use a full link, like https://linkedin.com/in/you.")
    .or(z.literal(""))
    .optional(),
  resume: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File && value.size > 0,
      "Attach your resume as a PDF.",
    )
    .refine(isPdf, "The resume needs to be a PDF file.")
    .refine(
      (file) => file.size <= RESUME_MAX_BYTES,
      `The resume needs to be ${RESUME_MAX_MB} MB or less.`,
    ),
  availability: z.union([z.enum(availabilityOptions), z.literal("")]).optional(),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Write at least ${MESSAGE_MIN} characters, please.`)
    .max(MESSAGE_MAX, `Keep this under ${MESSAGE_MAX} characters.`),
  consent: z.literal(true, "Tick the box to accept the Privacy Policy."),
  /** Honeypot — see newsletterSchema. */
  website: z.string().max(500).optional(),
});

export type CareerApplicationInput = z.infer<typeof careerApplicationSchema>;

/** Prefixes https:// when an applicant leaves out the scheme. */
export function normalizeUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

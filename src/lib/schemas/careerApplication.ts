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
  "Immediately",
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
    .min(2, "Please enter your full name.")
    .max(100, "Please keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(254, "That email address is too long.")
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .regex(/^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number, e.g. +91 98765 43210."),
  role: z.string().trim().min(1, "Please choose a role.").max(100),
  experience: z.union([z.enum(experienceOptions), z.literal("")]).optional(),
  portfolio: z
    .string()
    .trim()
    .min(1, "Please add a portfolio or GitHub link.")
    .max(300, "That link is too long.")
    .regex(URL_PATTERN, "Please enter a valid link, e.g. https://github.com/you."),
  linkedin: z
    .string()
    .trim()
    .max(300, "That link is too long.")
    .regex(URL_PATTERN, "Please enter a valid link, e.g. https://linkedin.com/in/you.")
    .or(z.literal(""))
    .optional(),
  resume: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File && value.size > 0,
      "Please attach your resume as a PDF.",
    )
    .refine(isPdf, "Your resume must be a PDF file.")
    .refine(
      (file) => file.size <= RESUME_MAX_BYTES,
      `Your resume must be ${RESUME_MAX_MB} MB or smaller.`,
    ),
  availability: z.union([z.enum(availabilityOptions), z.literal("")]).optional(),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Please write at least ${MESSAGE_MIN} characters.`)
    .max(MESSAGE_MAX, `Please keep this under ${MESSAGE_MAX} characters.`),
  consent: z.literal(true, "Please agree to the Privacy Policy to continue."),
  /** Honeypot — see newsletterSchema. */
  website: z.string().max(500).optional(),
});

export type CareerApplicationInput = z.infer<typeof careerApplicationSchema>;

/** Prefixes https:// when an applicant leaves out the scheme. */
export function normalizeUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

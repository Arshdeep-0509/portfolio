import { NextResponse } from "next/server";
import { roleOptions } from "@/content/collaborate";
import { saveApplication, type ApplicationRecord } from "@/lib/careers/applications";
import { siteConfig } from "@/content/site";
import { sendEmail } from "@/lib/email";
import {
  applicantConfirmationEmail,
  applicationNotificationEmail,
} from "@/lib/careers/emailTemplates";
import { storeResume } from "@/lib/careers/storage";
import { verifyTurnstile } from "@/lib/turnstile";
import { isPlaceholder } from "@/lib/constants";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import {
  careerApplicationSchema,
  normalizeUrl,
  RESUME_MAX_BYTES,
} from "@/lib/schemas/careerApplication";

/**
 * POST /api/careers — multipart/form-data from the application form on /collaborate.
 *
 * Validates with the same zod schema as the form, drops bots (honeypot, then Turnstile), rate-limits
 * per IP, checks the resume really is a PDF, stores it privately, saves the application and emails
 * both the careers inbox (with a signed resume link) and the applicant. Every adapter falls back to
 * a local mock when its environment variables are missing — see .env.example.
 *
 * Responses: 201 saved · 200 honeypot · 400 unreadable body · 403 bot check failed ·
 * 413 too large · 422 invalid (with per-field `fieldErrors`) · 429 rate-limited · 500 storage failure.
 */

const rateLimited = createRateLimiter({ name: "careers", windowMs: 60 * 60 * 1000, max: 3 });
const RETENTION_DAYS = 365;
// Text fields add a few KB on top of the resume.
const MAX_BODY_BYTES = RESUME_MAX_BYTES + 512 * 1024;

type FieldErrors = Record<string, string>;

function fail(status: number, error: string, fieldErrors?: FieldErrors) {
  return NextResponse.json({ ok: false, error, fieldErrors }, { status });
}

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail(413, "Your resume must be 5 MB or smaller.", {
      resume: "Your resume must be 5 MB or smaller.",
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "Invalid request.");
  }

  const resume = form.get("resume");
  const parsed = careerApplicationSchema.safeParse({
    name: text(form, "name"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    role: text(form, "role"),
    experience: text(form, "experience") ?? "",
    portfolio: text(form, "portfolio"),
    linkedin: text(form, "linkedin") ?? "",
    resume: resume instanceof File ? resume : undefined,
    availability: text(form, "availability") ?? "",
    message: text(form, "message"),
    consent: text(form, "consent") === "true",
    website: text(form, "website"),
  });

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return fail(422, "A few fields need another look.", fieldErrors);
  }
  const data = parsed.data;

  // A filled honeypot means a bot: report success so it learns nothing, store nothing.
  if (data.website) return NextResponse.json({ ok: true }, { status: 200 });

  const ip = clientIp(request);
  if (await rateLimited(ip))
    return fail(
      429,
      "Several applications have come from your connection. Wait a while, then try again.",
    );

  if (!(await verifyTurnstile(text(form, "cf-turnstile-response") ?? null, ip))) {
    return fail(403, "The human check didn't pass. Run it once more, then send again.");
  }

  const role = roleOptions.find((option) => option.id === data.role);
  if (!role) {
    return fail(422, "A few fields need another look.", {
      role: "That role has closed. Pick another, or send a general application.",
    });
  }

  // The browser-reported type and file name can be faked; the first bytes of a PDF can't.
  const bytes = new Uint8Array(await data.resume.arrayBuffer());
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-") {
    return fail(422, "A few fields need another look.", {
      resume: "The resume needs to be a PDF file.",
    });
  }

  const now = new Date();
  const record: ApplicationRecord = {
    id: crypto.randomUUID(),
    created_at: now.toISOString(),
    delete_after: new Date(now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    role: role.id,
    role_title: role.title,
    experience: data.experience || null,
    availability: data.availability || null,
    portfolio: normalizeUrl(data.portfolio),
    linkedin: data.linkedin ? normalizeUrl(data.linkedin) : null,
    message: data.message,
    resume_key: "",
  };

  let resumeLink: { link: string; expiresInDays: number | null };
  try {
    const stored = await storeResume(record.id, bytes);
    record.resume_key = stored.key;
    resumeLink = stored;
    await saveApplication(record);
  } catch (error) {
    console.error("[careers] could not store application", error);
    return fail(500, "Your application didn't save on my side. Please try again shortly.");
  }

  // The application is safely stored; an email failure is logged but doesn't fail the request.
  const inbox = process.env.CAREERS_INBOX_EMAIL || siteConfig.email;
  const results = await Promise.allSettled([
    sendEmail({
      to: inbox,
      replyTo: record.email,
      ...applicationNotificationEmail(record, resumeLink),
    }),
    sendEmail({
      to: record.email,
      replyTo: isPlaceholder(inbox) ? undefined : inbox,
      ...applicantConfirmationEmail(record),
    }),
  ]);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(`[careers] email failed for application ${record.id}`, result.reason);
    }
  });

  return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
}

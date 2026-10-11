import { NextResponse } from "next/server";
import { siteConfig } from "@/content/site";
import {
  leadAutoReplyEmail,
  leadNotificationEmail,
  leadSummary,
} from "@/lib/contact/emailTemplates";
import { saveLead, utmFromCookie, type StoredLead } from "@/lib/contact/leads";
import { notifyChannels } from "@/lib/contact/notify";
import { isPlaceholder } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { reportError } from "@/lib/reportError";
import {
  contactRequestSchema,
  MIN_FILL_MS,
  type ContactErrorCode,
  type ContactFormInput,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * POST /api/contact — JSON from the project form on /contact.
 *
 * 1. Validate with the shared strict zod schema (unknown fields are rejected).
 * 2. Spam: honeypot and a 3-second minimum fill time (bots get a fake success; nothing is stored
 *    or sent), then Cloudflare Turnstile.
 * 3. Rate limit: 5 per IP per hour (Upstash Redis when configured, in memory otherwise).
 * 4. Store the lead (Prisma/PostgreSQL, or .data/leads.jsonl in development).
 * 5. Email the inbox (reply-to = the lead), auto-reply to the lead, ping Slack/Telegram if set.
 *
 * Always answers with ContactResponse: { ok: true } or { ok: false, code, error, fieldErrors? }.
 * Internal errors are reported (Sentry when SENTRY_DSN is set) and never returned to the browser.
 */

const rateLimited = createRateLimiter({ name: "contact", windowMs: 60 * 60 * 1000, max: 5 });
const MAX_BODY_BYTES = 32 * 1024;

const messages: Record<ContactErrorCode, string> = {
  bad_request: "Something was wrong with that request. Please refresh the page and try again.",
  invalid: "Please check the highlighted fields.",
  rate_limited:
    "Too many messages from your connection. Please try again in an hour, or email me directly.",
  bot_check_failed: "We couldn't verify you're human. Please retry the check and send again.",
  server_error:
    "Something went wrong sending your message. Please try again, or email me directly.",
};

function fail(
  status: number,
  code: ContactErrorCode,
  fieldErrors?: Partial<Record<keyof ContactFormInput, string>>,
) {
  return NextResponse.json<ContactResponse>(
    { ok: false, code, error: messages[code], ...(fieldErrors ? { fieldErrors } : {}) },
    { status },
  );
}

const success = () => NextResponse.json<ContactResponse>({ ok: true }, { status: 200 });

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail(413, "bad_request");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "bad_request");
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactFormInput, string>> = {};
    let unknownField = false;
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (issue.code === "unrecognized_keys" || typeof key !== "string") unknownField = true;
      else fieldErrors[key as keyof ContactFormInput] ??= issue.message;
    }
    return unknownField && Object.keys(fieldErrors).length === 0
      ? fail(400, "bad_request")
      : fail(422, "invalid", fieldErrors);
  }
  const data = parsed.data;

  // Bots: a filled honeypot or an impossibly fast submit gets a fake success — nothing is stored or sent.
  const elapsed = Date.now() - data.startedAt;
  if (data.website || data.startedAt === 0 || elapsed < MIN_FILL_MS) return success();

  const ip = clientIp(request);
  if (await rateLimited(ip)) return fail(429, "rate_limited");

  if (!(await verifyTurnstile(data.turnstileToken ?? null, ip))) {
    return fail(403, "bot_check_failed");
  }

  let lead: StoredLead;
  try {
    lead = await saveLead({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: `${data.phoneCountry} ${data.phone}`,
      company: data.company || null,
      service: data.service,
      budget: data.budget || null,
      budgetCurrency: data.budget ? data.budgetCurrency : null,
      timeline: data.timeline || null,
      message: data.message,
      nda: data.nda,
      heardFrom: data.heardFrom || null,
      sourcePage: data.sourcePage || null,
      utm: utmFromCookie(request.headers.get("cookie")),
    });
  } catch (error) {
    await reportError(error, { route: "api/contact", step: "store" });
    return fail(500, "server_error");
  }

  // The lead is stored, so delivery problems are reported but don't fail the request.
  const inbox = process.env.CONTACT_TO_EMAIL || siteConfig.email;
  const results = await Promise.allSettled([
    sendEmail({ to: inbox, replyTo: lead.email, ...leadNotificationEmail(lead) }),
    sendEmail({
      to: lead.email,
      replyTo: isPlaceholder(inbox) ? undefined : inbox,
      ...leadAutoReplyEmail(lead),
    }),
    notifyChannels(leadSummary(lead)),
  ]);
  const steps = ["notify-email", "auto-reply", "webhooks"];
  await Promise.all(
    results.map((result, index) =>
      result.status === "rejected"
        ? reportError(result.reason, { route: "api/contact", step: steps[index], leadId: lead.id })
        : null,
    ),
  );

  return success();
}

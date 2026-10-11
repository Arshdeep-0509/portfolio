import { NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/newsletter";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { newsletterSchema } from "@/lib/schemas/newsletter";

/**
 * POST /api/newsletter  { email, website? }
 * Validates the address, ignores bots (honeypot), applies a light per-IP rate limit and stores the
 * subscriber via lib/newsletter.ts. Responses: 201 created, 200 already subscribed / honeypot,
 * 400 bad JSON, 422 invalid email, 429 too many requests, 500 storage failure.
 */

const rateLimited = createRateLimiter({ name: "newsletter", windowMs: 10 * 60 * 1000, max: 5 });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "That request couldn't be read." },
      { status: 400 },
    );
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "That email address doesn't look right.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }

  // A filled honeypot means a bot: report success so it learns nothing, store nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 200 });

  if (await rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Several attempts came from your connection. Try again a little later." },
      { status: 429 },
    );
  }

  try {
    const result = await saveSubscriber(parsed.data.email);
    return NextResponse.json(
      { ok: true, status: result },
      { status: result === "created" ? 201 : 200 },
    );
  } catch (error) {
    console.error("[newsletter] could not save subscriber", error);
    return NextResponse.json(
      { ok: false, error: "That didn't go through. Please try again shortly." },
      { status: 500 },
    );
  }
}

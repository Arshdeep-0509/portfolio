import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Where newsletter sign-ups go. Two adapters, chosen by environment:
 *
 * 1. NEWSLETTER_WEBHOOK_URL set → POST { email, source, subscribedAt } to it. Point this at your
 *    email provider (Buttondown, Brevo, Mailchimp via Zapier/Make, an n8n flow…). Recommended in
 *    production, and required on serverless hosts where the filesystem isn't persistent.
 * 2. Otherwise → append to .data/newsletter-subscribers.jsonl (git-ignored), de-duplicated.
 *    Fine for local development and single-server hosting.
 *
 * Double opt-in can be added later by having the provider send the confirmation email.
 */

const FILE = path.join(process.cwd(), ".data", "newsletter-subscribers.jsonl");

export type SaveResult = "created" | "exists";

export async function saveSubscriber(email: string, source = "footer"): Promise<SaveResult> {
  const record = { email: email.toLowerCase(), source, subscribedAt: new Date().toISOString() };

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error(`Newsletter webhook failed with ${response.status}`);
    return "created";
  }

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const existing = await fs.readFile(FILE, "utf8").catch(() => "");
  const already = existing
    .split("\n")
    .filter(Boolean)
    .some((line) => {
      try {
        return (JSON.parse(line) as { email?: string }).email === record.email;
      } catch {
        return false;
      }
    });
  if (already) return "exists";
  await fs.appendFile(FILE, `${JSON.stringify(record)}\n`, "utf8");
  return "created";
}

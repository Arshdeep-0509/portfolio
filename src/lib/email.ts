import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { isPlaceholder } from "@/lib/constants";

/**
 * Outgoing email for the contact and careers forms. The first configured provider wins:
 *
 * 1. RESEND_API_KEY + EMAIL_FROM → Resend's HTTP API (no SDK needed). EMAIL_FROM must be on a
 *    domain verified in Resend, e.g. "Arshdeep Singh <hello@yourdomain>".
 * 2. SMTP_HOST (+ SMTP_PORT, SMTP_USER, SMTP_PASS) + EMAIL_FROM → Nodemailer over SMTP
 *    (Gmail/Google Workspace app password, Zoho, Brevo, SES SMTP…).
 * 3. Otherwise → mock provider: each email is written to .data/outbox/ as an .html file you can
 *    open in a browser, and a one-line summary is logged to the server console.
 */

export type Email = { to: string; subject: string; html: string; text: string; replyTo?: string };

const OUTBOX = path.join(process.cwd(), ".data", "outbox");

export type EmailProvider = "resend" | "smtp" | "mock";

export function emailProvider(): EmailProvider {
  if (process.env.EMAIL_FROM && process.env.RESEND_API_KEY) return "resend";
  if (process.env.EMAIL_FROM && process.env.SMTP_HOST) return "smtp";
  return "mock";
}

export async function sendEmail(email: Email) {
  const provider = emailProvider();
  const from = process.env.EMAIL_FROM ?? "";

  if (provider !== "mock" && isPlaceholder(email.to)) {
    throw new Error(`Email recipient is a placeholder: ${email.to}`);
  }

  if (provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
    });
    if (!response.ok) {
      throw new Error(`Resend failed with ${response.status}: ${await response.text()}`);
    }
    return;
  }

  if (provider === "smtp") {
    // Loaded only when SMTP is in use.
    const { createTransport } = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT) || 587;
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await transport.sendMail({ from, ...email });
    return;
  }

  await fs.mkdir(OUTBOX, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = email.subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 50);
  const file = path.join(OUTBOX, `${stamp}-${slug}.html`);
  const replyTo = email.replyTo ? ` | Reply-To: ${email.replyTo}` : "";
  const header = `<!-- To: ${email.to}${replyTo} | Subject: ${email.subject} -->\n`;
  await fs.writeFile(file, header + email.html, "utf8");
  console.info(
    `[mock email] to=${email.to} subject="${email.subject}" → ${path.relative(process.cwd(), file)}`,
  );
}

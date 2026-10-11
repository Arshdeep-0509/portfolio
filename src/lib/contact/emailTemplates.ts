import "server-only";
import { siteConfig } from "@/content/site";
import type { StoredLead } from "@/lib/contact/leads";
import { isPlaceholder } from "@/lib/constants";
import {
  emailColors as colors,
  emailLayout as layout,
  emailRow as row,
  escapeHtml,
  type RenderedEmail,
} from "@/lib/emailLayout";
import {
  budgetLabel,
  heardFromOptions,
  optionLabel,
  serviceOptions,
  timelineOptions,
  type Currency,
} from "@/lib/schemas/contact";

/** Emails for contact-form leads: a notification to the inbox and an auto-reply to the lead. */

function labels(lead: StoredLead) {
  return {
    service: optionLabel(serviceOptions, lead.service) ?? lead.service,
    budget: budgetLabel(lead.budget, (lead.budgetCurrency ?? "INR") as Currency),
    timeline: optionLabel(timelineOptions, lead.timeline),
    heardFrom: optionLabel(heardFromOptions, lead.heardFrom),
  };
}

function receivedAt(lead: StoredLead) {
  const time = lead.createdAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `${time} IST`;
}

function messageBlock(message: string) {
  return `<p style="margin:0 0 24px;padding:12px 16px;background:${colors.bg};border-left:3px solid ${colors.primary};white-space:pre-wrap;">${escapeHtml(message)}</p>`;
}

export function leadNotificationEmail(lead: StoredLead): RenderedEmail {
  const l = labels(lead);
  const subject = `New lead: ${l.service} — ${lead.name}${lead.nda ? " (NDA requested)" : ""}`;
  const utm = Object.entries(lead.utm)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join(" · ");
  const whatsapp = `https://wa.me/${lead.phone.replace(/\D/g, "")}`;

  const html = layout(
    subject,
    `<h1 style="margin:0 0 4px;font-size:20px;">New project enquiry</h1>
<p style="margin:0 0 20px;color:${colors.muted};">Reply to this email to answer ${escapeHtml(lead.name)} directly.</p>
${lead.nda ? `<p style="margin:0 0 20px;padding:10px 14px;background:#fef3c7;border-radius:8px;font-weight:700;">NDA requested before sharing details.</p>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
${row("Name", lead.name)}
${row("Email", lead.email, `mailto:${lead.email}`)}
${row("Phone", lead.phone, `tel:${lead.phone.replace(/[^\d+]/g, "")}`)}
${row("WhatsApp", "Open chat", whatsapp)}
${row("Company", lead.company)}
${row("Needs help with", l.service)}
${row("Budget", l.budget)}
${row("Timeline", l.timeline)}
${row("Heard about me", l.heardFrom)}
${row("Sent from", lead.sourcePage)}
${row("UTM", utm || null)}
${row("Received", receivedAt(lead))}
${row("Reference", lead.id)}
</table>
<h2 style="margin:0 0 8px;font-size:16px;">Message</h2>
${messageBlock(lead.message)}`,
  );

  const text = [
    "New project enquiry",
    lead.nda ? "NDA requested before sharing details." : "",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone} (WhatsApp: ${whatsapp})`,
    `Company: ${lead.company ?? "—"}`,
    `Needs help with: ${l.service}`,
    `Budget: ${l.budget ?? "—"}`,
    `Timeline: ${l.timeline ?? "—"}`,
    `Heard about me: ${l.heardFrom ?? "—"}`,
    `Sent from: ${lead.sourcePage ?? "—"}`,
    `UTM: ${utm || "—"}`,
    `Received: ${receivedAt(lead)}`,
    `Reference: ${lead.id}`,
    "",
    "Message:",
    lead.message,
  ].join("\n");

  return { subject, html, text };
}

export function leadAutoReplyEmail(lead: StoredLead): RenderedEmail {
  const l = labels(lead);
  const firstName = lead.name.split(/\s+/)[0] || lead.name;
  const subject = `Thanks, ${firstName} — I've got your message`;
  const booking = isPlaceholder(siteConfig.calendlyUrl) ? null : siteConfig.calendlyUrl;
  const steps = [
    "I'll read your message and reply within one business day, by email or WhatsApp.",
    "If it helps, we'll have a 30–45 minute discovery call to understand your goals.",
    "You'll get a written plan: scope, timeline and estimate. No pressure — you decide when to move forward.",
  ];

  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;">Thanks, ${escapeHtml(firstName)}!</h1>
<p style="margin:0 0 16px;">Your message has reached me — I'll reply within one business day. Here's a copy of what you sent:</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:16px;">
${row("Needs help with", l.service)}
${row("Budget", l.budget)}
${row("Timeline", l.timeline)}
${row("NDA first", lead.nda ? "Yes" : "No")}
</table>
${messageBlock(lead.message)}
<h2 style="margin:0 0 8px;font-size:16px;">What happens next</h2>
<ol style="margin:0 0 20px;padding-left:20px;">${steps.map((step) => `<li style="margin-bottom:6px;">${escapeHtml(step)}</li>`).join("")}</ol>
${
  booking
    ? `<p style="margin:0 0 20px;"><a href="${escapeHtml(booking)}" style="display:inline-block;background:${colors.primary};color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:999px;">Book a 30-min call</a></p>`
    : ""
}
<p style="margin:0 0 16px;">Want to add something? Just reply to this email.</p>
<p style="margin:0 0 24px;">— ${escapeHtml(siteConfig.name)}</p>
<p style="margin:0;color:${colors.muted};font-size:13px;">You're receiving this because you contacted me at ${escapeHtml(siteConfig.url)}. Reference: ${escapeHtml(lead.id)}</p>`,
  );

  const text = [
    `Thanks, ${firstName}!`,
    "",
    "Your message has reached me — I'll reply within one business day. Here's a copy of what you sent:",
    "",
    `Needs help with: ${l.service}`,
    `Budget: ${l.budget ?? "—"}`,
    `Timeline: ${l.timeline ?? "—"}`,
    `NDA first: ${lead.nda ? "Yes" : "No"}`,
    "",
    lead.message,
    "",
    "What happens next:",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    ...(booking ? ["", `Book a 30-min call: ${booking}`] : []),
    "",
    "Want to add something? Just reply to this email.",
    "",
    `— ${siteConfig.name}`,
    "",
    `Reference: ${lead.id}`,
  ].join("\n");

  return { subject, html, text };
}

/** One-line summary for Slack / Telegram. */
export function leadSummary(lead: StoredLead) {
  const l = labels(lead);
  return [
    `New lead: ${lead.name} <${lead.email}> · ${lead.phone}`,
    `${l.service}${l.budget ? ` · ${l.budget}` : ""}${l.timeline ? ` · ${l.timeline}` : ""}${lead.nda ? " · NDA requested" : ""}`,
    lead.message.length > 280 ? `${lead.message.slice(0, 277)}…` : lead.message,
  ].join("\n");
}

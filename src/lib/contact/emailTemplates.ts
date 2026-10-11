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
  return `<p style="margin:0 0 24px;padding:12px 16px;background:${colors.bg};border-left:3px solid ${colors.lamp};white-space:pre-wrap;">${escapeHtml(message)}</p>`;
}

export function leadNotificationEmail(lead: StoredLead): RenderedEmail {
  const l = labels(lead);
  const subject = `Enquiry: ${l.service} from ${lead.name}${lead.nda ? " (wants an NDA)" : ""}`;
  const utm = Object.entries(lead.utm)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join(" · ");
  // Quick enquiries may arrive without a phone number.
  const digits = lead.phone.replace(/\D/g, "");
  const whatsapp = digits ? `https://wa.me/${digits}` : null;

  const html = layout(
    subject,
    `<h1 style="margin:0 0 4px;font-size:20px;">A new enquiry has arrived</h1>
<p style="margin:0 0 20px;color:${colors.muted};">Replying to this email goes straight to ${escapeHtml(lead.name)}.</p>
${lead.nda ? `<p style="margin:0 0 20px;padding:10px 14px;background:#f3ede2;border-left:3px solid #f5a524;border-radius:4px;font-weight:700;">They would like an NDA before sharing details.</p>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
${row("Name", lead.name)}
${row("Email", lead.email, `mailto:${lead.email}`)}
${row("Phone", lead.phone || null, lead.phone ? `tel:${lead.phone.replace(/[^\d+]/g, "")}` : undefined)}
${row("WhatsApp", whatsapp ? "Start a chat" : null, whatsapp ?? undefined)}
${row("Company", lead.company)}
${row("Looking for", l.service)}
${row("Budget", l.budget)}
${row("Timeline", l.timeline)}
${row("Found me through", l.heardFrom)}
${row("Page", lead.sourcePage)}
${row("UTM", utm || null)}
${row("Received", receivedAt(lead))}
${row("Reference", lead.id)}
</table>
<h2 style="margin:0 0 8px;font-size:16px;">What they wrote</h2>
${messageBlock(lead.message)}`,
  );

  const text = [
    "A new enquiry has arrived",
    lead.nda ? "They would like an NDA before sharing details." : "",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "—"}${whatsapp ? ` (WhatsApp: ${whatsapp})` : ""}`,
    `Company: ${lead.company ?? "—"}`,
    `Looking for: ${l.service}`,
    `Budget: ${l.budget ?? "—"}`,
    `Timeline: ${l.timeline ?? "—"}`,
    `Found me through: ${l.heardFrom ?? "—"}`,
    `Page: ${lead.sourcePage ?? "—"}`,
    `UTM: ${utm || "—"}`,
    `Received: ${receivedAt(lead)}`,
    `Reference: ${lead.id}`,
    "",
    "What they wrote:",
    lead.message,
  ].join("\n");

  return { subject, html, text };
}

export function leadAutoReplyEmail(lead: StoredLead): RenderedEmail {
  const l = labels(lead);
  const firstName = lead.name.split(/\s+/)[0] || lead.name;
  const subject = `${firstName}, your message is with me`;
  const booking = isPlaceholder(siteConfig.calendlyUrl) ? null : siteConfig.calendlyUrl;
  const steps = [
    "I read it and write back within one business day, by email or WhatsApp.",
    "Where useful, we talk for 30–45 minutes about your goals and your users.",
    "You receive a written plan with scope, timeline and estimate, and decide in your own time.",
  ];

  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;">Thank you, ${escapeHtml(firstName)}.</h1>
<p style="margin:0 0 16px;">It arrived safely, and you'll hear from me within one business day. For your records, this is what you sent:</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:16px;">
${row("Looking for", l.service)}
${row("Budget", l.budget)}
${row("Timeline", l.timeline)}
${row("NDA first", lead.nda ? "Yes" : "No")}
</table>
${messageBlock(lead.message)}
<h2 style="margin:0 0 8px;font-size:16px;">From here</h2>
<ol style="margin:0 0 20px;padding-left:20px;">${steps.map((step) => `<li style="margin-bottom:6px;">${escapeHtml(step)}</li>`).join("")}</ol>
${
  booking
    ? `<p style="margin:0 0 20px;"><a href="${escapeHtml(booking)}" style="display:inline-block;background:${colors.lamp};color:${colors.text};text-decoration:none;font-weight:700;padding:10px 18px;border-radius:8px;">Book a free call</a></p>`
    : ""
}
<p style="margin:0 0 16px;">Thought of something else? Reply to this email and it reaches me.</p>
<p style="margin:0 0 24px;">— ${escapeHtml(siteConfig.name)}</p>
<p style="margin:0;color:${colors.muted};font-size:13px;">This email went to you because you wrote to me through ${escapeHtml(siteConfig.url)}. Reference: ${escapeHtml(lead.id)}</p>`,
  );

  const text = [
    `Thank you, ${firstName}.`,
    "",
    "It arrived safely, and you'll hear from me within one business day. For your records, this is what you sent:",
    "",
    `Looking for: ${l.service}`,
    `Budget: ${l.budget ?? "—"}`,
    `Timeline: ${l.timeline ?? "—"}`,
    `NDA first: ${lead.nda ? "Yes" : "No"}`,
    "",
    lead.message,
    "",
    "From here:",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    ...(booking ? ["", `Book a free call: ${booking}`] : []),
    "",
    "Thought of something else? Reply to this email and it reaches me.",
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
    `Enquiry: ${lead.name} <${lead.email}>${lead.phone ? ` · ${lead.phone}` : ""}`,
    `${l.service}${l.budget ? ` · ${l.budget}` : ""}${l.timeline ? ` · ${l.timeline}` : ""}${lead.nda ? " · wants an NDA" : ""}`,
    lead.message.length > 280 ? `${lead.message.slice(0, 277)}…` : lead.message,
  ].join("\n");
}

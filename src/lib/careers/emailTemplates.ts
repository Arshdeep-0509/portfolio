import "server-only";
import { siteConfig } from "@/content/site";
import type { ApplicationRecord } from "@/lib/careers/applications";
import {
  emailColors as colors,
  emailLayout as layout,
  emailRow as row,
  escapeHtml,
  type RenderedEmail as Rendered,
} from "@/lib/emailLayout";

/**
 * Email templates for career applications: a notification to the careers inbox and a
 * confirmation to the applicant. Each returns a subject, HTML and a
 * plain-text version.
 */

function receivedAt(application: ApplicationRecord) {
  const time = new Date(application.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `${time} IST`;
}

export function applicationNotificationEmail(
  application: ApplicationRecord,
  resume: { link: string; expiresInDays: number | null },
): Rendered {
  const subject = `Application: ${application.role_title} from ${application.name}`;
  const expiry = resume.expiresInDays
    ? `The signed link stops working in ${resume.expiresInDays} day${resume.expiresInDays === 1 ? "" : "s"}.`
    : "Saved on this machine (development mode).";
  const deleteBy = application.delete_after.slice(0, 10);

  const html = layout(
    subject,
    `<h1 style="margin:0 0 4px;font-size:20px;">A new application has arrived</h1>
<p style="margin:0 0 20px;color:${colors.muted};">Replying to this email goes straight to ${escapeHtml(application.name)}.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
${row("Role", application.role_title)}
${row("Name", application.name)}
${row("Email", application.email, `mailto:${application.email}`)}
${row("Phone", application.phone, `tel:${application.phone.replace(/[^\d+]/g, "")}`)}
${row("Experience", application.experience)}
${row("Availability", application.availability)}
${row("Portfolio / GitHub", application.portfolio, application.portfolio)}
${row("LinkedIn", application.linkedin, application.linkedin ?? undefined)}
${row("Received", receivedAt(application))}
${row("Reference", application.id)}
</table>
<h2 style="margin:0 0 8px;font-size:16px;">In their words</h2>
<p style="margin:0 0 24px;padding:12px 16px;background:${colors.bg};border-left:3px solid ${colors.lamp};white-space:pre-wrap;">${escapeHtml(application.message)}</p>
<p style="margin:0 0 6px;"><a href="${escapeHtml(resume.link)}" style="display:inline-block;background:${colors.lamp};color:${colors.text};text-decoration:none;font-weight:700;padding:10px 18px;border-radius:8px;">Open the resume (PDF)</a></p>
<p style="margin:0;color:${colors.muted};font-size:13px;">${escapeHtml(expiry)} Remove this application by ${deleteBy}.</p>`,
  );

  const text = [
    "A new application has arrived",
    "",
    `Role: ${application.role_title}`,
    `Name: ${application.name}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `Experience: ${application.experience ?? "—"}`,
    `Availability: ${application.availability ?? "—"}`,
    `Portfolio / GitHub: ${application.portfolio}`,
    `LinkedIn: ${application.linkedin ?? "—"}`,
    `Received: ${receivedAt(application)}`,
    `Reference: ${application.id}`,
    "",
    "In their words:",
    application.message,
    "",
    `Resume: ${resume.link}`,
    expiry,
    `Remove this application by ${deleteBy}.`,
  ].join("\n");

  return { subject, html, text };
}

const nextSteps = [
  "I read each application myself, usually within a week.",
  "If there's a fit, I'll email you to set up a 20-minute intro call.",
  "If not right now, I'll say so — and keep your details for up to 12 months in case something opens.",
];

export function applicantConfirmationEmail(application: ApplicationRecord): Rendered {
  const firstName = application.name.split(/\s+/)[0] || application.name;
  const subject = `${firstName}, your application arrived`;

  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;">Thank you for applying, ${escapeHtml(firstName)}.</h1>
<p style="margin:0 0 16px;">Your application for <strong>${escapeHtml(application.role_title)}</strong> is with me. From here:</p>
<ol style="margin:0 0 20px;padding-left:20px;">${nextSteps.map((step) => `<li style="margin-bottom:6px;">${escapeHtml(step)}</li>`).join("")}</ol>
<p style="margin:0 0 16px;">Thought of something else? Reply to this email and it reaches me.</p>
<p style="margin:0 0 24px;">— ${escapeHtml(siteConfig.name)}</p>
<p style="margin:0;color:${colors.muted};font-size:13px;">This email went to you because you applied through ${escapeHtml(siteConfig.url)}/collaborate. Your details are kept for hiring purposes for up to 12 months; reply if you would like them removed sooner. Reference: ${escapeHtml(application.id)}</p>`,
  );

  const text = [
    `Thank you for applying, ${firstName}.`,
    "",
    `Your application for ${application.role_title} is with me. From here:`,
    ...nextSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Thought of something else? Reply to this email and it reaches me.",
    "",
    `— ${siteConfig.name}`,
    "",
    `This email went to you because you applied through ${siteConfig.url}/collaborate. Your details are kept for hiring purposes for up to 12 months; reply if you would like them removed sooner. Reference: ${application.id}`,
  ].join("\n");

  return { subject, html, text };
}

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
  const subject = `New application: ${application.role_title} — ${application.name}`;
  const expiry = resume.expiresInDays
    ? `This signed link expires in ${resume.expiresInDays} day${resume.expiresInDays === 1 ? "" : "s"}.`
    : "Stored locally (development mode).";
  const deleteBy = application.delete_after.slice(0, 10);

  const html = layout(
    subject,
    `<h1 style="margin:0 0 4px;font-size:20px;">New career application</h1>
<p style="margin:0 0 20px;color:${colors.muted};">Reply to this email to answer ${escapeHtml(application.name)} directly.</p>
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
<h2 style="margin:0 0 8px;font-size:16px;">Why they want to work on this</h2>
<p style="margin:0 0 24px;padding:12px 16px;background:${colors.bg};border-left:3px solid ${colors.primary};white-space:pre-wrap;">${escapeHtml(application.message)}</p>
<p style="margin:0 0 6px;"><a href="${escapeHtml(resume.link)}" style="display:inline-block;background:${colors.primary};color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:999px;">Download resume (PDF)</a></p>
<p style="margin:0;color:${colors.muted};font-size:13px;">${escapeHtml(expiry)} Delete this application by ${deleteBy}.</p>`,
  );

  const text = [
    "New career application",
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
    "Why they want to work on this:",
    application.message,
    "",
    `Resume: ${resume.link}`,
    expiry,
    `Delete this application by ${deleteBy}.`,
  ].join("\n");

  return { subject, html, text };
}

const nextSteps = [
  "I read every application personally, usually within a week.",
  "If there's a fit, I'll email you to book a 20-minute intro call.",
  "If not right now, I'll let you know — and keep your details for up to 12 months in case something opens up.",
];

export function applicantConfirmationEmail(application: ApplicationRecord): Rendered {
  const firstName = application.name.split(/\s+/)[0] || application.name;
  const subject = `Thanks for applying, ${firstName}`;

  const html = layout(
    subject,
    `<h1 style="margin:0 0 16px;font-size:20px;">Thanks for applying, ${escapeHtml(firstName)}!</h1>
<p style="margin:0 0 16px;">Your application for <strong>${escapeHtml(application.role_title)}</strong> has arrived safely. Here's what happens next:</p>
<ol style="margin:0 0 20px;padding-left:20px;">${nextSteps.map((step) => `<li style="margin-bottom:6px;">${escapeHtml(step)}</li>`).join("")}</ol>
<p style="margin:0 0 16px;">If you'd like to add anything, just reply to this email.</p>
<p style="margin:0 0 24px;">— ${escapeHtml(siteConfig.name)}</p>
<p style="margin:0;color:${colors.muted};font-size:13px;">You're receiving this because you applied at ${escapeHtml(siteConfig.url)}/careers. Your data is kept for hiring purposes for up to 12 months; reply to ask for it to be deleted sooner. Reference: ${escapeHtml(application.id)}</p>`,
  );

  const text = [
    `Thanks for applying, ${firstName}!`,
    "",
    `Your application for ${application.role_title} has arrived safely. Here's what happens next:`,
    ...nextSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "If you'd like to add anything, just reply to this email.",
    "",
    `— ${siteConfig.name}`,
    "",
    `You're receiving this because you applied at ${siteConfig.url}/careers. Your data is kept for hiring purposes for up to 12 months; reply to ask for it to be deleted sooner. Reference: ${application.id}`,
  ].join("\n");

  return { subject, html, text };
}

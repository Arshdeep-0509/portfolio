import "server-only";
import { siteConfig } from "@/content/site";

/** Shared building blocks for transactional emails: inline styles and a table layout, which email clients handle best. */

export type RenderedEmail = { subject: string; html: string; text: string };

export const emailColors = {
  night: "#0a0a12",
  /** Accent for links and rules: --lamp-700, AA on white. */
  accent: "#a65e00",
  lamp: "#f5a524",
  text: "#16141f",
  muted: "#4a4658",
  border: "#e6dfd3",
  bg: "#fbf8f2",
};

/** Applicant-supplied text is always escaped before it goes into HTML. */
export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function emailLayout(title: string, body: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${emailColors.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:${emailColors.text};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailColors.bg};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${emailColors.border};border-radius:4px;overflow:hidden;">
<tr><td style="background:${emailColors.night};padding:20px 28px;color:#fbf8f2;font-family:Georgia,serif;font-size:18px;font-weight:600;"><span style="color:${emailColors.lamp};">&#9679;</span> ${escapeHtml(siteConfig.name)}</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6;">${body}</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function emailRow(label: string, value: string | null, href?: string) {
  let shown = `<span style="color:${emailColors.muted};">—</span>`;
  if (value) {
    shown = href
      ? `<a href="${escapeHtml(href)}" style="color:${emailColors.accent};">${escapeHtml(value)}</a>`
      : escapeHtml(value);
  }
  return `<tr><td style="padding:6px 12px 6px 0;color:${emailColors.muted};white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;">${shown}</td></tr>`;
}

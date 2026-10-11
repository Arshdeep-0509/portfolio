/**
 * Client-side analytics events (GA4 naming). Sends through:
 * - gtag, once Google Analytics is loaded — which only happens after analytics consent;
 * - Plausible, when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (cookieless, no consent needed).
 * Without either it does nothing, so call sites never need to check. Never put personal data
 * (names, emails, phone numbers, messages) in event parameters.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    plausible?: ((event: string, options?: { props?: Record<string, unknown> }) => void) & {
      q?: unknown[];
    };
  }
}

export type AnalyticsEvent =
  /** { location, label } — buttons and links marked with data-cta="<location>". */
  | "cta_click"
  /** { service, budget } — contact form sent successfully. */
  | "generate_lead"
  | "whatsapp_click"
  | "calendly_open"
  /** { slug } — a service page was viewed. */
  | "service_view"
  /** { role } — careers application sent successfully. */
  | "career_apply"
  | "newsletter_signup"
  /** { url, domain } — a link to another site. */
  | "outbound_click"
  | "announcement_view"
  | "announcement_click"
  | "announcement_close";

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.plausible?.(name, { props: params });
}

/** Classifies a clicked link for the global click tracker (see ClickTracking). */
export function linkEvent(
  href: string,
  currentHost: string,
): { name: AnalyticsEvent; params: Record<string, unknown> } | null {
  let url: URL;
  try {
    url = new URL(href, `https://${currentHost}`);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.replace(/^www\./, "");
  if (host === "wa.me" || host === "api.whatsapp.com")
    return { name: "whatsapp_click", params: {} };
  if (host === "calendly.com" || host.endsWith(".calendly.com")) {
    return { name: "calendly_open", params: {} };
  }
  if (url.host !== currentHost) {
    return {
      name: "outbound_click",
      params: { url: `${url.origin}${url.pathname}`, domain: host },
    };
  }
  return null;
}

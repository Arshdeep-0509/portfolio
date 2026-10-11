import { services } from "@/content/services";

/** Every static route. sitemap.xml, the E2E tests and the link checker read this list. */

/** When page copy last changed (YYYY-MM-DD). Bump it with content edits; sitemap.xml uses it. */
export const CONTENT_UPDATED = "2026-10-10";

export type SiteRoute = { label: string; href: string; noIndex?: boolean };

export const staticRoutes: SiteRoute[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Why Me", href: "/why-me" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Pay", href: "/pay", noIndex: true },
  { label: "UI Showcase", href: "/dev/ui", noIndex: true },
];

export const serviceRoutes: SiteRoute[] = services.map((service) => ({
  label: service.title,
  href: `/services/${service.slug}`,
}));

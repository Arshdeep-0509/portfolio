import { services } from "@/content/services";

/** Every static route. sitemap.xml, the E2E tests and the link checker read this list. */

/** When page copy last changed (YYYY-MM-DD). Bump it with content edits; sitemap.xml uses it. */
export const CONTENT_UPDATED = "2026-10-11";

export type SiteRoute = { label: string; href: string; noIndex?: boolean };

export const staticRoutes: SiteRoute[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Journal", href: "/journal" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Collaborate", href: "/collaborate" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Pay", href: "/pay", noIndex: true },
  { label: "UI Showcase", href: "/dev/ui", noIndex: true },
];

/** Old addresses from before the Skylamp rebrand, permanently redirected in next.config.ts. */
export const renamedRoutes = [
  { source: "/why-me", destination: "/approach" },
  { source: "/insights", destination: "/journal" },
  { source: "/insights/:slug", destination: "/journal/:slug" },
  { source: "/careers", destination: "/collaborate" },
  { source: "/rss.xml", destination: "/journal/rss.xml" },
] as const;

export const serviceRoutes: SiteRoute[] = services.map((service) => ({
  label: service.title,
  href: `/services/${service.slug}`,
}));

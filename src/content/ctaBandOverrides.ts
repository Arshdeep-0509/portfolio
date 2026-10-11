import "server-only";
import type { CTABandContent } from "@/content/ctaBand";
import { services } from "@/content/services";
import { whyMeContent } from "@/content/whyMe";
import { getCaseStudies } from "@/lib/mdx";

/** "Ready to start your MVP project?" on each service page, with the quote link pre-filled. */
const serviceOverrides = Object.fromEntries(
  services.map((service) => [
    `/services/${service.slug}`,
    {
      title: `Ready to start your ${service.shortTitle} project?`,
      highlight: `${service.shortTitle} project`,
      primary: { label: "Get a free quote", href: `/contact?service=${service.slug}` },
    } satisfies Partial<CTABandContent>,
  ]),
);

/**
 * Per-page CTA band overrides, keyed by exact pathname. `null` hides the band on that page;
 * a partial object replaces only the fields it sets.
 *
 * Server-only: SiteShell passes this (small) map to the client band as a prop, so the
 * content modules it draws on are never bundled for the browser.
 */
export const ctaBandOverrides: Record<string, Partial<CTABandContent> | null> = {
  "/contact": null,
  "/why-me": whyMeContent.ctaBand,
  "/careers": {
    title: "Don't see your role? Send a general application.",
    highlight: "general application",
    text: "Good people are always welcome. Tell me what you do best, and I'll reach out when a project needs it.",
    primary: { label: "Send a general application", href: "#apply" },
    secondary: { label: "See how hiring works", href: "#hiring-process" },
  },
  ...serviceOverrides,
  // Case studies render their own "Want something similar?" CTA before the previous/next links.
  ...Object.fromEntries(getCaseStudies().map((study) => [`/work/${study.slug}`, null])),
};

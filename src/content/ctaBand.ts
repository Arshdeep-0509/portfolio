/**
 * Copy for the CTA band shown above the footer on every page.
 * Keep this module free of heavy imports: the band renders inside a client component, so
 * everything imported here ships to the browser. Per-page overrides live in ctaBandOverrides.ts.
 */

export type CTABandAction = { label: string; href: string };

export type CTABandContent = {
  title: string;
  /** Part of `title` to highlight. */
  highlight?: string;
  text: string;
  primary: CTABandAction;
  secondary?: CTABandAction;
};

export const defaultCTABand: CTABandContent = {
  title: "Have an idea? Let's turn it into a launch-ready product.",
  highlight: "launch-ready product",
  text: "Tell me what you're building. You'll get a clear scope, the right stack and an honest timeline — usually within one business day.",
  primary: { label: "Start your project", href: "/contact" },
  secondary: { label: "View all services", href: "/services" },
};

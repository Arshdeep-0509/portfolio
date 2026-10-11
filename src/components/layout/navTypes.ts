import type { Availability } from "@/content/site";

/**
 * Routes whose first section is a night hero that sits under a transparent header. Kept as a list
 * (rather than detected with :has() in CSS) so the header state is in the server HTML at no
 * style-recalculation cost. Keep in sync with the pages that use <Section underHeader> or
 * data-under-header.
 */
const OVER_HERO = [
  /^\/$/,
  /^\/approach$/,
  /^\/about$/,
  /^\/collaborate$/,
  /^\/dev\/ui$/,
  /^\/work\/[^/]+$/,
];

export function isOverHeroRoute(pathname: string) {
  return OVER_HERO.some((pattern) => pattern.test(pathname));
}

type NavigationModule = typeof import("@/content/navigation");

/** "/" matches only itself; other links also match their sub-pages (/services/mvp-development). */
export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Everything the client-side header needs, passed down from the server <Header>. Client
 * components must not import content modules directly: navigation.ts imports services.ts, and
 * importing it from a client component would ship every service's copy to the browser.
 */
export type HeaderNav = {
  main: NavigationModule["mainNav"];
  services: NavigationModule["servicesMenu"];
  copy: NavigationModule["headerCopy"];
  contact: NavigationModule["contactDetails"];
  social: NavigationModule["socialLinks"];
  availability: Availability;
};

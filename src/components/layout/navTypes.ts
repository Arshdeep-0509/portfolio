import type { MegaMenuGroup, MegaMenuItem } from "@/content/navigation";

/** Mega-menu data with each service icon already rendered on the server. */
export type MegaItemView = MegaMenuItem & { iconNode: React.ReactNode };
export type MegaGroupView = Omit<MegaMenuGroup, "items"> & { items: MegaItemView[] };

/** "/" matches only itself; other links also match their sub-pages (/services/mvp-development). */
export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

type NavigationModule = typeof import("@/content/navigation");

/**
 * Everything the client-side header needs, passed down from the server <Header>. Client
 * components must not import content modules directly: navigation.ts imports services.ts,
 * and importing it from a client component would ship every service's copy to the browser.
 */
export type HeaderNav = {
  main: { label: string; href: string; hasMega: boolean }[];
  cta: NavigationModule["ctaNav"];
  promo: NavigationModule["megaMenuPromo"];
  contact: NavigationModule["contactDetails"];
  social: NavigationModule["socialLinks"];
};

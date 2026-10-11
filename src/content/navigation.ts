import { getService, getServicesByGroup, serviceGroups, type IconName } from "@/content/services";
import { siteConfig, type SocialKey } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

export type NavLink = { label: string; href: string };

export type MegaMenuItem = NavLink & { description: string; icon: IconName };

export type MegaMenuGroup = {
  id: string;
  label: string;
  description: string;
  items: MegaMenuItem[];
};

export type MainNavItem = NavLink & { megaMenu?: MegaMenuGroup[] };

/** A footer entry is a link, or an action handled in the browser (e.g. reopening cookie settings). */
export type FooterItem = NavLink | { label: string; action: "cookie-settings" };

export type FooterColumn = { title: string; links: FooterItem[] };

export type SocialLink = NavLink & { key: SocialKey };

const blogLinks: NavLink[] = siteConfig.featureFlags.blog
  ? [{ label: "Insights", href: "/insights" }]
  : [];

export const servicesMegaMenu: MegaMenuGroup[] = serviceGroups.map((group) => ({
  id: group.id,
  label: group.label,
  description: group.description,
  items: getServicesByGroup(group.id).map((service) => ({
    label: service.shortTitle,
    href: `/services/${service.slug}`,
    description: service.tagline,
    icon: service.icon,
  })),
}));

export const mainNav: MainNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", megaMenu: servicesMegaMenu },
  { label: "Work", href: "/work" },
  { label: "Why Me", href: "/why-me" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export const ctaNav: NavLink = { label: "Let's Talk", href: "/contact" };

/** Highlighted card on the right of the Services mega menu. */
export const megaMenuPromo = {
  title: "Not sure what you need?",
  text: "Book a free 30-minute call. We'll work out the right next step together.",
  cta: { label: "Book a free call", href: "/contact" },
  allServices: { label: "View all services", href: "/services" },
};

/** Footer link to a service, taking its label from services.ts so titles never drift. */
function serviceLink(slug: string, label?: string): NavLink {
  const service = getService(slug);
  if (!service) throw new Error(`navigation.ts: unknown service slug "${slug}"`);
  return { label: label ?? service.title, href: `/services/${service.slug}` };
}

export const footerNav: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Why Me", href: "/why-me" },
      { label: "Work", href: "/work" },
      ...blogLinks,
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      serviceLink("mvp-development"),
      serviceLink("web-applications"),
      serviceLink("mobile-applications", "Mobile Apps"),
      // A real anchor (the Design group band), so it works without JavaScript too.
      { label: "UI/UX Design", href: "/services#group-design" },
      serviceLink("ai-integration", "AI Integration"),
      serviceLink("devops-cloud"),
      { label: "All services →", href: "/services" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      // Reopens the cookie consent panel.
      ...(siteConfig.featureFlags.cookieConsent
        ? [{ label: "Cookie settings", action: "cookie-settings" as const }]
        : []),
    ],
  },
];

const socialLabels: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
};

/** Only profiles that have a real URL in site.ts. Placeholders are left out. */
export const socialLinks: SocialLink[] = (Object.keys(socialLabels) as SocialKey[])
  .filter((key) => !isPlaceholder(siteConfig.social[key]))
  .map((key) => ({ key, label: socialLabels[key], href: siteConfig.social[key] }));

/** Email / WhatsApp / location rows for the footer and mobile menu. Placeholders render as text. */
export const contactDetails = {
  email: {
    label: siteConfig.email,
    href: isPlaceholder(siteConfig.email) ? undefined : `mailto:${siteConfig.email}`,
  },
  whatsapp: {
    label: siteConfig.phone,
    href: isPlaceholder(siteConfig.whatsappUrl) ? undefined : siteConfig.whatsappUrl,
  },
  location: `${siteConfig.location.city}, ${siteConfig.location.country}`,
  hours: siteConfig.businessHours,
};

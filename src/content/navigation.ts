import { getService, getServicesByGroup, serviceGroups } from "@/content/services";
import { siteConfig, type SocialKey } from "@/content/site";
import { bookingHref } from "@/lib/booking";
import { isPlaceholder } from "@/lib/constants";

export type NavLink = { label: string; href: string };

/** One service in the header menu, with what the preview panel shows. */
export type ServicesMenuItem = NavLink & {
  slug: string;
  tagline: string;
  /** The first three deliverables. */
  deliverables: string[];
};

export type ServicesMenuGroup = {
  id: string;
  label: string;
  description: string;
  items: ServicesMenuItem[];
};

export type MainNavItem = NavLink & { hasMenu?: boolean };

/** A footer entry is a link, or an action handled in the browser (reopening cookie settings). */
export type FooterItem = NavLink | { label: string; action: "cookie-settings" };

export type FooterColumn = { title: string; links: FooterItem[] };

export type SocialLink = NavLink & { key: SocialKey };

const journalLinks: NavLink[] = siteConfig.featureFlags.blog
  ? [{ label: "Journal", href: "/journal" }]
  : [];

export const servicesMenu: ServicesMenuGroup[] = serviceGroups.map((group) => ({
  id: group.id,
  label: group.label,
  description: group.description,
  items: getServicesByGroup(group.id).map((service) => ({
    slug: service.slug,
    label: service.title,
    href: `/services/${service.slug}`,
    tagline: service.tagline,
    deliverables: service.deliverables.slice(0, 3),
  })),
}));

export const mainNav: MainNavItem[] = [
  { label: "Services", href: "/services", hasMenu: true },
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  ...journalLinks,
  { label: "Collaborate", href: "/collaborate" },
];

export const headerCopy = {
  cta: { label: "Start a conversation", href: "/contact" },
  availability: {
    available: "Available for new projects",
    limited: "Limited availability",
    booked: "Booked for now",
  },
  timezone: "IST",
  menu: {
    open: "Menu",
    close: "Close",
    dialogLabel: "Site menu",
    servicesOverview: { label: "All services, at a glance", href: "/services" },
    previewHint: "Point at a service to preview it.",
    previewCta: "Read more",
    deliverablesLabel: "You receive",
  },
  book: { label: "Book a free call", href: bookingHref },
};

/** Footer link to a service, taking its label from services.ts so titles never drift. */
function serviceLink(slug: string, label?: string): NavLink {
  const service = getService(slug);
  if (!service) throw new Error(`navigation.ts: unknown service slug "${slug}"`);
  return { label: label ?? service.title, href: `/services/${service.slug}` };
}

export const footerNav: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Approach", href: "/approach" },
      { label: "Selected work", href: "/work" },
      { label: "About", href: "/about" },
      ...journalLinks,
      { label: "Collaborate", href: "/collaborate" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      serviceLink("mvp-development"),
      serviceLink("web-applications"),
      serviceLink("mobile-applications", "Mobile Apps"),
      serviceLink("ui-design", "UI Design"),
      serviceLink("ai-integration", "AI Integration"),
      serviceLink("devops-cloud"),
      serviceLink("digital-marketing", "Digital Marketing & SEO"),
      { label: "Every service", href: "/services" },
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

/** Email / WhatsApp / location for the header, footer and menus. Placeholders render as text. */
export const contactDetails = {
  email: {
    label: siteConfig.email,
    href: isPlaceholder(siteConfig.email) ? undefined : `mailto:${siteConfig.email}`,
  },
  whatsapp: {
    label: siteConfig.phone,
    href: isPlaceholder(siteConfig.whatsappUrl) ? undefined : siteConfig.whatsappUrl,
  },
  city: siteConfig.location.city,
  location: `${siteConfig.location.city}, ${siteConfig.location.country}`,
};

/** Copy for the global footer and the closing QuickStart section. */
export const footerCopy = {
  newsletter: {
    title: "Occasional notes, by email",
    text: "Short, practical write-ups on first versions, AI and infrastructure. No spam; leave any time.",
    emailLabel: "Your email",
    submit: "Subscribe",
    success: "You're on the list. Thank you.",
    error: "That didn't go through. Please try again shortly.",
    privacy: { label: "Privacy Policy", href: "/privacy-policy" },
  },
  contact: {
    title: "Say hello",
    localTime: "Local time in",
  },
  rights: "All rights reserved.",
};

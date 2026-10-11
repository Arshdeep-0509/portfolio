import { socialLinks } from "@/content/navigation";
import { serviceGroups } from "@/content/services";
import { siteConfig } from "@/content/site";
import { isPlaceholder, SITE_URL } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

/**
 * Site-wide schema.org entities. Each has a stable @id so page-level data (Service, BlogPosting,
 * JobPosting…) can reference them instead of repeating them. Fields backed by [PLACEHOLDERS]
 * are left out until they hold real values, so search engines never receive placeholder text.
 */

export const schemaIds = {
  website: `${SITE_URL}/#website`,
  person: `${SITE_URL}/#person`,
  business: `${SITE_URL}/#business`,
};

const real = (value: string | undefined) => (value && !isPlaceholder(value) ? value : undefined);

/** Drops undefined values so the JSON stays clean. */
function compact<T extends Record<string, unknown>>(object: T) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

export function personSchema() {
  const { founder, location } = siteConfig;
  const photo = real(founder.photo);
  const city = real(location.city);
  const education = real(founder.education);
  return compact({
    "@type": "Person",
    "@id": schemaIds.person,
    name: founder.name,
    jobTitle: founder.role,
    url: absoluteUrl("/about"),
    image: photo ? absoluteUrl(photo) : undefined,
    sameAs: socialLinks.length > 0 ? socialLinks.map((social) => social.href) : undefined,
    worksFor: { "@id": schemaIds.business },
    address: city
      ? { "@type": "PostalAddress", addressLocality: city, addressCountry: "IN" }
      : undefined,
    alumniOf: education ? { "@type": "EducationalOrganization", name: education } : undefined,
    knowsAbout: [
      "MVP development",
      "Full-stack web development",
      "Mobile app development",
      "AI integration",
      "DevOps and cloud infrastructure",
      "UI/UX design",
    ],
  });
}

export function businessSchema() {
  const { location } = siteConfig;
  const city = real(location.city);
  const state = real(location.state);
  return compact({
    "@type": "ProfessionalService",
    "@id": schemaIds.business,
    name: real(siteConfig.legalName) ?? siteConfig.name,
    alternateName: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icons/icon-512.png"),
    image: absoluteUrl("/opengraph-image"),
    email: real(siteConfig.email),
    telephone: real(siteConfig.phone),
    founder: { "@id": schemaIds.person },
    address: compact({
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "IN",
    }),
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide" },
    ],
    sameAs: socialLinks.length > 0 ? socialLinks.map((social) => social.href) : undefined,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: serviceGroups.map((group) => ({
        "@type": "OfferCatalog",
        name: group.label,
        description: group.description,
      })),
    },
  });
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": schemaIds.website,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-IN",
    publisher: { "@id": schemaIds.business },
  };
}

/** One @graph for every page: WebSite + ProfessionalService + Person. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteSchema(), businessSchema(), personSchema()],
  };
}

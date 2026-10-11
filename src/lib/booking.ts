import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

/**
 * Where "Book a free call" goes: the Calendly link once it exists, until then the contact form
 * with the scoping topic pre-selected — never a broken link.
 */
export const bookingHref = isPlaceholder(siteConfig.calendlyUrl)
  ? "/contact?topic=mvp-scoping"
  : siteConfig.calendlyUrl;

/** True when bookingHref leaves the site (opens in a new tab). */
export const bookingIsExternal = /^https?:\/\//.test(bookingHref);

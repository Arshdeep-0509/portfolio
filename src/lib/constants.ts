import { siteConfig } from "@/content/site";

/** True for unreplaced values such as "[EMAIL]" or "https://[DOMAIN]". */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /\[[A-Z0-9_ ]+\]/.test(value);
}

/** The public origin with no trailing slash. Comes from siteConfig.url. */
export const SITE_URL: string = siteConfig.url;

export const OG_LOCALE = siteConfig.locale;
export const LOCALE = OG_LOCALE.replace("_", "-");

/** Window event that asks the cookie consent panel (prompt 14) to reopen. */
export const COOKIE_SETTINGS_EVENT = "open-cookie-settings";

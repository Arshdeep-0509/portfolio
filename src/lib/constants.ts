import { siteConfig } from "@/content/site";

/** True for unreplaced values such as "[EMAIL]" or "https://[DOMAIN]". */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /\[[A-Z0-9_ ]+\]/.test(value);
}

/**
 * The public origin with no trailing slash.
 * "https://[DOMAIN]" is not a parseable URL, so until it is replaced this falls back to
 * NEXT_PUBLIC_SITE_URL, then localhost. That keeps metadataBase and canonicals from throwing.
 */
export const SITE_URL: string = (
  isPlaceholder(siteConfig.url)
    ? // `||`, not `??`: an empty variable (e.g. an unset Docker build arg) must fall back too.
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : siteConfig.url
).replace(/\/+$/, "");

export const LOCALE = "en-IN";
export const OG_LOCALE = "en_IN";

/** Window event that asks the cookie consent panel (prompt 14) to reopen. */
export const COOKIE_SETTINGS_EVENT = "open-cookie-settings";

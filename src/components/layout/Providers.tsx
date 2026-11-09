"use client";

import { RevealObserver } from "@/components/ui/RevealObserver";
import { ToastProvider } from "@/components/ui/Toast";
import { siteConfig } from "@/content/site";
import { AnalyticsScripts } from "./consent/AnalyticsScripts";
import { CookieConsent } from "./consent/CookieConsent";
import { ClickTracking } from "./ClickTracking";
import { ErrorReporter } from "./ErrorReporter";
import { UtmCapture } from "./UtmCapture";

/**
 * Client-side providers for the whole app.
 * - UtmCapture: first-touch utm_* parameters into a cookie (after analytics consent).
 * - CookieConsent + AnalyticsScripts: the banner/settings panel, and GA4 + Clarity loaded only
 *   after analytics consent (Consent Mode v2).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider>{children}</ToastProvider>
      <RevealObserver />
      <UtmCapture />
      {siteConfig.featureFlags.cookieConsent ? <CookieConsent /> : null}
      <AnalyticsScripts />
      <ClickTracking />
      <ErrorReporter />
    </>
  );
}

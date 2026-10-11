"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { ToastProvider } from "@/components/ui/Toast";
import { siteConfig } from "@/content/site";
import { AnalyticsScripts } from "./consent/AnalyticsScripts";
import { CookieConsent } from "./consent/CookieConsent";
import { ClickTracking } from "./ClickTracking";
import { ErrorReporter } from "./ErrorReporter";
import { UtmCapture } from "./UtmCapture";

/**
 * The animation engine (~30 KB gzipped) isn't needed to show the page: the few animated pieces
 * (header underline, tab pill, toasts) render statically until it arrives. Fetch it on the first
 * interaction, or 4 seconds after load, so it never competes with the first render.
 */
const loadMotionFeatures = () =>
  new Promise<void>((resolve) => {
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    let timer = 0;
    const done = () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, done));
      resolve();
    };
    events.forEach((name) => window.addEventListener(name, done, { once: true, passive: true }));
    const start = () => {
      timer = window.setTimeout(done, 4000);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }).then(() => import("./motionFeatures").then((mod) => mod.default));

/**
 * Client-side providers for the whole app.
 * - LazyMotion: components use the lightweight `m.*` elements; the animation engine is fetched
 *   on first interaction (or 4s after load). `strict` throws if a full `motion.*` component sneaks back in.
 * - reducedMotion="user": framer-motion drops transforms and layout movement when the OS asks
 *   for reduced motion.
 * - UtmCapture: first-touch utm_* parameters into a cookie (after analytics consent).
 * - CookieConsent + AnalyticsScripts: the banner/settings panel, and GA4 + Clarity loaded only
 *   after analytics consent (Consent Mode v2).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>{children}</ToastProvider>
        <RevealObserver />
        <UtmCapture />
        {siteConfig.featureFlags.cookieConsent ? <CookieConsent /> : null}
        <AnalyticsScripts />
        <ClickTracking />
        <ErrorReporter />
      </MotionConfig>
    </LazyMotion>
  );
}

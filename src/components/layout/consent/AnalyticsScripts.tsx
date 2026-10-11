"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
// Optional cookieless alternative. Sets no cookies, so it doesn't wait for consent.
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

type ConsentValue = "granted" | "denied";

function consentSignals(analytics: boolean, marketing: boolean): Record<string, ConsentValue> {
  const value = (on: boolean): ConsentValue => (on ? "granted" : "denied");
  return {
    analytics_storage: value(analytics),
    ad_storage: value(marketing),
    ad_user_data: value(marketing),
    ad_personalization: value(marketing),
  };
}

function appendScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

/** Google Analytics 4 with Consent Mode v2: everything "denied" by default, then updated. */
function loadGoogleAnalytics(id: string, marketing: boolean) {
  const disableKey = `ga-disable-${id}` as const;
  (window as unknown as Record<string, boolean>)[disableKey] = false;

  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js expects the Arguments object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", { ...consentSignals(false, false), wait_for_update: 500 });
    window.gtag("consent", "update", consentSignals(true, marketing));
    window.gtag("js", new Date());
    window.gtag("config", id);
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  } else {
    window.gtag("consent", "update", consentSignals(true, marketing));
  }
}

/** Microsoft Clarity, told about consent through its consent API. */
function loadClarity(id: string, marketing: boolean) {
  if (!window.clarity) {
    const queue = function clarity() {
      // eslint-disable-next-line prefer-rest-params
      (queue.q = queue.q ?? []).push(arguments);
    } as NonNullable<Window["clarity"]>;
    window.clarity = queue;
    appendScript(`https://www.clarity.ms/tag/${encodeURIComponent(id)}`);
  }
  window.clarity("consentv2", {
    analytics_Storage: "granted",
    ad_Storage: marketing ? "granted" : "denied",
  });
}

function loadPlausible(domain: string) {
  if (document.querySelector(`script[src="${PLAUSIBLE_SRC}"]`)) return;
  const queue = function plausible() {
    // eslint-disable-next-line prefer-rest-params
    (queue.q = queue.q ?? []).push(arguments);
  } as NonNullable<Window["plausible"]>;
  window.plausible = window.plausible ?? queue;
  const script = document.createElement("script");
  script.src = PLAUSIBLE_SRC;
  script.defer = true;
  script.dataset.domain = domain;
  document.head.appendChild(script);
}

/** Expires a cookie on this host and each parent domain (GA sets it on the registrable domain). */
function deleteCookie(name: string) {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; Domain=.${parts.slice(i).join(".")}`);
  for (const domain of domains) {
    document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
  }
}

/** No (or withdrawn) analytics consent: stop sending, tell both tools, remove analytics cookies. */
function revoke() {
  if (GA_ID) {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
    window.gtag?.("consent", "update", consentSignals(false, false));
  }
  window.clarity?.("consent", false);
  const names = document.cookie
    .split("; ")
    .map((part) => part.split("=")[0])
    .filter((name) => /^_ga($|_)|^_cl(ck|sk)$|^_gid$|^utm$/.test(name));
  names.forEach(deleteCookie);
}

/**
 * Loads GA4 (NEXT_PUBLIC_GA_MEASUREMENT_ID) and Microsoft Clarity (NEXT_PUBLIC_CLARITY_PROJECT_ID)
 * only after the visitor accepts analytics cookies. Plausible (NEXT_PUBLIC_PLAUSIBLE_DOMAIN), if
 * configured instead, is cookieless and loads straight away. Until then — and after "Reject" — no request
 * goes to Google or Microsoft. Renders nothing.
 */
export function AnalyticsScripts() {
  const { decided, analytics, marketing } = useConsent();

  useEffect(() => {
    if (PLAUSIBLE_DOMAIN) loadPlausible(PLAUSIBLE_DOMAIN);
  }, []);

  useEffect(() => {
    if (!decided) return;
    if (analytics) {
      if (GA_ID) loadGoogleAnalytics(GA_ID, marketing);
      if (CLARITY_ID) loadClarity(CLARITY_ID, marketing);
    } else {
      revoke();
    }
  }, [decided, analytics, marketing]);

  return null;
}

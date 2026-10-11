"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

const COOKIE = "utm";
const KEYS = ["source", "medium", "campaign", "term", "content"] as const;
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

// The landing page's utm_* parameters, held in memory (not storage) until consent is known.
let landing: Record<string, string> | null = null;

/**
 * First-touch attribution. The utm_* parameters of the page a visitor lands on are kept in memory;
 * once they accept analytics cookies they're written to a first-party `utm` cookie (90 days) that
 * is never overwritten. POST /api/contact saves it with the lead. Without analytics consent no
 * cookie is set (and an existing one is removed by AnalyticsScripts). Renders nothing.
 */
export function UtmCapture() {
  const { analytics } = useConsent();

  useEffect(() => {
    if (landing === null) {
      const params = new URLSearchParams(window.location.search);
      landing = Object.fromEntries(
        KEYS.flatMap((key) => {
          const value = params.get(`utm_${key}`)?.trim();
          return value ? [[key, value.slice(0, 200)]] : [];
        }),
      );
    }
    if (!analytics || Object.keys(landing).length === 0) return;
    if (document.cookie.split("; ").some((part) => part.startsWith(`${COOKIE}=`))) return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(landing))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  }, [analytics]);

  return null;
}

"use client";

import { COOKIE_SETTINGS_EVENT } from "@/lib/constants";

/** Reopens the cookie consent panel, which listens for this window event. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
      className={className}
    >
      {label}
    </button>
  );
}

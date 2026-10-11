import { useSyncExternalStore } from "react";

/**
 * Cookie consent: the visitor's choice is stored in a first-party `consent` cookie for 180 days.
 * A tiny external store keeps every component (banner, settings panel, analytics loader,
 * announcement popup) in sync without a context provider.
 */

export type ConsentPrefs = { analytics: boolean; marketing: boolean };
export type ConsentRecord = ConsentPrefs & { v: 1; ts: number };

export const CONSENT_COOKIE = "consent";
export const CONSENT_MAX_AGE_DAYS = 180;
const MAX_AGE = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

type Listener = () => void;
const listeners = new Set<Listener>();
let settingsOpen = false;
let cachedRaw: string | null | undefined;
let cachedRecord: ConsentRecord | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readRaw() {
  return (
    document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${CONSENT_COOKIE}=`))
      ?.slice(CONSENT_COOKIE.length + 1) ?? null
  );
}

/** Current choice, or null when the visitor hasn't decided yet. Stable between changes. */
export function readConsent(): ConsentRecord | null {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedRecord;
  cachedRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(decodeURIComponent(raw)) as Partial<ConsentRecord>) : null;
    cachedRecord =
      parsed?.v === 1
        ? {
            v: 1,
            ts: Number(parsed.ts) || 0,
            analytics: parsed.analytics === true,
            marketing: parsed.marketing === true,
          }
        : null;
  } catch {
    cachedRecord = null;
  }
  return cachedRecord;
}

export function saveConsent(prefs: ConsentPrefs) {
  const record: ConsentRecord = { v: 1, ts: Date.now(), ...prefs };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  settingsOpen = false;
  emit();
}

export function openConsentSettings() {
  settingsOpen = true;
  emit();
}

export function closeConsentSettings() {
  settingsOpen = false;
  emit();
}

/**
 * - `ready`: false during server rendering and hydration, when the cookie can't be read yet.
 * - `consent`: the stored choice, or null if the visitor hasn't chosen (banner shows).
 * - `settingsOpen`: the "Customise" panel is open.
 */
export function useConsent() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => undefined);
  const open = useSyncExternalStore(
    subscribe,
    () => settingsOpen,
    () => false,
  );
  const ready = consent !== undefined;

  return {
    ready,
    consent: consent ?? null,
    decided: ready && consent !== null,
    analytics: consent?.analytics === true,
    marketing: consent?.marketing === true,
    settingsOpen: open,
    /** The banner or the settings panel is on screen. */
    promptVisible: (ready && consent === null) || open,
    acceptAll: () => saveConsent({ analytics: true, marketing: true }),
    rejectAll: () => saveConsent({ analytics: false, marketing: false }),
    save: saveConsent,
    openSettings: openConsentSettings,
    closeSettings: closeConsentSettings,
  };
}

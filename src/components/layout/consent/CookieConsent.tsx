"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConsent } from "@/lib/consent";
import { COOKIE_SETTINGS_EVENT } from "@/lib/constants";

const POLICY_HREF = "/cookie-policy";

// The settings panel is only downloaded when someone opens it.
const ConsentSettingsDialog = dynamic(
  () =>
    import("@/components/layout/consent/ConsentSettingsDialog").then(
      (mod) => mod.ConsentSettingsDialog,
    ),
  { ssr: false },
);

/**
 * Cookie consent: a compact bottom-left card on the first visit (not a wall: the page stays usable) with
 * Allow all / Essential only / Choose for myself, and a settings panel that the footer's
 * "Cookie settings" button reopens at any time.
 */
export function CookieConsent() {
  const { ready, consent, settingsOpen, acceptAll, rejectAll, save, openSettings, closeSettings } =
    useConsent();

  useEffect(() => {
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, [openSettings]);

  // Stays mounted after the first open so the native dialog can restore focus on close.
  const [loaded, setLoaded] = useState(false);
  if (settingsOpen && !loaded) setLoaded(true);

  const showBanner = ready && consent === null && !settingsOpen;

  return (
    <>
      {showBanner ? (
        <section
          aria-labelledby="cookie-banner-title"
          className="fixed bottom-4 left-4 z-50 w-[min(24rem,calc(100%-2rem))] animate-corner-in rounded-card border border-border bg-surface p-4 text-ink sm:bottom-6 sm:left-6 print:hidden"
        >
          <h2 id="cookie-banner-title" className="flex items-center gap-2 text-body text-ink">
            <Cookie aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
            Cookies, if you agree
          </h2>
          <p className="mt-1.5 text-small text-ink-muted">
            A few essential cookies keep this site working. Analytics, which show me which pages
            help, run only if you say yes.{" "}
            <Link
              href={POLICY_HREF}
              className="font-semibold text-link underline underline-offset-4"
            >
              Cookie Policy
            </Link>
          </p>
          {/* Accept and Reject side by side at equal weight, Customise underneath. */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" onClick={acceptAll} className="px-2">
              Allow all
            </Button>
            <Button size="sm" variant="outline" onClick={rejectAll} className="px-2">
              Essential only
            </Button>
            <Button
              size="sm"
              variant="text-link"
              onClick={openSettings}
              className="col-span-2 justify-center"
            >
              Choose for myself
            </Button>
          </div>
        </section>
      ) : null}

      {loaded ? (
        <ConsentSettingsDialog
          open={settingsOpen}
          initial={{
            analytics: consent?.analytics ?? false,
            marketing: consent?.marketing ?? false,
          }}
          onSave={save}
          onAcceptAll={acceptAll}
          onClose={closeSettings}
        />
      ) : null}
    </>
  );
}

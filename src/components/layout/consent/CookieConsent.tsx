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
 * Cookie consent: a bottom banner on the first visit (not a wall — the page stays usable) with
 * Accept all / Reject non-essential / Customise, and a settings panel that the footer's
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
          className="tone-light fixed inset-x-3 bottom-3 z-50 mx-auto max-w-4xl animate-hero-in rounded-xl border border-border bg-surface p-4 shadow-card-hover sm:inset-x-6 sm:bottom-6 sm:p-6 print:hidden"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
            <div className="flex gap-3.5">
              <Cookie aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary" />
              <div>
                <h2 id="cookie-banner-title" className="font-heading text-body font-bold text-ink">
                  Cookies, only with your OK
                </h2>
                <p className="mt-1 text-small text-muted">
                  I use necessary cookies to run this site. With your permission I&apos;d also use
                  analytics to see what&apos;s useful.{" "}
                  <Link href={POLICY_HREF} className="font-semibold text-primary underline">
                    Cookie Policy
                  </Link>
                </p>
              </div>
            </div>
            {/* Phones: Accept and Reject side by side (equal weight), Customise underneath. */}
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:gap-2.5">
              <Button size="md" onClick={acceptAll} className="px-3 sm:px-6">
                Accept all
              </Button>
              <Button size="md" variant="outline" onClick={rejectAll} className="px-3 sm:px-6">
                <span className="sm:hidden">Reject all</span>
                <span className="hidden sm:inline">Reject non-essential</span>
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={openSettings}
                className="col-span-2 border-transparent sm:border-primary"
              >
                Customise
              </Button>
            </div>
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

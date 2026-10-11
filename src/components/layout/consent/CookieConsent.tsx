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
          className="tone-ivory fixed inset-x-3 bottom-3 z-50 mx-auto max-w-4xl animate-corner-in rounded-card border border-line bg-ivory-50 p-4 text-fg shadow-[0_24px_60px_-28px_rgb(10_10_18/0.5)] sm:inset-x-6 sm:bottom-6 sm:p-6 print:hidden"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
            <div className="flex gap-3.5">
              <Cookie
                aria-hidden="true"
                strokeWidth={1.5}
                className="mt-0.5 size-6 shrink-0 text-accent"
              />
              <div>
                <h2 id="cookie-banner-title" className="font-sans text-body font-bold text-fg">
                  Cookies, if you agree
                </h2>
                <p className="mt-1 text-small text-fg-muted">
                  A few essential cookies keep this site working. Analytics, which show me which
                  pages help, run only if you say yes.{" "}
                  <Link
                    href={POLICY_HREF}
                    className="font-semibold text-accent underline underline-offset-4"
                  >
                    Cookie Policy
                  </Link>
                </p>
              </div>
            </div>
            {/* Phones: Accept and Reject side by side (equal weight), Customise underneath. */}
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:gap-2.5">
              <Button size="md" onClick={acceptAll} className="px-3 sm:px-6">
                Allow all
              </Button>
              <Button size="md" variant="outline" onClick={rejectAll} className="px-3 sm:px-6">
                Essential only
              </Button>
              <Button
                size="md"
                variant="text-link"
                onClick={openSettings}
                className="col-span-2 justify-center sm:px-2"
              >
                Choose for myself
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

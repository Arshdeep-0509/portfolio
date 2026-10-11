"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Announcement } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";

const DELAY_MS = 8000;
const SCROLL_RATIO = 0.5;
const MOBILE_GRACE_MS = 2000;
/** Never interrupt these: people are already contacting, paying or reading terms. */
const EXCLUDED = [
  "/contact",
  "/pay",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
  "/refund-policy",
];

const storageKey = (id: string) => `announcement-seen:${id}`;

function alreadySeen(id: string) {
  try {
    return window.localStorage.getItem(storageKey(id)) !== null;
  } catch {
    // Storage blocked: treat as seen rather than risk showing it on every page.
    return true;
  }
}

function markSeen(id: string) {
  try {
    window.localStorage.setItem(storageKey(id), new Date().toISOString());
  } catch {
    // Ignore — see alreadySeen.
  }
}

/** Today's date in IST as YYYY-MM-DD, to compare with startDate / endDate. */
function todayIst() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

/**
 * The announcement configured in site.ts, as a card that slides in from the bottom-left. It never
 * blocks the page (no modal, no focus grab). Shown at most once per visitor per `id`, after
 * 8 seconds or half a page of scrolling — whichever comes first — and only once the cookie banner
 * has been answered. Excluded on contact, payment and legal pages.
 */
export function CornerCard({ config, href }: { config: Announcement; href: string }) {
  const pathname = usePathname();
  const { decided, promptVisible } = useConsent();
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const eligiblePage = !EXCLUDED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const canShow = config.enabled && eligiblePage && decided && !promptVisible;

  useEffect(() => {
    if (!canShow || alreadySeen(config.id)) return;
    const today = todayIst();
    if (
      (config.startDate && today < config.startDate) ||
      (config.endDate && today > config.endDate)
    ) {
      return;
    }

    const started = performance.now();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      markSeen(config.id);
      setOpen(true);
      trackEvent("announcement_view", { announcement_id: config.id });
    };
    const scrolledEnough = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 && window.scrollY / max >= SCROLL_RATIO;
    };
    const onScroll = () => {
      if (!scrolledEnough()) return;
      // On phones, never in the first 2 seconds — check again once the grace period ends.
      if (mobile && performance.now() - started < MOBILE_GRACE_MS) return;
      show();
    };

    const timer = window.setTimeout(show, DELAY_MS);
    const grace = mobile ? window.setTimeout(onScroll, MOBILE_GRACE_MS) : 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      done = true;
      window.clearTimeout(timer);
      window.clearTimeout(grace);
      window.removeEventListener("scroll", onScroll);
    };
  }, [canShow, config]);

  function close(method: "dismiss" | "secondary" | "cta") {
    setOpen(false);
    trackEvent(method === "cta" ? "announcement_click" : "announcement_close", {
      announcement_id: config.id,
      method,
    });
  }

  // Also hides if the cookie panel is reopened over it, or the visitor navigates to an excluded page.
  if (!open || promptVisible || !eligiblePage) return null;
  const external = /^https?:\/\//.test(href);

  return (
    <aside
      aria-labelledby={titleId}
      className="tone-night fixed bottom-4 left-4 z-40 w-[min(22rem,calc(100%-2rem))] animate-corner-in rounded-card border border-lamp-500/50 bg-night-950/95 p-5 text-fg shadow-[0_24px_60px_-28px_rgb(245_165_36/0.6)] backdrop-blur-md sm:bottom-6 sm:left-6 print:hidden"
    >
      <button
        type="button"
        onClick={() => close("dismiss")}
        aria-label="Close announcement"
        className="absolute top-2 right-2 inline-flex size-10 items-center justify-center rounded-button text-mist-300 transition-colors hover:text-ivory-50"
      >
        <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
      </button>
      <p className="label-mono text-accent">{config.badge}</p>
      <h2 id={titleId} className="mt-2 pr-8 text-h3 text-fg">
        {config.title}
      </h2>
      <p className="mt-2 text-small text-fg-muted">{config.description}</p>
      <ul className="mt-4 space-y-1.5 border-t border-line-dark pt-4 text-small text-fg">
        {config.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-[0.6em] size-1.5 shrink-0 rounded-dot bg-lamp-500"
            />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button
          href={href}
          size="sm"
          data-cta="announcement"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={() => close("cta")}
        >
          {config.primaryCta.label}
          {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </Button>
        <button
          type="button"
          onClick={() => close("secondary")}
          className="min-h-10 link-underline text-small text-fg-muted hover:text-fg"
        >
          {config.secondaryLabel}
        </button>
      </div>
      <p className="mt-3 label-mono text-fg-muted">{config.footnote}</p>
    </aside>
  );
}

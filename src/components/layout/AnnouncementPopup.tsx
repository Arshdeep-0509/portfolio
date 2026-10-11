"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { Announcement } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";

// The dialog itself is only downloaded when the popup is about to show.
const AnnouncementDialog = dynamic(
  () => import("@/components/layout/AnnouncementDialog").then((mod) => mod.AnnouncementDialog),
  { ssr: false },
);

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
 * Announcement popup configured in site.ts (`announcement`). Shown at most once per visitor per
 * id, after 8 seconds or half a page of scrolling — whichever comes first — and only once the
 * cookie banner has been answered.
 */
export function AnnouncementPopup({ config, href }: { config: Announcement; href: string }) {
  const pathname = usePathname();
  const { decided, promptVisible } = useConsent();
  const [open, setOpen] = useState(false);
  // Stays mounted after showing so the native dialog can restore focus on close.
  const [shown, setShown] = useState(false);

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
      setShown(true);
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

  return shown ? (
    // Also closes if the cookie panel is reopened over it.
    <AnnouncementDialog config={config} href={href} open={open && !promptVisible} onClose={close} />
  ) : null;
}

"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/content/site";
import { LOCALE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const format = new Intl.DateTimeFormat(LOCALE, {
  timeZone: siteConfig.location.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(timer);
}

/**
 * The current time in India (IST), e.g. "14:05", refreshed every 15 seconds. The server render
 * and hydration show "--:--" (the page is prerendered, so there is no meaningful server time);
 * the real time appears right after.
 */
export function LiveClock({ className }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(new Date()),
    () => "--:--",
  );
  return (
    <time
      // A fixed box, so swapping "--:--" for the time can't move the text around it.
      className={cn("inline-block w-[5ch] text-center tabular-nums", className)}
      suppressHydrationWarning
    >
      {time}
    </time>
  );
}

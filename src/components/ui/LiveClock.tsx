"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
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
    <time className={className} suppressHydrationWarning>
      {time}
    </time>
  );
}

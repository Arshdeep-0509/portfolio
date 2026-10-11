"use client";

import { useEffect } from "react";
import { linkEvent, trackEvent } from "@/lib/analytics";

/**
 * One document-level listener instead of per-component tracking:
 * - elements with data-cta="<location>" send cta_click { location, label };
 * - links to WhatsApp send whatsapp_click, links to Calendly calendly_open, and links to any
 *   other site outbound_click { url, domain }.
 * Events only reach analytics tools the visitor has consented to (see trackEvent). Renders nothing.
 */
export function ClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest?.("a, button");
      if (!target) return;
      const location = target.getAttribute("data-cta");
      if (location) {
        trackEvent("cta_click", {
          location,
          label: (target.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 100),
        });
      }
      const href = target.getAttribute("href");
      if (target.tagName === "A" && href) {
        const link = linkEvent(href, window.location.host);
        if (link) {
          trackEvent(link.name, {
            ...link.params,
            location: location ?? undefined,
            page_location: window.location.href,
          });
        }
      }
    };
    // Capture phase: runs even if a handler later stops propagation or opens a modal instead.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

/** Sends one event when mounted — e.g. service_view { slug } on a service page. */
export function TrackOnMount({
  name,
  params,
}: {
  name: "service_view";
  params: Record<string, string>;
}) {
  const key = JSON.stringify(params);
  useEffect(() => {
    trackEvent(name, JSON.parse(key) as Record<string, string>);
  }, [name, key]);
  return null;
}

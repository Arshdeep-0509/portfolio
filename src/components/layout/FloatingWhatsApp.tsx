"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const TEXT_ENTRY =
  "input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=file]), textarea, select, [contenteditable=true]";

function prefilledMessage(name: string) {
  const title = document.title.split(" | ")[0] || "your website";
  return `Hi ${name}! I'm on your website ("${title}") and I'd like to chat about a project.`;
}

/**
 * Floating "Chat on WhatsApp" button, bottom-right, stacked above BackToTop. Opens wa.me with a
 * pre-filled message naming the current page. Hidden on touch devices while a text field has
 * focus, when the on-screen keyboard would push it over the form. Only rendered when a real
 * WhatsApp number is set in site.ts.
 */
export function FloatingWhatsApp({ href, name }: { href: string; name: string }) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const onFocusIn = (event: FocusEvent) => {
      if (coarse.matches && (event.target as Element | null)?.matches?.(TEXT_ENTRY))
        setTyping(true);
    };
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <a
      href={`${href}?text=${encodeURIComponent(`Hi ${name}! I'd like to chat about a project.`)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp (opens in a new tab)"
      // whatsapp_click is sent by ClickTracking (data-cta gives it the location).
      data-cta="floating-whatsapp"
      onClick={(event) => {
        // Name the page the visitor is on, so the first message has context.
        event.currentTarget.href = `${href}?text=${encodeURIComponent(prefilledMessage(name))}`;
      }}
      // Hidden while typing: out of the tab order and the accessibility tree too.
      tabIndex={typing ? -1 : undefined}
      aria-hidden={typing || undefined}
      className={cn(
        "group fixed right-4 bottom-20 z-40 inline-flex size-12 items-center justify-center rounded-pill bg-[#128c7e] text-white shadow-card-hover sm:right-6 sm:bottom-[5.5rem]",
        "transition-[opacity,transform,background-color] duration-200 ease-out hover:bg-[#0e6f64]",
        typing && "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <span className="relative inline-flex">
        <MessageCircle aria-hidden="true" className="size-6" />
        <Phone
          aria-hidden="true"
          strokeWidth={2.5}
          className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 fill-current"
        />
      </span>
      <span
        aria-hidden="true"
        className="tone-dark pointer-events-none absolute right-full mr-3 rounded-md bg-navy-900 px-3 py-1.5 text-small font-semibold whitespace-nowrap text-white opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}

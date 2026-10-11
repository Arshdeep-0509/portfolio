"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, Mail, MessageCircle, MessagesSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TEXT_ENTRY =
  "input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=file]), textarea, select, [contenteditable=true]";

export type ContactDockProps = {
  /** wa.me link, or null while the number is still a placeholder. */
  whatsappHref: string | null;
  /** mailto: link, or null while the address is still a placeholder. */
  emailHref: string | null;
  /** Calendly, or the contact form's scoping topic until Calendly exists. */
  bookingHref: string;
  firstName: string;
  labels: { toggle: string; close: string; whatsapp: string; email: string; book: string };
};

function prefilledMessage(name: string) {
  const title = document.title.split(" | ")[0] || "your website";
  return `Hi ${name}, I'm reading "${title}" on your site and would like to talk about a project.`;
}

/**
 * Bottom-right on every page except /contact: a small "Contact" button that opens three ways to reach me — WhatsApp, email and
 * booking a call. A disclosure (button + list of links): Esc or a click outside closes it.
 * WhatsApp links are tracked as whatsapp_click by ClickTracking. On touch devices it hides while
 * a text field has focus, so the on-screen keyboard never pushes it over a form.
 */
export function ContactDock({
  whatsappHref,
  emailHref,
  bookingHref,
  firstName,
  labels,
}: ContactDockProps) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Element | null;
      if (coarse.matches && target?.matches?.(TEXT_ENTRY) && !rootRef.current?.contains(target)) {
        setTyping(true);
      }
    };
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // /contact already lists every way to reach me, and the dock would cover the form's buttons.
  if (pathname === "/contact") return null;
  const external = /^https?:\/\//.test(bookingHref);
  const item =
    "flex min-h-12 items-center gap-3 rounded-card px-3 text-small font-semibold text-ivory-50 transition-colors duration-200 hover:bg-ivory-50/[0.06] hover:text-lamp-400";

  return (
    <div
      ref={rootRef}
      className={cn(
        "tone-night fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6 print:hidden",
        "transition-[opacity,transform] duration-300",
        typing && "pointer-events-none translate-y-2 opacity-0",
      )}
      aria-hidden={typing || undefined}
    >
      <ul
        id={panelId}
        hidden={!open}
        className="w-60 animate-panel-in rounded-card border border-line-dark bg-night-950/95 p-1.5 backdrop-blur-md"
      >
        {whatsappHref ? (
          <li>
            <a
              href={`${whatsappHref}?text=${encodeURIComponent(`Hi ${firstName}, I'd like to talk about a project.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="contact-dock"
              className={item}
              onClick={(event) => {
                // Name the page the visitor is on, so the first message has context.
                event.currentTarget.href = `${whatsappHref}?text=${encodeURIComponent(prefilledMessage(firstName))}`;
              }}
            >
              <MessageCircle
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-5 text-lamp-400"
              />
              {labels.whatsapp}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ) : null}
        {emailHref ? (
          <li>
            <a href={emailHref} data-cta="contact-dock" className={item}>
              <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-lamp-400" />
              {labels.email}
            </a>
          </li>
        ) : null}
        <li>
          <a
            href={bookingHref}
            data-cta="contact-dock"
            className={item}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <CalendarClock aria-hidden="true" strokeWidth={1.5} className="size-5 text-lamp-400" />
            {labels.book}
            {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        </li>
      </ul>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        tabIndex={typing ? -1 : undefined}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-12 items-center gap-2 rounded-button border border-lamp-500/60 bg-night-950/90 px-4 text-small font-semibold text-ivory-50 backdrop-blur-md transition-[border-color,box-shadow] duration-200 hover:border-lamp-500 hover:shadow-glow"
      >
        {open ? (
          <X aria-hidden="true" strokeWidth={1.5} className="size-5 text-lamp-400" />
        ) : (
          <MessagesSquare aria-hidden="true" strokeWidth={1.5} className="size-5 text-lamp-400" />
        )}
        {open ? labels.close : labels.toggle}
      </button>
    </div>
  );
}

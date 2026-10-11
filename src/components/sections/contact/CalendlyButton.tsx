"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CalendarClock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/Button";

// The modal and iframe code is only downloaded the first time someone opens it on desktop.
const CalendlyDialog = dynamic(
  () => import("@/components/sections/contact/CalendlyDialog").then((mod) => mod.CalendlyDialog),
  { ssr: false },
);

const DESKTOP = "(min-width: 1024px) and (pointer: fine)";

/**
 * "Book a call" link to Calendly. On desktop it opens the scheduler inline in a modal; the iframe
 * is only created when the modal opens, so nothing loads up front. On phones and tablets (and
 * without JavaScript) it opens Calendly in a new tab.
 */
export function CalendlyButton({
  url,
  label,
  modalTitle,
  variant = "flame",
  className,
}: {
  url: string;
  label: string;
  modalTitle: string;
  variant?: ButtonProps["variant"];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so the native dialog can restore focus on close.
  const [loaded, setLoaded] = useState(false);
  const embedUrl = `${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&embed_type=Inline`;

  return (
    <>
      <Button
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        leftIcon={<CalendarClock aria-hidden="true" strokeWidth={1.5} className="size-4" />}
        className={className}
        onClick={(event) => {
          if (window.matchMedia(DESKTOP).matches) {
            event.preventDefault();
            setLoaded(true);
            setOpen(true);
          }
        }}
      >
        {label}
        <span className="sr-only"> (opens a scheduler)</span>
      </Button>
      {loaded ? (
        <CalendlyDialog
          open={open}
          onClose={() => setOpen(false)}
          title={modalTitle}
          embedUrl={embedUrl}
        />
      ) : null}
    </>
  );
}

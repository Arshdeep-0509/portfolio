"use client";

import { Modal } from "@/components/ui/Modal";

/** The Calendly scheduler in a modal. Loaded on demand by CalendlyButton (desktop only). */
export function CalendlyDialog({
  open,
  onClose,
  title,
  embedUrl,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  embedUrl: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="lg" className="max-w-4xl">
      {open ? (
        <iframe
          src={embedUrl}
          title="Calendly scheduler"
          className="mt-4 h-[70vh] min-h-[560px] w-full rounded-card border border-line"
        />
      ) : null}
    </Modal>
  );
}

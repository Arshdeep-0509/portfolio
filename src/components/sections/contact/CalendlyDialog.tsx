"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";

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
  const [loaded, setLoaded] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg" className="max-w-4xl">
      {open ? (
        <div className="relative mt-4 h-[70vh] min-h-[560px] w-full">
          {/* The modal is already --surface, so the block steps up one to stay visible. */}
          {loaded ? null : <Skeleton className="absolute inset-0 rounded-card bg-surface-raised" />}
          <iframe
            src={embedUrl}
            title="Calendly scheduler"
            onLoad={() => setLoaded(true)}
            className="relative size-full rounded-card border border-border"
          />
        </div>
      ) : null}
    </Modal>
  );
}

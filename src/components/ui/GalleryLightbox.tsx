"use client";

import { useId } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/components/ui/Gallery";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { isUnoptimized } from "@/lib/images";

/**
 * Lightbox for <Gallery>, loaded only when a thumbnail is first opened. ←/→ (and the on-screen
 * buttons) move between images, Esc or a backdrop click closes, and focus is trapped then
 * restored to the thumbnail that opened it (native <dialog> via useModalDialog).
 */
export function GalleryLightbox({
  images,
  label,
  index,
  onIndexChange,
}: {
  images: GalleryImage[];
  label: string;
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const open = index !== null;
  const close = () => onIndexChange(null);
  const dialogProps = useModalDialog(open, close);
  const titleId = useId();
  const count = images.length;
  const go = (delta: number) => {
    if (index !== null) onIndexChange((index + delta + count) % count);
  };
  const current = index !== null ? images[index] : undefined;

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        dialogProps.onKeyDown(event);
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
      className="m-auto w-[min(72rem,calc(100%-2rem))] max-w-none bg-transparent p-0 backdrop:bg-scrim backdrop:backdrop-blur-sm open:animate-panel-in"
    >
      {current ? (
        <div data-theme="dark" className="text-ink">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id={titleId} className="label-text text-ink">
              {label} · {index! + 1} of {count}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="inline-flex size-11 items-center justify-center rounded-button border border-border text-ink hover:border-link"
            >
              <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-surface-raised">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1200px) 1152px, 100vw"
              unoptimized={isUnoptimized(current.src)}
              className="object-contain"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screen"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-button border border-border text-ink hover:border-link"
            >
              <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
            <p aria-live="polite" className="text-center text-small text-ink-muted">
              {current.caption ? <PlaceholderText text={current.caption} /> : current.alt}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screen"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-button border border-border text-ink hover:border-link"
            >
              <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

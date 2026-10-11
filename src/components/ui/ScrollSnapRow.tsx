"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollSnapRowProps = {
  /** Accessible name of the carousel region. */
  label: string;
  children: React.ReactNode;
  /** Width of each item, e.g. "min(85%, 26rem)". */
  itemWidth?: string;
  className?: string;
};

/**
 * A horizontal scroll-snap row with previous/next buttons. Native scrolling does the work, so it
 * swipes on touch, scrolls with a trackpad, and keeps working without JavaScript. The track is
 * focusable: ←/→ move one item, Home/End jump to the ends. Buttons disable at either end.
 */
export function ScrollSnapRow({
  label,
  children,
  itemWidth = "min(85%, 25rem)",
  className,
}: ScrollSnapRowProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * (first.offsetWidth + gap),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget) return;
    const track = event.currentTarget;
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "Home") track.scrollTo({ left: 0 });
    else if (event.key === "End") track.scrollTo({ left: track.scrollWidth });
    else return;
    event.preventDefault();
  }

  const count = Children.count(children);
  const arrow =
    "inline-flex size-11 items-center justify-center rounded-button border border-rule text-fg transition-colors duration-200 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className={className}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="label-mono text-fg-muted" aria-hidden="true">
          {count} {count === 1 ? "item" : "items"} · scroll or use the arrows
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={arrow}
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Previous"
          >
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
          <button
            type="button"
            className={arrow}
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Next"
          >
            <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${label}: use the left and right arrow keys to scroll`}
        style={{ "--item-w": itemWidth } as React.CSSProperties}
        className={cn(
          "relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 sm:-mx-0 sm:scroll-px-0 sm:px-0",
          "[scrollbar-width:thin] [scrollbar-color:var(--rule)_transparent]",
          "[&>li]:w-(--item-w) [&>li]:shrink-0 [&>li]:snap-start",
        )}
      >
        {children}
      </ul>
    </div>
  );
}

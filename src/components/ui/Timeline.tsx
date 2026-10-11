"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type TimelineItem = {
  title: string;
  text?: string;
  /** Milestones variant: a date or period, e.g. "2024". */
  meta?: string;
  /** Milestones variant: render this (e.g. a card) instead of meta/title/text. */
  content?: React.ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
  /**
   * "steps": horizontal on ≥1024px, vertical below. "vertical": numbered steps, vertical at every
   * width. "milestones": vertical, alternating sides on ≥768px.
   */
  variant?: "steps" | "vertical" | "milestones";
  className?: string;
};

// The fill scales with --progress (0–1), set on the wrapper by useScrollProgress. Under reduced
// motion it is drawn full and static: `transform: none !important` beats the inline scale.
const fillClass =
  "block h-full w-full bg-primary transition-transform duration-150 ease-out motion-reduce:transform-none!";
const fillY = { transform: "scaleY(var(--progress, 0))" };
const fillX = { transform: "scaleX(var(--progress, 0))" };

/**
 * Writes the element's scroll progress to a --progress CSS variable: 0 when its top reaches 85%
 * of the viewport, 1 when its bottom reaches 55%. One passive listener, throttled to animation
 * frames, and no React re-renders.
 */
function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * 0.85 - rect.top) / (vh * 0.3 + rect.height);
      el.style.setProperty("--progress", String(Math.min(1, Math.max(0, progress))));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return ref;
}

/** Ordered timeline whose connector line fills as it scrolls into view. */
export function Timeline({ items, variant = "steps", className }: TimelineProps) {
  const ref = useScrollProgress();

  if (variant === "milestones") {
    return (
      <div ref={ref} className={cn("relative", className)}>
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-4 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2"
        >
          <span style={fillY} className={cn(fillClass, "origin-top")} />
        </span>
        <ol className="space-y-10">
          {items.map((item, index) => {
            const right = index % 2 === 1;
            return (
              <li
                key={`${item.title}-${index}`}
                className="relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-4 size-3.5 -translate-x-1/2 rounded-pill border-2 border-primary bg-surface md:left-1/2",
                    // Align the node with a card's first line when custom content is used.
                    item.content ? "top-8" : "top-1.5",
                  )}
                />
                {item.content ? (
                  <div className={cn(right && "md:col-start-2")}>{item.content}</div>
                ) : (
                  <div className={cn(right ? "md:col-start-2" : "md:text-right")}>
                    {item.meta ? (
                      <p className="font-mono text-eyebrow font-medium text-tone-accent-text uppercase">
                        {item.meta}
                      </p>
                    ) : null}
                    <h3 className="mt-1 text-h3 font-bold">{item.title}</h3>
                    {item.text ? <p className="mt-1.5 text-tone-muted">{item.text}</p> : null}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  // Desktop connector runs between the centres of the first and last nodes.
  const inset = `calc(100% / ${items.length} / 2)`;
  const horizontal = variant === "steps";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className={cn("absolute top-6 bottom-6 left-6 w-0.5 bg-border", horizontal && "lg:hidden")}
      >
        <span style={fillY} className={cn(fillClass, "origin-top")} />
      </span>
      {horizontal ? (
        <span
          aria-hidden="true"
          className="absolute top-6 hidden h-0.5 bg-border lg:block"
          style={{ left: inset, right: inset }}
        >
          <span style={fillX} className={cn(fillClass, "origin-left")} />
        </span>
      ) : null}

      <ol
        className={cn(
          "relative grid gap-8",
          horizontal && "lg:auto-cols-fr lg:grid-flow-col lg:gap-6",
        )}
      >
        {items.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            className={cn("flex gap-5", horizontal && "lg:flex-col lg:items-center lg:text-center")}
          >
            <span className="tone-light flex size-12 shrink-0 items-center justify-center rounded-pill border-2 border-primary bg-surface font-mono text-small font-medium text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={cn("pt-2.5", horizontal && "lg:pt-0")}>
              <h3 className="text-h3 font-bold">{item.title}</h3>
              {item.text ? <p className="mt-1.5 text-tone-muted">{item.text}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

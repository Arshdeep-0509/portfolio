"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "@/components/brand/Star";
import { cn, pad2 } from "@/lib/utils";

export type StoryStep = {
  id: string;
  title: string;
  /** The panel body (rendered on the server and passed in). */
  content: React.ReactNode;
};

type StickyScrollStoryProps = {
  /** The left column's heading block (usually a SectionHeader). */
  intro: React.ReactNode;
  steps: StoryStep[];
  /** Accessible name for the step outline. */
  outlineLabel: string;
  className?: string;
};

/** One waypoint on the path: gold when lit. The backing hides the dotted line behind the star. */
function Waypoint({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("absolute bg-bg py-1", className)}>
      <Star
        className={cn(
          "block size-3.5 transition-colors duration-300",
          lit ? "text-accent" : "text-ink-muted",
        )}
      />
    </span>
  );
}

/**
 * The steps as a vertical star path: a dotted line with a small star at each step, gold on the
 * current or hovered step. From 1024px the path is the outline in the sticky left column, beside
 * panels that scroll past; below that it runs down the side of the stacked panels. The step whose
 * panel crosses the middle of the viewport is current. Without JavaScript the first step stays
 * lit and everything else works.
 */
export function StickyScrollStory({
  intro,
  steps,
  outlineLabel,
  className,
}: StickyScrollStoryProps) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = panels.current.indexOf(entry.target as HTMLElement);
          if (index !== -1) setActive(index);
        }
      },
      // A thin band across the middle of the viewport decides which step is "current".
      { rootMargin: "-45% 0px -50% 0px" },
    );
    panels.current.forEach((panel) => panel && observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  const lit = (index: number) => index === active || index === hovered;

  return (
    <div className={cn("grid gap-12 lg:grid-cols-12 lg:gap-8", className)}>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
          {intro}
          <nav aria-label={outlineLabel} className="relative mt-12 hidden pl-8 lg:block">
            <span aria-hidden="true" className="absolute inset-y-4 left-1.5 star-path" />
            <ol>
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className="relative"
                  onPointerEnter={() => setHovered(index)}
                  onPointerLeave={() => setHovered(null)}
                >
                  <Waypoint lit={lit(index)} className="top-1/2 -left-8 -translate-y-1/2" />
                  <a
                    href={`#${step.id}`}
                    aria-current={index === active ? "step" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 transition-colors duration-300",
                      index === active ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    <span className="text-xs tabular-nums">{pad2(index + 1)}</span>
                    <span className="font-medium">{step.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <ol className="relative space-y-6 max-lg:pl-8 lg:col-span-7 lg:space-y-[18vh] lg:py-[8vh]">
        <span aria-hidden="true" className="absolute inset-y-8 left-1.5 star-path lg:hidden" />
        {steps.map((step, index) => (
          <li
            key={step.id}
            id={step.id}
            ref={(node) => {
              panels.current[index] = node;
            }}
            onPointerEnter={() => setHovered(index)}
            onPointerLeave={() => setHovered(null)}
            className={cn(
              "relative rounded-card border bg-surface-raised/60 p-6 transition-colors duration-500 sm:p-9",
              index === active ? "border-link" : "border-border",
            )}
          >
            <Waypoint lit={lit(index)} className="top-7 -left-8 lg:hidden" />
            {/* The path ends at the last star, not at the bottom of the last panel. */}
            {index === steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-12 -bottom-px -left-8 w-3.5 bg-bg lg:hidden"
              />
            ) : null}
            <p className="label-text text-ink-muted">Step {pad2(index + 1)}</p>
            <h3 className="mt-3 text-h2 text-ink">{step.title}</h3>
            <div className="mt-5">{step.content}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * A sticky left column — the section title plus a vertical progress line listing every step —
 * beside right-hand panels that scroll past. The step whose panel crosses the middle of the
 * viewport is highlighted in the outline and in its panel. Below 1024px it becomes a simple
 * stacked list. Without JavaScript the first step stays highlighted and everything else works.
 */
export function StickyScrollStory({
  intro,
  steps,
  outlineLabel,
  className,
}: StickyScrollStoryProps) {
  const [active, setActive] = useState(0);
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

  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  return (
    <div className={cn("grid gap-12 lg:grid-cols-12 lg:gap-8", className)}>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
          {intro}
          <nav aria-label={outlineLabel} className="relative mt-12 hidden pl-7 lg:block">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-rule" />
            <span
              aria-hidden="true"
              className="absolute top-2 left-[5px] w-px origin-top bg-lamp-500 transition-transform duration-700 ease-out"
              style={{ height: "calc(100% - 1rem)", transform: `scaleY(${progress})` }}
            />
            <ol className="space-y-1">
              {steps.map((step, index) => {
                const current = index === active;
                return (
                  <li key={step.id} className="relative">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-1/2 -left-7 size-[11px] -translate-y-1/2 rounded-dot border transition-colors duration-500",
                        index <= active
                          ? "border-lamp-500 bg-lamp-500"
                          : "border-fg-muted/50 bg-night-950",
                        current && "shadow-[0_0_14px_2px_rgb(245_165_36/0.55)]",
                      )}
                    />
                    <a
                      href={`#${step.id}`}
                      aria-current={current ? "step" : undefined}
                      className={cn(
                        "flex min-h-10 items-center gap-3 transition-colors duration-300",
                        current ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      <span className="font-mono text-xs">{pad2(index + 1)}</span>
                      <span className="font-medium">{step.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      <ol className="space-y-6 lg:col-span-7 lg:space-y-[18vh] lg:py-[8vh]">
        {steps.map((step, index) => {
          const current = index === active;
          return (
            <li
              key={step.id}
              id={step.id}
              ref={(node) => {
                panels.current[index] = node;
              }}
              className={cn(
                "rounded-card border bg-night-800/60 p-6 transition-[border-color,box-shadow] duration-500 sm:p-9",
                current ? "border-lamp-500/70 shadow-glow" : "border-line-dark",
              )}
            >
              <p className="label-mono text-accent">Step {pad2(index + 1)}</p>
              <h3 className="mt-3 text-h2 text-fg">{step.title}</h3>
              <div className="mt-5">{step.content}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

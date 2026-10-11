"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Testimonial } from "@/content/testimonials";

/**
 * One large serif pull-quote at a time, with the name and role underneath. Never autoplays;
 * ←/→ or the buttons move between quotes, and changes are announced politely.
 */
export function PullQuote({ items, label }: { items: Testimonial[]; label: string }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const go = (next: number) => setIndex((next + count) % count);
  const item = items[index];
  if (!item) return null;

  const arrow =
    "inline-flex size-11 items-center justify-center rounded-button border border-rule text-fg transition-colors duration-200 hover:border-accent hover:text-accent";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1);
        else if (event.key === "ArrowLeft") go(index - 1);
        else return;
        event.preventDefault();
      }}
    >
      <figure aria-live="polite" key={index} className="animate-fade-in">
        <span
          aria-hidden="true"
          className="block font-display-soft text-7xl leading-none text-accent"
        >
          “
        </span>
        <blockquote className="mt-2 max-w-[30ch] font-display-soft text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-[1.18] text-fg">
          <p>{item.quote}</p>
        </blockquote>
        <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-semibold text-fg">{item.name}</span>
          <span className="label-mono text-fg-muted">
            {item.role}, {item.company}
          </span>
          {item.linkedinUrl ? (
            <a
              href={item.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-small text-accent"
            >
              Verify on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </figcaption>
      </figure>
      {count > 1 ? (
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            className={arrow}
            onClick={() => go(index - 1)}
            aria-label="Previous quote"
          >
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
          <button
            type="button"
            className={arrow}
            onClick={() => go(index + 1)}
            aria-label="Next quote"
          >
            <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
          <span className="label-mono text-fg-muted">
            {index + 1} / {count}
          </span>
        </div>
      ) : null}
    </div>
  );
}

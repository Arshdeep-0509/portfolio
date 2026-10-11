"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/utils";

const SWIPE_PX = 48;

function initials(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type TestimonialCarouselProps = {
  items: Testimonial[];
  /** Accessible name for the carousel region. */
  label?: string;
};

/**
 * One testimonial at a time, with arrows, dots, ←/→ keys and touch swipe. Never autoplays,
 * so nothing moves unless the visitor asks it to; slide changes are announced politely.
 */
export function TestimonialCarousel({ items, label = "Testimonials" }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = items.length;
  const go = (next: number) => setIndex((next + count) % count);

  if (count === 0) return null;

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
      className="mx-auto max-w-3xl"
    >
      <div
        // touch-pan-y keeps vertical page scrolling native while horizontal swipes change slides.
        className="touch-pan-y select-none"
        onPointerDown={(event) => {
          startX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const dx = event.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        <div aria-live="polite" className="grid">
          {items.map((item, i) => (
            <figure
              key={`${item.name}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              hidden={i !== index}
              className="tone-light col-start-1 row-start-1 animate-fade-in rounded-xl border border-border bg-surface p-7 shadow-card sm:p-10"
            >
              <Quote aria-hidden="true" className="size-8 text-primary" />
              <blockquote className="mt-4 font-heading text-lg leading-relaxed font-semibold text-ink sm:text-xl">
                <p>{item.quote}</p>
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-pill object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-pill bg-soft font-heading font-bold text-primary"
                  >
                    {initials(item.name)}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{item.name}</span>
                  <span className="block text-small text-muted">
                    {item.role}, {item.company}
                  </span>
                </span>
                {item.linkedinUrl ? (
                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.name} on LinkedIn (opens in a new tab)`}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-border text-muted transition-colors duration-200 hover:border-primary hover:text-primary"
                  >
                    <SocialIcon name="linkedin" className="size-5" />
                  </a>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <ArrowButton label="Previous testimonial" onClick={() => go(index - 1)}>
            <ChevronLeft aria-hidden="true" className="size-5" />
          </ArrowButton>
          <div className="flex">
            {items.map((item, i) => (
              <button
                key={`dot-${item.name}-${i}`}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show testimonial ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="group inline-flex size-11 items-center justify-center rounded-pill"
              >
                <span
                  className={cn(
                    "h-2.5 rounded-pill transition-[width,background-color] duration-200",
                    i === index ? "w-6 bg-primary" : "w-2.5 bg-subtle group-hover:bg-muted",
                  )}
                />
              </button>
            ))}
          </div>
          <ArrowButton label="Next testimonial" onClick={() => go(index + 1)}>
            <ChevronRight aria-hidden="true" className="size-5" />
          </ArrowButton>
        </div>
      ) : null}
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="tone-light inline-flex size-11 items-center justify-center rounded-pill border border-border bg-surface text-ink shadow-card transition-colors duration-200 hover:border-primary hover:text-primary"
    >
      {children}
    </button>
  );
}

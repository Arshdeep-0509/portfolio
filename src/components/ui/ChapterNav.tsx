"use client";

import { useEffect, useState } from "react";
import { cn, pad2 } from "@/lib/utils";

export type Chapter = { id: string; text: string; level?: 2 | 3 };

/**
 * A chapter list with scroll-spy: the chapter currently being read is marked with a lamp line
 * and aria-current="location". Used in the margins of service pages, journal posts and legal
 * documents.
 */
export function ChapterNav({
  chapters,
  label,
  numbered = false,
  className,
}: {
  chapters: Chapter[];
  label: string;
  /** Prefix each top-level chapter with "01", "02"… */
  numbered?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line =
        (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) ||
          100) + 48;
      let current: string | null = null;
      for (const chapter of chapters) {
        const el = document.getElementById(chapter.id);
        if (el && el.getBoundingClientRect().top <= line) current = chapter.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [chapters]);

  const numbers = chapters.map((chapter, index) =>
    chapter.level === 3
      ? null
      : chapters.slice(0, index + 1).filter((entry) => entry.level !== 3).length,
  );

  return (
    <nav aria-label={label} className={className}>
      <p className="label-mono text-fg-muted">{label}</p>
      <ol className="mt-3 border-l border-rule">
        {chapters.map((chapter, index) => {
          const current = chapter.id === active;
          const number = numbers[index];
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "-ml-px flex min-h-10 items-center gap-2.5 border-l-2 py-1 text-small transition-colors duration-200",
                  chapter.level === 3 ? "pl-7" : "pl-4",
                  current
                    ? "border-lamp-500 font-semibold text-fg"
                    : "border-transparent text-fg-muted hover:text-fg",
                )}
              >
                {numbered && number ? (
                  <span className="font-mono text-xs text-accent">{pad2(number)}</span>
                ) : null}
                {chapter.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

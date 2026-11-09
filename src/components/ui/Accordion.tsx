"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Index of the item open on first render, or null for none. Default 0. */
  defaultOpen?: number | null;
  /** Heading level wrapping each trigger button. Default "h3". */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

/**
 * Question rows separated by hairlines, no boxes. One item open at a time; the chevron turns over.
 * Height animates only once someone has used it, never on load. ↑/↓/Home/End move between
 * questions. Collapsed panels are `inert`, so their links are skipped by Tab and screen readers.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  headingLevel: Heading = "h3",
  className,
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const [used, setUsed] = useState(false);
  const baseId = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const target =
      event.key === "ArrowDown"
        ? (index + 1) % items.length
        : event.key === "ArrowUp"
          ? (index - 1 + items.length) % items.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    triggers.current[target]?.focus();
  }

  return (
    <div className={cn("border-y border-border", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-border last:border-b-0">
            <Heading className="font-sans text-body">
              <button
                ref={(node) => {
                  triggers.current[index] = node;
                }}
                id={triggerId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                  setUsed(true);
                  setOpenIndex(open ? null : index);
                }}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group flex min-h-11 w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="font-semibold text-ink transition-colors duration-200 group-hover:text-link">
                  {item.question}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className={cn(
                    "mt-1 size-5 shrink-0 text-ink-muted motion-safe:transition-transform motion-safe:duration-300",
                    open && "rotate-180",
                  )}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!open}
              className={cn(
                "grid",
                used &&
                  "motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-[68ch] pr-10 pb-7 text-ink-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

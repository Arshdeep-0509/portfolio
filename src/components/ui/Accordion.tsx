"use client";

import { useId, useRef, useState } from "react";
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
 * Question rows separated by hairlines — no boxes. One item open at a time; "+" turns into "−".
 * ↑/↓/Home/End move between questions. Collapsed panels are `inert`, so their links are skipped
 * by Tab and screen readers. Colours follow the section tone.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  headingLevel: Heading = "h3",
  className,
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
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
    <div className={cn("border-y border-rule", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-rule last:border-b-0">
            <Heading className="font-sans text-body">
              <button
                ref={(node) => {
                  triggers.current[index] = node;
                }}
                id={triggerId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group flex min-h-11 w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-[-2px] w-5 shrink-0 text-center font-mono text-xl leading-none text-accent"
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-[68ch] pr-10 pb-7 text-fg-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { NumberLabel } from "@/components/ui/NumberLabel";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: React.ReactNode;
  /** Shown above the question in the "numbered" variant, e.g. "PRICING". */
  label?: string;
};

type AccordionProps = {
  items: AccordionItem[];
  variant?: "default" | "numbered";
  /** Index of the item open on first render, or null for none. Default 0. */
  defaultOpen?: number | null;
  /** Heading level wrapping each trigger button. Default "h3". */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

/**
 * FAQ accordion. One item open at a time; ↑/↓/Home/End move between questions.
 * Collapsed panels are `inert`, so their links are skipped by Tab and screen readers.
 */
export function Accordion({
  items,
  variant = "default",
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
    <div
      className={cn(
        "tone-light divide-y divide-border rounded-lg border border-border bg-surface",
        className,
      )}
    >
      {items.map((item, index) => {
        const open = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <Heading className="text-body">
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
                className="flex min-h-11 w-full items-start justify-between gap-4 rounded-lg px-5 py-5 text-left sm:px-6"
              >
                <span>
                  {variant === "numbered" ? (
                    <NumberLabel number={index + 1} label={item.label} className="mb-1.5" />
                  ) : null}
                  <span className="font-heading font-semibold text-ink">{item.question}</span>
                </span>
                <Plus
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 size-5 shrink-0 text-primary transition-transform duration-200 ease-out",
                    open && "rotate-45",
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
                "grid transition-[grid-template-rows] duration-200 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-muted sm:px-6">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

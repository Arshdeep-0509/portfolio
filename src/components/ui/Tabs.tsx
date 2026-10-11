"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  defaultTab?: string;
  className?: string;
};

/**
 * WAI-ARIA tabs with automatic activation: ←/→ move and select, Home/End jump to the ends.
 * Tabs sit on a hairline; the active one is marked by a 2px lamp line, not a pill.
 */
export function Tabs({ items, label, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const item = items[index];
    if (!item) return;
    setActive(item.id);
    tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % items.length,
      ArrowLeft: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="flex max-w-full gap-6 overflow-x-auto border-b border-rule sm:gap-10"
      >
        {items.map((item, index) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "relative -mb-px min-h-12 shrink-0 border-b-2 pb-3 text-left font-display-soft text-xl whitespace-nowrap transition-colors duration-200 sm:text-2xl",
                selected
                  ? "border-lamp-500 text-fg"
                  : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          tabIndex={0}
          hidden={item.id !== active}
          className="mt-10 animate-fade-in rounded-card"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

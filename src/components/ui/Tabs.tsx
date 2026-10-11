"use client";

import { useId, useRef, useState } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  /** Panel content for this tab. Omit when using the shared `children` panel instead. */
  content?: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  defaultTab?: string;
  /** Controlled mode: the selected tab id, paired with onValueChange. */
  value?: string;
  onValueChange?: (id: string) => void;
  /**
   * Shared-panel mode: one tabpanel whose content the parent derives from the selected tab.
   * Keeps the DOM small when tabs only filter one list (no hidden copy per tab).
   */
  children?: React.ReactNode;
  /** Horizontal alignment of the tab list. Default "start". */
  align?: "start" | "center";
  className?: string;
};

const panelClass = "mt-6 animate-fade-in rounded-md";

/**
 * WAI-ARIA tabs with automatic activation: ←/→ move and select, Home/End jump to the ends.
 * The active pill slides between tabs (snaps instantly under reduced motion via MotionConfig).
 */
export function Tabs({
  items,
  label,
  defaultTab,
  value,
  onValueChange,
  children,
  align = "start",
  className,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultTab ?? items[0]?.id);
  const active = value ?? internal;
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shared = children !== undefined;
  const panelId = (id: string) => (shared ? `${baseId}-panel` : `${baseId}-panel-${id}`);

  function setActive(id: string) {
    setInternal(id);
    onValueChange?.(id);
  }

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
      <div className={cn("flex", align === "center" && "justify-center")}>
        <div
          role="tablist"
          aria-label={label}
          className="tone-light inline-flex max-w-full gap-1 overflow-x-auto rounded-pill border border-border bg-surface p-1 shadow-card"
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
                aria-controls={panelId(item.id)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  "relative min-h-11 rounded-pill px-4 text-small font-semibold whitespace-nowrap transition-colors duration-200",
                  selected ? "text-white" : "text-muted hover:text-ink",
                )}
              >
                {selected ? (
                  <m.span
                    layoutId={`${baseId}-pill`}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-pill bg-primary"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {shared ? (
        <div
          // Re-keyed per tab so the fade replays when the filtered content changes.
          key={active}
          id={panelId("")}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          className={panelClass}
        >
          {children}
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            id={panelId(item.id)}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${item.id}`}
            tabIndex={0}
            hidden={item.id !== active}
            // Fades in when shown (the global reduced-motion rule makes it instant).
            className={panelClass}
          >
            {item.content}
          </div>
        ))
      )}
    </div>
  );
}

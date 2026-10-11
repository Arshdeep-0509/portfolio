"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { HeaderNav, MegaGroupView } from "@/components/layout/navTypes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PANEL_ID = "services-mega-menu";
const INTENT_MS = 150;

type MegaMenuProps = {
  label: string;
  groups: MegaGroupView[];
  /** The "Not sure what you need?" card. */
  promo: HeaderNav["promo"];
  /** The current page is /services or a service page. */
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Disclosure-style mega menu (a button that shows a panel of links — not an ARIA menu, so screen
 * readers browse it as ordinary links). Opens on hover after 150ms, on click, or with Enter/Space/↓.
 * Inside: ↑/↓ move within a column, ←/→ jump between columns, Home/End, Esc returns to the button.
 */
export function MegaMenu({ label, groups, promo, active, open, onOpenChange }: MegaMenuProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  function scheduleOpen(next: boolean) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onOpenChange(next), INTENT_MS);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Esc and clicks outside close the panel while it is open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onOpenChange(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  function items() {
    return Array.from(panelRef.current?.querySelectorAll<HTMLElement>("[data-col]") ?? []);
  }

  function focusAt(col: number, row: number) {
    const all = items();
    const column = all.filter((el) => Number(el.dataset.col) === col);
    if (column.length === 0) return;
    column[Math.min(Math.max(row, 0), column.length - 1)]?.focus();
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    window.clearTimeout(timer.current);
    onOpenChange(true);
    // Wait one frame for the panel to become visible before moving focus into it.
    requestAnimationFrame(() => focusAt(0, 0));
  }

  function onPanelKeyDown(event: React.KeyboardEvent) {
    const current = document.activeElement as HTMLElement | null;
    if (!current?.dataset.col) return;
    const col = Number(current.dataset.col);
    const row = Number(current.dataset.row);
    const lastCol = Math.max(...items().map((el) => Number(el.dataset.col)));
    const all = items();

    switch (event.key) {
      case "ArrowDown":
        focusAt(col, row + 1);
        break;
      case "ArrowUp":
        if (row === 0 && col === 0) triggerRef.current?.focus();
        else focusAt(col, row - 1);
        break;
      case "ArrowRight":
        focusAt(Math.min(col + 1, lastCol), row);
        break;
      case "ArrowLeft":
        focusAt(Math.max(col - 1, 0), row);
        break;
      case "Home":
        all[0]?.focus();
        break;
      case "End":
        all[all.length - 1]?.focus();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div
      ref={rootRef}
      className="flex h-full items-center"
      onPointerEnter={(event) => event.pointerType === "mouse" && scheduleOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && scheduleOpen(false)}
      // Tabbing out of the trigger + panel closes it.
      onBlur={(event) => {
        if (open && !rootRef.current?.contains(event.relatedTarget as Node | null)) {
          onOpenChange(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onKeyDown={onTriggerKeyDown}
        onClick={(event) => {
          window.clearTimeout(timer.current);
          // Mouse clicks only open (hover may already have opened it); keyboard toggles.
          onOpenChange(event.detail === 0 ? !open : true);
        }}
        className={cn(
          "inline-flex min-h-11 items-center gap-1 rounded-pill px-3.5 text-small font-semibold transition-colors duration-200",
          active || open ? "text-primary" : "text-ink hover:text-primary",
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform duration-200 ease-out", open && "rotate-180")}
        />
      </button>

      <div
        ref={panelRef}
        id={PANEL_ID}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        // The header's backdrop-filter makes it the containing block, so this sits right under it.
        // The full-width wrapper is click-through: only the card counts as "inside" for hover and clicks.
        className="pointer-events-none fixed inset-x-0 top-(--header-h) max-h-[calc(100dvh-var(--header-h))] animate-menu-in overflow-y-auto pb-6"
      >
        <div className="container-site">
          <div className="tone-light pointer-events-auto grid gap-x-6 gap-y-8 rounded-b-xl border border-t-0 border-border bg-surface p-6 shadow-card-hover lg:grid-cols-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_16rem]">
            {groups.map((group, col) => (
              <div key={group.id}>
                <p
                  id={`mega-group-${group.id}`}
                  className="px-2.5 text-eyebrow font-semibold text-primary uppercase"
                >
                  {group.label}
                </p>
                <ul aria-labelledby={`mega-group-${group.id}`} className="mt-3 space-y-1">
                  {group.items.map((item, row) => {
                    const current = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          data-col={col}
                          data-row={row}
                          aria-current={current ? "page" : undefined}
                          className="group/item flex gap-3 rounded-md p-2.5 transition-colors duration-200 hover:bg-tint aria-[current=page]:bg-soft"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-soft text-primary transition-colors duration-200 group-hover/item:bg-primary group-hover/item:text-white">
                            {item.iconNode}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-small font-semibold text-ink">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-muted">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="tone-gradient flex flex-col items-start gap-4 rounded-lg bg-grad-cta p-6 text-white lg:col-span-4 lg:flex-row lg:items-center lg:justify-between xl:col-span-1 xl:flex-col xl:items-start xl:justify-start">
              <div>
                <p className="font-heading text-h3 font-bold">{promo.title}</p>
                <p className="mt-2 text-small">{promo.text}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <Button
                  href={promo.cta.href}
                  variant="white"
                  data-col={groups.length}
                  data-row={0}
                  rightIcon={<ArrowRight aria-hidden="true" className="size-4" />}
                >
                  {promo.cta.label}
                </Button>
                <Link
                  href={promo.allServices.href}
                  data-col={groups.length}
                  data-row={1}
                  className="inline-flex min-h-11 items-center rounded-sm text-small font-semibold underline underline-offset-4"
                >
                  {promo.allServices.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

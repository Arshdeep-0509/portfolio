"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { HeaderNav } from "@/components/layout/navTypes";
import { cn, pad2 } from "@/lib/utils";

const PANEL_ID = "services-menu";
const INTENT_MS = 140;

type ServicesMenuProps = {
  label: string;
  groups: HeaderNav["services"];
  copy: HeaderNav["copy"]["menu"];
  /** The current page is /services or a service page. */
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Two-panel services menu (a disclosure: a button that shows a panel of ordinary links, not an
 * ARIA menu, so screen readers browse it as links). Left: the four groups and their services.
 * Right: a preview of whichever service is hovered or focused — tagline, three deliverables and
 * a "Read more" link. Opens on hover after a short intent delay, on click, or with Enter/Space/↓.
 * Inside, ↑/↓ move through the services, Home/End jump, Esc returns focus to the button.
 */
export function ServicesMenu({
  label,
  groups,
  copy,
  active,
  open,
  onOpenChange,
}: ServicesMenuProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const items = groups.flatMap((group) => group.items);
  const [previewSlug, setPreviewSlug] = useState(items[0]?.slug);
  const preview = items.find((item) => item.slug === previewSlug) ?? items[0];

  function scheduleOpen(next: boolean) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onOpenChange(next), INTENT_MS);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

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

  function links() {
    return Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-service]") ?? []);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    window.clearTimeout(timer.current);
    onOpenChange(true);
    requestAnimationFrame(() => links()[0]?.focus());
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    const all = links();
    const index = all.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    const target =
      event.key === "ArrowDown"
        ? all[Math.min(index + 1, all.length - 1)]
        : event.key === "ArrowUp"
          ? index === 0
            ? triggerRef.current
            : all[index - 1]
          : event.key === "Home"
            ? all[0]
            : event.key === "End"
              ? all[all.length - 1]
              : undefined;
    if (!target) return;
    event.preventDefault();
    target.focus();
  }

  return (
    <div
      ref={rootRef}
      className="flex h-full items-center"
      onPointerEnter={(event) => event.pointerType === "mouse" && scheduleOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && scheduleOpen(false)}
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
          "inline-flex min-h-11 items-center gap-1 text-small font-semibold transition-colors duration-200 hover:text-accent",
          active || open ? "text-accent" : "text-fg",
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        id={PANEL_ID}
        hidden={!open}
        // Full-width click-through wrapper; only the panel itself counts as "inside".
        className="pointer-events-none fixed inset-x-0 top-(--header-h) max-h-[calc(100dvh-var(--header-h))] animate-panel-in overflow-y-auto pb-8"
      >
        <div className="container-site">
          <div className="tone-ivory pointer-events-auto grid overflow-hidden rounded-b-card border border-t-0 border-line bg-ivory-50 text-fg shadow-[0_30px_60px_-30px_rgb(10_10_18/0.35)] lg:grid-cols-12">
            <div
              ref={listRef}
              onKeyDown={onListKeyDown}
              className="grid gap-8 p-8 lg:col-span-8 lg:grid-cols-2 xl:gap-x-10"
            >
              {groups.map((group) => (
                <div key={group.id}>
                  <p
                    id={`menu-group-${group.id}`}
                    className="flex items-center gap-3 label-mono text-accent"
                  >
                    {group.label}
                    <span aria-hidden="true" className="h-px flex-1 bg-rule" />
                  </p>
                  <ul aria-labelledby={`menu-group-${group.id}`} className="mt-3">
                    {group.items.map((item) => {
                      const current = pathname === item.href;
                      const previewing = item.slug === preview?.slug;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            data-service=""
                            aria-current={current ? "page" : undefined}
                            onPointerEnter={() => setPreviewSlug(item.slug)}
                            onFocus={() => setPreviewSlug(item.slug)}
                            className={cn(
                              "group/item flex min-h-10 items-center gap-3 text-small transition-colors duration-200",
                              previewing ? "text-accent" : "text-fg hover:text-accent",
                            )}
                          >
                            <span className="w-6 font-mono text-xs text-fg-muted">
                              {pad2(items.indexOf(item) + 1)}
                            </span>
                            <span className="font-medium">{item.label}</span>
                            <ArrowRight
                              aria-hidden="true"
                              strokeWidth={1.5}
                              className={cn(
                                "size-3.5 transition-[opacity,transform] duration-200",
                                previewing
                                  ? "translate-x-0 opacity-100"
                                  : "-translate-x-1 opacity-0",
                              )}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <Link
                href={copy.servicesOverview.href}
                className="inline-flex min-h-11 items-center gap-2 self-end link-underline text-small font-semibold lg:col-span-2"
              >
                {copy.servicesOverview.label}
                <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </Link>
            </div>

            {preview ? (
              <div className="tone-night relative isolate overflow-hidden bg-night-950 bg-stars p-8 text-fg lg:col-span-4">
                <span
                  aria-hidden="true"
                  className="absolute -right-20 -bottom-24 -z-10 size-72 rounded-dot bg-[radial-gradient(circle,rgb(245_165_36/0.3),transparent_65%)]"
                />
                <p className="label-mono text-mist-300">{copy.previewHint}</p>
                <p className="mt-6 font-display-soft text-2xl text-ivory-50">{preview.label}</p>
                <p className="mt-3 text-small text-mist-300">{preview.tagline}</p>
                <p className="mt-6 label-mono text-accent">{copy.deliverablesLabel}</p>
                <ul className="mt-3 space-y-2 text-small text-ivory-50">
                  {preview.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-1.5 shrink-0 rounded-dot bg-lamp-500"
                      />
                      {deliverable}
                    </li>
                  ))}
                </ul>
                <Link
                  href={preview.href}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 link-underline text-small font-semibold text-lamp-400"
                >
                  {copy.previewCta}
                  <span className="sr-only">: {preview.label}</span>
                  <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

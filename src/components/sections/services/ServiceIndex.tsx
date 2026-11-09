"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { cn, pad2 } from "@/lib/utils";

export type IndexService = {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  timeline: string;
};

export type IndexGroup = { id: string; label: string; services: IndexService[] };

/** Build and AI & Cloud run the full width with their rows in two columns; the others sit side by side. */
const WIDE_GROUPS = ["build", "ai-cloud"];
/** The lead group also gets a raised panel, matching the home page. */
const LEAD_GROUP = "ai-cloud";

type ServiceIndexProps = {
  groups: IndexGroup[];
  copy: {
    previewLabel: string;
    deliverablesLabel: string;
    timelineLabel: string;
    readMore: string;
    hint: string;
  };
};

function Row({
  service,
  onPreview,
  active,
}: {
  service: IndexService;
  onPreview?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      onPointerEnter={onPreview}
      onFocus={onPreview}
      className={cn(
        "group flex min-h-12 items-baseline gap-3 border-b border-border py-3 transition-colors",
        active ? "text-link" : "text-ink hover:text-link",
      )}
    >
      <span className="w-6 shrink-0 text-xs text-ink-muted tabular-nums">
        {pad2(service.number)}
      </span>
      <span className="font-semibold">{service.title}</span>
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.5}
        className="ml-auto size-4 shrink-0 self-center transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

/**
 * The service index, styled as a table of contents: numbered rows in one column per group.
 * From 1024px, hovering or focusing a row fills the sticky preview panel (tagline, summary,
 * three deliverables, typical timeline). Below that, each group is a native <details>
 * accordion — no JavaScript needed.
 */
export function ServiceIndex({ groups, copy }: ServiceIndexProps) {
  const all = groups.flatMap((group) => group.services);
  const [slug, setSlug] = useState(all[0]?.slug);
  const preview = all.find((service) => service.slug === slug) ?? all[0];

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-8 lg:grid lg:grid-cols-12">
        <div className="grid gap-x-8 gap-y-12 lg:col-span-8 lg:grid-cols-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className={cn(
                WIDE_GROUPS.includes(group.id) && "lg:col-span-2",
                group.id === LEAD_GROUP &&
                  "rounded-card border border-border bg-surface-raised p-6",
              )}
            >
              <p id={`index-${group.id}`} className="label-text text-ink-muted">
                {group.label}
              </p>
              <ul
                aria-labelledby={`index-${group.id}`}
                className={cn(
                  "mt-3 border-t border-border",
                  WIDE_GROUPS.includes(group.id) && "grid grid-cols-2 gap-x-8",
                )}
              >
                {group.services.map((service) => (
                  <li key={service.slug}>
                    <Row
                      service={service}
                      active={service.slug === preview?.slug}
                      onPreview={() => setSlug(service.slug)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {preview ? (
          <aside aria-label={copy.previewLabel} className="lg:col-span-4">
            <div className="sticky top-[calc(var(--header-h)+2rem)] overflow-hidden rounded-card border border-border bg-surface-raised p-8 text-ink">
              <p className="label-text text-ink-muted">
                {copy.previewLabel} · {pad2(preview.number)}
              </p>
              <p className="mt-5 text-3xl leading-tight font-semibold text-ink">{preview.title}</p>
              <p className="mt-3 text-ink-muted">{preview.tagline}</p>
              <p className="mt-4 text-small text-ink-muted">{preview.summary}</p>
              <p className="mt-6 label-text text-ink-muted">{copy.deliverablesLabel}</p>
              <ul className="mt-2 space-y-1.5 text-small text-ink">
                {preview.deliverables.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] size-1.5 shrink-0 rounded-dot bg-ink-muted"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 label-text text-ink-muted">{copy.timelineLabel}</p>
              <p className="mt-1 text-sm text-ink tabular-nums">
                <PlaceholderText text={preview.timeline} />
              </p>
              <Link
                href={`/services/${preview.slug}`}
                className="mt-7 inline-flex min-h-11 items-center gap-2 link-underline font-semibold text-link"
              >
                {copy.readMore}
                <span className="sr-only">: {preview.title}</span>
                <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
              </Link>
              <p className="mt-6 text-xs text-ink-muted">{copy.hint}</p>
            </div>
          </aside>
        ) : null}
      </div>

      {/* Mobile and tablet */}
      <div className="border-t border-border lg:hidden">
        {groups.map((group, index) => (
          <details key={group.id} open={index === 0} className="group border-b border-border">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="text-2xl font-semibold text-ink">{group.label}</span>
              <ChevronDown
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-5 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <ul className="pb-4">
              {group.services.map((service) => (
                <li key={service.slug}>
                  <Row service={service} />
                  <p className="pt-1 pb-3 pl-9 text-small text-ink-muted">{service.tagline}</p>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </>
  );
}

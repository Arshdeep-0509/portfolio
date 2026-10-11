"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChipList } from "@/components/ui/Chip";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { StatusDot } from "@/components/ui/StatusDot";
import type { CaseStudyCardData, CaseStudyCategory, CaseStudyStatus } from "@/lib/contentTypes";
import { isUnoptimized } from "@/lib/images";
import { setUrlSearch, useUrlSearch } from "@/lib/useUrlSearch";
import { cn } from "@/lib/utils";

type WorkIndexProps = {
  studies: CaseStudyCardData[];
  copy: {
    filters: { label: string; all: string; options: { id: CaseStudyCategory; label: string }[] };
    empty: { filtered: string; clear: string; none: string };
    row: { status: string; year: string; role: string; cta: string };
    status: Record<CaseStudyStatus, string>;
  };
};

/**
 * Category filters as plain text links (a lamp dot marks the active one), then one full-width
 * row per project — a large image on one side, the facts on the other, alternating. The URL
 * holds the filter (?type=ai), so filtered views can be shared.
 */
export function WorkIndex({ studies, copy }: WorkIndexProps) {
  const params = useUrlSearch();
  const raw = params.get("type") as CaseStudyCategory | null;
  const active = raw && copy.filters.options.some((option) => option.id === raw) ? raw : null;
  const shown = active ? studies.filter((study) => study.categories.includes(active)) : studies;

  function select(type: CaseStudyCategory | null) {
    const next = new URLSearchParams(window.location.search);
    if (type) next.set("type", type);
    else next.delete("type");
    setUrlSearch(next);
  }

  if (studies.length === 0) {
    return <p className="max-w-xl text-lg text-fg-muted">{copy.empty.none}</p>;
  }

  const filters: { id: CaseStudyCategory | null; label: string }[] = [
    { id: null, label: copy.filters.all },
    ...copy.filters.options,
  ];

  return (
    <div>
      <div role="group" aria-label={copy.filters.label} className="flex flex-wrap gap-x-7 gap-y-1">
        {filters.map((filter) => {
          const on = filter.id === active;
          return (
            <button
              key={filter.label}
              type="button"
              aria-pressed={on}
              onClick={() => select(filter.id)}
              className={cn(
                "relative inline-flex min-h-11 items-center text-small font-semibold transition-colors",
                on ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {filter.label}
              {on ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-dot bg-lamp-500"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {shown.length} {shown.length === 1 ? "project" : "projects"} shown
      </p>

      {shown.length === 0 ? (
        <div className="mt-12 border-y border-rule py-12">
          <p className="text-lg text-fg-muted">{copy.empty.filtered}</p>
          <button
            type="button"
            onClick={() => select(null)}
            className="mt-4 min-h-11 link-underline font-semibold text-accent"
          >
            {copy.empty.clear}
          </button>
        </div>
      ) : (
        <ul className="mt-12 border-t border-rule">
          {shown.map((study, index) => (
            <li key={study.slug} className="border-b border-rule py-12 lg:py-16">
              <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <Link
                  href={`/work/${study.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className={cn(
                    "group relative block aspect-[16/10] overflow-hidden rounded-card border border-rule bg-night-900 lg:col-span-7",
                    index % 2 === 1 && "lg:order-2 lg:col-start-6",
                  )}
                >
                  <Image
                    src={study.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 700px, 100vw"
                    unoptimized={isUnoptimized(study.cover)}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </Link>
                <div
                  className={cn("lg:col-span-5", index % 2 === 1 && "lg:order-1 lg:col-start-1")}
                >
                  <dl className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <dt className="sr-only">{copy.row.status}</dt>
                      <dd>
                        <StatusDot status={study.status} label={copy.status[study.status]} />
                      </dd>
                    </div>
                    <div className="flex gap-2 label-mono text-fg-muted">
                      <dt>{copy.row.year}</dt>
                      <dd className="text-fg">{study.publishedAt.slice(0, 4)}</dd>
                    </div>
                  </dl>
                  <h2 className="mt-5 text-h2 text-fg">
                    <Link href={`/work/${study.slug}`} className="hover:text-accent">
                      {study.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-lg text-fg-muted">{study.summary}</p>
                  <p className="mt-4 text-small text-fg">
                    <span className="label-mono text-fg-muted">{copy.row.role} </span>
                    <PlaceholderText text={study.role} />
                  </p>
                  <ChipList items={study.stack} label="Stack" className="mt-5" />
                  <Link
                    href={`/work/${study.slug}`}
                    className="group/link mt-7 inline-flex min-h-11 items-center gap-2 link-underline font-semibold text-fg hover:text-accent"
                  >
                    {copy.row.cta}
                    <span className="sr-only">: {study.title}</span>
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { CaseStudyCard } from "@/components/ui/cards/CaseStudyCard";
import type { CaseStudyCardData, CaseStudyCategory, CaseStudyStatus } from "@/lib/contentTypes";
import { setUrlSearch, useUrlSearch } from "@/lib/useUrlSearch";
import { cn } from "@/lib/utils";

type WorkBrowserProps = {
  studies: CaseStudyCardData[];
  copy: {
    filters: { label: string; all: string; options: { id: CaseStudyCategory; label: string }[] };
    empty: { filtered: string; clear: string; none: string };
    card: { cta: string };
    status: Record<CaseStudyStatus, string>;
  };
};

const PARAM = "category";

/**
 * Multi-select filter chips over the case study grid, mirrored in the URL (?category=web,ai)
 * so filtered views can be shared. A study shows when it matches any selected category.
 */
export function WorkBrowser({ studies, copy }: WorkBrowserProps) {
  // The URL is the state: ?category=web,ai
  const search = useUrlSearch();
  const validIds: string[] = copy.filters.options.map((option) => option.id);
  const selected = (search.get(PARAM) ?? "")
    .split(",")
    .filter((id): id is CaseStudyCategory => validIds.includes(id));

  function update(next: CaseStudyCategory[]) {
    const params = new URLSearchParams(window.location.search);
    if (next.length) params.set(PARAM, next.join(","));
    else params.delete(PARAM);
    setUrlSearch(params);
  }

  const toggle = (id: CaseStudyCategory) =>
    update(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);

  const visible = selected.length
    ? studies.filter((study) => study.categories.some((category) => selected.includes(category)))
    : studies;

  if (studies.length === 0) {
    return <p className="mx-auto max-w-xl text-center text-lg text-muted">{copy.empty.none}</p>;
  }

  const chip =
    "inline-flex min-h-11 items-center rounded-pill border px-4 text-small font-semibold transition-colors duration-200";

  return (
    <div>
      <div role="group" aria-label={copy.filters.label} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={selected.length === 0}
          onClick={() => update([])}
          className={cn(
            chip,
            selected.length === 0
              ? "border-primary bg-primary text-white"
              : "border-border bg-surface text-ink hover:border-primary hover:text-primary",
          )}
        >
          {copy.filters.all}
        </button>
        {copy.filters.options.map((option) => {
          const pressed = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => toggle(option.id)}
              className={cn(
                chip,
                pressed
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-ink hover:border-primary hover:text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "case study" : "case studies"} shown
      </p>

      {visible.length > 0 ? (
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {visible.map((study) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} statusLabels={copy.status} ctaLabel={copy.card.cta} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-subtle bg-surface p-10 text-center">
          <p className="text-lg text-muted">{copy.empty.filtered}</p>
          <Button variant="outline" className="mt-5" onClick={() => update([])}>
            {copy.empty.clear}
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/ui/cards/PostCard";
import type { PostCardData, PostCategory } from "@/lib/contentTypes";
import { setUrlSearch, useUrlSearch } from "@/lib/useUrlSearch";
import { cn } from "@/lib/utils";

type InsightsBrowserProps = {
  posts: PostCardData[];
  copy: {
    categoriesLabel: string;
    all: string;
    categories: readonly PostCategory[];
    searchLabel: string;
    searchPlaceholder: string;
    featuredLabel: string;
    pageSize: number;
    empty: string;
    clear: string;
    none: string;
    paginationLabel: string;
  };
};

type State = { category: PostCategory | null; query: string; page: number };

function readState(params: URLSearchParams, categories: readonly PostCategory[]): State {
  const category = params.get("category") as PostCategory | null;
  const page = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    category: category && categories.includes(category) ? category : null,
    query: params.get("q") ?? "",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function toParams({ category, query, page }: State) {
  const params = new URLSearchParams(window.location.search);
  params.delete("category");
  params.delete("q");
  params.delete("page");
  if (category) params.set("category", category);
  // Store the raw text so the box keeps trailing spaces while typing; trimming happens on match.
  if (query.trim()) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  return params;
}

/**
 * Category chips, search over titles and excerpts, and pagination — all client-side over the
 * post summaries. The URL is the state (?category=AI&q=rag&page=2), so every view can be shared.
 * The featured post is shown as a large card only on the unfiltered first page.
 */
export function InsightsBrowser({ posts, copy }: InsightsBrowserProps) {
  const state = readState(useUrlSearch(), copy.categories);
  const searchId = useId();

  function update(next: Partial<State>) {
    // Changing the filter or search goes back to page 1.
    setUrlSearch(toParams({ ...state, ...next, page: next.page ?? 1 }));
  }

  if (posts.length === 0) {
    return <p className="mx-auto max-w-xl text-center text-lg text-muted">{copy.none}</p>;
  }

  // Every word must appear somewhere in the title or summary, in any order.
  const words = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filtering = Boolean(state.category || words.length);
  const matches = posts.filter((post) => {
    if (state.category && post.category !== state.category) return false;
    const haystack = `${post.title} ${post.description}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });

  const featured = filtering ? undefined : (posts.find((post) => post.featured) ?? posts[0]);
  const listed = featured ? matches.filter((post) => post.slug !== featured.slug) : matches;
  const pageCount = Math.max(1, Math.ceil(listed.length / copy.pageSize));
  const page = Math.min(state.page, pageCount);
  const pagePosts = listed.slice((page - 1) * copy.pageSize, page * copy.pageSize);
  const showFeatured = featured && page === 1;

  const chip =
    "inline-flex min-h-11 items-center rounded-pill border px-4 text-small font-semibold transition-colors duration-200";
  const chipState = (on: boolean) =>
    on
      ? "border-primary bg-primary text-white"
      : "border-border bg-surface text-ink hover:border-primary hover:text-primary";

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={copy.categoriesLabel} className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={!state.category}
            onClick={() => update({ category: null })}
            className={cn(chip, chipState(!state.category))}
          >
            {copy.all}
          </button>
          {copy.categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={state.category === category}
              onClick={() => update({ category: state.category === category ? null : category })}
              className={cn(chip, chipState(state.category === category))}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor={searchId} className="sr-only">
            {copy.searchLabel}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          />
          <input
            id={searchId}
            type="search"
            value={state.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder={copy.searchPlaceholder}
            className="tone-light block min-h-11 w-full rounded-pill border border-subtle bg-surface py-2.5 pr-4 pl-10 text-body text-ink placeholder:text-subtle focus-visible:border-primary"
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {matches.length} {matches.length === 1 ? "post" : "posts"} found
      </p>

      {showFeatured ? (
        <div className="mt-10">
          <PostCard post={featured} variant="featured" featuredLabel={copy.featuredLabel} as="h2" />
        </div>
      ) : null}

      {pagePosts.length > 0 ? (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} as={showFeatured ? "h3" : "h2"} />
            </li>
          ))}
        </ul>
      ) : matches.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-subtle bg-surface p-10 text-center">
          <p className="text-lg text-muted">{copy.empty}</p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => update({ category: null, query: "" })}
          >
            {copy.clear}
          </Button>
        </div>
      ) : null}

      {pageCount > 1 ? (
        <nav
          aria-label={copy.paginationLabel}
          className="mt-12 flex items-center justify-center gap-2"
        >
          <PageButton
            label="Previous page"
            disabled={page === 1}
            onClick={() => update({ page: page - 1 })}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </PageButton>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => update({ page: number })}
              aria-label={`Page ${number}`}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-pill text-small font-semibold",
                number === page ? "bg-primary text-white" : "text-ink hover:bg-soft",
              )}
            >
              {number}
            </button>
          ))}
          <PageButton
            label="Next page"
            disabled={page === pageCount}
            onClick={() => update({ page: page + 1 })}
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </PageButton>
        </nav>
      ) : null}
    </div>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-pill border border-border bg-surface text-ink hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

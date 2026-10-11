"use client";

import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostCardData, PostCategory } from "@/lib/contentTypes";
import { isUnoptimized } from "@/lib/images";
import { setUrlSearch, useUrlSearch } from "@/lib/useUrlSearch";
import { cn, formatDate } from "@/lib/utils";

type JournalIndexProps = {
  posts: PostCardData[];
  copy: {
    categoriesLabel: string;
    all: string;
    categories: readonly PostCategory[];
    searchLabel: string;
    searchPlaceholder: string;
    featuredLabel: string;
    readingTime: string;
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
  if (query.trim()) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  return params;
}

/**
 * An editorial index rather than a card grid: one featured post with a large cover, then rows of
 * date · title · topic · reading time separated by hairlines. Topic filters are text links and
 * search is a single underlined field. The URL holds the state, so every view can be shared.
 */
export function JournalIndex({ posts, copy }: JournalIndexProps) {
  const state = readState(useUrlSearch(), copy.categories);
  const searchId = useId();

  function update(next: Partial<State>) {
    setUrlSearch(toParams({ ...state, ...next, page: next.page ?? 1 }));
  }

  if (posts.length === 0) {
    return <p className="max-w-xl text-lg text-fg-muted">{copy.none}</p>;
  }

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

  const filters: { id: PostCategory | null; label: string }[] = [
    { id: null, label: copy.all },
    ...copy.categories.map((category) => ({ id: category, label: category })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-rule pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div
          role="group"
          aria-label={copy.categoriesLabel}
          className="flex flex-wrap gap-x-6 gap-y-1"
        >
          {filters.map((filter) => {
            const on = filter.id === state.category;
            return (
              <button
                key={filter.label}
                type="button"
                aria-pressed={on}
                onClick={() => update({ category: filter.id })}
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
        <div className="w-full lg:max-w-xs">
          <label htmlFor={searchId} className="label-mono text-fg-muted">
            {copy.searchLabel}
          </label>
          <input
            id={searchId}
            type="search"
            value={state.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder={copy.searchPlaceholder}
            className="mt-1 block min-h-11 w-full border-b border-fg-muted/50 bg-transparent text-body text-fg placeholder:text-fg-muted/70 focus-visible:border-accent focus-visible:outline-none"
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {matches.length} {matches.length === 1 ? "post" : "posts"} found
      </p>

      {showFeatured ? (
        <article className="grid items-center gap-8 border-b border-rule py-12 lg:grid-cols-12 lg:gap-12">
          <Link
            href={`/journal/${featured.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            className="relative block aspect-[16/10] overflow-hidden rounded-card border border-rule bg-night-900 lg:col-span-7"
          >
            <Image
              src={featured.cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              unoptimized={isUnoptimized(featured.cover)}
              className="object-cover"
            />
          </Link>
          <div className="lg:col-span-5">
            <p className="label-mono text-accent">
              {copy.featuredLabel} · {featured.category}
            </p>
            <h2 className="mt-4 text-h2 text-fg">
              <Link href={`/journal/${featured.slug}`} className="hover:text-accent">
                {featured.title}
              </Link>
            </h2>
            <p className="mt-4 text-fg-muted">{featured.description}</p>
            <p className="mt-5 label-mono text-fg-muted">
              <time dateTime={featured.date}>{formatDate(featured.date)}</time> ·{" "}
              {featured.readingMinutes} {copy.readingTime}
            </p>
          </div>
        </article>
      ) : null}

      {pagePosts.length > 0 ? (
        <ul>
          {pagePosts.map((post) => (
            <li key={post.slug} className="border-b border-rule">
              <Link
                href={`/journal/${post.slug}`}
                className="group grid gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-fg-muted md:col-span-2"
                >
                  {formatDate(post.date, { day: "2-digit", month: "short", year: "numeric" })}
                </time>
                <span className="font-display-soft text-2xl leading-snug text-fg group-hover:text-accent md:col-span-6">
                  {post.title}
                </span>
                <span className="label-mono text-accent md:col-span-2">{post.category}</span>
                <span className="flex items-center justify-between gap-3 font-mono text-xs text-fg-muted md:col-span-2">
                  {post.readingMinutes} {copy.readingTime}
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 text-accent transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : matches.length === 0 ? (
        <div className="py-12">
          <p className="text-lg text-fg-muted">{copy.empty}</p>
          <button
            type="button"
            onClick={() => update({ category: null, query: "" })}
            className="mt-4 min-h-11 link-underline font-semibold text-accent"
          >
            {copy.clear}
          </button>
        </div>
      ) : null}

      {pageCount > 1 ? (
        <nav
          aria-label={copy.paginationLabel}
          className="mt-10 flex items-center gap-4 font-mono text-sm"
        >
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => update({ page: number })}
              aria-label={`Page ${number}`}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-button border",
                number === page
                  ? "border-lamp-500 text-fg"
                  : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              {number}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

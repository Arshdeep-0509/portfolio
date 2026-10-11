import { postCategories } from "@/lib/contentTypes";

/**
 * Copy for /journal and the shared parts of /journal/[slug].
 * Posts themselves are MDX files in content/journal/ — add a file, get a page.
 */

export const journalContent = {
  seo: {
    title: "Journal — Notes on MVPs, AI and DevOps",
    description:
      "Practical write-ups on building first versions, adding AI that pays its way and running dependable infrastructure, from a full-stack, AI and DevOps engineer in India.",
  },
  hero: {
    title: "Journal",
    text: "Working notes on first versions, useful AI and infrastructure that stays up.",
  },
  index: {
    categoriesLabel: "Show posts about",
    all: "Everything",
    categories: postCategories,
    searchLabel: "Search the journal",
    searchPlaceholder: "Words from a title or summary",
    featuredLabel: "Featured",
    readingTime: "min read",
    pageSize: 12,
    empty: "No post matches that search yet.",
    clear: "Clear the search and filters",
    none: "The first posts are being written. Add your email in the footer to hear when they're out.",
    paginationLabel: "Journal pages",
    columns: { date: "Date", title: "Title", category: "Topic", time: "Reading time" },
  },
  post: {
    toc: "In this post",
    share: "Pass it on",
    copy: "Copy the link",
    copied: "Link copied",
    related: "Keep reading",
    relatedServices: "Services this post relates to",
    draft: "Draft — not published",
    updated: "updated",
    author: {
      bio: "I write code across the stack, build AI features and run cloud infrastructure — mostly for founders and teams turning an early idea into a product people rely on.",
      links: [
        { label: "More about me", href: "/about" },
        { label: "Start a conversation", href: "/contact" },
      ],
    },
  },
  rss: { title: "Journal" },
};

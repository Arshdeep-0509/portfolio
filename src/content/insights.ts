import { postCategories } from "@/lib/contentTypes";

/**
 * Copy for /insights and the shared parts of /insights/[slug].
 * Posts themselves are MDX files in content/insights/ — add a file, get a page.
 */

export const insightsContent = {
  seo: {
    title: "Insights on MVPs, AI & DevOps",
    description:
      "Practical notes on building MVPs, AI features and reliable infrastructure — from a full-stack, AI and DevOps engineer in India.",
  },
  hero: {
    eyebrow: "Insights",
    title: "Insights",
    subtitle: "Practical notes on building MVPs, AI features and reliable infrastructure.",
  },
  browser: {
    categoriesLabel: "Filter posts by category",
    all: "All",
    categories: postCategories,
    searchLabel: "Search posts",
    searchPlaceholder: "Search titles and summaries…",
    featuredLabel: "Featured",
    pageSize: 9,
    empty: "No posts match that search yet.",
    clear: "Clear search and filters",
    none: "The first articles are being written. Subscribe below and you'll hear when they're published.",
    paginationLabel: "Posts pagination",
  },
  newsletter: {
    title: "Get new articles by email",
    text: "Occasional, practical notes on MVPs, AI and infrastructure. No spam — unsubscribe any time.",
    emailLabel: "Email address",
    submit: "Subscribe",
    success: "Thanks! You're on the list.",
    error: "Something went wrong. Please try again in a moment.",
    privacy: { label: "Privacy policy", href: "/privacy-policy" },
  },
  post: {
    toc: "On this page",
    share: "Share this article",
    copied: "Link copied",
    related: "Related articles",
    relatedServices: "Services related to this article",
    author: {
      bio: "Full-stack, AI and DevOps engineer helping founders and growing businesses turn ideas into fast, reliable products.",
      links: [
        { label: "About me", href: "/about" },
        { label: "Work with me", href: "/contact" },
      ],
    },
  },
};

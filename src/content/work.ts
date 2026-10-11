import type { CaseStudyCategory } from "@/lib/contentTypes";

/**
 * Copy for /work and the shared parts of /work/[slug].
 * Case studies themselves are MDX files in content/work/ — add a file, get a page.
 */

export const workContent = {
  seo: {
    title: "Selected Work — Web, Mobile, AI & DevOps Projects",
    description:
      "Products I've designed, built and shipped, written up honestly: the problem, the approach and what came of it. Web, mobile, AI and DevOps work.",
  },
  hero: {
    label: "Selected work",
    title: "Selected work",
    text: "Products I've designed, built and run — the problem, how I approached it and what happened next.",
  },
  filters: {
    label: "Show work of type",
    all: "Everything",
    options: [
      { id: "web", label: "Web" },
      { id: "mobile", label: "Mobile" },
      { id: "ai", label: "AI" },
      { id: "devops", label: "DevOps" },
      { id: "design", label: "Design" },
    ] satisfies { id: CaseStudyCategory; label: string }[],
  },
  empty: {
    filtered: "Nothing in that category yet.",
    clear: "Show everything",
    none: "Write-ups are on their way. Meanwhile, I'm glad to walk you through my work on a call.",
  },
  row: { status: "Status", year: "Year", role: "Role", cta: "Read the case study" },
  status: {
    live: "Live",
    "in-development": "In development",
    concept: "Concept",
  },
  detail: {
    factsTitle: "Project facts",
    facts: {
      client: "Client",
      role: "Role",
      timeline: "Timeline",
      stack: "Stack",
      status: "Status",
    },
    links: { live: "Open the live product", github: "Read the source on GitHub" },
    contents: "Chapters",
    sections: {
      problem: "The problem",
      goals: "What it had to do",
      approach: "How I approached it",
      architecture: "Architecture",
      features: "Key features",
      screens: "Screens",
      results: "Results",
      next: "What comes next",
    },
    screensHint: "Select a screen to enlarge it.",
    pager: { previous: "Older case study", next: "Newer case study" },
  },
};

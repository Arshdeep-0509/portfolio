import type { CaseStudyCategory } from "@/lib/contentTypes";

/**
 * Copy for /work and the shared parts of /work/[slug].
 * Case studies themselves are MDX files in content/work/ — add a file, get a page.
 */

export const workContent = {
  seo: {
    title: "Work & Case Studies",
    description:
      "Products I've designed, built and shipped — the problem, the approach and what happened. Web, mobile, AI and DevOps case studies.",
  },
  hero: {
    eyebrow: "Work",
    title: "Work & case studies",
    highlight: "case studies",
    subtitle:
      "Products I've designed, built and shipped — the problem, the approach and what happened.",
  },
  filters: {
    label: "Filter case studies by type",
    all: "All",
    options: [
      { id: "web", label: "Web" },
      { id: "mobile", label: "Mobile" },
      { id: "ai", label: "AI" },
      { id: "devops", label: "DevOps" },
      { id: "design", label: "Design" },
    ] satisfies { id: CaseStudyCategory; label: string }[],
  },
  empty: {
    filtered: "No case studies match those filters yet.",
    clear: "Clear filters",
    none: "Case studies are being written up. In the meantime, I'm happy to walk you through my work on a call.",
  },
  card: { cta: "Read case study" },
  status: {
    live: "Live",
    "in-development": "In development",
    concept: "Concept",
  },
  detail: {
    facts: { client: "Client", role: "Role", timeline: "Timeline", stack: "Stack" },
    links: { live: "View live product", github: "View source on GitHub" },
    sections: {
      problem: "The problem",
      goals: "Goals",
      approach: "Approach",
      architecture: "Architecture",
      features: "Key features",
      screens: "Screens",
      results: "Results",
      next: "What I'd do next",
    },
    cta: {
      title: "Want something similar?",
      highlight: "something similar",
      text: "Tell me about your product. You'll get a clear scope, the right stack and an honest timeline — usually within one business day.",
      primary: { label: "Start your project", href: "/contact" },
      secondary: { label: "See all services", href: "/services" },
    },
    pager: { previous: "Previous case study", next: "Next case study" },
  },
};

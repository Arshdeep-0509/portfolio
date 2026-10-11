/**
 * Content constants and card shapes that client components may import.
 * Keep this file free of Node APIs (lib/mdx.ts, which reads the filesystem, imports from here).
 */

export const caseStudyCategories = ["web", "mobile", "ai", "devops", "design"] as const;
export type CaseStudyCategory = (typeof caseStudyCategories)[number];

export const postCategories = ["MVP", "AI", "DevOps", "Design", "Growth"] as const;
export type PostCategory = (typeof postCategories)[number];

export type CaseStudyStatus = "live" | "in-development" | "concept";

/** What a case study card needs — no MDX body. */
export type CaseStudyCardData = {
  slug: string;
  title: string;
  summary: string;
  cover: string;
  coverAlt?: string;
  status: CaseStudyStatus;
  stack: string[];
  categories: CaseStudyCategory[];
};

/** What a post card needs — no MDX body. */
export type PostCardData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: PostCategory;
  cover: string;
  coverAlt?: string;
  readingMinutes: number;
  featured: boolean;
  draft: boolean;
};

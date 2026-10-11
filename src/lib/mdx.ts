import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { z } from "zod";
import { services } from "@/content/services";
import { caseStudyCategories, postCategories } from "@/lib/contentTypes";

export { caseStudyCategories, postCategories };
export type { CaseStudyCategory, PostCategory } from "@/lib/contentTypes";

/**
 * File-based content for /work (case studies) and /journal (posts).
 *
 * Each .mdx file in content/<collection>/ is one entry; the file name is its slug. Frontmatter is
 * validated with zod, so a typo fails the build with a clear message instead of rendering a
 * broken page. Files starting with "_" are ignored.
 *
 * Drafts (`draft: true`) are listed and rendered in development, and excluded everywhere in
 * production — listings, detail pages, the sitemap and RSS. Set SHOW_DRAFTS=true to preview
 * drafts in a production build.
 *
 * No React in this module: the proxy, sitemap and RSS routes import it too.
 */

export type MdxCollection = "work" | "journal";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export const includeDrafts =
  process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "true";

// ---------------------------------------------------------------------------- schemas

/** YAML dates arrive as Date objects; quoted ones as strings. Normalise to "YYYY-MM-DD". */
const isoDate = z
  .union([z.string(), z.date()])
  .transform((value) => (value instanceof Date ? value : new Date(value)))
  .refine((date) => !Number.isNaN(date.getTime()), "Invalid date")
  .transform((date) => date.toISOString().slice(0, 10));

/** Service slugs (src/content/services.ts) this entry relates to; unknown slugs fail the build. */
const serviceSlugs = z
  .array(z.string())
  .default([])
  .refine(
    (slugs) => slugs.every((slug) => services.some((service) => service.slug === slug)),
    "Unknown service slug in services: use slugs from src/content/services.ts",
  );

const image = z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() });

const caseStudySchema = z.object({
  title: z.string(),
  /** Optional; when present it must match the file name. */
  slug: z.string().optional(),
  summary: z.string(),
  cover: z.string(),
  coverAlt: z.string().optional(),
  status: z.enum(["live", "in-development", "concept"]),
  /** A real client name only with written permission; otherwise "Personal product". */
  client: z.string().default("Personal product"),
  role: z.string(),
  /** Optional; the facts sidebar leaves the row out when it's missing. */
  timeline: z.string().optional(),
  stack: z.array(z.string()).default([]),
  categories: z.array(z.enum(caseStudyCategories)).default([]),
  /** Service pages show this case study when it lists their slug. */
  services: serviceSlugs,
  links: z.object({ live: z.string().optional(), github: z.string().optional() }).default({}),
  /** Real, verifiable results only. The Results section is hidden when this is empty. */
  results: z.array(z.string()).default([]),
  publishedAt: isoDate,
  problem: z.string(),
  goals: z.array(z.string()).default([]),
  architecture: image.optional(),
  /** `icon` is a lucide-react icon name, e.g. "ShieldCheck". */
  features: z
    .array(z.object({ icon: z.string(), title: z.string(), text: z.string() }))
    .default([]),
  screens: z.array(image).default([]),
  nextSteps: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: isoDate,
  updated: isoDate.optional(),
  category: z.enum(postCategories),
  tags: z.array(z.string()).default([]),
  /** Linked as related services at the end of the post. List at least one. */
  services: serviceSlugs,
  cover: z.string(),
  coverAlt: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export type CaseStudyMeta = z.infer<typeof caseStudySchema> & { slug: string };
export type PostMeta = z.infer<typeof postSchema> & {
  slug: string;
  readingMinutes: number;
};
export type Heading = { id: string; text: string; level: 2 | 3 };

// ---------------------------------------------------------------------------- reading

type RawEntry = { slug: string; data: Record<string, unknown>; body: string };

function readCollection(collection: MdxCollection): RawEntry[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("_"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return { slug: file.replace(/\.mdx?$/, ""), data, body: content };
    });
}

function parse<T extends z.ZodType>(schema: T, entry: RawEntry, collection: MdxCollection) {
  const result = schema.safeParse(entry.data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/${collection}/${entry.slug}.mdx:\n${issues}`);
  }
  return result.data as z.infer<T>;
}

/** Roughly 200 words a minute, ignoring code blocks. Minimum one minute. */
export function readingMinutes(body: string): number {
  const prose = body.replace(/```[\s\S]*?```/g, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * h2/h3 headings for the table of contents. Ids are generated with github-slugger — the same
 * algorithm rehype-slug uses — so the links match the rendered headings.
 */
export function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[2]!.replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    headings.push({ id: slugger.slug(text), text, level: match[1]!.length as 2 | 3 });
  }
  return headings;
}

// ---------------------------------------------------------------------------- case studies

function loadCaseStudies(): (CaseStudyMeta & { body: string })[] {
  return readCollection("work").map((entry) => {
    const data = parse(caseStudySchema, entry, "work");
    if (data.slug && data.slug !== entry.slug) {
      throw new Error(
        `content/work/${entry.slug}.mdx: frontmatter slug "${data.slug}" must match the file name.`,
      );
    }
    return { ...data, slug: entry.slug, body: entry.body };
  });
}

/** Newest first. Drafts only when includeDrafts is true. */
export function getCaseStudies({ drafts = includeDrafts } = {}): CaseStudyMeta[] {
  return loadCaseStudies()
    .filter((study) => drafts || !study.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(({ body: _body, ...meta }) => meta);
}

export function getCaseStudy(slug: string, { drafts = includeDrafts } = {}) {
  const study = loadCaseStudies().find((entry) => entry.slug === slug);
  if (!study || (study.draft && !drafts)) return undefined;
  return study;
}

// ---------------------------------------------------------------------------- posts

function loadPosts(): (PostMeta & { body: string })[] {
  return readCollection("journal").map((entry) => ({
    ...parse(postSchema, entry, "journal"),
    slug: entry.slug,
    readingMinutes: readingMinutes(entry.body),
    body: entry.body,
  }));
}

/** Newest first. Drafts only when includeDrafts is true. */
export function getPosts({ drafts = includeDrafts } = {}): PostMeta[] {
  return loadPosts()
    .filter((post) => drafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ body: _body, ...meta }) => meta);
}

export function getPost(slug: string, { drafts = includeDrafts } = {}) {
  const post = loadPosts().find((entry) => entry.slug === slug);
  if (!post || (post.draft && !drafts)) return undefined;
  return post;
}

// ---------------------------------------------------------------------------- slugs

/** Slugs that have a public page (drafts excluded in production). Used by the proxy. */
export function getMdxSlugs(collection: MdxCollection): string[] {
  return collection === "work"
    ? getCaseStudies().map((study) => study.slug)
    : getPosts().map((post) => post.slug);
}

/**
 * Cache Components requires generateStaticParams to return at least one entry. When a
 * collection has no published entries yet, this placeholder slug is prerendered as a 404.
 */
export const EMPTY_COLLECTION_SLUG = "__none";

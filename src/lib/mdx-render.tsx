import "server-only";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { rehypeMarkPlaceholders } from "@/lib/rehypeMarkPlaceholders";

/**
 * Compiles MDX bodies on the server (at build time for static pages).
 * Plugins: GitHub-flavoured Markdown, heading ids (rehype-slug, matching extractHeadings), syntax
 * highlighting (rehype-pretty-code + shiki) and visible [PLACEHOLDER] marking.
 */

type MdxComponents = Record<
  string,
  React.ComponentType<never> | ((props: never) => React.ReactNode)
>;

const components = {
  Callout,
  pre: CodeBlock,
  a: ({ href = "", children, ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
  // Markdown images have no known size, so use a lazy native <img>. For hero-sized art, use the
  // frontmatter `cover` (rendered with next/image) instead.
  img: ({ alt = "", ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} loading="lazy" decoding="async" className="rounded-card" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
} satisfies MdxComponents;

/**
 * Renders an MDX body. A cached server component: the MDX compiler and shiki read the clock while
 * compiling, which Cache Components does not allow during prerendering outside a cache scope.
 * Content only changes on deploy, so the result is cached for the life of the build.
 */
export async function MdxContent({ source }: { source: string }) {
  "use cache";
  cacheLife("max");
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "vesper", keepBackground: true }],
      rehypeMarkPlaceholders,
    ],
  });
  return <Content components={components} />;
}

import { EMPTY_COLLECTION_SLUG, getPost, getPosts } from "@/lib/mdx";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

// Blog post share image. Used when the post has no real (raster) cover image.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Article by Arshdeep Singh";

export function generateStaticParams() {
  const slugs = getPosts().map((post) => ({ slug: post.slug }));
  return slugs.length ? slugs : [{ slug: EMPTY_COLLECTION_SLUG }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOgImage({
    eyebrow: post ? `Insights · ${post.category}` : "Insights",
    title: post?.title ?? "Insights",
    subtitle: post ? `${post.readingMinutes} min read` : undefined,
    path: `/insights/${slug}`,
  });
}

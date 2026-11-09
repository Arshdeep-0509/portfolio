import { EMPTY_COLLECTION_SLUG, getCaseStudies, getCaseStudy } from "@/lib/mdx";
import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export function generateStaticParams() {
  const slugs = getCaseStudies().map((study) => ({ slug: study.slug }));
  return slugs.length ? slugs : [{ slug: EMPTY_COLLECTION_SLUG }];
}

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const title = getCaseStudy(params.slug)?.title ?? "Work";
  return [{ id: "card", alt: ogAlt(title), size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderOgImage({ title: getCaseStudy(slug)?.title ?? "Work" });
}

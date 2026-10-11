import { getCaseStudies, getCaseStudy, EMPTY_COLLECTION_SLUG } from "@/lib/mdx";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

// Case study share image. Used when the case study has no real (raster) cover image.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Case study by Arshdeep Singh";

export function generateStaticParams() {
  const slugs = getCaseStudies().map((study) => ({ slug: study.slug }));
  return slugs.length ? slugs : [{ slug: EMPTY_COLLECTION_SLUG }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return renderOgImage({
    eyebrow: "Case study",
    title: study?.title ?? "Work",
    subtitle: study?.summary,
    path: `/work/${slug}`,
  });
}

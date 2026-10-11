import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/layout/CTABand";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import {
  CaseStudyArchitecture,
  CaseStudyBody,
  CaseStudyFacts,
  CaseStudyFeatures,
  CaseStudyNext,
  CaseStudyPager,
  CaseStudyResults,
  CaseStudyScreens,
} from "@/components/sections/work/CaseStudySections";
import { workContent } from "@/content/work";
import { isUnoptimized } from "@/lib/images";
import { EMPTY_COLLECTION_SLUG, getCaseStudies, getCaseStudy } from "@/lib/mdx";
import { MdxContent } from "@/lib/mdx-render";
import { buildMetadata } from "@/lib/seo";

// Await params at the top so unknown slugs return a real HTTP 404. Every valid slug is prerendered,
// so opting out of instant-navigation validation costs nothing here.
export const instant = false;

export function generateStaticParams() {
  const slugs = getCaseStudies().map((study) => ({ slug: study.slug }));
  // Cache Components needs at least one entry; the placeholder slug renders a 404.
  return slugs.length ? slugs : [{ slug: EMPTY_COLLECTION_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return buildMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${study.slug}`,
    // Real cover images become the share image; otherwise ./opengraph-image.tsx renders one.
    image: isUnoptimized(study.cover) ? false : study.cover,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const all = getCaseStudies();
  const index = all.findIndex((entry) => entry.slug === study.slug);
  // The listing is newest first: "previous" is the older study, "next" the newer one.
  const older = all[index + 1];
  const newer = index > 0 ? all[index - 1] : undefined;
  const { cta } = workContent.detail;

  return (
    <>
      <CompactPageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: study.title },
        ]}
        eyebrow={`Case study · ${workContent.status[study.status]}`}
        title={study.title}
        subtitle={study.summary}
        aside={
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/20 shadow-card-hover">
            <Image
              src={study.cover}
              alt={study.coverAlt ?? ""}
              fill
              preload
              sizes="(min-width: 1024px) 416px, 100vw"
              unoptimized={isUnoptimized(study.cover)}
              className="object-cover"
            />
          </div>
        }
      />
      <CaseStudyFacts study={study} />
      <CaseStudyBody study={study} approach={<MdxContent source={study.body} />} />
      <CaseStudyArchitecture study={study} />
      <CaseStudyFeatures study={study} />
      <CaseStudyScreens study={study} />
      <CaseStudyResults study={study} />
      <CaseStudyNext study={study} />
      {/* In-page CTA (the layout band is switched off for case studies in ctaBandOverrides.ts),
          so it sits before the previous / next links. */}
      <CTABand
        title={cta.title}
        highlight={cta.highlight}
        text={cta.text}
        primary={cta.primary}
        secondary={cta.secondary}
      />
      <CaseStudyPager
        previous={older && { slug: older.slug, title: older.title }}
        next={newer && { slug: newer.slug, title: newer.title }}
      />
    </>
  );
}

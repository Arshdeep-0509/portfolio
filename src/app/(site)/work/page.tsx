import { WorkBrowser } from "@/components/sections/work/WorkBrowser";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { Section } from "@/components/ui/Section";
import { workContent } from "@/content/work";
import { getCaseStudies } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: workContent.seo.title,
  description: workContent.seo.description,
  path: "/work",
});

export default function WorkPage() {
  const { hero } = workContent;
  // Only card fields go to the client — never the MDX bodies.
  const studies = getCaseStudies().map((study) => ({
    slug: study.slug,
    title: study.title,
    summary: study.summary,
    cover: study.cover,
    coverAlt: study.coverAlt,
    status: study.status,
    stack: study.stack,
    categories: study.categories,
  }));

  return (
    <>
      <CompactPageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Work" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />
      <Section background="section" aria-labelledby="case-studies-title">
        {/* Keeps the outline h1 → h2 → card h3 without adding visible text. */}
        <h2 id="case-studies-title" className="sr-only">
          Case studies
        </h2>
        <WorkBrowser studies={studies} copy={workContent} />
      </Section>
    </>
  );
}

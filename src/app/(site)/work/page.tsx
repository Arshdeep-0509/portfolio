import { WorkIndex } from "@/components/sections/work/WorkIndex";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { workContent } from "@/content/work";
import { getCaseStudies } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: workContent.seo.title,
  description: workContent.seo.description,
  path: "/work",
});

/** "Selected work": text-link filters, then alternating full-width project rows. */
export default function WorkPage() {
  const { hero } = workContent;
  // Only row fields go to the client — never the MDX bodies.
  const studies = getCaseStudies().map((study) => ({
    slug: study.slug,
    title: study.title,
    summary: study.summary,
    cover: study.cover,
    coverAlt: study.coverAlt,
    status: study.status,
    stack: study.stack,
    categories: study.categories,
    role: study.role,
    publishedAt: study.publishedAt,
  }));

  return (
    <Section tone="ivory" padding="none" className="pt-16 pb-24 lg:pt-24 lg:pb-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1 className="text-h1 text-fg lg:col-span-7">{hero.title}</h1>
        <p className="text-lg text-fg-muted lg:col-span-4 lg:col-start-9">{hero.text}</p>
      </div>
      <div className="mt-14">
        <WorkIndex studies={studies} copy={workContent} />
      </div>
    </Section>
  );
}

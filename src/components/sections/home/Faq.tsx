import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/content/faqs";
import { homeContent, type SectionCopy } from "@/content/home";

/**
 * FAQ accordion plus matching FAQPage structured data. Defaults to the home page FAQs
 * (faqs.ts); other pages pass their own copy and questions.
 */
export function Faq({
  copy = homeContent.faq,
  items = faqs,
}: {
  copy?: SectionCopy;
  items?: { q: string; a: string }[];
}) {
  return (
    <Section id={copy.id} background="section">
      <SectionHeading title={copy.title} highlight={copy.highlight} subtitle={copy.subtitle} />
      <Accordion
        className="mx-auto mt-12 max-w-3xl"
        items={items.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
    </Section>
  );
}

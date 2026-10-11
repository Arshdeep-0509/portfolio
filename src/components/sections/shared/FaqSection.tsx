import { FaqJsonLd } from "@/components/sections/shared/FaqJsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Section, type SectionTone } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type FaqSectionProps = {
  id?: string;
  index?: number;
  label: string;
  title: string;
  emphasis?: string;
  intro?: string;
  items: { q: string; a: string }[];
  tone?: SectionTone;
};

/** Questions on a page: header, hairline accordion and matching FAQPage structured data. */
export function FaqSection({
  id = "faq",
  index,
  label,
  title,
  emphasis,
  intro,
  items,
  tone = "ivory",
}: FaqSectionProps) {
  return (
    <Section id={id} tone={tone} aria-labelledby={`${id}-title`}>
      <SectionHeader
        id={`${id}-title`}
        index={index}
        label={label}
        title={title}
        emphasis={emphasis}
        intro={intro ? <p>{intro}</p> : undefined}
      />
      <div className="mt-12 lg:grid lg:grid-cols-12">
        <Accordion
          className="lg:col-span-8 lg:col-start-5"
          items={items.map((faq) => ({ question: faq.q, answer: faq.a }))}
        />
      </div>
      <FaqJsonLd items={items} />
    </Section>
  );
}

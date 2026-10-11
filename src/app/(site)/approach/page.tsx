import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqSection } from "@/components/sections/shared/FaqSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ComparisonMatrix } from "@/components/ui/ComparisonMatrix";
import { Emphasis } from "@/components/ui/Emphasis";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { approachContent } from "@/content/approach";
import { buildMetadata } from "@/lib/seo";
import { cn, pad2 } from "@/lib/utils";

export const metadata = buildMetadata({
  title: approachContent.seo.title,
  description: approachContent.seo.description,
  path: "/approach",
});

/**
 * Manifesto (night) · My commitments (ivory) · Is this a fit? (sand) · Your options, honestly
 * (ivory) · Why it works (night) · links to the process and handover kit (sand) · Questions.
 */
export default function ApproachPage() {
  const { manifesto, commitments, fit, comparison, why, links, faq } = approachContent;

  return (
    <>
      <Section
        tone="night"
        underHeader
        padding="none"
        className="overflow-hidden pt-[calc(var(--header-h)+4rem)] pb-24 lg:pt-[calc(var(--header-h)+6rem)] lg:pb-32"
        aria-labelledby="approach-title"
      >
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Approach" }]} />
        <h1 id="approach-title" className="mt-8 label-mono text-lamp-400">
          {manifesto.title}
        </h1>
        <ol className="mt-10 space-y-6 lg:space-y-10">
          {manifesto.statements.map((statement, index) => (
            <li
              key={statement.text}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-4 lg:grid-cols-[4rem_minmax(0,1fr)]"
            >
              <span className="font-mono text-sm text-mist-300">{pad2(index + 1)}</span>
              <p
                data-reveal="mask"
                style={{ transitionDelay: `${index * 450}ms` }}
                className="headline max-w-[22ch] font-display-soft text-h1 text-fg"
              >
                <Emphasis text={statement.text} emphasis={statement.emphasis} />
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-14 grid gap-6 border-t border-line-dark pt-8 lg:grid-cols-12">
          <p className="label-mono text-mist-300 lg:col-span-4">{manifesto.note}</p>
          <p className="text-fg-muted lg:col-span-7 lg:col-start-6">
            <PlaceholderText text={manifesto.intro} />
          </p>
        </div>
      </Section>

      <Section id={commitments.id} tone="ivory" aria-labelledby="commitments-title">
        <SectionHeader
          id="commitments-title"
          index={1}
          label={commitments.label}
          title={commitments.title}
          emphasis={commitments.emphasis}
        />
        <dl className="mt-14 border-t border-rule font-mono">
          {commitments.items.map((item) => (
            <div
              key={item.term}
              className="grid gap-2 border-b border-rule py-6 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <dt className="text-small text-fg-muted md:col-span-3">{item.term}</dt>
              <dd className="text-2xl text-accent md:col-span-3">
                <PlaceholderText text={item.value} />
              </dd>
              <dd className="font-sans text-fg md:col-span-6">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id={fit.id} tone="sand" aria-labelledby="fit-title">
        <SectionHeader
          id="fit-title"
          index={2}
          label={fit.label}
          title={fit.title}
          emphasis={fit.emphasis}
        />
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          {[
            { title: fit.forTitle, items: fit.forItems, mark: "+", good: true },
            { title: fit.notForTitle, items: fit.notForItems, mark: "−", good: false },
          ].map((column) => (
            <div key={column.title}>
              <h3 className="text-h3 text-fg">{column.title}</h3>
              <ul className="mt-5 border-t border-rule">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="flex min-h-14 items-center gap-4 border-b border-rule py-3 text-fg"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-4 font-mono text-lg",
                        column.good ? "text-success-fg" : "text-danger-fg",
                      )}
                    >
                      {column.mark}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              {!column.good ? (
                <p className="mt-4 text-small text-fg-muted">{fit.notForNote}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section id={comparison.id} tone="ivory" aria-labelledby="options-title">
        <SectionHeader
          id="options-title"
          index={3}
          label={comparison.label}
          title={comparison.title}
          emphasis={comparison.emphasis}
          intro={<p>{comparison.data.intro}</p>}
        />
        <ComparisonMatrix
          id="comparison"
          data={comparison.data}
          criteriaLabel={comparison.criteriaLabel}
          className="mt-14"
        />
      </Section>

      <Section id={why.id} tone="night-900" aria-labelledby="why-title">
        <SectionHeader
          id="why-title"
          index={4}
          label={why.label}
          title={why.title}
          emphasis={why.emphasis}
        />
        <ol className="mt-14 border-t border-line-dark">
          {why.items.map((item, index) => (
            <RevealItem
              as="li"
              key={item.title}
              index={index}
              className="grid gap-3 border-b border-line-dark py-8 md:grid-cols-12 md:gap-8"
            >
              <h3
                className={cn(
                  "text-h3 text-fg md:col-span-5",
                  index % 2 === 1 && "md:order-2 md:col-start-8",
                )}
              >
                <span className="mr-3 font-mono text-sm text-lamp-400">{pad2(index + 1)}</span>
                {item.title}
              </h3>
              <p
                className={cn(
                  "text-fg-muted md:col-span-6",
                  index % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-7",
                )}
              >
                {item.text}
              </p>
            </RevealItem>
          ))}
        </ol>
      </Section>

      <Section id={links.id} tone="sand" padding="tight" aria-labelledby="more-title">
        <p className="label-mono text-accent">
          ({pad2(5)}) {links.label}
        </p>
        <h2 id="more-title" className="mt-4 text-h3 text-fg">
          {links.title}
        </h2>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-card border border-rule bg-line md:grid-cols-2">
          {links.items.map((link) => (
            <li key={link.href} className="bg-sand-100">
              <Link
                href={link.href}
                className="group flex h-full items-start justify-between gap-6 p-6"
              >
                <span>
                  <span className="block font-display-soft text-xl text-fg group-hover:text-accent">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-small text-fg-muted">{link.text}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 size-5 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection
        index={6}
        label={faq.label}
        title={faq.title}
        emphasis={faq.emphasis}
        items={faq.items}
      />
    </>
  );
}

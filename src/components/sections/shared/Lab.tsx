import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChipList } from "@/components/ui/Chip";
import { ScrollSnapRow } from "@/components/ui/ScrollSnapRow";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusDot } from "@/components/ui/StatusDot";
import { homeContent } from "@/content/home";
import { labItems } from "@/content/products";
import { getCaseStudies } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * "From the lab" on night: my own products and the free scoping call in a scroll-snap row, then
 * the two newest case studies as text links. Used on About.
 */
export function Lab({ index, id = "lab" }: { index: number; id?: string }) {
  const { lab } = homeContent;
  const featured = getCaseStudies().slice(0, 2);

  return (
    <Section id={id} tone="sky" aria-labelledby={`${id}-title`}>
      <SectionHeader
        id={`${id}-title`}
        index={index}
        label={lab.label}
        title={lab.title}
        emphasis={lab.emphasis}
        intro={<p>{lab.intro}</p>}
      />
      <ScrollSnapRow label={lab.carouselLabel} itemWidth="min(88%, 27rem)" className="mt-14">
        {labItems.map((item) => {
          const external = /^https?:\/\//.test(item.cta.href);
          return (
            <li
              key={item.slug}
              className={cn(
                "flex flex-col rounded-card border p-7 transition-colors duration-300 hover:border-link",
                item.kind === "offer"
                  ? "border-border bg-surface-raised"
                  : "border-border bg-surface-raised/60",
              )}
            >
              <StatusDot status={item.status.kind} label={item.status.label} />
              <h3 className="mt-5 text-h3 text-ink">{item.name}</h3>
              <p className="mt-3 text-small text-ink-muted">{item.description}</p>
              {item.bullets ? (
                <ul className="mt-4 space-y-2 text-small text-ink">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-1.5 shrink-0 rounded-dot bg-ink-muted"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ChipList items={item.facts} className="mt-5" />
              {item.note ? <p className="mt-4 text-small text-ink-muted">{item.note}</p> : null}
              <div className="mt-auto pt-6">
                <Button
                  href={item.cta.href}
                  variant={item.kind === "offer" ? "flame" : "text-link"}
                  size={item.kind === "offer" ? "sm" : undefined}
                  data-cta={`lab-${item.slug}`}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.cta.label}
                  {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </Button>
              </div>
            </li>
          );
        })}
      </ScrollSnapRow>

      {featured.length > 0 ? (
        <div className="mt-16">
          <p className="label-text text-ink-muted">{lab.caseStudiesTitle}</p>
          <ul className="mt-4 border-t border-border">
            {featured.map((study) => (
              <li key={study.slug} className="border-b border-border">
                <Link
                  href={`/work/${study.slug}`}
                  className="group flex min-h-20 flex-col justify-center gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="text-2xl font-semibold text-ink transition-colors group-hover:text-link">
                    {study.title}
                  </span>
                  <span className="flex items-center gap-3 text-small text-ink-muted">
                    <span className="max-w-md">{study.summary}</span>
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 shrink-0 text-link transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}

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
    <Section id={id} tone="night" aria-labelledby={`${id}-title`}>
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
                "flex flex-col rounded-card border p-7 transition-[border-color,box-shadow] duration-300 hover:border-lamp-500 hover:shadow-glow",
                item.kind === "offer"
                  ? "border-lamp-500/50 bg-night-800"
                  : "border-line-dark bg-night-800/60",
              )}
            >
              <StatusDot status={item.status.kind} label={item.status.label} />
              <h3 className="mt-5 text-h3 text-fg">{item.name}</h3>
              <p className="mt-3 text-small text-fg-muted">{item.description}</p>
              {item.bullets ? (
                <ul className="mt-4 space-y-2 text-small text-fg">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-1.5 shrink-0 rounded-dot bg-lamp-500"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ChipList items={item.facts} className="mt-5" />
              {item.note ? (
                <p className="mt-4 text-small text-mist-300 italic">{item.note}</p>
              ) : null}
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
          <p className="label-mono text-mist-300">{lab.caseStudiesTitle}</p>
          <ul className="mt-4 border-t border-line-dark">
            {featured.map((study) => (
              <li key={study.slug} className="border-b border-line-dark">
                <Link
                  href={`/work/${study.slug}`}
                  className="group flex min-h-20 flex-col justify-center gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="font-display-soft text-2xl text-fg transition-colors group-hover:text-lamp-400">
                    {study.title}
                  </span>
                  <span className="flex items-center gap-3 text-small text-fg-muted">
                    <span className="max-w-md">{study.summary}</span>
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 shrink-0 text-lamp-400 transition-transform group-hover:translate-x-1"
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

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { TechChip } from "@/components/ui/Chip";
import { cardBase, cardHover } from "@/components/ui/cards/Card";
import type { CaseStudyCardData, CaseStudyStatus } from "@/lib/contentTypes";
import { isUnoptimized } from "@/lib/images";
import { cn } from "@/lib/utils";

const statusVariant: Record<CaseStudyStatus, BadgeVariant> = {
  live: "live",
  "in-development": "in-development",
  concept: "outline",
};

type CaseStudyCardProps = {
  study: CaseStudyCardData;
  statusLabels: Record<CaseStudyStatus, string>;
  ctaLabel: string;
  className?: string;
};

/**
 * 16:10 cover, status badge, title, one-line outcome, tech chips and a "Read case study" cue.
 * The title link is stretched over the card, so the whole card is clickable while its accessible
 * name stays just the title. Client-safe (no server-only imports).
 */
export function CaseStudyCard({ study, statusLabels, ctaLabel, className }: CaseStudyCardProps) {
  return (
    <article
      className={cn(
        cardBase,
        cardHover,
        "group relative flex h-full flex-col overflow-hidden p-0",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-soft">
        <Image
          src={study.cover}
          alt={study.coverAlt ?? ""}
          fill
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
          unoptimized={isUnoptimized(study.cover)}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <Badge variant={statusVariant[study.status]} className="absolute top-4 left-4 shadow-card">
          {statusLabels[study.status]}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-h3 font-bold">
          <Link
            href={`/work/${study.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {study.title}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{study.summary}</p>
        {study.stack.length > 0 ? (
          <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-1.5">
            {study.stack.slice(0, 6).map((tech) => (
              <li key={tech}>
                <TechChip>{tech}</TechChip>
              </li>
            ))}
          </ul>
        ) : null}
        <p
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-small font-semibold text-primary"
        >
          {ctaLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
        </p>
      </div>
    </article>
  );
}

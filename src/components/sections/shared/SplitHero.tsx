import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconTile } from "@/components/ui/IconTile";
import { Illustration } from "@/components/ui/Illustration";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { IconName } from "@/content/services";

/** Entrance stagger, in ms. CSS-only so the hero paints without waiting for JavaScript. */
const stagger = (step: number) => ({ animationDelay: `${step * 90}ms` });

/**
 * Split diagonal hero (home and /contact). ≥1024px: a --grad-hero panel on the left with a diagonal right edge and
 * the illustration on white. Below that: the gradient spans full width, illustration underneath.
 */
export type SplitHeroProps = {
  /** Optional breadcrumb above the eyebrow (inner pages). */
  breadcrumb?: BreadcrumbItem[];
  eyebrow: string;
  /** Rendered on two lines; the second is highlighted. */
  titleLines: [string, string];
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  trust?: string[];
  illustration: { src: string; alt: string; width: number; height: number };
  floatingCards?: { icon: IconName; label: string }[];
};

export function SplitHero({
  breadcrumb,
  eyebrow,
  titleLines,
  subtitle,
  primaryCta,
  secondaryCta,
  trust = [],
  illustration,
  floatingCards = [],
}: SplitHeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-surface">
      {/* Desktop gradient panel. Its diagonal edge ends exactly at the centre line, so the text
          column (which stops 32px short of centre) never crosses it at any viewport width. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 hidden w-[calc(50%+160px)] bg-grad-hero [clip-path:polygon(0_0,100%_0,calc(100%-160px)_100%,0_100%)] lg:block"
      />

      <div className="lg:container-site lg:grid lg:min-h-[88vh] lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
        {/* Copy */}
        <div className="tone-gradient bg-grad-hero px-4 py-16 text-white sm:px-6 sm:py-20 lg:bg-none lg:p-0">
          <div className="max-w-xl">
            {breadcrumb ? (
              <div className="mb-8 animate-hero-in" style={stagger(0)}>
                <Breadcrumb items={breadcrumb} jsonLd />
              </div>
            ) : null}
            <div className="animate-hero-in" style={stagger(0)}>
              <Badge variant="eyebrow-dark">{eyebrow}</Badge>
            </div>
            <h1
              id="hero-title"
              className="mt-6 animate-hero-rise text-h1 font-extrabold tracking-tight text-white"
              style={stagger(1)}
            >
              {titleLines[0]}
              <br />
              {/* --sky-200 rather than --sky-400: on the gradient's brightest stop sky-400 is 2.7:1. */}
              <span className="text-tone-highlight">{titleLines[1]}</span>
            </h1>
            <p
              className="mt-6 max-w-[520px] animate-hero-in text-body text-white"
              style={stagger(2)}
            >
              {subtitle}
            </p>
            <div
              className="mt-8 flex animate-hero-in flex-col gap-3 sm:flex-row sm:flex-wrap"
              style={stagger(3)}
            >
              <Button href={primaryCta.href} variant="white" size="lg" data-cta="hero">
                {primaryCta.label}
              </Button>
              <Button href={secondaryCta.href} variant="ghost-light" size="lg" data-cta="hero">
                {secondaryCta.label}
              </Button>
            </div>
            {trust.length > 0 ? (
              <ul
                className="mt-8 flex animate-hero-in flex-col gap-x-6 gap-y-2.5 text-small text-white sm:flex-row sm:flex-wrap"
                style={stagger(4)}
              >
                {trust.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-tone-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* Illustration */}
        <div className="px-4 py-12 sm:px-6 lg:p-0">
          <div className="relative mx-auto max-w-[560px] animate-hero-art-in" style={stagger(2)}>
            <Illustration
              name={illustration.src}
              width={illustration.width}
              height={illustration.height}
              alt={illustration.alt}
              preload
              className="w-full"
            />
            {floatingCards.map((card, index) => (
              <div
                key={card.label}
                className={
                  index === 0
                    ? "absolute top-0 left-0 sm:top-[14%] sm:-left-4"
                    : "absolute right-0 bottom-0 sm:-right-2 sm:bottom-[10%]"
                }
              >
                <div
                  className="tone-light flex animate-bob items-center gap-3 rounded-lg border border-border bg-surface px-3.5 py-2.5 shadow-card-hover"
                  style={{ animationDelay: `${index * 2}s` }}
                >
                  <IconTile icon={card.icon} size="sm" />
                  <span className="text-small font-semibold whitespace-nowrap text-ink">
                    {card.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

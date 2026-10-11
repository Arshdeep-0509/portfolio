import { Badge } from "@/components/ui/Badge";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type Action = { label: string; href: string };

type CompactPageHeroProps = {
  breadcrumb: BreadcrumbItem[];
  eyebrow?: string;
  /** Rendered above the eyebrow, e.g. an on-dark IconTile. */
  icon?: React.ReactNode;
  title: string;
  /** Part of `title` coloured with the tone highlight (sky-200 on this gradient). */
  highlight?: string;
  subtitle?: string;
  /** Extra copy under the subtitle, e.g. a service summary. */
  children?: React.ReactNode;
  primaryCta?: Action;
  secondaryCta?: Action;
  /** Right-hand column (illustration or card). Control its visibility per breakpoint via className. */
  aside?: React.ReactNode;
  asideClassName?: string;
};

/**
 * Inner-page hero on --grad-hero: breadcrumb, eyebrow, H1, subtitle and two actions, with an
 * optional right-hand column. Shorter than the home hero; text colours follow the gradient tone.
 */
export function CompactPageHero({
  breadcrumb,
  eyebrow,
  icon,
  title,
  highlight,
  subtitle,
  children,
  primaryCta,
  secondaryCta,
  aside,
  asideClassName,
}: CompactPageHeroProps) {
  const index = highlight ? title.indexOf(highlight) : -1;

  return (
    <section
      aria-labelledby="page-title"
      className="tone-gradient relative isolate overflow-hidden bg-grad-hero text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dots" />
      <Container className="py-12 sm:py-16 lg:py-20">
        <Breadcrumb items={breadcrumb} jsonLd />
        <div
          className={cn(
            "mt-8 grid items-center gap-10",
            aside && "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16",
          )}
        >
          <div className="max-w-2xl">
            {icon ? <div className="mb-5">{icon}</div> : null}
            {eyebrow ? <Badge variant="eyebrow-dark">{eyebrow}</Badge> : null}
            <h1
              id="page-title"
              className={cn("text-h1 font-extrabold tracking-tight text-white", eyebrow && "mt-5")}
            >
              {index >= 0 ? (
                <>
                  {title.slice(0, index)}
                  <span className="text-tone-highlight">{highlight}</span>
                  {title.slice(index + (highlight?.length ?? 0))}
                </>
              ) : (
                title
              )}
            </h1>
            {subtitle ? <p className="mt-5 text-lg text-white">{subtitle}</p> : null}
            {children}
            {primaryCta || secondaryCta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryCta ? (
                  <Button href={primaryCta.href} variant="white" size="lg" data-cta="page-hero">
                    {primaryCta.label}
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    href={secondaryCta.href}
                    variant="ghost-light"
                    size="lg"
                    data-cta="page-hero"
                  >
                    {secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
          {aside ? <div className={asideClassName}>{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}

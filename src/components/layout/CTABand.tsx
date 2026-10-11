import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { defaultCTABand, type CTABandContent } from "@/content/ctaBand";

type CTABandProps = Partial<CTABandContent>;

/**
 * Full-width call to action above the footer. Every field falls back to src/content/ctaBand.ts,
 * so a page can override just the title, the text or a button.
 */
export function CTABand(props: CTABandProps) {
  const { title, highlight, text, primary, secondary } = { ...defaultCTABand, ...props };
  // Only keep the default highlight if the title still contains it.
  const highlightText = highlight && title.includes(highlight) ? highlight : undefined;

  return (
    <section
      aria-labelledby="cta-band-title"
      className="tone-gradient relative isolate overflow-hidden bg-grad-cta text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dots" />
      <Container className="flex flex-col items-center section-y text-center">
        <SectionHeading
          id="cta-band-title"
          title={title}
          highlight={highlightText}
          subtitle={text}
        />
        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button
            href={primary.href}
            data-cta="cta-band"
            variant="white"
            size="lg"
            rightIcon={<ArrowRight aria-hidden="true" className="size-5" />}
          >
            {primary.label}
          </Button>
          {secondary ? (
            <Button href={secondary.href} variant="ghost-light" size="lg" data-cta="cta-band">
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

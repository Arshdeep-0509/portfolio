import { PullQuote } from "@/components/ui/PullQuote";
import { Section } from "@/components/ui/Section";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { isPlaceholder } from "@/lib/constants";

/**
 * One large serif pull-quote at a time. Renders nothing — not even an empty wrapper — while the
 * testimonials flag is off, and never shows placeholder entries ("[ADD REAL TESTIMONIAL]").
 */
export function Testimonials() {
  if (!siteConfig.featureFlags.testimonials) return null;
  const real = testimonials.filter((item) => !isPlaceholder(item.quote));
  if (real.length === 0) return null;

  const copy = homeContent.testimonials;
  return (
    <Section id={copy.id} tone="night-900" aria-label={copy.label}>
      <p className="label-mono text-accent">{copy.label}</p>
      <div className="mt-8">
        <PullQuote items={real} label={copy.label} />
      </div>
    </Section>
  );
}

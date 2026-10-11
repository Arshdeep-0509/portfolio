import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { isPlaceholder } from "@/lib/constants";

/**
 * Renders nothing — not even an empty wrapper — while the testimonials flag is off.
 * As a second guard, placeholder entries ("[ADD REAL TESTIMONIAL]") are never shown.
 */
export function Testimonials() {
  if (!siteConfig.featureFlags.testimonials) return null;
  const real = testimonials.filter((item) => !isPlaceholder(item.quote));
  if (real.length === 0) return null;

  const copy = homeContent.testimonials;
  return (
    <Section id={copy.id} background="white">
      <SectionHeading title={copy.title} highlight={copy.highlight} subtitle={copy.subtitle} />
      <div className="mt-12">
        <TestimonialCarousel items={real} label={copy.title} />
      </div>
    </Section>
  );
}

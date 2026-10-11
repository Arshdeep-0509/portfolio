import { ServicePicker } from "@/components/sections/services/ServicePicker";
import { Button } from "@/components/ui/Button";
import { ServiceLinkCard } from "@/components/ui/cards/ServiceLinkCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";
import { servicesPage } from "@/content/servicesPage";

/** "Not sure where to start?": scoping-call pitch on the left, three-question picker on the right. */
export function ServiceStart() {
  const copy = servicesPage.picker;

  return (
    <Section id={copy.id} background="tint">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <SectionHeading align="left" title={copy.title} highlight={copy.highlight} />
          <div className="mt-6 space-y-4 text-muted">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Button href={copy.scopingCta.href} variant="outline" className="mt-8">
            {copy.scopingCta.label}
          </Button>
        </div>
        <ServicePicker
          questions={copy.questions}
          copy={copy}
          cards={Object.fromEntries(
            services.map((service) => [
              service.slug,
              <ServiceLinkCard
                key={service.slug}
                as="h4"
                href={`/services/${service.slug}`}
                icon={service.icon}
                title={service.title}
                tagline={service.tagline}
              />,
            ]),
          )}
        />
      </div>
    </Section>
  );
}

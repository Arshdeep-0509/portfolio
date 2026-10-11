import { ServiceNavigator } from "@/components/sections/services/ServiceNavigator";
import { ServiceLinkCard } from "@/components/ui/cards/ServiceLinkCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceGroups, services } from "@/content/services";
import { servicesPage } from "@/content/servicesPage";

/** "Core services": filterable grid of all services. Cards render here so icons stay server-side. */
export function ServiceList() {
  const copy = servicesPage.navigator;

  return (
    <Section id={copy.id} background="section">
      <SectionHeading title={copy.title} highlight={copy.highlight} subtitle={copy.subtitle} />
      <ServiceNavigator
        filters={[
          { id: "all", label: copy.allLabel },
          ...serviceGroups.map((group) => ({ id: group.id, label: group.label })),
        ]}
        cards={services.map((service) => ({
          slug: service.slug,
          group: service.group,
          node: (
            <ServiceLinkCard
              href={`/services/${service.slug}`}
              icon={service.icon}
              title={service.title}
              tagline={service.tagline}
            />
          ),
        }))}
      />
    </Section>
  );
}

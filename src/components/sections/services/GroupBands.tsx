import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { IconTile } from "@/components/ui/IconTile";
import { Section } from "@/components/ui/Section";
import { getServicesByGroup, serviceGroups } from "@/content/services";
import { servicesPage } from "@/content/servicesPage";

/**
 * One band per service group: name and description on the left, its services on the right with
 * a two-line summary, up to three headline deliverables and a "Learn more" link.
 * Summary falls back to the tagline; the deliverables list hides until services.ts has them.
 */
export function GroupBands() {
  return (
    <Section background="white" aria-label="Services by group">
      <div className="divide-y divide-border">
        {serviceGroups.map((group) => {
          const groupServices = getServicesByGroup(group.id);
          return (
            <div
              key={group.id}
              id={`group-${group.id}`}
              className="grid gap-8 py-12 first:pt-0 last:pb-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14"
            >
              <div>
                <p className="font-mono text-eyebrow font-medium text-muted uppercase">
                  {String(groupServices.length).padStart(2, "0")} services
                </p>
                <h2 className="mt-2 text-h2 font-extrabold tracking-tight">{group.label}</h2>
                <p className="mt-3 text-muted">{group.description}</p>
              </div>
              <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                {groupServices.map((service) => {
                  const headline = (service.deliverables ?? []).slice(0, 3);
                  return (
                    <li key={service.slug} className="flex gap-4">
                      <IconTile icon={service.icon} size="sm" />
                      <div className="min-w-0">
                        <h3 className="text-body font-bold">{service.title}</h3>
                        <p className="mt-1 line-clamp-2 text-small text-muted">
                          {service.summary ?? service.tagline}
                        </p>
                        {headline.length > 0 ? (
                          <ul className="mt-3 space-y-1.5 text-small text-ink">
                            {headline.map((item) => (
                              <li key={item} className="flex gap-2">
                                <CircleCheck
                                  aria-hidden="true"
                                  className="mt-0.5 size-4 shrink-0 text-primary"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <Link
                          href={`/services/${service.slug}`}
                          className="group mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-small font-semibold text-primary hover:underline"
                        >
                          {servicesPage.groupBands.learnMore}
                          <span className="sr-only"> about {service.title}</span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                          />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

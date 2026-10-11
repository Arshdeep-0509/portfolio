import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { GlassCard } from "@/components/ui/cards/GlassCard";
import { IconTile } from "@/components/ui/IconTile";
import type { ServiceEntry } from "@/content/services";
import { serviceDetailCopy } from "@/content/servicesPage";

/** Service hero with an "At a glance" glass card. Rows without data hide themselves. */
export function ServiceHero({
  service,
  hasProcess,
}: {
  service: ServiceEntry;
  hasProcess: boolean;
}) {
  const copy = serviceDetailCopy;
  const idealFor = service.idealFor ?? [];

  return (
    <CompactPageHero
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: service.title },
      ]}
      icon={<IconTile icon={service.icon} variant="on-dark" size="lg" />}
      title={service.title}
      subtitle={service.tagline}
      primaryCta={{ label: copy.heroCtas.quote, href: `/contact?service=${service.slug}` }}
      // "See the process" only when there is a #process section to land on.
      secondaryCta={hasProcess ? { label: copy.heroCtas.process, href: "#process" } : undefined}
      aside={
        <GlassCard>
          <h2 className="text-h3 font-bold text-white">{copy.atAGlance.title}</h2>
          <dl className="mt-5 space-y-5 text-small">
            {service.typicalTimeline ? (
              <div>
                <dt className="font-mono text-eyebrow font-medium uppercase">
                  {copy.atAGlance.timelineLabel}
                </dt>
                <dd className="mt-1 text-body font-semibold text-white">
                  {service.typicalTimeline}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono text-eyebrow font-medium uppercase">
                {copy.atAGlance.modelsLabel}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {copy.atAGlance.engagementModels.map((model) => (
                  <span
                    key={model}
                    className="rounded-pill border border-white/25 bg-white/10 px-3 py-1 font-semibold text-white"
                  >
                    {model}
                  </span>
                ))}
              </dd>
            </div>
            {idealFor.length > 0 ? (
              <div>
                <dt className="font-mono text-eyebrow font-medium uppercase">
                  {copy.atAGlance.idealForLabel}
                </dt>
                <dd className="mt-2">
                  <ul className="list-disc space-y-1 pl-5 text-white marker:text-tone-accent">
                    {idealFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </GlassCard>
      }
    >
      {service.summary ? <p className="mt-4 text-white">{service.summary}</p> : null}
    </CompactPageHero>
  );
}

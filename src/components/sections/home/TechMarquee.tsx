import { Icon } from "@/components/ui/Icon";
import { Marquee } from "@/components/ui/Marquee";
import { homeContent } from "@/content/home";

/** Thin strip of tools under the hero. The list lives in home.ts → techMarquee. */
export function TechMarquee() {
  const { techMarquee } = homeContent;

  return (
    <section aria-label={techMarquee.label} className="border-y border-border bg-surface">
      <div className="container-site flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:gap-8">
        <p className="shrink-0 font-mono text-eyebrow font-medium text-muted uppercase">
          {techMarquee.label}
        </p>
        <Marquee
          className="min-w-0 flex-1"
          label={techMarquee.label}
          duration={50}
          items={techMarquee.items.map((tool) => (
            <span
              key={tool.name}
              className="inline-flex items-center gap-2 text-small font-semibold whitespace-nowrap text-muted"
            >
              <Icon icon={tool.icon} className="size-4 text-primary" />
              {tool.name}
            </span>
          ))}
        />
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/Button";
import { EditorialList } from "@/components/ui/EditorialList";
import { Emphasis } from "@/components/ui/Emphasis";
import { Section } from "@/components/ui/Section";
import { homeContent } from "@/content/home";
import { pad2 } from "@/lib/utils";

/** "Principles" on sand: a sticky overview on the left, six numbered principles on the right. */
export function Principles({ index }: { index: number }) {
  const { principles } = homeContent;
  return (
    <Section id={principles.id} tone="sand" aria-labelledby="principles-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <p className="flex items-center gap-4 label-mono text-accent">
              ({pad2(index)}) {principles.label}
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </p>
            <h2 id="principles-title" data-reveal="mask" className="mt-8 text-h2 text-fg">
              <Emphasis text={principles.title} emphasis={principles.emphasis} />
            </h2>
            <div className="mt-6 space-y-4 text-fg-muted">
              {principles.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Button href={principles.link.href} variant="text-link" className="mt-4">
              {principles.link.label}
            </Button>
          </div>
        </div>
        <EditorialList items={principles.items} className="lg:col-span-7" />
      </div>
    </Section>
  );
}

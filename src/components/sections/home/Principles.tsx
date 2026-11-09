import { Button } from "@/components/ui/Button";
import { EditorialList } from "@/components/ui/EditorialList";
import { Emphasis } from "@/components/ui/Emphasis";
import { Section } from "@/components/ui/Section";
import { homeContent } from "@/content/home";
import { pad2 } from "@/lib/utils";

/** "Principles": a sticky overview on the left, the six habits on the right. Not a sequence, so not numbered. */
export function Principles({ index }: { index: number }) {
  const { principles } = homeContent;
  return (
    <Section id={principles.id} tone="surface" aria-labelledby="principles-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <p className="flex label-text items-center gap-4 text-ink-muted">
              ({pad2(index)}) {principles.label}
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </p>
            <h2 id="principles-title" data-reveal="mask" className="mt-8 text-h2 text-ink">
              <Emphasis text={principles.title} emphasis={principles.emphasis} />
            </h2>
            <div className="mt-6 space-y-4 text-ink-muted">
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

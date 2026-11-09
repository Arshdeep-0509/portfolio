import { ChevronRight } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { cn, pad2 } from "@/lib/utils";

export type StackBand = {
  id: string;
  label: string;
  /** One short line on what this layer does. */
  note: string;
  chips: string[];
};

/**
 * Layered bands in a dark mono panel, matching the file tree: a label column on the left, the
 * tools as chips on the right. Hovering (or focusing) one band dims the others, pure CSS through
 * :has(), so it costs no JavaScript and degrades to a plain list.
 */
export function StackMap({ bands, className }: { bands: StackBand[]; className?: string }) {
  return (
    <ol
      data-theme="dark"
      className={cn(
        "group/stack rounded-card border border-border bg-surface-raised px-5 font-mono text-ink sm:px-8",
        className,
      )}
    >
      {bands.map((band, index) => (
        <li
          key={band.id}
          data-band=""
          tabIndex={0}
          className={cn(
            "grid gap-4 border-b border-border py-6 transition-opacity duration-300 last:border-b-0 md:grid-cols-12 md:gap-8",
            "group-has-[[data-band]:focus-visible]/stack:opacity-35 group-has-[[data-band]:hover]/stack:opacity-35",
            "hover:!opacity-100 focus-visible:!opacity-100",
          )}
        >
          <div className="md:col-span-4">
            <p className="text-xs text-ink-muted">
              {pad2(index + 1)} <span aria-hidden="true">—</span> layer
            </p>
            <h3 className="mt-2 flex items-center gap-1.5 font-mono text-body font-normal text-ink">
              <ChevronRight aria-hidden="true" strokeWidth={2} className="size-4 text-link" />
              {band.label}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">{band.note}</p>
          </div>
          <ul className="flex flex-wrap content-start gap-2 md:col-span-8 md:pt-1">
            {band.chips.map((chip) => (
              <li key={chip}>
                <Chip className="bg-surface px-3 py-2 font-mono text-xs">{chip}</Chip>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

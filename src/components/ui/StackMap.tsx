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
 * Horizontal layered bands: a label column on the left, the tools as chips on the right.
 * Hovering (or focusing) one band dims the others — pure CSS through :has(), so it costs no
 * JavaScript and degrades to a plain list.
 */
export function StackMap({ bands, className }: { bands: StackBand[]; className?: string }) {
  return (
    <ol className={cn("group/stack border-t border-rule", className)}>
      {bands.map((band, index) => (
        <li
          key={band.id}
          data-band=""
          tabIndex={0}
          className={cn(
            "grid gap-4 border-b border-rule py-6 transition-opacity duration-300 md:grid-cols-12 md:gap-8",
            "group-has-[[data-band]:focus-visible]/stack:opacity-35 group-has-[[data-band]:hover]/stack:opacity-35",
            "hover:!opacity-100 focus-visible:!opacity-100",
          )}
        >
          <div className="md:col-span-4">
            <p className="label-mono text-accent">
              {pad2(index + 1)} <span aria-hidden="true">—</span> layer
            </p>
            <h3 className="mt-2 text-h3 text-fg">{band.label}</h3>
            <p className="mt-1 text-small text-fg-muted">{band.note}</p>
          </div>
          <ul className="flex flex-wrap content-start gap-2 md:col-span-8 md:pt-1">
            {band.chips.map((chip) => (
              <li key={chip}>
                <Chip className="bg-field px-3 py-2 text-[13px]">{chip}</Chip>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

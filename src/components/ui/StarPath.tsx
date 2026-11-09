import { Star } from "@/components/brand/Star";
import { cn, pad2 } from "@/lib/utils";

export type StarPathItem = {
  title?: string;
  text: React.ReactNode;
  /** A short note on the step, such as how long it takes. */
  meta?: React.ReactNode;
};

/**
 * A real sequence as a vertical star path: a dotted line with a small star at each step, gold on
 * the hovered step. The line is drawn per step, so it ends at the last star on any background.
 * Scroll-driven steps use the same parts in StickyScrollStory.
 */
export function StarPath({
  items,
  numbered = false,
  className,
}: {
  items: StarPathItem[];
  /** Show 01, 02… beside each title. */
  numbered?: boolean;
  className?: string;
}) {
  return (
    <ol className={className}>
      {items.map((item, index) => (
        <li key={index} className="group relative pb-8 pl-8 last:pb-0">
          {index < items.length - 1 ? (
            <span aria-hidden="true" className="absolute top-6 bottom-1 left-1.5 star-path" />
          ) : null}
          <Star className="absolute top-1 left-0 size-3.5 text-ink-muted transition-colors duration-300 group-hover:text-accent" />
          <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-6">
            <div>
              {item.title ? (
                <h3 className="font-sans text-body font-semibold text-ink">
                  {numbered ? (
                    <span className="mr-3 text-sm font-normal text-ink-muted tabular-nums">
                      {pad2(index + 1)}
                    </span>
                  ) : null}
                  {item.title}
                </h3>
              ) : null}
              <div className={cn(item.title ? "mt-1 text-ink-muted" : "text-small text-ink")}>
                {item.text}
              </div>
            </div>
            {item.meta ? (
              <p className="mt-2 label-text whitespace-nowrap text-ink-muted sm:mt-0">
                {item.meta}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** What you get, as a checklist with small gold stars. */
export function StarChecklist({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-8 border-t border-border sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex min-h-14 items-center gap-3 border-b border-border py-3 text-ink"
        >
          <Star className="size-3 shrink-0 text-accent" />
          <span className="font-medium">{item}</span>
        </li>
      ))}
    </ul>
  );
}

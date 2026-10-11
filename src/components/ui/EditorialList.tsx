import { RevealItem } from "@/components/ui/Reveal";
import { cn, pad2 } from "@/lib/utils";

export type EditorialItem = {
  title: string;
  text: React.ReactNode;
  /** Optional small mono line under the text. */
  meta?: React.ReactNode;
};

type EditorialListProps = {
  items: EditorialItem[];
  /** Number of the first row. Default 1. */
  start?: number;
  /** Heading level of each row title. Default "h3". */
  headingLevel?: "h3" | "h4";
  /** "wide" puts the title and text side by side from lg; "stacked" keeps them in one column. */
  layout?: "wide" | "stacked";
  className?: string;
};

/**
 * Rows separated by hairlines, each with a large serif numeral, a title and a short text —
 * an index, not a grid of cards.
 */
export function EditorialList({
  items,
  start = 1,
  headingLevel: Heading = "h3",
  layout = "stacked",
  className,
}: EditorialListProps) {
  return (
    <ol className={cn("border-t border-rule", className)}>
      {items.map((item, index) => (
        <RevealItem
          as="li"
          key={item.title}
          index={index}
          className={cn(
            "grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 border-b border-rule py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-8",
          )}
        >
          <span
            aria-hidden="true"
            className="font-display-soft text-[2.5rem] leading-none text-accent sm:text-[3.25rem]"
          >
            {pad2(start + index)}
          </span>
          <div className={cn(layout === "wide" && "lg:grid lg:grid-cols-12 lg:gap-8")}>
            <Heading className={cn("text-h3 text-fg", layout === "wide" && "lg:col-span-5")}>
              {item.title}
            </Heading>
            <div className={cn("mt-2 text-fg-muted", layout === "wide" && "lg:col-span-7 lg:mt-1")}>
              <div>{item.text}</div>
              {item.meta ? <div className="mt-3 label-mono text-accent">{item.meta}</div> : null}
            </div>
          </div>
        </RevealItem>
      ))}
    </ol>
  );
}

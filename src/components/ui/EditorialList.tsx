import { RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export type EditorialItem = {
  title: string;
  text: React.ReactNode;
  /** Optional small line under the text. */
  meta?: React.ReactNode;
};

type EditorialListProps = {
  items: EditorialItem[];
  /** Heading level of each row title. Default "h3". */
  headingLevel?: "h3" | "h4";
  /** "wide" puts the title and text side by side from lg; "stacked" keeps them in one column. */
  layout?: "wide" | "stacked";
  className?: string;
};

/**
 * Rows separated by hairlines, each with a title and a short text: an index, not a grid of cards.
 * Unnumbered, because nothing listed here is a sequence. Numbers are for real steps.
 */
export function EditorialList({
  items,
  headingLevel: Heading = "h3",
  layout = "stacked",
  className,
}: EditorialListProps) {
  return (
    <ul className={cn("border-t border-border", className)}>
      {items.map((item, index) => (
        <RevealItem
          as="li"
          key={item.title}
          index={index}
          className={cn(
            "border-b border-border py-8",
            layout === "wide" && "lg:grid lg:grid-cols-12 lg:gap-8",
          )}
        >
          <Heading className={cn("text-h3 text-ink", layout === "wide" && "lg:col-span-5")}>
            {item.title}
          </Heading>
          <div className={cn("mt-2 text-ink-muted", layout === "wide" && "lg:col-span-7 lg:mt-1")}>
            <div>{item.text}</div>
            {item.meta ? <div className="mt-3 label-text text-ink-muted">{item.meta}</div> : null}
          </div>
        </RevealItem>
      ))}
    </ul>
  );
}

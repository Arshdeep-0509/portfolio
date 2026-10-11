import { cardBase, CheckList } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type InfoCardProps = {
  heading: string;
  /** Optional line under the heading. */
  text?: string;
  items: string[];
  /** Numbered steps instead of check marks. */
  ordered?: boolean;
  /** Optional closing line under the list. */
  footer?: string;
  className?: string;
};

/** Heading + check list (or numbered steps) on a faint grid, with a thin --primary top border. */
export function InfoCard({
  heading,
  text,
  items,
  ordered = false,
  footer,
  className,
}: InfoCardProps) {
  return (
    <div className={cn(cardBase, "border-t-2 border-t-primary bg-grid", className)}>
      <h3 className="text-h3 font-bold">{heading}</h3>
      {text ? <p className="mt-2 text-small text-muted">{text}</p> : null}
      {ordered ? (
        <ol className="mt-5 space-y-4">
          {items.map((item, index) => (
            <li key={item} className="flex gap-3.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-primary font-mono text-small font-medium text-white">
                {index + 1}
              </span>
              <span className="pt-1 text-ink">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <CheckList items={items} className="mt-5" />
      )}
      {footer ? (
        <p className="mt-6 border-t border-border pt-4 text-small font-semibold text-muted">
          {footer}
        </p>
      ) : null}
    </div>
  );
}

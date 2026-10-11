import { cn } from "@/lib/utils";

/** Shared white card surface: 16px radius, 28px padding, soft shadow. Always light-toned. */
export const cardBase =
  "tone-light rounded-lg border border-border/70 bg-surface p-card shadow-card";

/** Lift 4px and deepen the shadow on hover. No movement under reduced motion. */
export const cardHover =
  "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0";

type CardProps = React.ComponentProps<"div"> & { interactive?: boolean };

export function Card({ interactive = false, className, ...props }: CardProps) {
  return <div className={cn(cardBase, interactive && cardHover, className)} {...props} />;
}

/** Check-mark bullet list used inside several cards. */
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-2 text-small text-tone-muted", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="mt-1 size-4 shrink-0 text-tone-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

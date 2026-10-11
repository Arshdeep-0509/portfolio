import { cn } from "@/lib/utils";

/**
 * Mono chip for technologies and short facts ("Next.js", "2–6 weeks"). Hairline border, 4px
 * corners — never a pill. Colours follow the section tone.
 */
export function Chip({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-card border border-rule px-2.5 py-1 font-mono text-xs leading-none text-fg",
        className,
      )}
      {...props}
    />
  );
}

/** A wrapped list of chips. */
export function ChipList({
  items,
  label,
  className,
}: {
  items: string[];
  /** Accessible name for the list, e.g. "Tools". */
  label?: string;
  className?: string;
}) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

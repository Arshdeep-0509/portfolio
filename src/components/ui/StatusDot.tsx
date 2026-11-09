import { cn } from "@/lib/utils";

export type StatusKind = "available" | "limited" | "booked" | "live" | "in-development" | "concept";

/** Default labels; pass `label` to override (e.g. from a content file). */
export const statusLabels: Record<StatusKind, string> = {
  available: "Available",
  limited: "Limited",
  booked: "Booked",
  live: "Live",
  "in-development": "In development",
  concept: "Concept",
};

const dotClass: Record<StatusKind, string> = {
  available: "bg-success",
  live: "bg-success",
  limited: "bg-ink-muted",
  "in-development": "bg-ink-muted",
  booked: "bg-ink-muted",
  concept: "bg-ink-muted ring-1 ring-ink-muted",
};

/**
 * A small dot plus a text label. The label always carries the meaning, so the state never
 * depends on colour alone. The only fully rounded shape on the site.
 */
export function StatusDot({
  status,
  label,
  mono = true,
  className,
}: {
  status: StatusKind;
  label?: React.ReactNode;
  /** Label style (default) or body text. */
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-ink",
        mono ? "label-text" : "text-small font-medium",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-dot", dotClass[status])} />
      {label ?? statusLabels[status]}
    </span>
  );
}

import type { Availability } from "@/content/site";
import { cn } from "@/lib/utils";

const states: Record<Availability, { label: string; badge: string; dot: string }> = {
  available: {
    label: "Available for new projects",
    badge: "bg-success-soft text-success-strong",
    dot: "bg-success",
  },
  limited: {
    label: "Limited availability",
    badge: "bg-amber-500 text-navy-950",
    dot: "bg-navy-950",
  },
  booked: {
    label: "Fully booked",
    badge: "bg-tint text-muted",
    dot: "bg-subtle",
  },
};

/**
 * Availability pill driven by siteConfig.availability. The state is carried by the text label
 * (not just the dot colour), so it reads correctly for everyone.
 */
export function AvailabilityBadge({
  status,
  className,
}: {
  status: Availability;
  className?: string;
}) {
  const state = states[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3 py-1 text-small font-semibold",
        state.badge,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2 rounded-pill", state.dot)} />
      {state.label}
    </span>
  );
}

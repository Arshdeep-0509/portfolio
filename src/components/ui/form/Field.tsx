import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared look for text-like controls: a 1px box with a 10px radius on --surface, 48px tall, label
 * always above. The border is --ink-muted rather than --border: a control's edge has to reach 3:1.
 * Focus uses the site-wide ring; aria-invalid turns the border red.
 */
export const controlClasses = cn(
  "block min-h-12 w-full rounded-button border border-ink-muted bg-surface px-4 py-3 text-body text-ink",
  "transition-colors duration-200 placeholder:text-ink-muted hover:border-ink focus-visible:border-link",
  "aria-invalid:border-danger aria-invalid:hover:border-danger",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

type LabelProps = React.ComponentProps<"label"> & { required?: boolean };

export function Label({ required = false, className, children, ...props }: LabelProps) {
  return (
    <label className={cn("mb-2 block text-small font-semibold text-ink", className)} {...props}>
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : null}
    </label>
  );
}

/** Error message. Give it an id and reference it from the control's aria-describedby. */
export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p id={id} className={cn("mt-2 flex items-center gap-1.5 text-small text-danger", className)}>
      <CircleAlert aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
      {children}
    </p>
  );
}

export function HelperText({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p id={id} className={cn("mt-2 text-small text-ink-muted", className)}>
      {children}
    </p>
  );
}

import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared look for text-like controls: a hairline box with a 4px radius, 48px tall, label above.
 * Focus draws a lamp-coloured ring; aria-invalid turns the border red. Colours follow the tone.
 */
export const controlClasses = cn(
  "block min-h-12 w-full rounded-card border border-rule bg-field px-4 py-3 text-body text-fg",
  "transition-[border-color,box-shadow] duration-200 placeholder:text-fg-muted/75 hover:border-fg-muted/60",
  "focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--lamp-500)_28%,transparent)] focus-visible:outline-none",
  "aria-invalid:border-danger aria-invalid:hover:border-danger",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

type LabelProps = React.ComponentProps<"label"> & { required?: boolean };

export function Label({ required = false, className, children, ...props }: LabelProps) {
  return (
    <label className={cn("mb-2 block text-small font-semibold text-fg", className)} {...props}>
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="ml-0.5 text-danger-fg">
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
    <p
      id={id}
      className={cn("mt-2 flex items-center gap-1.5 text-small text-danger-fg", className)}
    >
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
    <p id={id} className={cn("mt-2 text-small text-fg-muted", className)}>
      {children}
    </p>
  );
}

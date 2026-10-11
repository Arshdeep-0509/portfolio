import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared look for text-like controls: 44px min height, visible border, red when aria-invalid. */
export const controlClasses = cn(
  "tone-light block min-h-11 w-full rounded-md border border-subtle bg-surface px-4 py-2.5 text-body text-ink",
  "transition-colors duration-200 placeholder:text-subtle hover:border-muted",
  "focus-visible:border-primary",
  "aria-invalid:border-danger aria-invalid:hover:border-danger",
  "disabled:cursor-not-allowed disabled:bg-bg disabled:opacity-70",
);

type LabelProps = React.ComponentProps<"label"> & { required?: boolean };

export function Label({ required = false, className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn("mb-1.5 block text-small font-semibold text-tone-fg", className)}
      {...props}
    >
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
    <p id={id} className={cn("mt-1.5 flex items-center gap-1.5 text-small text-danger", className)}>
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
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
    <p id={id} className={cn("mt-1.5 text-small text-tone-muted", className)}>
      {children}
    </p>
  );
}

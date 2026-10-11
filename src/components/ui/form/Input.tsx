import { ChevronDown } from "lucide-react";
import { controlClasses } from "@/components/ui/form/Field";
import { cn } from "@/lib/utils";

type InvalidProp = {
  /** Sets aria-invalid, which turns the border red. Pair with a <FieldError> via aria-describedby. */
  invalid?: boolean;
};

export function Input({
  invalid,
  className,
  ...props
}: React.ComponentProps<"input"> & InvalidProp) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlClasses, className)}
      {...props}
    />
  );
}

type SelectProps = React.ComponentProps<"select"> &
  InvalidProp & {
    /** Disabled first option shown until a choice is made. */
    placeholder?: string;
  };

/** Native <select> (best keyboard and mobile support) with a thin chevron. */
export function Select({ invalid, placeholder, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(controlClasses, "appearance-none pr-11", className)}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-muted"
      />
    </div>
  );
}

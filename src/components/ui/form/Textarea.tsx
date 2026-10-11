"use client";

import { useId, useState } from "react";
import { controlClasses } from "@/components/ui/form/Field";
import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  invalid?: boolean;
  /** Show "120 / 1000" under the field. Requires maxLength. Default true when maxLength is set. */
  showCount?: boolean;
};

export function Textarea({
  invalid,
  showCount,
  maxLength,
  onChange,
  value,
  defaultValue,
  className,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const counterId = useId();
  const [length, setLength] = useState(String(value ?? defaultValue ?? "").length);
  const withCount = (showCount ?? maxLength !== undefined) && maxLength !== undefined;
  // Controlled usage: trust the value prop over internal state.
  const count = value !== undefined ? String(value).length : length;
  const nearLimit = maxLength !== undefined && count >= maxLength * 0.9;

  return (
    <div>
      <textarea
        aria-invalid={invalid || undefined}
        aria-describedby={cn(describedBy, withCount && counterId) || undefined}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          setLength(event.target.value.length);
          onChange?.(event);
        }}
        className={cn(controlClasses, "min-h-36 resize-y leading-relaxed", className)}
        {...props}
      />
      {withCount ? (
        <p
          id={counterId}
          className={cn(
            "mt-2 text-right font-mono text-xs",
            nearLimit ? "text-danger-fg" : "text-fg-muted",
          )}
        >
          {count} / {maxLength}
          <span className="sr-only"> characters</span>
        </p>
      ) : null}
    </div>
  );
}

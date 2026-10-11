import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  label: React.ReactNode;
  invalid?: boolean;
};

/** Native checkbox with a custom box. The whole 44px-tall row is clickable. */
export function Checkbox({ label, invalid, className, id, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn("flex min-h-11 cursor-pointer items-start gap-3 py-2.5", className)}
    >
      <span className="relative mt-0.5 inline-flex size-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          aria-invalid={invalid || undefined}
          className={cn(
            "peer tone-light size-5 shrink-0 cursor-pointer appearance-none rounded-sm border border-subtle bg-surface",
            "transition-colors duration-200 checked:border-primary checked:bg-primary",
            "disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger",
          )}
          {...props}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      </span>
      <span className="text-small text-tone-fg">{label}</span>
    </label>
  );
}

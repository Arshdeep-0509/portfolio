import { cn } from "@/lib/utils";

/**
 * Choice controls built on native inputs, so react-hook-form's register(), the keyboard
 * (Tab / arrows / Space) and screen readers all work without extra code. The inputs are visually
 * hidden; their label is the visible control, and :has() mirrors checked and focus states.
 */

type NativeInput = Omit<React.ComponentProps<"input">, "type" | "children">;

/* ---------------------------------------------------------------- SelectableCard */

type SelectableCardProps = NativeInput & {
  /** "checkbox" for multi-select, "radio" for one-of. */
  kind?: "checkbox" | "radio";
  title: string;
  description?: string;
  /** Optional icon or mono index shown before the title. */
  leading?: React.ReactNode;
};

/** A hairline card that toggles like a checkbox or radio. Selected: an Aurora border and tick. */
export function SelectableCard({
  kind = "checkbox",
  title,
  description,
  leading,
  className,
  id,
  ...props
}: SelectableCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group/choice relative flex min-h-16 cursor-pointer items-start gap-3 rounded-button border border-border bg-surface p-4",
        "transition-[border-color,background-color] duration-200 hover:border-ink-muted",
        "has-[:checked]:border-link has-[:checked]:bg-surface-raised",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
        className,
      )}
    >
      <input id={id} type={kind} className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 inline-flex size-4 shrink-0 items-center justify-center border border-ink-muted transition-colors",
          kind === "radio" ? "rounded-dot" : "rounded-tick",
          "peer-checked:border-link peer-checked:bg-link",
        )}
      >
        <span className="size-1.5 rounded-dot bg-bg opacity-0 group-has-[:checked]/choice:opacity-100" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-semibold text-ink">
          {leading}
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-small text-ink-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/* ---------------------------------------------------------------- SegmentedControl */

type Option = { value: string; label: string };

type GroupProps = {
  /** Accessible name of the group. */
  label: string;
  /** Visually hide the group label (when a visible <Label> already names it). */
  hideLabel?: boolean;
  name: string;
  options: Option[];
  /** Props spread onto every radio, e.g. the result of register("budget"). */
  inputProps?: NativeInput;
  /** Currently selected value, for controlled use. */
  value?: string;
  onValueChange?: (value: string) => void;
  idPrefix: string;
  className?: string;
  describedBy?: string;
};

/** Connected segments on one hairline track (one-of). Wraps onto two rows on narrow screens. */
export function SegmentedControl({
  label,
  hideLabel = true,
  name,
  options,
  inputProps,
  value,
  onValueChange,
  idPrefix,
  className,
  describedBy,
}: GroupProps) {
  return (
    <fieldset className={className} aria-describedby={describedBy}>
      <legend className={cn(hideLabel ? "sr-only" : "mb-2 text-small font-semibold text-ink")}>
        {label}
      </legend>
      <div className="flex flex-wrap overflow-hidden rounded-button border border-border bg-surface">
        {options.map((option, index) => {
          // Index, not value: option values may contain spaces, which ids can't.
          const id = `${idPrefix}-${index}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "relative flex min-h-12 flex-1 basis-[46%] cursor-pointer items-center justify-center border-border px-3 py-2 text-center text-small font-semibold text-ink-muted sm:basis-0",
                "border-r border-b last:border-r-0 sm:border-b-0",
                "transition-colors duration-200 hover:text-ink",
                "has-[:checked]:bg-link has-[:checked]:text-bg",
                "has-[:focus-visible]:z-10 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                className="sr-only"
                {...(value !== undefined
                  ? {
                      checked: value === option.value,
                      onChange: () => onValueChange?.(option.value),
                    }
                  : {})}
                {...inputProps}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------------------------------------------------------------- ChoiceChips */

/** Separate pill chips (one-of). Lighter than a segmented control for short lists. */
export function ChoiceChips({
  label,
  hideLabel = true,
  name,
  options,
  inputProps,
  value,
  onValueChange,
  idPrefix,
  className,
  describedBy,
}: GroupProps) {
  return (
    <fieldset className={className} aria-describedby={describedBy}>
      <legend className={cn(hideLabel ? "sr-only" : "mb-2 text-small font-semibold text-ink")}>
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          // Index, not value: option values may contain spaces, which ids can't.
          const id = `${idPrefix}-${index}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-dot border border-border bg-surface px-4 text-xs font-medium text-ink-muted tabular-nums",
                "transition-colors duration-200 hover:border-ink-muted hover:text-ink",
                "has-[:checked]:border-link has-[:checked]:bg-link has-[:checked]:text-bg",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                className="sr-only"
                {...(value !== undefined
                  ? {
                      checked: value === option.value,
                      onChange: () => onValueChange?.(option.value),
                    }
                  : {})}
                {...inputProps}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ---------------------------------------------------------------- Toggle */

type ToggleProps = NativeInput & { label: React.ReactNode; description?: React.ReactNode };

/** An on/off switch: a native checkbox exposed as role="switch". */
export function Toggle({ label, description, id, className, ...props }: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={cn("flex min-h-11 cursor-pointer items-center justify-between gap-4", className)}
    >
      <span>
        <span className="block text-small font-semibold text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-small text-ink-muted">{description}</span>
        ) : null}
      </span>
      <span className="relative inline-flex h-7 w-12 shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          className="peer absolute inset-0 z-10 cursor-pointer appearance-none rounded-dot"
          {...props}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-dot border border-ink-muted bg-surface transition-colors duration-200 peer-checked:border-link peer-checked:bg-link peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-1 left-1 size-5 rounded-dot bg-ink-muted transition-[transform,background-color] duration-200 peer-checked:translate-x-5 peer-checked:bg-bg"
        />
      </span>
    </label>
  );
}

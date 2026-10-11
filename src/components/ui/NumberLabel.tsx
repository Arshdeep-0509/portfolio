import { cn } from "@/lib/utils";

type NumberLabelProps = {
  /** 1 renders as "01". Strings are shown as-is. */
  number: number | string;
  label?: string;
  className?: string;
};

/** Small mono label such as "01 · FOUNDER-FIRST". Colour follows the section tone. */
export function NumberLabel({ number, label, className }: NumberLabelProps) {
  const num = typeof number === "number" ? String(number).padStart(2, "0") : number;
  return (
    <p className={cn("font-mono text-eyebrow font-medium text-tone-muted uppercase", className)}>
      {label ? `${num} · ${label}` : num}
    </p>
  );
}

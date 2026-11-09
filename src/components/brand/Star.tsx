import { MARK_STAR, MARK_STAR_VIEW_BOX } from "@/components/brand/mark";

/** The logo's four-point star on its own, in the current text colour. Always decorative. */
export function Star({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox={MARK_STAR_VIEW_BOX} className={className}>
      <path d={MARK_STAR} fill="currentColor" />
    </svg>
  );
}

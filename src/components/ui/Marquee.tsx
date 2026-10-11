import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: React.ReactNode[];
  /** Accessible name for the list. */
  label: string;
  /** Seconds for one full loop. Default 40. */
  duration?: number;
  className?: string;
};

/**
 * Infinite horizontal scroll, pure CSS. Pauses on hover and while anything inside has focus.
 * Under reduced motion it becomes a static, wrapping row and the duplicate copy is removed.
 */
export function Marquee({ items, label, duration = 40, className }: MarqueeProps) {
  const style = { "--marquee-duration": `${duration}s` } as React.CSSProperties;

  return (
    <div
      className={cn(
        "group/marquee relative overflow-hidden",
        "mask-x-from-90% mask-x-to-100% motion-reduce:mask-none",
        className,
      )}
    >
      <div
        style={style}
        className="flex w-max animate-marquee group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
      >
        <MarqueeList items={items} label={label} />
        <MarqueeList items={items} label={label} duplicate />
      </div>
    </div>
  );
}

function MarqueeList({
  items,
  label,
  duplicate = false,
}: {
  items: React.ReactNode[];
  label: string;
  duplicate?: boolean;
}) {
  return (
    <ul
      aria-label={duplicate ? undefined : label}
      aria-hidden={duplicate || undefined}
      // The duplicate exists only to make the loop seamless; keep it out of the tab order.
      inert={duplicate}
      className={cn(
        "flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center",
        duplicate && "motion-reduce:hidden",
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="shrink-0">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Scroll reveal without per-element JavaScript. These render plain elements marked `data-reveal`;
 * the single global <RevealObserver> (in Providers) adds `data-revealed` when each one enters the
 * viewport, and CSS in globals.css fades it up 16px. No hydration cost per card.
 *
 * - Reduced motion: no movement (globals.css); content simply appears.
 * - No JavaScript: a <noscript> rule in the root layout shows everything.
 */

type RevealProps = {
  children: React.ReactNode;
  /** Milliseconds to wait before animating. */
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

type RevealGroupProps = {
  children: React.ReactNode;
  /** Milliseconds between consecutive items. Default 80. */
  stagger?: number;
  className?: string;
  as?: "div" | "ul";
};

/** Wraps a grid; each <RevealItem index={i}> waits `index × stagger` ms. */
export function RevealGroup({
  children,
  stagger = 80,
  className,
  as: Tag = "div",
}: RevealGroupProps) {
  return (
    <Tag
      className={className}
      style={{ "--reveal-stagger": `${stagger}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

type RevealItemProps = {
  children: React.ReactNode;
  /** Position in the group, used for the stagger delay. */
  index?: number;
  className?: string;
  as?: "div" | "li";
};

export function RevealItem({ children, index = 0, className, as: Tag = "div" }: RevealItemProps) {
  return (
    <Tag
      data-reveal=""
      className={className}
      style={
        { "--reveal-delay": `calc(${index} * var(--reveal-stagger, 80ms))` } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

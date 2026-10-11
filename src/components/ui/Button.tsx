import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap",
    "transition-[background-color,color,border-color,box-shadow,filter] duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55",
  ],
  {
    variants: {
      variant: {
        /** Primary: the flame gradient with ink text (8.9:1 on --lamp-500, 5.9:1 on --ember-500). */
        flame: "rounded-button bg-grad-flame text-ink-900 hover:shadow-glow hover:brightness-105",
        "solid-ink": "rounded-button bg-ink-900 text-ivory-50 hover:bg-night-800",
        /** Ink on light sections, ivory on night: the colour follows the section tone. */
        outline:
          "rounded-button border border-fg/70 bg-transparent text-fg hover:border-accent hover:text-accent",
        /** Inline text action with an animated underline and a trailing arrow. */
        "text-link": "link-underline rounded-[2px] text-fg hover:text-accent",
      },
      size: {
        sm: "min-h-10 px-4 text-small",
        md: "min-h-12 px-6 text-small",
        lg: "min-h-13 px-7 text-body",
      },
    },
    // Text links keep a 44px tap height without horizontal padding.
    compoundVariants: [{ variant: "text-link", className: "min-h-11 gap-1.5 px-0" }],
    defaultVariants: { variant: "flame", size: "md" },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonOwnProps &
  Omit<React.ComponentProps<"button">, keyof ButtonOwnProps> & { href?: undefined };

type ButtonAsLink = ButtonOwnProps &
  Omit<React.ComponentProps<typeof Link>, keyof ButtonOwnProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Renders a Next.js <Link> when `href` is given, otherwise a <button>. 8px radius, never a pill. */
export function Button({
  variant,
  size,
  leftIcon,
  rightIcon,
  loading = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  // Text links always get a trailing arrow that eases 3px to the right on hover.
  const trailing =
    rightIcon ??
    (variant === "text-link" ? (
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 transition-transform duration-200 ease-out group-hover/button:translate-x-[3px]"
      />
    ) : null);

  const content = (
    <>
      {loading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : leftIcon}
      {children}
      {trailing}
    </>
  );

  const classes = cn(buttonVariants({ variant, size }), className);

  if (rest.href !== undefined) {
    const linkProps = rest as Omit<ButtonAsLink, keyof ButtonOwnProps>;
    return (
      <Link {...linkProps} className={classes} aria-busy={loading || undefined}>
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    disabled,
    ...buttonProps
  } = rest as Omit<ButtonAsButton, keyof ButtonOwnProps>;
  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}

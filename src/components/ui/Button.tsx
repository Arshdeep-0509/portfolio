import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-card hover:bg-primary-hover",
        secondary: "bg-navy-900 text-white shadow-card hover:bg-navy-950",
        outline: "border border-primary bg-surface text-primary hover:bg-soft",
        white: "bg-surface text-navy-900 shadow-card hover:bg-soft",
        "ghost-light": "border border-white/60 text-white hover:border-white hover:bg-white/10",
        // accent-text, not highlight: sky-200 on the gradient is only AA for large text.
        link: "rounded-sm text-tone-accent-text underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-9 px-4 text-small",
        md: "min-h-11 px-6 text-small",
        lg: "min-h-13 px-8 text-body",
      },
    },
    // Text-style links keep a 44px tap height without horizontal padding.
    compoundVariants: [{ variant: "link", className: "min-h-11 px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
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

/** Pill button. Renders a Next.js <Link> when `href` is given, otherwise a <button>. */
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
  // The link variant always gets a trailing arrow that slides 4px on hover.
  const trailing =
    rightIcon ??
    (variant === "link" ? (
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 ease-out group-hover/button:translate-x-1"
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

import Link from "next/link";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** "white" for dark backgrounds such as the footer. */
  tone?: "default" | "white";
  onClick?: () => void;
  className?: string;
};

/** "AS" monogram + wordmark + micro-tagline. The accessible name is just the brand name. */
export function Logo({ tone = "default", onClick, className }: LogoProps) {
  const white = tone === "white";

  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-md", className)}
    >
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-md bg-grad-hero font-heading text-small font-extrabold tracking-wide text-white"
      >
        {siteConfig.brand.monogram}
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-[1.0625rem] font-bold tracking-tight",
            white ? "text-white" : "text-ink",
          )}
        >
          {siteConfig.brand.wordmark}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "mt-1 font-mono text-[9px] font-medium tracking-[0.14em]",
            white ? "text-white/80" : "text-muted",
          )}
        >
          {siteConfig.brand.microTagline}
        </span>
      </span>
    </Link>
  );
}

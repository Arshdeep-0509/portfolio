import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * An image frame with an arched top (999px top corners, 4px bottom) and a soft lamp glow along
 * its edge — the portrait window on /about.
 */
export function ArchFrame({
  src,
  alt,
  width,
  height,
  preload = false,
  unoptimized = false,
  sizes,
  className,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  preload?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  className?: string;
  /** Rendered under the frame, e.g. a status line. */
  children?: React.ReactNode;
}) {
  return (
    <figure className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[999px_999px_16px_16px] border border-border bg-surface-raised">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          preload={preload}
          unoptimized={unoptimized}
          sizes={sizes}
          className="aspect-[4/5] w-full object-cover"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[999px_999px_4px_4px] bg-[radial-gradient(80%_50%_at_50%_0%,var(--glow),transparent_70%)]"
        />
      </div>
      {children ? <figcaption className="mt-4">{children}</figcaption> : null}
    </figure>
  );
}

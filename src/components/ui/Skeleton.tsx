import { cn } from "@/lib/utils";

/**
 * A placeholder block on --surface, for third-party embeds that take time to arrive. Decorative.
 * Don't add a route-level loading.tsx: pages here are prerendered, and that boundary puts this in
 * the first HTML ahead of the real content (templates.spec.ts guards against it).
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block rounded-button bg-surface motion-safe:animate-pulse", className)}
    />
  );
}

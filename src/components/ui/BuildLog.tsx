import { cn } from "@/lib/utils";

/**
 * A dark instrument panel listing the milestones of a project. It stays dark in both themes. The
 * full text is in the DOM from the first frame, so screen readers read the log as a list.
 */
export function BuildLog({
  lines,
  title = "build.log",
  className,
}: {
  lines: string[];
  /** File name shown in the title bar. */
  title?: string;
  className?: string;
}) {
  return (
    <figure
      data-theme="dark"
      className={cn("rounded-card border border-border bg-surface-raised text-ink", className)}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-dot bg-ink-muted/40" />
          <span className="size-2 rounded-dot bg-ink-muted/40" />
          <span className="size-2 rounded-dot bg-ink-muted" />
        </span>
        <figcaption className="ml-2 font-mono text-xs text-ink-muted">{title}</figcaption>
      </div>
      <ol className="space-y-2.5 px-5 py-6 font-mono text-[13px] leading-6 sm:text-sm">
        {lines.map((line) => (
          <li key={line} className="flex items-center justify-between gap-4">
            <span className="whitespace-nowrap text-ink">{line}</span>
            <span aria-hidden="true" className="text-xs text-success">
              ok
            </span>
          </li>
        ))}
        <li aria-hidden="true" className="flex items-center gap-2 text-ink-muted">
          <span className="text-link">$</span>
          <span className="log-caret inline-block h-4 w-2 bg-accent" />
        </li>
      </ol>
    </figure>
  );
}

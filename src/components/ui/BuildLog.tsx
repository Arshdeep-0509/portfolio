import { cn } from "@/lib/utils";

const CHAR_MS = 42;
const PAUSE_MS = 650;
const START_MS = 500;

/** Start time and duration for each line: each one begins after the previous finishes. */
function schedule(lines: string[]) {
  const timed: { line: string; chars: number; delay: number; duration: number }[] = [];
  let delay = START_MS;
  for (const line of lines) {
    const chars = [...line].length;
    const duration = chars * CHAR_MS;
    timed.push({ line, chars, delay, duration });
    delay += duration + PAUSE_MS;
  }
  return { timed, finished: delay };
}

/**
 * A terminal-style card that types its lines out one by one. Pure CSS: a clip-path uncovers each
 * line in `steps(n)` over a mono font, after the previous line finishes, so it costs no JavaScript
 * and never blocks rendering. Under reduced motion every line is simply shown. The full text is
 * always in the DOM, so screen readers read the log as a list.
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
  const { timed, finished } = schedule(lines);

  return (
    <figure
      className={cn(
        "tone-night rounded-card border border-line-dark bg-night-800/80 text-fg backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line-dark px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-dot bg-mist-300/40" />
          <span className="size-2 rounded-dot bg-mist-300/40" />
          <span className="size-2 rounded-dot bg-lamp-500" />
        </span>
        <figcaption className="label-mono text-mist-300">{title}</figcaption>
      </div>
      <ol className="space-y-2.5 px-5 py-6 font-mono text-[13px] leading-6 sm:text-sm">
        {timed.map(({ line, chars, delay: start, duration }) => (
          <li key={line} className="flex items-center justify-between gap-4">
            <span
              className="inline-block whitespace-nowrap text-ivory-50"
              style={{ animation: `log-type ${duration}ms steps(${chars}) ${start}ms both` }}
            >
              {line}
            </span>
            <span
              aria-hidden="true"
              className="text-[11px] tracking-[0.08em] text-success uppercase"
              style={{ animation: `log-fade 300ms ease-out ${start + duration + 120}ms both` }}
            >
              ok
            </span>
          </li>
        ))}
        <li aria-hidden="true" className="flex items-center gap-2 text-mist-300">
          <span className="text-lamp-400">$</span>
          <span
            className="inline-block h-4 w-2 bg-lamp-400"
            style={{ animation: `log-caret 1s steps(1) ${finished}ms 6` }}
          />
        </li>
      </ol>
    </figure>
  );
}

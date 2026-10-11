import { Check, Minus, X } from "lucide-react";
import type { ComparisonData, ComparisonStatus } from "@/content/whyMe";
import { cn } from "@/lib/utils";

/**
 * Comparison of options against criteria.
 * - ≥1024px: a real <table> with a caption, `scope` on every header cell, a sticky first column,
 *   and a keyboard-focusable scroll region when it is wider than the screen.
 * - Below that: one stacked card per option (the table is hidden, so screen readers get one copy).
 * Status is always shown by icon shape and text, never by colour alone; the first column (the
 * recommended option) is highlighted.
 */

const statusMeta: Record<
  ComparisonStatus,
  { label: string; Icon: typeof Check; className: string }
> = {
  yes: { label: "Yes", Icon: Check, className: "bg-success-soft text-success-strong" },
  partial: { label: "Partly", Icon: Minus, className: "bg-tint text-muted" },
  no: { label: "No", Icon: X, className: "bg-danger-soft text-danger" },
};

function StatusIcon({ status }: { status: ComparisonStatus }) {
  const { Icon, className } = statusMeta[status];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-pill",
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.75} />
    </span>
  );
}

function Cell({ status, text }: { status: ComparisonStatus; text: string }) {
  return (
    <span className="flex items-start gap-2.5">
      <StatusIcon status={status} />
      <span>
        <span className="sr-only">{statusMeta[status].label}: </span>
        {text}
      </span>
    </span>
  );
}

type ComparisonTableProps = { data: ComparisonData; id: string; className?: string };

export function ComparisonTable({ data, id, className }: ComparisonTableProps) {
  const captionId = `${id}-caption`;

  return (
    <div className={className}>
      {/* Desktop and tablet: semantic table */}
      <div
        role="region"
        aria-labelledby={captionId}
        tabIndex={0}
        className="tone-light hidden overflow-x-auto rounded-xl border border-border bg-surface shadow-card lg:block"
      >
        <table className="w-full min-w-[52rem] border-collapse text-left text-small">
          <caption id={captionId} className="px-6 pt-5 pb-3 text-left font-semibold text-ink">
            {data.caption}
          </caption>
          <thead>
            <tr className="border-y border-border">
              <th
                scope="col"
                className="sticky left-0 z-10 w-52 bg-surface px-6 py-4 font-mono text-eyebrow font-medium text-muted uppercase"
              >
                Compared on
              </th>
              {data.columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    "px-5 py-4 font-heading text-body font-bold text-ink",
                    index === 0 && "bg-soft text-primary",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-surface px-6 py-4 align-top font-semibold text-ink"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={data.columns[index]}
                    className={cn(
                      "px-5 py-4 align-top text-muted",
                      index === 0 && "bg-soft text-ink",
                    )}
                  >
                    <Cell status={cell.status} text={cell.text} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: one card per option */}
      <ul className="grid gap-4 md:grid-cols-2 lg:hidden">
        {data.columns.map((column, columnIndex) => (
          <li
            key={column}
            className={cn(
              "tone-light rounded-xl border bg-surface p-5 shadow-card",
              columnIndex === 0 ? "border-primary" : "border-border",
            )}
          >
            <h3 className={cn("text-h3 font-bold", columnIndex === 0 && "text-primary")}>
              {column}
            </h3>
            <dl className="mt-4 divide-y divide-border text-small">
              {data.rows.map((row) => {
                const cell = row.cells[columnIndex];
                if (!cell) return null;
                return (
                  <div key={row.label} className="py-3 first:pt-0 last:pb-0">
                    <dt className="font-semibold text-ink">{row.label}</dt>
                    <dd className="mt-1.5 text-muted">
                      <Cell status={cell.status} text={cell.text} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>

      {/* Legend: shape + word, so meaning never depends on colour */}
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small text-muted">
        {(Object.keys(statusMeta) as ComparisonStatus[]).map((status) => (
          <li key={status} className="flex items-center gap-2">
            <StatusIcon status={status} />
            {statusMeta[status].label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-small text-muted">{data.note}</p>
    </div>
  );
}

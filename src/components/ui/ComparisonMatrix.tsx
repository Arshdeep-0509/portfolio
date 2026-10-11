import { Check, Minus, X } from "lucide-react";
import { ScrollSnapRow } from "@/components/ui/ScrollSnapRow";
import type { ComparisonData, ComparisonStatus } from "@/content/approach";
import { cn } from "@/lib/utils";

/**
 * Options compared against criteria.
 * - From 1024px: a real <table> with hairline-separated rows, a caption, `scope` on every header
 *   cell and the first option (working with me) marked by a lamp rule.
 * - Below that: a scroll-snap row with one card per option (the table is hidden, so screen readers
 *   get one copy).
 * Status is always shown by icon shape and a word, never by colour alone.
 */

const statusMeta: Record<ComparisonStatus, { label: string; Icon: typeof Check }> = {
  yes: { label: "Yes", Icon: Check },
  partial: { label: "Partly", Icon: Minus },
  no: { label: "No", Icon: X },
};

function StatusIcon({ status }: { status: ComparisonStatus }) {
  const { Icon } = statusMeta[status];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-card border",
        status === "yes" && "border-success text-success-fg",
        status === "partial" && "border-rule text-fg-muted",
        status === "no" && "border-danger text-danger-fg",
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} />
    </span>
  );
}

function Cell({ status, text }: { status: ComparisonStatus; text: string }) {
  return (
    <span className="flex items-start gap-3">
      <StatusIcon status={status} />
      <span>
        <span className="sr-only">{statusMeta[status].label}: </span>
        {text}
      </span>
    </span>
  );
}

export function ComparisonMatrix({
  data,
  id,
  criteriaLabel,
  className,
}: {
  data: ComparisonData;
  id: string;
  /** Header of the criteria column, e.g. "Compared on". */
  criteriaLabel: string;
  className?: string;
}) {
  const captionId = `${id}-caption`;

  return (
    <div className={className}>
      <div role="region" aria-labelledby={captionId} tabIndex={0} className="hidden lg:block">
        <table className="w-full border-collapse text-left text-small">
          <caption id={captionId} className="sr-only">
            {data.caption}
          </caption>
          <thead>
            <tr className="border-b border-fg/40">
              <th scope="col" className="w-[17%] py-4 pr-6 align-bottom label-mono text-fg-muted">
                {criteriaLabel}
              </th>
              {data.columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    "px-5 py-4 align-bottom font-display-soft text-xl font-medium text-fg",
                    index === 0 && "border-t-2 border-lamp-500",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.label} className="border-b border-rule">
                <th scope="row" className="py-5 pr-6 align-top font-semibold text-fg">
                  {row.label}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={data.columns[index]}
                    className={cn(
                      "px-5 py-5 align-top text-fg-muted",
                      index === 0 && "bg-lamp-500/[0.07] text-fg",
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

      <div className="lg:hidden">
        <ScrollSnapRow label={data.caption} itemWidth="min(86%, 22rem)">
          {data.columns.map((column, columnIndex) => (
            <li
              key={column}
              className={cn(
                "rounded-card border bg-field p-5",
                columnIndex === 0 ? "border-lamp-500" : "border-rule",
              )}
            >
              <h3 className="text-h3 text-fg">{column}</h3>
              <dl className="mt-4 divide-y divide-rule text-small">
                {data.rows.map((row) => {
                  const cell = row.cells[columnIndex];
                  if (!cell) return null;
                  return (
                    <div key={row.label} className="py-3 first:pt-0 last:pb-0">
                      <dt className="label-mono text-fg-muted">{row.label}</dt>
                      <dd className="mt-1.5 text-fg">
                        <Cell status={cell.status} text={cell.text} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ScrollSnapRow>
      </div>

      {/* Legend: shape + word, so meaning never depends on colour. */}
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small text-fg-muted">
        {(Object.keys(statusMeta) as ComparisonStatus[]).map((status) => (
          <li key={status} className="flex items-center gap-2">
            <StatusIcon status={status} />
            {statusMeta[status].label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-small text-fg-muted">{data.note}</p>
    </div>
  );
}

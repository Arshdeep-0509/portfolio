import { cn } from "@/lib/utils";

export type FileNode = {
  name: string;
  /** Shown beside the node on hover and keyboard focus (always shown on small screens). */
  note?: string;
  children?: FileNode[];
};

type Row = { node: FileNode; prefix: string; depth: number };

/** Flattens the tree into rows with box-drawing prefixes ("├─ ", "└─ ", "│  "). */
function flatten(nodes: FileNode[], prefix = "", depth = 0): Row[] {
  return nodes.flatMap((node, index) => {
    const last = index === nodes.length - 1;
    const branch = depth === 0 ? "" : `${prefix}${last ? "└─ " : "├─ "}`;
    const childPrefix = depth === 0 ? "" : `${prefix}${last ? "   " : "│  "}`;
    return [
      { node, prefix: branch, depth },
      ...(node.children ? flatten(node.children, childPrefix, depth + 1) : []),
    ];
  });
}

/**
 * A dark, code-style card that draws a folder tree. Each node with a note is focusable and shows
 * its explanation on hover and focus; the note is real text in the DOM, so screen readers read
 * it with the name. Pure CSS — no JavaScript.
 */
export function FileTree({
  tree,
  label,
  className,
}: {
  tree: FileNode[];
  /** Accessible name, e.g. "Files you receive". */
  label: string;
  className?: string;
}) {
  const rows = flatten(tree);
  return (
    <figure
      className={cn(
        "tone-night overflow-hidden rounded-card border border-line-dark bg-night-950 text-fg",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line-dark px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-dot bg-mist-300/40" />
          <span className="size-2 rounded-dot bg-mist-300/40" />
          <span className="size-2 rounded-dot bg-lamp-500" />
        </span>
        <figcaption className="ml-2 label-mono text-mist-300">{label}</figcaption>
      </div>
      <ul className="px-2 py-3 font-mono text-[13px] leading-6 sm:text-sm">
        {rows.map(({ node, prefix, depth }) => {
          const folder = Boolean(node.children) || node.name.endsWith("/");
          return (
            <li
              key={`${prefix}${node.name}`}
              tabIndex={node.note ? 0 : undefined}
              className={cn(
                "group/node flex flex-col rounded-[3px] px-2 py-1 outline-offset-0 md:flex-row md:items-baseline md:gap-4",
                node.note && "hover:bg-ivory-50/[0.05] focus-visible:bg-ivory-50/[0.05]",
              )}
            >
              <span className="shrink-0 whitespace-pre">
                <span aria-hidden="true" className="text-mist-300/60">
                  {prefix}
                </span>
                <span
                  className={cn(
                    folder ? "text-lamp-400" : "text-ivory-50",
                    depth === 0 && "font-medium",
                  )}
                >
                  {node.name}
                </span>
              </span>
              {node.note ? (
                <span
                  className={cn(
                    "text-mist-300 transition-opacity duration-200",
                    "md:opacity-0 md:group-hover/node:opacity-100 md:group-focus-visible/node:opacity-100",
                  )}
                >
                  <span aria-hidden="true" className="text-lamp-500">
                    →{" "}
                  </span>
                  {node.note}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

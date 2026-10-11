/**
 * Rehype plugin: wraps [PLACEHOLDER] tokens in prose with <mark data-placeholder>, so unfilled
 * content in MDX is as visible as it is elsewhere on the site. Code is left untouched.
 * (Same rule as components/ui/PlaceholderText: bracketed text starting with a capital letter.)
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const TOKEN = /(\[[A-Z][^\]]*\])/;
const SKIP = new Set(["code", "pre", "script", "style"]);

function transform(node: HastNode) {
  if (!node.children) return;
  if (node.type === "element" && node.tagName && SKIP.has(node.tagName)) return;

  node.children = node.children.flatMap((child): HastNode[] => {
    if (child.type !== "text" || !child.value || !TOKEN.test(child.value)) {
      transform(child);
      return [child];
    }
    return child.value
      .split(TOKEN)
      .filter((part) => part !== "")
      .map((part) =>
        TOKEN.test(part)
          ? {
              type: "element",
              tagName: "mark",
              properties: { dataPlaceholder: "", title: "Placeholder — replace before launch" },
              children: [{ type: "text", value: part }],
            }
          : { type: "text", value: part },
      );
  });
}

export function rehypeMarkPlaceholders() {
  return (tree: HastNode) => transform(tree);
}

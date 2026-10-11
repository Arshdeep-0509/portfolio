import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbProps = {
  /** Ordered from Home to the current page. The last item is the current page. */
  items: BreadcrumbItem[];
  /** Also output schema.org BreadcrumbList JSON-LD. Default true. */
  jsonLd?: boolean;
  className?: string;
};

/**
 * The breadcrumb as a mono label line: "(Home / Services / MVP Development)". Links keep a
 * 24px minimum target height.
 */
export function Breadcrumb({ items, jsonLd = true, className }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center label-mono text-fg-muted">
        <li aria-hidden="true">(</li>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {current || !item.href ? (
                <span
                  aria-current={current ? "page" : undefined}
                  className={cn(current && "text-accent")}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex min-h-6 items-center link-underline hover:text-fg"
                >
                  {item.label}
                </Link>
              )}
              {!current ? (
                <span aria-hidden="true" className="px-1.5">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
        <li aria-hidden="true">)</li>
      </ol>
      {jsonLd ? <JsonLd data={schema} /> : null}
    </nav>
  );
}

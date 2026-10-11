import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbProps = {
  /** Ordered from Home to the current page. The last item is the current page. */
  items: BreadcrumbItem[];
  /** Also output schema.org BreadcrumbList JSON-LD. */
  jsonLd?: boolean;
  className?: string;
};

export function Breadcrumb({ items, jsonLd = false, className }: BreadcrumbProps) {
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
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-tone-muted">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {current || !item.href ? (
                <span
                  aria-current={current ? "page" : undefined}
                  className={cn(current && "font-semibold text-tone-fg")}
                >
                  {item.label}
                </span>
              ) : (
                // 44px tap target; the negative margin keeps the row visually compact.
                <Link
                  href={item.href}
                  className="-my-3 inline-flex min-h-11 items-center rounded-sm hover:text-tone-fg hover:underline"
                >
                  {item.label}
                </Link>
              )}
              {!current ? (
                <ChevronRight aria-hidden="true" className="size-3.5 opacity-70" />
              ) : null}
            </li>
          );
        })}
      </ol>
      {jsonLd ? <JsonLd data={schema} /> : null}
    </nav>
  );
}

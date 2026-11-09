import { ChevronDown } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChapterNav } from "@/components/ui/ChapterNav";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import type { LegalBlock, LegalDocument } from "@/content/legal/types";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const BOLD = /\*\*([^*]+)\*\*/;

/** Plain text with **bold** spans and marked [PLACEHOLDERS]. */
function Plain({ text }: { text: string }) {
  const parts = text.split(BOLD);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index}>
            <PlaceholderText text={part} />
          </strong>
        ) : (
          <PlaceholderText key={index} text={part} />
        ),
      )}
    </>
  );
}

/** Inline text: [label](href) links and **bold**, with [PLACEHOLDERS] marked everywhere else. */
function Rich({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    nodes.push(<Plain key={`t${last}`} text={text.slice(last, match.index)} />);
    const internal = href.startsWith("/") || href.startsWith("#");
    nodes.push(
      internal ? (
        <Link key={`l${match.index}`} href={href}>
          {label}
        </Link>
      ) : (
        <a key={`l${match.index}`} href={href}>
          <PlaceholderText text={label} />
        </a>
      ),
    );
    last = match.index + whole.length;
  }
  nodes.push(<Plain key="end" text={text.slice(last)} />);
  return <>{nodes}</>;
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <Rich text={block.text} />
        </p>
      );
    case "h3":
      return (
        <h3>
          <Rich text={block.text} />
        </h3>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p className="not-prose rounded-r-button border-l-2 border-link bg-surface-raised py-4 pr-4 pl-5 text-ink">
          <Rich text={block.text} />
        </p>
      );
    case "table":
      return (
        // Scrolls sideways on narrow screens instead of overflowing the page.
        <div
          className="not-prose my-6 overflow-x-auto rounded-card border border-border"
          tabIndex={0}
          role="region"
          aria-label={block.caption}
        >
          <table className="w-full min-w-[36rem] text-left text-small">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-surface-raised">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="px-4 py-3 font-semibold text-ink">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className={
                        index === 0
                          ? "px-4 py-3 text-xs text-ink tabular-nums"
                          : "px-4 py-3 text-ink-muted"
                      }
                    >
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/**
 * Layout for legal pages on ivory: a breadcrumb and serif title, a mono "Last updated" line, the
 * table of contents in the left margin (sticky, with scroll-spy) and the document in a readable
 * column with serif h2 headings. A collapsible contents list replaces the margin on small
 * screens. Prints as a clean document (site chrome is hidden).
 */
export function LegalLayout({
  doc,
  extras = {},
}: {
  doc: LegalDocument;
  /** Extra content rendered at the end of a section, keyed by section id (e.g. a button). */
  extras?: Record<string, React.ReactNode>;
}) {
  const chapters = doc.sections.map((section) => ({ id: section.id, text: section.title }));
  const updated = formatDate(doc.lastUpdated);
  const email = siteConfig.contact.email;

  return (
    <div className="bg-bg text-ink">
      <div className="container-site pt-16 pb-24 lg:pt-24 lg:pb-32 print:p-0">
        <div className="print:hidden">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: doc.title }]} />
        </div>
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8 lg:col-start-4">
            <h1 className="text-h1 text-ink">{doc.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-muted print:hidden">{doc.description}</p>
            <p className="mt-6 label-text text-ink-muted">
              Last updated · <time dateTime={doc.lastUpdated}>{updated}</time>
            </p>
          </div>
        </div>

        <div className="mt-14 lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:col-span-3 lg:block print:hidden">
            <div className="sticky top-[calc(var(--header-h)+2rem)] max-h-[calc(100vh-var(--header-h)-4rem)] overflow-y-auto pb-4">
              <ChapterNav chapters={chapters} label="Contents" numbered />
            </div>
          </aside>

          <article className="min-w-0 lg:col-span-8 lg:col-start-4">
            <details className="group mb-10 rounded-card border border-border lg:hidden print:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold [&::-webkit-details-marker]:hidden">
                Contents
                <ChevronDown
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4 text-ink-muted transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <ol className="border-t border-border px-4 py-2">
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      className="flex min-h-11 items-center gap-3 text-small text-ink-muted hover:text-ink"
                    >
                      <span className="text-xs text-ink-muted tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {chapter.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <div className="legal-prose prose max-w-[68ch]">
              {doc.sections.map((section, index) => (
                <Fragment key={section.id}>
                  <h2 id={section.id}>
                    <span className="mr-3 text-base font-normal text-ink-muted tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  {section.blocks.map((block, blockIndex) => (
                    <Block key={blockIndex} block={block} />
                  ))}
                  {extras[section.id] ? (
                    <div className="not-prose my-6">{extras[section.id]}</div>
                  ) : null}
                </Fragment>
              ))}
            </div>

            <aside className="mt-14 border-t border-border pt-6">
              <p className="text-ink">
                <strong>Questions about this page?</strong> Write to{" "}
                {isPlaceholder(email) ? (
                  <PlaceholderText text={email} />
                ) : (
                  <a
                    href={`mailto:${email}`}
                    className="font-semibold text-link underline underline-offset-4"
                  >
                    {email}
                  </a>
                )}{" "}
                and I&apos;ll answer personally.
              </p>
            </aside>
          </article>
        </div>
      </div>
    </div>
  );
}

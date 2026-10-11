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
        <p className="not-prose border-l-2 border-lamp-500 bg-sand-100 py-4 pr-4 pl-5 text-fg">
          <Rich text={block.text} />
        </p>
      );
    case "table":
      return (
        // Scrolls sideways on narrow screens instead of overflowing the page.
        <div
          className="not-prose my-6 overflow-x-auto rounded-card border border-line"
          tabIndex={0}
          role="region"
          aria-label={block.caption}
        >
          <table className="w-full min-w-[36rem] text-left text-small">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-sand-100">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="px-4 py-3 font-semibold text-fg">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className={
                        index === 0
                          ? "px-4 py-3 font-mono text-xs text-fg"
                          : "px-4 py-3 text-fg-muted"
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
  const email = siteConfig.email;

  return (
    <div className="tone-ivory grain bg-ivory-50 text-fg">
      <div className="container-site pt-16 pb-24 lg:pt-24 lg:pb-32 print:p-0">
        <div className="print:hidden">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: doc.title }]} />
        </div>
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8 lg:col-start-4">
            <h1 className="text-h1 text-fg">{doc.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-muted print:hidden">{doc.description}</p>
            <p className="mt-6 label-mono text-accent">
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
            <details className="group mb-10 rounded-card border border-line lg:hidden print:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold [&::-webkit-details-marker]:hidden">
                Contents
                <span aria-hidden="true" className="font-mono text-accent">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <ol className="border-t border-line px-4 py-2">
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      className="flex min-h-11 items-center gap-3 text-small text-fg-muted hover:text-fg"
                    >
                      <span className="font-mono text-xs text-accent">
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
                    <span className="mr-3 font-mono text-base font-normal text-lamp-700">
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

            <aside className="mt-14 border-t border-line pt-6">
              <p className="text-fg">
                <strong>Questions about this page?</strong> Write to{" "}
                {isPlaceholder(email) ? (
                  <PlaceholderText text={email} />
                ) : (
                  <a
                    href={`mailto:${email}`}
                    className="font-semibold text-accent underline underline-offset-4"
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

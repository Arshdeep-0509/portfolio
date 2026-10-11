import { Fragment } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { TableOfContents } from "@/components/sections/insights/PostWidgets";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
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
        <p className="not-prose rounded-lg border-l-4 border-primary bg-soft p-4 text-ink">
          <Rich text={block.text} />
        </p>
      );
    case "table":
      return (
        // Scrolls sideways on narrow screens instead of overflowing the page.
        <div
          className="not-prose my-6 overflow-x-auto rounded-lg border border-border"
          tabIndex={0}
          role="region"
          aria-label={block.caption}
        >
          <table className="w-full min-w-[36rem] text-left text-small">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-tint">
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
                          ? "px-4 py-3 font-mono text-xs text-ink"
                          : "px-4 py-3 text-muted"
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
 * Layout for legal pages: hero with breadcrumb, a sticky table of contents with scroll-spy on
 * desktop (collapsible list on mobile), a readable prose column with the last-updated date, and
 * a closing contact box. Prints as a clean document (site chrome is hidden).
 */
export function LegalLayout({
  doc,
  extras = {},
}: {
  doc: LegalDocument;
  /** Extra content rendered at the end of a section, keyed by section id (e.g. a button). */
  extras?: Record<string, React.ReactNode>;
}) {
  const headings = doc.sections.map((section) => ({
    id: section.id,
    text: section.title,
    level: 2 as const,
  }));
  const updated = formatDate(doc.lastUpdated);
  const email = siteConfig.email;

  return (
    <>
      <div className="print:hidden">
        <CompactPageHero
          breadcrumb={[{ label: "Home", href: "/" }, { label: doc.title }]}
          eyebrow="Legal"
          title={doc.title}
          subtitle={doc.description}
        />
      </div>
      <Section background="white" className="print:py-0">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-[calc(var(--header-h)+2rem)] max-h-[calc(100vh-var(--header-h)-4rem)] overflow-y-auto pb-4">
              <TableOfContents headings={headings} label="On this page" />
            </div>
          </aside>

          <article className="max-w-[760px] min-w-0">
            {/* The hero isn't printed, so the printout gets its own title. */}
            <p className="hidden text-h2 font-extrabold text-ink print:block">{doc.title}</p>
            <p className="text-small text-muted">
              Last updated: <time dateTime={doc.lastUpdated}>{updated}</time>
            </p>

            <details className="group mt-6 rounded-lg border border-border bg-tint lg:hidden print:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                On this page
                <span
                  aria-hidden="true"
                  className="text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <ol className="px-4 pb-4">
                {headings.map((heading, index) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="flex min-h-11 items-center text-small text-muted hover:text-primary"
                    >
                      {index + 1}. {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <div className="legal-prose prose mt-8 max-w-none">
              {doc.sections.map((section, index) => (
                <Fragment key={section.id}>
                  <h2 id={section.id}>
                    {index + 1}. {section.title}
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

            <aside className="tone-light mt-12 flex flex-col gap-4 rounded-xl border border-border bg-tint p-6 sm:flex-row sm:items-center">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-primary text-white print:hidden">
                <Mail aria-hidden="true" className="size-5" />
              </span>
              <p className="text-ink">
                <strong>Questions?</strong> Contact{" "}
                {isPlaceholder(email) ? (
                  <PlaceholderText text={email} />
                ) : (
                  <a href={`mailto:${email}`} className="font-semibold text-primary underline">
                    {email}
                  </a>
                )}{" "}
                and I&apos;ll get back to you.
              </p>
            </aside>
          </article>
        </div>
      </Section>
    </>
  );
}

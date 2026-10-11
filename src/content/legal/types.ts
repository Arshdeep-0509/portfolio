/**
 * Shape of the legal documents in this folder. Text supports these inline features:
 * - links written as [label](/path) or [label](mailto:…), and **bold** text
 * - [PLACEHOLDERS], which render visibly marked until replaced
 *
 * These are starting templates, not legal advice — have a lawyer review them before launch.
 */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  /** Highlighted box, e.g. a short summary. */
  | { type: "note"; text: string };

export type LegalSection = {
  /** Anchor id, e.g. "your-rights". Also used by the table of contents. */
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  path: string;
  /** Meta description and hero subtitle. */
  description: string;
  /** YYYY-MM-DD. Update whenever the content changes. */
  lastUpdated: string;
  sections: LegalSection[];
};

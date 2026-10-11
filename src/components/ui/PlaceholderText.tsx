import { Fragment } from "react";

// A placeholder is any bracketed text starting with a capital or a digit, e.g. [CITY], [30] or
// [WHAT I'VE BUILT — real projects only]. The capturing group makes split() return the tokens
// at the odd indices.
const TOKEN = /(\[[A-Z0-9][^\]]*\])/;

/**
 * Renders text with every [PLACEHOLDER] token visibly marked — semibold with a dashed lamp-coloured
 * underline — so unfilled content is hard to miss. Works on light and dark backgrounds because
 * it keeps the surrounding text colour.
 */
export function PlaceholderText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={index}
            title="Placeholder — replace before launch"
            className="bg-transparent font-semibold text-inherit underline decoration-lamp-500 decoration-dashed decoration-2 underline-offset-4"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

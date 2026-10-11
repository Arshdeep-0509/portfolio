/**
 * Renders `text` with its `emphasis` substring wrapped in <em>. Inside headlines globals.css
 * sets <em> in Fraunces italic over a thin flame underline. Unknown substrings render plain.
 */
export function Emphasis({ text, emphasis }: { text: string; emphasis?: string }) {
  const index = emphasis ? text.indexOf(emphasis) : -1;
  if (!emphasis || index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <em>{emphasis}</em>
      {text.slice(index + emphasis.length)}
    </>
  );
}

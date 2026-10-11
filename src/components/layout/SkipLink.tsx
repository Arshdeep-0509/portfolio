/** First focusable element on every page. Visible only when focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-button bg-lamp-500 px-5 py-3 text-small font-semibold text-ink-900 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
    >
      Skip to the content
    </a>
  );
}

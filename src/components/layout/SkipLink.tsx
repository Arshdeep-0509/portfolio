/** First focusable element on every page. Visible only when focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-pill bg-navy-900 px-5 py-3 text-small font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
    >
      Skip to content
    </a>
  );
}

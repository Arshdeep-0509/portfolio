"use client";

import { useEffect } from "react";
import { reportClientError } from "@/components/layout/ErrorReporter";
import { brandColors } from "@/lib/brandColors";
import { LOCALE } from "@/lib/constants";
import { fontVariables } from "@/lib/fonts";

/**
 * Last-resort error UI when the root layout itself fails. It replaces the whole document, so it
 * can't rely on the site's stylesheet: inline styles on the shared tokens and font variables.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    reportClientError(error, { source: "global-error", digest: error.digest ?? "none" });
  }, [error]);

  return (
    <html lang={LOCALE} className={fontVariables}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-body)",
          background: brandColors.dark.bg,
          color: brandColors.dark.ink,
        }}
      >
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0 }}>
            The site hit a problem
          </h1>
          <p style={{ color: brandColors.dark.inkMuted }}>
            I&apos;ve been notified and will look into it.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 12,
              minHeight: 44,
              padding: "0 24px",
              borderRadius: 10,
              border: 0,
              background: brandColors.dark.accent,
              color: brandColors.dark.accentInk,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Load it again
          </button>
        </main>
      </body>
    </html>
  );
}

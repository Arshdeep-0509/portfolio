"use client";

import { useEffect } from "react";
import { reportClientError } from "@/components/layout/ErrorReporter";

/**
 * Last-resort error UI when the root layout itself fails. It replaces the whole document, so it
 * can't rely on the site's fonts or stylesheet: plain inline styles only.
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
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#475569" }}>
            Sorry — the site hit an error. It&apos;s been reported.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 12,
              minHeight: 44,
              padding: "0 24px",
              borderRadius: 999,
              border: 0,
              background: "#1d5fd1",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

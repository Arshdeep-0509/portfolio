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
          fontFamily: "Georgia, serif",
          background: "#0A0A12",
          color: "#FBF8F2",
        }}
      >
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>The site hit a problem</h1>
          <p style={{ color: "#B8B4C6" }}>I&apos;ve been notified and will look into it.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 12,
              minHeight: 44,
              padding: "0 24px",
              borderRadius: 8,
              border: 0,
              background: "linear-gradient(135deg, #FFC15E 0%, #F5A524 45%, #F2683C 100%)",
              color: "#16141F",
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

"use client";

import { useEffect } from "react";
import { sendToSentry } from "@/lib/sentryEnvelope";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const MAX_REPORTS_PER_PAGE = 5;
let sent = 0;

/** Sends a browser error to Sentry (when NEXT_PUBLIC_SENTRY_DSN is set), at most 5 per page. */
export function reportClientError(error: unknown, tags: Record<string, string> = {}) {
  if (!DSN || sent >= MAX_REPORTS_PER_PAGE) return;
  sent += 1;
  void sendToSentry(DSN, error, {
    platform: "javascript",
    tags: { runtime: "browser", ...tags },
    url: `${window.location.origin}${window.location.pathname}`,
  });
}

/** Global listeners for uncaught errors and unhandled promise rejections. Renders nothing. */
export function ErrorReporter() {
  useEffect(() => {
    if (!DSN) return;
    const onError = (event: ErrorEvent) => {
      // Ignore errors from browser extensions and cross-origin scripts ("Script error.").
      if (!event.error) return;
      reportClientError(event.error, { source: "window.onerror" });
    };
    const onRejection = (event: PromiseRejectionEvent) =>
      reportClientError(event.reason, { source: "unhandledrejection" });
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}

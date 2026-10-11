"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { reportClientError } from "@/components/layout/ErrorReporter";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** Shown inside the site layout when a page fails to render. The error is reported to Sentry. */
export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    reportClientError(error, { source: "error-boundary", digest: error.digest ?? "none" });
  }, [error]);

  return (
    <Container className="py-24">
      <p className="label-mono text-accent">(Error) Page failed</p>
      <h1 className="mt-4 text-h1 text-fg">The page couldn&apos;t load</h1>
      <p className="mt-4 max-w-md text-fg-muted">
        I&apos;ve been notified. Give it another go, or return to the home page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => retry()}
          leftIcon={<RotateCcw aria-hidden="true" strokeWidth={1.5} className="size-4" />}
        >
          Load it again
        </Button>
        <Button href="/" variant="outline">
          Return home
        </Button>
      </div>
    </Container>
  );
}

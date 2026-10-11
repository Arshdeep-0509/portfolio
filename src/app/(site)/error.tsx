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
    <Container className="py-24 text-center">
      <p className="font-mono text-eyebrow font-medium text-primary uppercase">
        Something went wrong
      </p>
      <h1 className="mt-4 text-h1 font-extrabold tracking-tight text-ink">
        This page didn&apos;t load
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Sorry about that — it&apos;s been reported. Please try again, or head back to the home page.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          onClick={() => retry()}
          leftIcon={<RotateCcw aria-hidden="true" className="size-4" />}
        >
          Try again
        </Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
      </div>
    </Container>
  );
}

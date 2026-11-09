"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Star } from "@/components/brand/Star";
import { reportClientError } from "@/components/layout/ErrorReporter";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/** Body of both error boundaries, with a retry button. The error is reported to Sentry. */
export function ErrorContent({ error, retry }: ErrorProps) {
  useEffect(() => {
    reportClientError(error, { source: "error-boundary", digest: error.digest ?? "none" });
  }, [error]);

  return (
    <div className="flex min-h-[70svh] items-center bg-bg text-ink">
      <Container className="py-24">
        <Star className="hero-polaris size-3.5" />
        <h1 className="mt-6 text-h1 text-ink">The page couldn&apos;t load</h1>
        <p className="mt-4 max-w-md text-ink-muted">
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
    </div>
  );
}

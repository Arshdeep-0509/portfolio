"use client";

import { ErrorContent, type ErrorProps } from "@/components/layout/ErrorContent";

/** Catches a failure in the site layout itself, inside the root layout, so fonts and theme hold. */
export default function RootError(props: ErrorProps) {
  return <ErrorContent {...props} />;
}

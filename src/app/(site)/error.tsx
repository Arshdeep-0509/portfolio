"use client";

import { ErrorContent, type ErrorProps } from "@/components/layout/ErrorContent";

/** Shown inside the site layout, with its header and footer, when a page fails to render. */
export default function SiteError(props: ErrorProps) {
  return <ErrorContent {...props} />;
}

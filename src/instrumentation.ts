import type { Instrumentation } from "next";

/**
 * Reports server errors (Server Components, Route Handlers, proxy) to Sentry when a DSN is set.
 * API routes that catch their own errors call reportError() directly.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const { reportError } = await import("@/lib/reportError");
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest: unknown }).digest)
      : undefined;
  await reportError(error, {
    route: context.routePath,
    routeType: context.routeType,
    method: request.method,
    path: request.path.split("?")[0],
    digest,
  });
};

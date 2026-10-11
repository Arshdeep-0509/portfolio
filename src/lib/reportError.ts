import "server-only";
import { sendToSentry } from "@/lib/sentryEnvelope";

/**
 * Logs a server error and, when SENTRY_DSN (or NEXT_PUBLIC_SENTRY_DSN) is set, sends it to Sentry.
 * Never throws. Keep `context` free of personal data: pass ids and flags, not names, emails or
 * messages.
 */
export async function reportError(
  error: unknown,
  context: { route: string } & Record<string, string | number | boolean | undefined>,
) {
  console.error(`[${context.route}]`, error);

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  await sendToSentry(dsn, error, {
    platform: "node",
    tags: { route: context.route, runtime: "server" },
    extra: context,
  });
}

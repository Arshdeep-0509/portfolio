/**
 * Minimal Sentry client (no SDK, so nothing heavy in the bundle): sends one error event to the
 * project's envelope endpoint. Works on the server and in the browser. Never throws.
 * Keep `extra` free of personal data — ids and flags, not names, emails or form contents.
 */

export type SentryContext = {
  platform: "node" | "javascript";
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  /** Page or request URL, without query strings. */
  url?: string;
};

export async function sendToSentry(dsn: string, error: unknown, context: SentryContext) {
  try {
    const { protocol, username: publicKey, host, pathname } = new URL(dsn);
    const projectId = pathname.replace(/^\/+/, "");
    const err = error instanceof Error ? error : new Error(String(error));
    const eventId = crypto.randomUUID().replaceAll("-", "");
    const now = new Date();

    const event = {
      event_id: eventId,
      timestamp: now.getTime() / 1000,
      platform: context.platform,
      level: "error",
      environment: process.env.NODE_ENV,
      tags: context.tags,
      extra: { ...context.extra, stack: err.stack },
      request: context.url ? { url: context.url } : undefined,
      // Don't let Sentry infer and store the visitor's IP address.
      user: { ip_address: null },
      exception: { values: [{ type: err.name, value: err.message }] },
    };
    const envelope = [
      JSON.stringify({ event_id: eventId, sent_at: now.toISOString(), dsn }),
      JSON.stringify({ type: "event" }),
      JSON.stringify(event),
    ].join("\n");

    await fetch(
      `${protocol}//${host}/api/${projectId}/envelope/?sentry_key=${publicKey}&sentry_version=7`,
      {
        method: "POST",
        // text/plain keeps the browser request "simple" (no CORS preflight); Sentry accepts it.
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: envelope,
        keepalive: true,
      },
    );
  } catch {
    // Reporting must never break the page or the request.
  }
}

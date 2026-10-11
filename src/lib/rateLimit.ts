import "server-only";

/**
 * Fixed-window rate limiter, keyed by e.g. client IP.
 *
 * - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set → counts live in Upstash Redis (REST API,
 *   no SDK), so limits hold across serverless instances and restarts.
 * - Otherwise → in-memory counts: per server instance and reset on restart. Fine in development.
 *
 * If Redis is unreachable the request is allowed (fail open) and the error is logged: a short
 * outage shouldn't stop real people reaching out.
 */
export function createRateLimiter({
  name,
  windowMs,
  max,
}: {
  /** Namespaces the Redis keys, e.g. "contact". */
  name: string;
  windowMs: number;
  max: number;
}) {
  const hits = new Map<string, { count: number; start: number }>();

  function limitedInMemory(key: string) {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { count: 1, start: now });
      return false;
    }
    entry.count += 1;
    return entry.count > max;
  }

  /** Records a hit for `key` and resolves to true when it is over the limit. */
  return async function limited(key: string): Promise<boolean> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return limitedInMemory(key);

    const redisKey = `ratelimit:${name}:${key}`;
    try {
      const response = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        // INCR, then start the window's expiry only on the first hit (NX).
        body: JSON.stringify([
          ["INCR", redisKey],
          ["PEXPIRE", redisKey, String(windowMs), "NX"],
        ]),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Upstash responded ${response.status}`);
      const [incr] = (await response.json()) as [{ result?: number; error?: string }];
      if (typeof incr?.result !== "number") throw new Error(incr?.error ?? "Bad Upstash response");
      return incr.result > max;
    } catch (error) {
      console.error(`[rate-limit] ${name}: Redis unavailable, allowing request`, error);
      return false;
    }
  };
}

/** Client IP from the proxy header, or "unknown" when running without one. */
export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

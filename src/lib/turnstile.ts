import "server-only";

/**
 * Cloudflare Turnstile verification.
 * - TURNSTILE_SECRET_KEY set → the token is checked with Cloudflare's siteverify API.
 * - Not set → verification is skipped with a warning (local development). Set both keys before
 *   launch; Cloudflare's test keys (see .env.example) let you exercise the real flow locally.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set — skipping bot verification.");
    return true;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success)
      console.warn("[turnstile] Turnstile rejected a token", result["error-codes"]);
    return result.success === true;
  } catch (error) {
    console.error("[turnstile] Turnstile verification failed", error);
    return false;
  }
}

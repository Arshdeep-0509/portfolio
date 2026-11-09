type DeployEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_URL?: string;
};

/**
 * This deployment's public origin, decided once at build time by next.config.ts, which bakes it
 * into NEXT_PUBLIC_SITE_URL so server and browser code agree (VERCEL_URL never reaches the
 * browser). Undefined means "use the default": siteConfig.url falls back to the real domain.
 *
 * Imported by next.config.ts, so it can't use the @/ alias or import anything from the app.
 */
export function deployUrl(env: DeployEnv): string | undefined {
  // `||` semantics: an unset Docker build arg arrives as an empty string, which must fall through.
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (env.VERCEL_ENV === "preview" && env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return undefined;
}

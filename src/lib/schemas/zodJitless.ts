/**
 * Side-effect module, imported by every schema file: turns off zod's JIT compiler.
 *
 * Zod 4 probes for `eval` to JIT-compile validators. The site's Content-Security-Policy doesn't
 * allow eval, so the probe would log a CSP violation; with `jitless` it's skipped and validation
 * works the same. This is what `z.config({ jitless: true })` does — zod keeps its settings on this
 * global — but importing zod here (or re-exporting `z`) defeats tree-shaking and roughly triples
 * zod's client bundle, so the schemas import `z` from "zod" directly.
 */
const scope = globalThis as { __zod_globalConfig?: Record<string, unknown> };
Object.assign((scope.__zod_globalConfig ??= {}), { jitless: true });

export {};

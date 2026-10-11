import { connection, NextResponse } from "next/server";

/**
 * GET /api/health — for uptime monitors (UptimeRobot, Better Stack) and the Docker HEALTHCHECK.
 * 200 when the app is up and, if DATABASE_URL is set, the database answers within 3 seconds;
 * 503 otherwise. Never cached. Reveals no configuration beyond ok / not ok.
 */
export async function GET() {
  await connection();
  const started = Date.now();
  const checks: Record<string, "ok" | "error" | "skipped"> = { app: "ok" };

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db");
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
      ]);
      checks.database = "ok";
    } catch {
      checks.database = "error";
    }
  } else {
    checks.database = "skipped";
  }

  const healthy = !Object.values(checks).includes("error");
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks,
      version: process.env.APP_VERSION ?? "dev",
      uptimeSeconds: Math.round(process.uptime()),
      responseMs: Date.now() - started,
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}

import { defineConfig } from "prisma/config";

// The Prisma CLI doesn't read Next.js env files; load them here (Node 20.12+).
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // File not present — fine.
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Not needed for `prisma generate`; required by migrate commands.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});

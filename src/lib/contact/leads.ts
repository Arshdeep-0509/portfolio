import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Where contact-form leads are stored. Two adapters, chosen by environment:
 *
 * 1. DATABASE_URL set → PostgreSQL through Prisma (`leads` table; see prisma/schema.prisma and
 *    prisma/migrations). Works with any Postgres host, including Supabase and Neon.
 * 2. Otherwise → append to .data/leads.jsonl (git-ignored). Local development only.
 */

const LOCAL_FILE = path.join(process.cwd(), ".data", "leads.jsonl");

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  budget: string | null;
  budgetCurrency: string | null;
  timeline: string | null;
  message: string;
  nda: boolean;
  heardFrom: string | null;
  sourcePage: string | null;
  utm: Utm;
};

export type StoredLead = LeadInput & { id: string; createdAt: Date; status: "new" };

export async function saveLead(input: LeadInput): Promise<StoredLead> {
  const { utm, ...fields } = input;
  const utmColumns = {
    utmSource: utm.source ?? null,
    utmMedium: utm.medium ?? null,
    utmCampaign: utm.campaign ?? null,
    utmTerm: utm.term ?? null,
    utmContent: utm.content ?? null,
  };

  if (process.env.DATABASE_URL) {
    const { prisma } = await import("@/lib/db");
    const lead = await prisma.lead.create({
      data: { ...fields, ...utmColumns },
      select: { id: true, createdAt: true },
    });
    return { ...input, ...lead, status: "new" };
  }

  const lead: StoredLead = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: "new",
  };
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.appendFile(
    LOCAL_FILE,
    `${JSON.stringify({ id: lead.id, createdAt: lead.createdAt, status: lead.status, ...fields, ...utmColumns })}\n`,
    "utf8",
  );
  return lead;
}

/** Reads first-touch UTM parameters from the `utm` cookie set by <UtmCapture />. */
export function utmFromCookie(cookieHeader: string | null): Utm {
  const raw = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("utm="))
    ?.slice(4);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;
    const pick = (key: string) =>
      typeof parsed[key] === "string" ? (parsed[key] as string).slice(0, 200) : undefined;
    return {
      source: pick("source"),
      medium: pick("medium"),
      campaign: pick("campaign"),
      term: pick("term"),
      content: pick("content"),
    };
  } catch {
    return {};
  }
}

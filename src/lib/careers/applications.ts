import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Where applications are stored. Two adapters, chosen by environment:
 *
 * 1. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set → insert into the `career_applications` table
 *    through Supabase's REST API (no extra dependency). Create the table with:
 *
 *      create table career_applications (
 *        id uuid primary key,
 *        created_at timestamptz not null default now(),
 *        delete_after timestamptz not null,
 *        name text not null, email text not null, phone text not null,
 *        role text not null, role_title text not null,
 *        experience text, availability text,
 *        portfolio text not null, linkedin text,
 *        message text not null, resume_key text not null
 *      );
 *      alter table career_applications enable row level security; -- no public policies
 *
 * 2. Otherwise → append to .data/careers/applications.jsonl (git-ignored). Local / single-server only.
 *
 * Applications are kept for hiring purposes for up to 12 months (the consent text says so):
 * `delete_after` records when each one must be deleted. Schedule a job to enforce it.
 */

const LOCAL_FILE = path.join(process.cwd(), ".data", "careers", "applications.jsonl");

export type ApplicationRecord = {
  id: string;
  created_at: string;
  delete_after: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  role_title: string;
  experience: string | null;
  availability: string | null;
  portfolio: string;
  linkedin: string | null;
  message: string;
  resume_key: string;
};

export async function saveApplication(record: ApplicationRecord) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const response = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/career_applications`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });
    if (!response.ok) {
      throw new Error(
        `Saving the application failed with ${response.status}: ${await response.text()}`,
      );
    }
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.appendFile(LOCAL_FILE, `${JSON.stringify(record)}\n`, "utf8");
}

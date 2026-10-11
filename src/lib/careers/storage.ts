import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { AwsClient } from "aws4fetch";

/**
 * Private resume storage. Two adapters, chosen by environment:
 *
 * 1. RESUME_S3_* set → upload to a PRIVATE S3-compatible bucket and return a time-limited signed
 *    link. Works with AWS S3, Cloudflare R2 and Supabase Storage (via its S3 endpoint). The bucket
 *    must not allow public reads — the signed link is the only way in.
 * 2. Otherwise → write to .data/careers/resumes/ (git-ignored) and return a file:// link.
 *    Local development and single-server hosting only.
 */

const LOCAL_DIR = path.join(process.cwd(), ".data", "careers", "resumes");
// S3 caps presigned URLs at 7 days.
const MAX_EXPIRY_DAYS = 7;

export type StoredResume = { key: string; link: string; expiresInDays: number | null };

function s3Config() {
  const endpoint = process.env.RESUME_S3_ENDPOINT;
  const bucket = process.env.RESUME_S3_BUCKET;
  const accessKeyId = process.env.RESUME_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.RESUME_S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return {
    endpoint: endpoint.replace(/\/+$/, ""),
    bucket,
    client: new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: "s3",
      region: process.env.RESUME_S3_REGION || "auto",
    }),
  };
}

export async function storeResume(
  id: string,
  bytes: Uint8Array<ArrayBuffer>,
): Promise<StoredResume> {
  const s3 = s3Config();

  if (s3) {
    const key = `resumes/${id}.pdf`;
    // Path-style URLs work across S3, R2 and Supabase.
    const objectUrl = `${s3.endpoint}/${s3.bucket}/${key}`;
    const upload = await s3.client.fetch(objectUrl, {
      method: "PUT",
      body: bytes,
      headers: { "Content-Type": "application/pdf" },
    });
    if (!upload.ok) throw new Error(`Resume upload failed with ${upload.status}`);

    const days = Math.min(
      MAX_EXPIRY_DAYS,
      Math.max(1, Number(process.env.RESUME_LINK_EXPIRY_DAYS) || MAX_EXPIRY_DAYS),
    );
    const url = new URL(objectUrl);
    url.searchParams.set("X-Amz-Expires", String(days * 24 * 60 * 60));
    const signed = await s3.client.sign(new Request(url, { method: "GET" }), {
      aws: { signQuery: true },
    });
    return { key, link: signed.url, expiresInDays: days };
  }

  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const file = path.join(LOCAL_DIR, `${id}.pdf`);
  await fs.writeFile(file, bytes);
  return {
    key: path.relative(process.cwd(), file),
    link: pathToFileURL(file).href,
    expiresInDays: null,
  };
}

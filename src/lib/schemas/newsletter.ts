import { z } from "zod";
import "@/lib/schemas/zodJitless";

/** Shared by the newsletter form (client) and POST /api/newsletter (server). */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Add your email address.")
    .max(254, "That address is longer than email allows.")
    .email("That email address doesn't look right."),
  /**
   * Honeypot: hidden from people, so only bots fill it in. Accepted here (not rejected) so the API
   * can answer bots with a quiet success instead of an error that reveals the trap.
   */
  website: z.string().max(500).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

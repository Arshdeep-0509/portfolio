import { z } from "zod";
import "@/lib/schemas/zodJitless";

/** Shared by the newsletter form (client) and POST /api/newsletter (server). */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(254, "That email address is too long.")
    .email("Please enter a valid email address."),
  /**
   * Honeypot: hidden from people, so only bots fill it in. Accepted here (not rejected) so the API
   * can answer bots with a quiet success instead of an error that reveals the trap.
   */
  website: z.string().max(500).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/**
 * Real testimonials only — never invent quotes, names, companies or ratings.
 * The pull-quote renders nothing while siteConfig.featureFlags.testimonials is false.
 * Replace the placeholder below with real, permission-granted quotes before turning the flag on.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Link to the person's LinkedIn profile or the original review, for verification. */
  linkedinUrl?: string;
  /** Related service slug. */
  service?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "[ADD REAL TESTIMONIAL]",
    name: "[CLIENT_NAME]",
    role: "[CLIENT_ROLE]",
    company: "[CLIENT_COMPANY]",
  },
];

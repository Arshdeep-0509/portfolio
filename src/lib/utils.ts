import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { LOCALE, SITE_URL } from "@/lib/constants";

/**
 * tailwind-merge must know the custom theme keys from globals.css. Otherwise it reads
 * `text-small` as a colour and silently drops `text-white` from the same class list.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["h1", "h2", "h3", "body", "small", "eyebrow"],
      radius: ["pill"],
      shadow: ["card", "card-hover", "nav"],
      spacing: ["card"],
      font: ["heading"],
    },
  },
});

/** Merge conditional class names and resolve Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a date for display, e.g. "10 October 2026". Accepts ISO strings or Date objects. */
export function formatDate(
  input: string | number | Date,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE, { timeZone: "Asia/Kolkata", ...options }).format(date);
}

/** Turn a site-relative path ("/about") into an absolute URL. Absolute URLs pass through. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

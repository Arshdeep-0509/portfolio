"use client";

import dynamic from "next/dynamic";

// Server-rendered as normal on their own pages. Being dynamic keeps react-hook-form and zod out of
// the route's prefetch, which every page with a link to /contact would otherwise download.
export const LazyContactForm = dynamic(() =>
  import("@/components/sections/contact/ContactForm").then((mod) => mod.ContactForm),
);
export const LazyApplicationForm = dynamic(() =>
  import("@/components/sections/collaborate/ApplicationForm").then((mod) => mod.ApplicationForm),
);

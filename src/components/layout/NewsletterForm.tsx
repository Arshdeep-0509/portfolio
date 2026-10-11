"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, CircleCheck } from "lucide-react";
import { FieldError } from "@/components/ui/form/Field";
import { trackEvent } from "@/lib/analytics";
import { newsletterSchema, type NewsletterInput } from "@/lib/schemas/newsletter";

export type NewsletterCopy = {
  title: string;
  text: string;
  emailLabel: string;
  submit: string;
  success: string;
  error: string;
  privacy: { label: string; href: string };
};

/**
 * Compact email sign-up for the footer: one underlined field and an arrow button, posting to
 * /api/newsletter. Validation runs in the browser and again on the server.
 */
export function NewsletterForm({ copy, location }: { copy: NewsletterCopy; location: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: NewsletterInput) {
    setServerError(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setServerError(data.error ?? copy.error);
        return;
      }
      trackEvent("newsletter_signup", { location });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setServerError(copy.error);
    }
  }

  const emailError = errors.email?.message;
  const inputId = `newsletter-email-${location}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      <p className="font-display-soft text-xl text-fg">{copy.title}</p>
      <p className="mt-2 text-small text-fg-muted">{copy.text}</p>
      <label htmlFor={inputId} className="mt-5 block label-mono text-fg-muted">
        {copy.emailLabel}
      </label>
      <div className="mt-1 flex items-center border-b border-fg-muted/50 focus-within:border-lamp-400">
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${inputId}-error` : undefined}
          className="min-h-12 w-full bg-transparent text-body text-fg placeholder:text-fg-muted/70 focus-visible:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 pl-3 text-small font-semibold text-lamp-400 hover:text-lamp-500 disabled:opacity-50"
        >
          {copy.submit}
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
        </button>
      </div>
      <FieldError id={`${inputId}-error`}>{emailError}</FieldError>
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${inputId}-website`}>Website</label>
        <input
          id={`${inputId}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <div aria-live="polite" className="mt-2 min-h-6 text-small">
        {status === "success" ? (
          <p className="flex items-center gap-2 text-success-fg">
            <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-4" /> {copy.success}
          </p>
        ) : null}
        {status === "error" && serverError ? <p className="text-danger-fg">{serverError}</p> : null}
      </div>
      <p className="text-xs text-fg-muted">
        Signing up means you accept the{" "}
        <Link href={copy.privacy.href} className="underline underline-offset-2 hover:text-fg">
          {copy.privacy.label}
        </Link>
        .
      </p>
    </form>
  );
}

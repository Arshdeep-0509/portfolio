"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldError, Label } from "@/components/ui/form/Field";
import { Input } from "@/components/ui/form/Input";
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
 * Compact email sign-up for the footer: a labelled field and a secondary button, posting to
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
      <p className="text-xl font-semibold text-ink">{copy.title}</p>
      <p className="mt-2 text-small text-ink-muted">{copy.text}</p>
      <Label htmlFor={inputId} className="mt-5">
        {copy.emailLabel}
      </Label>
      <Input
        id={inputId}
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@company.com"
        invalid={Boolean(emailError)}
        aria-describedby={emailError ? `${inputId}-error` : undefined}
        {...register("email")}
      />
      <FieldError id={`${inputId}-error`}>{emailError}</FieldError>
      <Button
        type="submit"
        variant="outline"
        loading={isSubmitting}
        className="mt-3 w-full"
        rightIcon={<ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />}
      >
        {copy.submit}
      </Button>
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
      <div aria-live="polite" className="mt-3 mb-2 min-h-6 text-small">
        {status === "success" ? (
          <p className="flex items-start gap-2 text-success">
            <CircleCheck aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />{" "}
            {copy.success}
          </p>
        ) : null}
        {status === "error" ? <FieldError className="mt-0">{serverError}</FieldError> : null}
      </div>
      <p className="text-xs text-ink-muted">
        Signing up means you accept the{" "}
        <Link href={copy.privacy.href} className="underline underline-offset-2 hover:text-ink">
          {copy.privacy.label}
        </Link>
        .
      </p>
    </form>
  );
}

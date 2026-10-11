"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldError, Label } from "@/components/ui/form/Field";
import { Input } from "@/components/ui/form/Input";
import { trackEvent } from "@/lib/analytics";
import { newsletterSchema, type NewsletterInput } from "@/lib/schemas/newsletter";

type NewsletterCopy = {
  title: string;
  text: string;
  emailLabel: string;
  submit: string;
  success: string;
  error: string;
  privacy: { label: string; href: string };
};

/** Email sign-up posting to /api/newsletter. Validation runs in the browser and on the server. */
export function NewsletterCard({ copy }: { copy: NewsletterCopy }) {
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
      trackEvent("newsletter_signup", { location: "insights" });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setServerError(copy.error);
    }
  }

  const emailError = errors.email?.message;

  return (
    <div className="tone-gradient relative overflow-hidden rounded-xl bg-grad-cta p-8 text-white shadow-card-hover sm:p-10">
      <div aria-hidden="true" className="absolute inset-0 bg-dots" />
      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        <div>
          <Mail aria-hidden="true" className="size-8 text-tone-accent" />
          <h2 className="mt-4 text-h2 font-extrabold tracking-tight text-white">{copy.title}</h2>
          <p className="mt-3 text-white">{copy.text}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="tone-light rounded-lg bg-surface p-5 text-ink"
        >
          <Label htmlFor="newsletter-email">{copy.emailLabel}</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              invalid={Boolean(emailError)}
              aria-describedby={emailError ? "newsletter-email-error" : undefined}
              {...register("email")}
            />
            <Button type="submit" loading={isSubmitting} className="shrink-0">
              {copy.submit}
            </Button>
          </div>
          <FieldError id="newsletter-email-error">{emailError}</FieldError>
          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="newsletter-website">Website</label>
            <input
              id="newsletter-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>
          <div aria-live="polite" className="mt-3 min-h-6 text-small">
            {status === "success" ? (
              <p className="flex items-center gap-2 font-semibold text-success-strong">
                <CircleCheck aria-hidden="true" className="size-4" /> {copy.success}
              </p>
            ) : null}
            {status === "error" && serverError ? (
              <p className="text-danger">{serverError}</p>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted">
            By subscribing you agree to the{" "}
            <Link href={copy.privacy.href} className="font-semibold text-primary underline">
              {copy.privacy.label}
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

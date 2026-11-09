"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { FieldError, Label } from "@/components/ui/form/Field";
import { Input } from "@/components/ui/form/Input";
import { Turnstile } from "@/components/ui/form/Turnstile";
import { useToast } from "@/components/ui/Toast";
import { quickStartCopy as copy } from "@/content/quickStart";
import { trackEvent } from "@/lib/analytics";
import {
  contactFormSchema,
  MESSAGE_MAX,
  QUICK_SERVICE,
  type ContactFormInput,
  type ContactRequest,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const FIELDS = ["name", "email", "message", "consent"] as const;

/**
 * The three-field form in the closing section (name, email, one-line idea). It posts to
 * /api/contact as a "quick" enquiry, with the same validation, spam checks and error toast as the
 * full form. The Turnstile widget (when configured) loads only after the visitor starts typing,
 * so no third-party script runs on every page view.
 */
export function QuickStartForm({ emailHref }: { emailHref: string | null }) {
  const toast = useToast();
  const [startedAt, setStartedAt] = useState(0);
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [summary, setSummary] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phoneCountry: "+91",
      phone: "",
      service: QUICK_SERVICE,
      budgetCurrency: "INR",
      message: "",
      nda: false,
      website: "",
    },
  });

  function fail(text: string) {
    toast({
      type: "error",
      title: copy.error.title,
      description: text,
      duration: 10000,
      ...(emailHref ? { action: { label: copy.error.fallback, href: emailHref } } : {}),
    });
  }

  async function onSubmit(values: ContactFormInput) {
    setSummary("");
    if (TURNSTILE_SITE_KEY && !token) {
      setSummary(copy.error.botCheck);
      return;
    }
    const payload: ContactRequest = {
      ...values,
      startedAt,
      turnstileToken: token ?? undefined,
      sourcePage: `${window.location.pathname}${window.location.search}`,
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as ContactResponse | null;
      if (response.ok && data?.ok) {
        trackEvent("generate_lead", {
          form: "quick-start",
          service: QUICK_SERVICE,
          budget: "not_given",
        });
        setSent(true);
        return;
      }
      if (data && !data.ok && data.fieldErrors) {
        const fields = FIELDS.filter((field) => data.fieldErrors?.[field]);
        fields.forEach((field) => setError(field, { message: data.fieldErrors?.[field] }));
        if (fields[0]) setFocus(fields[0]);
      }
      fail(data && !data.ok ? data.error : copy.error.retry);
    } catch {
      fail(copy.error.offline);
    } finally {
      setToken(null);
      setWidgetKey((key) => key + 1);
    }
  }

  const describe = (field: (typeof FIELDS)[number]) =>
    errors[field] ? `quick-${field}-error` : undefined;

  return sent ? (
    <div className="rounded-card border border-success bg-surface p-8">
      <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-8 text-success" />
      <h3
        ref={(heading) => heading?.focus()}
        tabIndex={-1}
        className="mt-4 text-h3 text-ink outline-none"
      >
        {copy.success.title}
      </h3>
      <p className="mt-3 text-ink-muted">{copy.success.text}</p>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={() => {
        if (!startedAt) setStartedAt(Date.now());
      }}
      noValidate
      aria-label="Quick enquiry"
      className="relative grid gap-5 sm:grid-cols-2"
    >
      <div>
        <Label htmlFor="quick-name" required>
          {copy.fields.name}
        </Label>
        <Input
          id="quick-name"
          autoComplete="name"
          invalid={Boolean(errors.name)}
          aria-describedby={describe("name")}
          aria-required="true"
          {...register("name")}
        />
        <FieldError id="quick-name-error">{errors.name?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="quick-email" required>
          {copy.fields.email}
        </Label>
        <Input
          id="quick-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          aria-describedby={describe("email")}
          aria-required="true"
          {...register("email")}
        />
        <FieldError id="quick-email-error">{errors.email?.message}</FieldError>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="quick-message" required>
          {copy.fields.idea}
        </Label>
        <Input
          id="quick-message"
          maxLength={MESSAGE_MAX}
          placeholder={copy.fields.ideaPlaceholder}
          invalid={Boolean(errors.message)}
          aria-describedby={describe("message")}
          aria-required="true"
          {...register("message")}
        />
        <FieldError id="quick-message-error">{errors.message?.message}</FieldError>
      </div>
      <div className="sm:col-span-2">
        <Checkbox
          id="quick-consent"
          invalid={Boolean(errors.consent)}
          aria-describedby={describe("consent")}
          aria-required="true"
          label={
            <>
              {copy.consent.before}{" "}
              <Link href={copy.consent.href} className="text-link underline underline-offset-4">
                {copy.consent.link}
              </Link>
              <span aria-hidden="true" className="ml-0.5 text-danger">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          }
          {...register("consent")}
        />
        <FieldError id="quick-consent-error" className="mt-0">
          {errors.consent?.message}
        </FieldError>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="quick-website">Website</label>
        <input
          id="quick-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {TURNSTILE_SITE_KEY && startedAt ? (
        <div className="sm:col-span-2">
          <Turnstile key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={setToken} />
        </div>
      ) : null}

      <p
        aria-live="assertive"
        className={cn(
          "flex items-center gap-1.5 text-small font-semibold text-danger sm:col-span-2",
          !summary && "sr-only",
        )}
      >
        {summary ? (
          <CircleAlert aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
        ) : null}
        {summary}
      </p>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={isSubmitting}>
          {isSubmitting ? copy.sending : copy.submit}
        </Button>
      </div>
    </form>
  );
}

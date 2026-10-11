"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, CircleCheck } from "lucide-react";
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
 * The closing section of every page except /contact: night sky with the horizon glow, one serif
 * line, and a three-field form (name, email, one-line idea) that posts to /api/contact as a
 * "quick" enquiry. Same validation, spam checks, success state and error toast as the full form.
 * The Turnstile widget (when configured) loads only after the visitor starts typing, so no
 * third-party script runs on every page view.
 */
export function QuickStart({ emailHref }: { emailHref: string | null }) {
  const pathname = usePathname();
  const toast = useToast();
  const [startedAt, setStartedAt] = useState(0);
  const [sentName, setSentName] = useState<string | null>(null);
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

  if (pathname === "/contact") return null;

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
        setSentName(values.name.trim().split(/\s+/)[0] ?? values.name);
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

  return (
    <section
      aria-labelledby="quick-start-title"
      className="tone-night relative isolate overflow-hidden bg-night-950 bg-grad-horizon text-fg print:hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-stars" />
      <div className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="label-mono text-accent">{copy.label}</p>
            <h2 id="quick-start-title" data-reveal="mask" className="mt-6 text-h2 text-fg">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-md text-fg-muted">{copy.text}</p>
            <Link
              href={copy.fullForm.href}
              className="group/button mt-6 inline-flex min-h-11 items-center gap-1.5 link-underline font-semibold text-fg hover:text-accent"
            >
              {copy.fullForm.label}
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 transition-transform group-hover/button:translate-x-[3px]"
              />
            </Link>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {sentName ? (
              <div className="rounded-card border border-lamp-500/50 bg-night-800/60 p-8">
                <CircleCheck
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-8 text-lamp-400"
                />
                <h3
                  ref={(heading) => heading?.focus()}
                  tabIndex={-1}
                  className="mt-4 text-h3 text-fg outline-none"
                >
                  {copy.success.title.replace("{firstName}", sentName)}
                </h3>
                <p className="mt-3 text-fg-muted">{copy.success.text}</p>
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
                        <Link
                          href={copy.consent.href}
                          className="text-accent underline underline-offset-4"
                        >
                          {copy.consent.link}
                        </Link>
                        <span aria-hidden="true" className="ml-0.5 text-danger-fg">
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
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                >
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
                    "text-small font-semibold text-danger-fg sm:col-span-2",
                    !summary && "sr-only",
                  )}
                >
                  {summary}
                </p>

                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" loading={isSubmitting}>
                    {isSubmitting ? copy.sending : copy.submit}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

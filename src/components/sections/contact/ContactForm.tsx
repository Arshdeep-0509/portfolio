"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CircleCheck, Mail } from "lucide-react";
import { CalendlyButton } from "@/components/sections/contact/CalendlyButton";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { FieldError, Label } from "@/components/ui/form/Field";
import { Input, Select } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { Turnstile } from "@/components/ui/form/Turnstile";
import { useToast } from "@/components/ui/Toast";
import { trackEvent } from "@/lib/analytics";
import {
  budgetOptions,
  contactFormSchema,
  countryCodes,
  currencies,
  heardFromOptions,
  MESSAGE_MAX,
  MESSAGE_MIN,
  serviceFromQuery,
  serviceOptions,
  timelineOptions,
  type ContactFormInput,
  type ContactRequest,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  copy: {
    detailsHeading: string;
    projectHeading: string;
    messagePlaceholder: string;
    submit: string;
    success: { title: string; text: string; book: string; home: string };
    errorToast: { title: string; fallback: string };
  };
  /** Real mailto: link for the error fallback, or null while the email is a placeholder. */
  emailHref: string | null;
  /** Real Calendly URL, or null while it is a placeholder. */
  calendlyUrl: string | null;
  privacyHref: string;
};

type FieldName = keyof ContactFormInput;

const FIELD_ORDER: FieldName[] = [
  "name",
  "email",
  "phoneCountry",
  "phone",
  "company",
  "service",
  "budget",
  "timeline",
  "message",
  "heardFrom",
  "nda",
  "consent",
];

// Inlined at build time; without it the widget is skipped and the server skips verification too.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Keeps a live region mounted so errors that appear on blur are announced. */
function ErrorSlot({ id, message }: { id: string; message?: string }) {
  return (
    <div aria-live="polite">
      <FieldError id={id}>{message}</FieldError>
    </div>
  );
}

/**
 * Project enquiry form. Validates on blur with the same zod schema the API uses, then POSTs JSON
 * to /api/contact. "How can I help?" is pre-filled from ?service= or ?topic=.
 */
export function ContactForm({ copy, emailHref, calendlyUrl, privacyHref }: ContactFormProps) {
  const toast = useToast();
  // When the visitor first focuses the form; the server treats very fast (or missing) times as bots.
  const [startedAt, setStartedAt] = useState(0);
  const [sentName, setSentName] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    setValue,
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
      company: "",
      budgetCurrency: "INR",
      budget: "",
      timeline: "",
      message: "",
      heardFrom: "",
      nda: false,
      website: "",
    },
  });

  const currency = useWatch({ control, name: "budgetCurrency" });
  const message = useWatch({ control, name: "message" }) ?? "";
  const remaining = Math.max(0, MESSAGE_MIN - message.trim().length);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = serviceFromQuery(params.get("service"), params.get("topic"));
    if (service) setValue("service", service, { shouldDirty: true });
  }, [setValue]);

  function showFailure(text: string) {
    toast({
      type: "error",
      title: copy.errorToast.title,
      description: text,
      duration: 10000,
      ...(emailHref ? { action: { label: copy.errorToast.fallback, href: emailHref } } : {}),
    });
  }

  async function onSubmit(values: ContactFormInput) {
    setSummary("");
    if (TURNSTILE_SITE_KEY && !token) {
      setSummary("Please complete the quick human check above the button.");
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
          form: "contact",
          service: values.service,
          budget: values.budget ? `${values.budget} (${values.budgetCurrency})` : "not_given",
        });
        setSentName(values.name.trim().split(/\s+/)[0] ?? values.name);
        return;
      }

      if (data && !data.ok && data.fieldErrors) {
        const fields = FIELD_ORDER.filter((field) => data.fieldErrors?.[field]);
        fields.forEach((field) => setError(field, { message: data.fieldErrors?.[field] }));
        if (fields[0]) setFocus(fields[0]);
      }
      showFailure(data && !data.ok ? data.error : "Please try again in a moment.");
    } catch {
      showFailure("Check your connection and try again.");
    } finally {
      // Turnstile tokens are single-use: get a fresh one for the next attempt.
      setToken(null);
      setWidgetKey((key) => key + 1);
    }
  }

  function onInvalid(invalid: Partial<Record<FieldName, unknown>>) {
    const count = Object.keys(invalid).length;
    setSummary(`Please fix ${count} field${count === 1 ? "" : "s"} before sending.`);
  }

  if (sentName) {
    return (
      <div className="tone-light rounded-xl border border-border bg-surface p-8 text-center shadow-card sm:p-12">
        <CircleCheck aria-hidden="true" className="mx-auto size-12 text-success" />
        <h3
          ref={(heading) => heading?.focus()}
          tabIndex={-1}
          className="mt-4 text-h3 font-bold text-ink outline-none"
        >
          {copy.success.title.replace("{firstName}", sentName)}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-muted">{copy.success.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {calendlyUrl ? (
            <CalendlyButton
              url={calendlyUrl}
              label={copy.success.book}
              modalTitle={copy.success.book}
            />
          ) : null}
          <Button href="/" variant="outline">
            {copy.success.home}
          </Button>
        </div>
      </div>
    );
  }

  const describe = (field: FieldName, extra?: string) =>
    [extra, errors[field] ? `contact-${field}-error` : null].filter(Boolean).join(" ") || undefined;

  const legend = "font-heading text-small font-bold tracking-wide text-primary uppercase";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onFocusCapture={() => {
        if (!startedAt) setStartedAt(Date.now());
      }}
      noValidate
      aria-label="Project enquiry"
      className="tone-light relative rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8"
    >
      <fieldset>
        <legend className={legend}>{copy.detailsHeading}</legend>
        <div className="mt-4 grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="contact-name" required>
              Full name
            </Label>
            <Input
              id="contact-name"
              autoComplete="name"
              invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
              aria-required="true"
              {...register("name")}
            />
            <ErrorSlot id="contact-name-error" message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="contact-email" required>
              Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              aria-describedby={describe("email")}
              aria-required="true"
              {...register("email")}
            />
            <ErrorSlot id="contact-email-error" message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="contact-phone" required>
              Phone
            </Label>
            <div className="flex gap-2">
              <div className="w-28 shrink-0">
                <Select
                  aria-label="Country code"
                  autoComplete="tel-country-code"
                  className="pr-8 pl-3"
                  {...register("phoneCountry")}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Input
                id="contact-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="98765 43210"
                invalid={Boolean(errors.phone)}
                aria-describedby={describe("phone")}
                aria-required="true"
                {...register("phone")}
              />
            </div>
            <ErrorSlot id="contact-phone-error" message={errors.phone?.message} />
          </div>
          <div>
            <Label htmlFor="contact-company">Company / organisation</Label>
            <Input
              id="contact-company"
              autoComplete="organization"
              placeholder="Optional"
              invalid={Boolean(errors.company)}
              aria-describedby={describe("company")}
              {...register("company")}
            />
            <ErrorSlot id="contact-company-error" message={errors.company?.message} />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-border pt-6">
        <legend className={cn(legend, "float-left w-full")}>{copy.projectHeading}</legend>
        <div className="clear-both grid gap-x-5 gap-y-5 pt-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="contact-service" required>
              How can I help?
            </Label>
            <Select
              id="contact-service"
              placeholder="Choose one"
              defaultValue=""
              invalid={Boolean(errors.service)}
              aria-describedby={describe("service")}
              aria-required="true"
              {...register("service")}
            >
              {serviceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
            <ErrorSlot id="contact-service-error" message={errors.service?.message} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <Label htmlFor="contact-budget" className="mb-0">
                Budget range
              </Label>
              <div
                role="radiogroup"
                aria-label="Budget currency"
                className="inline-flex rounded-pill border border-border p-0.5"
              >
                {currencies.map((code) => (
                  <label
                    key={code}
                    className="cursor-pointer rounded-pill px-3 py-1 font-mono text-xs font-medium text-muted has-[:checked]:bg-primary has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary"
                  >
                    <input
                      type="radio"
                      value={code}
                      className="sr-only"
                      {...register("budgetCurrency")}
                    />
                    {code}
                  </label>
                ))}
              </div>
            </div>
            <Select id="contact-budget" {...register("budget")}>
              <option value="">Prefer not to say</option>
              {budgetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option[currency ?? "INR"]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="contact-timeline">Timeline</Label>
            <Select id="contact-timeline" {...register("timeline")}>
              <option value="">Not sure yet</option>
              {timelineOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="contact-message" required>
              Your message
            </Label>
            <Textarea
              id="contact-message"
              rows={6}
              maxLength={MESSAGE_MAX}
              showCount={false}
              placeholder={copy.messagePlaceholder}
              invalid={Boolean(errors.message)}
              aria-describedby={describe("message", "contact-message-count")}
              aria-required="true"
              {...register("message")}
            />
            <p
              id="contact-message-count"
              className={cn(
                "mt-1.5 flex justify-between gap-3 font-mono text-xs",
                remaining > 0 ? "text-muted" : "text-success-strong",
              )}
            >
              <span>
                {remaining > 0
                  ? `${remaining} more character${remaining === 1 ? "" : "s"} needed (min ${MESSAGE_MIN})`
                  : "Looks good"}
              </span>
              <span>
                {message.length} / {MESSAGE_MAX}
              </span>
            </p>
            <ErrorSlot id="contact-message-error" message={errors.message?.message} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="contact-heard">How did you hear about me?</Label>
            <Select id="contact-heard" {...register("heardFrom")}>
              <option value="">Prefer not to say</option>
              {heardFromOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Checkbox id="contact-nda" label="I need an NDA first" {...register("nda")} />
            <Checkbox
              id="contact-consent"
              invalid={Boolean(errors.consent)}
              aria-describedby={describe("consent")}
              aria-required="true"
              label={
                <>
                  I agree to the{" "}
                  <Link href={privacyHref} className="font-semibold text-primary underline">
                    Privacy Policy
                  </Link>
                  <span aria-hidden="true" className="ml-0.5 text-danger">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </>
              }
              {...register("consent")}
            />
            <ErrorSlot id="contact-consent-error" message={errors.consent?.message} />
          </div>
        </div>
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {TURNSTILE_SITE_KEY ? (
        <div className="mt-6">
          <Turnstile key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={setToken} />
        </div>
      ) : null}

      <p
        aria-live="assertive"
        className={cn("text-small font-semibold text-danger", summary && "mt-6")}
      >
        {summary}
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Sending…" : copy.submit}
        </Button>
        {emailHref ? (
          <a
            href={emailHref}
            className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Mail aria-hidden="true" className="size-4" />
            Or email me directly
          </a>
        ) : null}
      </div>
    </form>
  );
}

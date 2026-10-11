"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CircleCheck } from "lucide-react";
import { CalendlyButton } from "@/components/sections/contact/CalendlyButton";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import {
  ChoiceChips,
  SegmentedControl,
  SelectableCard,
  Toggle,
} from "@/components/ui/form/Choices";
import { FieldError, Label } from "@/components/ui/form/Field";
import { Input, Select } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { Turnstile } from "@/components/ui/form/Turnstile";
import { FormWizard } from "@/components/ui/FormWizard";
import { useToast } from "@/components/ui/Toast";
import type { contactContent } from "@/content/contact";
import { trackEvent } from "@/lib/analytics";
import {
  budgetLabel,
  budgetOptions,
  contactFormSchema,
  countryCodes,
  heardFromOptions,
  MESSAGE_MAX,
  MESSAGE_MIN,
  optionLabel,
  selectableServiceOptions,
  servicesFromQuery,
  timelineOptions,
  type ContactFormInput,
  type ContactRequest,
  type ContactResponse,
} from "@/lib/schemas/contact";
import { useUrlSearch } from "@/lib/useUrlSearch";
import { cn, pad2 } from "@/lib/utils";

type FormCopy = (typeof contactContent)["form"];
type FieldName = keyof ContactFormInput;
type ServiceId = ContactFormInput["service"];

/** Fields validated on steps 2 and 3 (step 1 is the service selection). */
const STEP_FIELDS: FieldName[][] = [
  ["service"],
  ["budget", "timeline", "message", "nda"],
  ["name", "email", "phoneCountry", "phone", "company", "heardFrom", "consent"],
];

// Inlined at build time; without it the widget is skipped and the server skips verification too.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type ContactFormProps = {
  copy: FormCopy;
  /** Real mailto: link for the error fallback, or null while the email is a placeholder. */
  emailHref: string | null;
  /** Real Calendly URL, or null while it is a placeholder. */
  calendlyUrl: string | null;
  calendlyTitle: string;
  privacyHref: string;
};

/**
 * The project enquiry as a three-step wizard on the shared schema and /api/contact:
 * 1. What do you need? — services as selectable cards (several allowed; the first becomes the
 *    `service` field and the rest are added to the message);
 * 2. About the project — budget, currency, timeline, message with a live counter, NDA;
 * 3. About you — contact details and consent, then a review and Submit.
 * Query parameters pre-select services (?service=, ?topic=, ?bundle=, ?services=).
 */
export function ContactForm({
  copy,
  emailHref,
  calendlyUrl,
  calendlyTitle,
  privacyHref,
}: ContactFormProps) {
  const toast = useToast();
  const [startedAt, setStartedAt] = useState(0);
  const [sentName, setSentName] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [step, setStep] = useState(0);
  // Until the visitor changes the selection, it comes from the URL (?bundle=, ?service=…).
  const query = useUrlSearch();
  const [chosen, setChosen] = useState<ServiceId[] | null>(null);
  const picked = chosen ?? servicesFromQuery(query);
  const [pickError, setPickError] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    trigger,
    getFieldState,
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

  /**
   * register() plus one rule: a field that is currently showing an error re-checks itself on every
   * change. Without it the error only clears on blur, so the first click on Next blurs the field,
   * the message disappears, the button moves up under the pointer and the click is lost.
   */
  const field = (name: keyof ContactFormInput) =>
    register(name, {
      onChange: () => {
        if (getFieldState(name).error) void trigger(name);
      },
    });

  const values = useWatch({ control });
  const message = values.message ?? "";
  const remaining = Math.max(0, MESSAGE_MIN - message.trim().length);
  const currency = values.budgetCurrency ?? "INR";

  function choose(next: ServiceId[]) {
    setChosen(next);
    setPickError(false);
  }

  // The first selected option is the form's `service` field.
  const lead = picked[0];
  useEffect(() => {
    if (lead) setValue("service", lead, { shouldDirty: true });
  }, [lead, setValue]);

  function stepOf(field: FieldName) {
    return STEP_FIELDS.findIndex((group) => group.includes(field));
  }

  function goToFirstError(fields: FieldName[]) {
    const first = [...fields].sort((a, b) => stepOf(a) - stepOf(b))[0];
    if (!first) return;
    setStep(Math.max(0, stepOf(first)));
    requestAnimationFrame(() => setFocus(first));
  }

  async function validateStep(index: number) {
    if (index === 0) {
      const ok = picked.length > 0;
      setPickError(!ok);
      if (!ok) requestAnimationFrame(() => document.getElementById("contact-service-0")?.focus());
      return ok;
    }
    return trigger(STEP_FIELDS[index], { shouldFocus: true });
  }

  function showFailure(text: string) {
    toast({
      type: "error",
      title: copy.errorToast.title,
      description: text,
      duration: 10000,
      ...(emailHref ? { action: { label: copy.errorToast.fallback, href: emailHref } } : {}),
    });
  }

  async function onSubmit(data: ContactFormInput) {
    setSummary("");
    if (TURNSTILE_SITE_KEY && !token) {
      setSummary(copy.botCheck);
      return;
    }
    const extras = picked.slice(1).map((id) => optionLabel(selectableServiceOptions, id));
    const payload: ContactRequest = {
      ...data,
      service: picked[0] ?? data.service,
      message: extras.length
        ? `${data.message}\n\n${copy.alsoInterested}: ${extras.join(", ")}`
        : data.message,
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
      const result = (await response.json().catch(() => null)) as ContactResponse | null;
      if (response.ok && result?.ok) {
        trackEvent("generate_lead", {
          form: "contact",
          service: payload.service,
          budget: data.budget ? `${data.budget} (${data.budgetCurrency})` : "not_given",
        });
        setSentName(data.name.trim().split(/\s+/)[0] ?? data.name);
        return;
      }
      if (result && !result.ok && result.fieldErrors) {
        const fields = (Object.keys(result.fieldErrors) as FieldName[]).filter(
          (field) => stepOf(field) !== -1,
        );
        fields.forEach((field) => setError(field, { message: result.fieldErrors?.[field] }));
        goToFirstError(fields);
      }
      showFailure(result && !result.ok ? result.error : copy.errorToast.retry);
    } catch {
      showFailure(copy.errorToast.offline);
    } finally {
      setToken(null);
      setWidgetKey((key) => key + 1);
    }
  }

  function onInvalid(invalid: Partial<Record<FieldName, unknown>>) {
    const fields = Object.keys(invalid) as FieldName[];
    setSummary(copy.fixFields.replace("{n}", String(fields.length)));
    goToFirstError(fields);
  }

  if (sentName) {
    return (
      <div className="rounded-card border border-lamp-500/60 p-8 sm:p-12">
        <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-10 text-success-fg" />
        <h2
          ref={(heading) => heading?.focus()}
          tabIndex={-1}
          className="mt-4 text-h3 text-fg outline-none"
        >
          {copy.success.title.replace("{firstName}", sentName)}
        </h2>
        <p className="mt-3 max-w-md text-fg-muted">{copy.success.text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {calendlyUrl ? (
            <CalendlyButton
              url={calendlyUrl}
              label={copy.success.book}
              modalTitle={calendlyTitle}
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
  const pickedLabels = picked
    .map((id) => optionLabel(selectableServiceOptions, id))
    .filter(Boolean);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onFocusCapture={() => {
        if (!startedAt) setStartedAt(Date.now());
      }}
      noValidate
      aria-label={copy.ariaLabel}
      className="relative"
    >
      <FormWizard
        step={step}
        onStepChange={setStep}
        validateStep={validateStep}
        submitLabel={isSubmitting ? copy.sending : copy.submit}
        submitting={isSubmitting}
        reviewTitle={copy.reviewTitle}
        review={
          <dl className="grid gap-x-8 gap-y-3 text-small sm:grid-cols-2">
            {[
              [copy.review.services, pickedLabels.join(", ")],
              [copy.review.budget, budgetLabel(values.budget, currency) ?? copy.noAnswer],
              [
                copy.review.timeline,
                optionLabel(timelineOptions, values.timeline) ?? copy.noAnswer,
              ],
              [copy.review.nda, values.nda ? copy.review.yes : copy.review.no],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="label-mono text-fg-muted">{term}</dt>
                <dd className="mt-0.5 text-fg">{detail || "—"}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="label-mono text-fg-muted">{copy.message}</dt>
              <dd className="mt-0.5 line-clamp-3 text-fg">{message || "—"}</dd>
            </div>
          </dl>
        }
        footer={
          <>
            <p
              aria-live="assertive"
              className={cn("mb-4 text-small font-semibold text-danger-fg", !summary && "sr-only")}
            >
              {summary}
            </p>
            <ul className="flex flex-col gap-1.5 text-small text-fg-muted sm:flex-row sm:gap-6">
              {copy.reassurance.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-dot bg-lamp-500" />
                  {line}
                </li>
              ))}
            </ul>
          </>
        }
        steps={[
          {
            id: "need",
            title: copy.steps.need.title,
            description: copy.steps.need.description,
            content: (
              <fieldset aria-describedby={pickError ? "contact-service-error" : undefined}>
                <legend className="sr-only">{copy.steps.need.title}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectableServiceOptions.map((option, index) => {
                    const order = picked.indexOf(option.id);
                    return (
                      <SelectableCard
                        key={option.id}
                        id={`contact-service-${index}`}
                        name="services"
                        value={option.id}
                        title={option.label}
                        checked={order !== -1}
                        onChange={(event) =>
                          choose(
                            event.target.checked
                              ? [...picked, option.id]
                              : picked.filter((id) => id !== option.id),
                          )
                        }
                        leading={
                          order === 0 ? (
                            <span className="font-mono text-[10px] tracking-wider text-accent uppercase">
                              {pad2(1)}
                            </span>
                          ) : undefined
                        }
                      />
                    );
                  })}
                </div>
                <FieldError id="contact-service-error">
                  {pickError ? copy.servicesError : errors.service?.message}
                </FieldError>
              </fieldset>
            ),
          },
          {
            id: "project",
            title: copy.steps.project.title,
            description: copy.steps.project.description,
            content: (
              <div className="space-y-8">
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <p id="contact-budget-label" className="text-small font-semibold text-fg">
                      {copy.budget}
                    </p>
                    <SegmentedControl
                      label={copy.currency}
                      name="budgetCurrency"
                      idPrefix="contact-currency"
                      options={[
                        { value: "INR", label: "INR" },
                        { value: "USD", label: "USD" },
                      ]}
                      inputProps={field("budgetCurrency")}
                      className="w-32"
                    />
                  </div>
                  <SegmentedControl
                    label={copy.budget}
                    name="budget"
                    idPrefix="contact-budget"
                    options={[
                      ...budgetOptions
                        .filter((option) => option.id !== "not-sure")
                        .map((option) => ({ value: option.id, label: option[currency] })),
                      { value: "", label: copy.noAnswer },
                    ]}
                    inputProps={field("budget")}
                  />
                </div>
                <ChoiceChips
                  label={copy.timeline}
                  hideLabel={false}
                  name="timeline"
                  idPrefix="contact-timeline"
                  options={[
                    ...timelineOptions.map((option) => ({ value: option.id, label: option.label })),
                    { value: "", label: copy.noAnswer },
                  ]}
                  inputProps={field("timeline")}
                />
                <div>
                  <Label htmlFor="contact-message" required>
                    {copy.message}
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={6}
                    maxLength={MESSAGE_MAX}
                    showCount={false}
                    placeholder={copy.messagePlaceholder}
                    invalid={Boolean(errors.message)}
                    aria-describedby={describe(
                      "message",
                      "contact-message-count contact-message-tips",
                    )}
                    aria-required="true"
                    {...field("message")}
                  />
                  <p
                    id="contact-message-count"
                    className={cn(
                      "mt-2 flex justify-between gap-3 font-mono text-xs",
                      remaining > 0 ? "text-fg-muted" : "text-success-fg",
                    )}
                  >
                    <span>
                      {remaining > 0
                        ? copy.counter.need
                            .replace("{n}", String(remaining))
                            .replace("{min}", String(MESSAGE_MIN))
                        : copy.counter.ok}
                    </span>
                    <span>
                      {message.length} / {MESSAGE_MAX}
                    </span>
                  </p>
                  <FieldError id="contact-message-error">{errors.message?.message}</FieldError>
                  <div
                    id="contact-message-tips"
                    className="mt-4 border-l-2 border-lamp-500 pl-4 text-small text-fg-muted"
                  >
                    <p className="font-semibold text-fg">{copy.tipsTitle}</p>
                    <p className="mt-1">{copy.tips.join(" · ")}</p>
                  </div>
                </div>
                <Toggle
                  id="contact-nda"
                  label={copy.nda.label}
                  description={copy.nda.description}
                  {...field("nda")}
                />
              </div>
            ),
          },
          {
            id: "you",
            title: copy.steps.you.title,
            description: copy.steps.you.description,
            content: (
              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contact-name" required>
                    {copy.name}
                  </Label>
                  <Input
                    id="contact-name"
                    autoComplete="name"
                    invalid={Boolean(errors.name)}
                    aria-describedby={describe("name")}
                    aria-required="true"
                    {...field("name")}
                  />
                  <FieldError id="contact-name-error">{errors.name?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="contact-email" required>
                    {copy.email}
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    invalid={Boolean(errors.email)}
                    aria-describedby={describe("email")}
                    aria-required="true"
                    {...field("email")}
                  />
                  <FieldError id="contact-email-error">{errors.email?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="contact-phone" required>
                    {copy.phone}
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-28 shrink-0">
                      <Select
                        aria-label={copy.countryCode}
                        autoComplete="tel-country-code"
                        className="pr-8 pl-3"
                        {...field("phoneCountry")}
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
                      {...field("phone")}
                    />
                  </div>
                  <FieldError id="contact-phone-error">{errors.phone?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="contact-company">{copy.company}</Label>
                  <Input
                    id="contact-company"
                    autoComplete="organization"
                    placeholder={copy.optional}
                    invalid={Boolean(errors.company)}
                    aria-describedby={describe("company")}
                    {...field("company")}
                  />
                  <FieldError id="contact-company-error">{errors.company?.message}</FieldError>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="contact-heard">{copy.heardFrom}</Label>
                  <Select id="contact-heard" {...field("heardFrom")}>
                    <option value="">{copy.noAnswer}</option>
                    {heardFromOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Checkbox
                    id="contact-consent"
                    invalid={Boolean(errors.consent)}
                    aria-describedby={describe("consent")}
                    aria-required="true"
                    label={
                      <>
                        {copy.consentBefore}{" "}
                        <Link
                          href={privacyHref}
                          className="font-semibold text-accent underline underline-offset-4"
                        >
                          {copy.consentLink}
                        </Link>
                        <span aria-hidden="true" className="ml-0.5 text-danger-fg">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </>
                    }
                    {...field("consent")}
                  />
                  <FieldError id="contact-consent-error" className="mt-0">
                    {errors.consent?.message}
                  </FieldError>
                </div>
                {TURNSTILE_SITE_KEY ? (
                  <div className="sm:col-span-2">
                    <Turnstile key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={setToken} />
                  </div>
                ) : null}
              </div>
            ),
          },
        ]}
      />

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
    </form>
  );
}

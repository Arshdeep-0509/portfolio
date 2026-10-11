"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import { SELECT_ROLE_EVENT } from "@/components/sections/collaborate/ApplyButton";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { ChoiceChips, SegmentedControl } from "@/components/ui/form/Choices";
import { FieldError, HelperText, Label } from "@/components/ui/form/Field";
import { FileDrop } from "@/components/ui/form/FileDrop";
import { Input, Select } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { Turnstile } from "@/components/ui/form/Turnstile";
import { FormWizard } from "@/components/ui/FormWizard";
import type { collaborateContent } from "@/content/collaborate";
import { trackEvent } from "@/lib/analytics";
import {
  availabilityOptions,
  careerApplicationSchema,
  experienceOptions,
  MESSAGE_MAX,
  MESSAGE_MIN,
  RESUME_ACCEPT,
  RESUME_MAX_MB,
  type CareerApplicationInput,
} from "@/lib/schemas/careerApplication";

type FormCopy = (typeof collaborateContent)["form"];

type ApplicationFormProps = {
  copy: FormCopy;
  roles: { id: string; title: string }[];
};

type FieldName = keyof CareerApplicationInput;

/** Fields validated on each step, in order — also used to jump back to a server-rejected field. */
const STEP_FIELDS: FieldName[][] = [
  ["name", "email", "phone", "role", "portfolio", "linkedin"],
  ["experience", "availability"],
  ["resume", "message", "consent"],
];

// Inlined at build time; without it the widget is skipped and the server skips verification too.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * The application as a three-step wizard: role & links → experience & availability → resume,
 * message & consent (with a review summary). Each step validates with the same zod schema the
 * API uses, then the form posts multipart data (with the resume) to /api/careers. "Apply" links
 * pre-select a role via SELECT_ROLE_EVENT; ?role=<id> in the URL does the same on load.
 */
export function ApplicationForm({ copy, roles }: ApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [formKey, setFormKey] = useState(0);
  const [step, setStep] = useState(0);

  const defaultRole = roles.length === 1 ? roles[0].id : "";
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    reset,
    trigger,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<CareerApplicationInput>({
    resolver: zodResolver(careerApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: defaultRole,
      experience: "",
      portfolio: "",
      linkedin: "",
      availability: "",
      message: "",
      website: "",
    },
  });

  /**
   * register() plus one rule: a field that is currently showing an error re-checks itself on every
   * change. Without it the error only clears on blur, so the first click on Next blurs the field,
   * the message disappears, the button moves up under the pointer and the click is lost.
   */
  const field = (name: keyof CareerApplicationInput) =>
    register(name, {
      onChange: () => {
        if (getFieldState(name).error) void trigger(name);
      },
    });
  const values = useWatch({ control });

  useEffect(() => {
    const select = (id: string | null) => {
      if (id && roles.some((role) => role.id === id)) {
        setValue("role", id, { shouldValidate: true, shouldDirty: true });
      }
    };
    select(new URLSearchParams(window.location.search).get("role"));
    const onSelect = (event: Event) => select((event as CustomEvent<string>).detail);
    window.addEventListener(SELECT_ROLE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_ROLE_EVENT, onSelect);
  }, [roles, setValue]);

  function showFieldErrors(fields: FieldName[]) {
    if (!fields[0]) return;
    const target = STEP_FIELDS.findIndex((group) => group.includes(fields[0]!));
    if (target !== -1) setStep(target);
    requestAnimationFrame(() => setFocus(fields[0]!));
  }

  async function onSubmit(data: CareerApplicationInput) {
    setServerError(null);
    if (TURNSTILE_SITE_KEY && !token) {
      setServerError(copy.botCheck);
      return;
    }

    const body = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || key === "resume") continue;
      body.append(key, String(value));
    }
    body.append("resume", data.resume);
    if (token) body.append("cf-turnstile-response", token);

    try {
      const response = await fetch("/api/careers", { method: "POST", body });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (response.ok && result.ok) {
        trackEvent("career_apply", { role: data.role });
        setSubmitted(true);
        return;
      }
      const all = STEP_FIELDS.flat();
      const fieldErrors = Object.entries(result.fieldErrors ?? {}).filter(([key]) =>
        all.includes(key as FieldName),
      );
      fieldErrors.forEach(([key, message]) => setError(key as FieldName, { message }));
      showFieldErrors(fieldErrors.map(([key]) => key as FieldName));
      setServerError(result.error ?? copy.error);
    } catch {
      setServerError(copy.error);
    } finally {
      setToken(null);
      setWidgetKey((key) => key + 1);
    }
  }

  function startOver() {
    reset();
    setSubmitted(false);
    setServerError(null);
    setStep(0);
    setFormKey((key) => key + 1);
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-lamp-500/50 p-8 sm:p-10">
        <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-9 text-success-fg" />
        <h3
          ref={(heading) => heading?.focus()}
          tabIndex={-1}
          className="mt-4 text-h3 text-fg outline-none"
        >
          {copy.successTitle}
        </h3>
        <p className="mt-2 text-fg-muted">{copy.successText}</p>
        <ol className="mt-6 border-t border-rule">
          {copy.nextSteps.map((line, index) => (
            <li key={line} className="flex gap-4 border-b border-rule py-3 text-fg">
              <span className="font-mono text-xs text-accent">0{index + 1}</span>
              {line}
            </li>
          ))}
        </ol>
        <Button variant="outline" className="mt-8" onClick={startOver}>
          {copy.another}
        </Button>
      </div>
    );
  }

  const describe = (field: FieldName, helper?: boolean) =>
    [helper ? `apply-${field}-help` : null, errors[field] ? `apply-${field}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  const { labels } = copy;
  const roleTitle = roles.find((role) => role.id === values.role)?.title;
  const review: [string, string | undefined][] = [
    [labels.name, values.name],
    [labels.email, values.email],
    [labels.role, roleTitle],
    [labels.portfolio, values.portfolio],
    [labels.experience, values.experience || labels.noAnswer],
    [labels.availability, values.availability || labels.noAnswer],
    [labels.resume, values.resume instanceof File ? values.resume.name : undefined],
  ];

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit(onSubmit, (invalid) =>
        showFieldErrors(Object.keys(invalid) as FieldName[]),
      )}
      noValidate
      aria-label="Application"
      className="relative"
    >
      <FormWizard
        step={step}
        onStepChange={setStep}
        validateStep={(index) => trigger(STEP_FIELDS[index], { shouldFocus: true })}
        submitLabel={copy.submit}
        submitting={isSubmitting}
        reviewTitle={copy.reviewTitle}
        review={
          <dl className="grid gap-x-8 gap-y-3 text-small sm:grid-cols-2">
            {review.map(([term, detail]) => (
              <div key={term}>
                <dt className="label-mono text-fg-muted">{term}</dt>
                <dd className="mt-0.5 break-words text-fg">{detail || "—"}</dd>
              </div>
            ))}
          </dl>
        }
        footer={
          <div aria-live="assertive">
            {serverError ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-card border border-danger/40 p-4 text-small text-danger-fg"
              >
                <CircleAlert
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-0.5 size-4 shrink-0"
                />
                {serverError}
              </p>
            ) : null}
          </div>
        }
        steps={[
          {
            id: "role",
            title: copy.steps.role.title,
            description: copy.steps.role.description,
            content: (
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="apply-name" required>
                    {labels.name}
                  </Label>
                  <Input
                    id="apply-name"
                    autoComplete="name"
                    invalid={Boolean(errors.name)}
                    aria-describedby={describe("name")}
                    {...field("name")}
                  />
                  <FieldError id="apply-name-error">{errors.name?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apply-email" required>
                    {labels.email}
                  </Label>
                  <Input
                    id="apply-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    invalid={Boolean(errors.email)}
                    aria-describedby={describe("email")}
                    {...field("email")}
                  />
                  <FieldError id="apply-email-error">{errors.email?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apply-phone" required>
                    {labels.phone}
                  </Label>
                  <Input
                    id="apply-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    invalid={Boolean(errors.phone)}
                    aria-describedby={describe("phone")}
                    {...field("phone")}
                  />
                  <FieldError id="apply-phone-error">{errors.phone?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apply-role" required>
                    {labels.role}
                  </Label>
                  <Select
                    id="apply-role"
                    placeholder={labels.rolePlaceholder}
                    invalid={Boolean(errors.role)}
                    aria-describedby={describe("role")}
                    {...field("role")}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </Select>
                  <FieldError id="apply-role-error">{errors.role?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apply-portfolio" required>
                    {labels.portfolio}
                  </Label>
                  <Input
                    id="apply-portfolio"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://github.com/you"
                    invalid={Boolean(errors.portfolio)}
                    aria-describedby={describe("portfolio")}
                    {...field("portfolio")}
                  />
                  <FieldError id="apply-portfolio-error">{errors.portfolio?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apply-linkedin">{labels.linkedin}</Label>
                  <Input
                    id="apply-linkedin"
                    type="url"
                    inputMode="url"
                    placeholder="https://linkedin.com/in/you"
                    invalid={Boolean(errors.linkedin)}
                    aria-describedby={describe("linkedin")}
                    {...field("linkedin")}
                  />
                  <FieldError id="apply-linkedin-error">{errors.linkedin?.message}</FieldError>
                </div>
              </div>
            ),
          },
          {
            id: "experience",
            title: copy.steps.experience.title,
            description: copy.steps.experience.description,
            content: (
              <div className="space-y-8">
                <SegmentedControl
                  label={labels.experience}
                  hideLabel={false}
                  name="experience"
                  idPrefix="apply-experience"
                  options={[
                    { value: "", label: labels.noAnswer },
                    ...experienceOptions.map((option) => ({ value: option, label: option })),
                  ]}
                  inputProps={field("experience")}
                />
                <ChoiceChips
                  label={labels.availability}
                  hideLabel={false}
                  name="availability"
                  idPrefix="apply-availability"
                  options={[
                    ...availabilityOptions.map((option) => ({ value: option, label: option })),
                    { value: "", label: labels.noAnswer },
                  ]}
                  inputProps={field("availability")}
                />
              </div>
            ),
          },
          {
            id: "message",
            title: copy.steps.message.title,
            description: copy.steps.message.description,
            content: (
              <div className="space-y-6">
                <div>
                  {/* Not a <label>: FileDrop's drop zone is itself the label of the hidden file input. */}
                  <p id="apply-resume-label" className="mb-2 text-small font-semibold text-fg">
                    {labels.resume}
                    <span aria-hidden="true" className="ml-0.5 text-danger-fg">
                      *
                    </span>
                    <span className="sr-only"> (required)</span>
                  </p>
                  <Controller
                    control={control}
                    name="resume"
                    render={({ field }) => (
                      <FileDrop
                        id="apply-resume"
                        name="resume"
                        accept={RESUME_ACCEPT}
                        invalid={Boolean(errors.resume)}
                        aria-describedby={describe("resume", true)}
                        onFilesChange={(files) => {
                          field.onChange(files[0]);
                          field.onBlur();
                        }}
                      />
                    )}
                  />
                  <HelperText id="apply-resume-help">
                    {labels.resumeHelp.replace("{mb}", String(RESUME_MAX_MB))}
                  </HelperText>
                  <FieldError id="apply-resume-error">{errors.resume?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apply-message" required>
                    {labels.message}
                  </Label>
                  <Textarea
                    id="apply-message"
                    rows={5}
                    maxLength={MESSAGE_MAX}
                    invalid={Boolean(errors.message)}
                    aria-describedby={describe("message", true)}
                    {...field("message")}
                  />
                  <HelperText id="apply-message-help">
                    {labels.messageHelp.replace("{min}", String(MESSAGE_MIN))}
                  </HelperText>
                  <FieldError id="apply-message-error">{errors.message?.message}</FieldError>
                </div>
                <div>
                  <Checkbox
                    id="apply-consent"
                    invalid={Boolean(errors.consent)}
                    aria-describedby={describe("consent")}
                    label={
                      <>
                        {labels.consentBefore}{" "}
                        <Link
                          href={copy.privacy.href}
                          className="font-semibold text-accent underline underline-offset-4"
                        >
                          {copy.privacy.label}
                        </Link>{" "}
                        {labels.consent}
                        <span aria-hidden="true" className="ml-0.5 text-danger-fg">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </>
                    }
                    {...field("consent")}
                  />
                  <FieldError id="apply-consent-error" className="mt-0">
                    {errors.consent?.message}
                  </FieldError>
                </div>
                {TURNSTILE_SITE_KEY ? (
                  <Turnstile key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={setToken} />
                ) : null}
              </div>
            ),
          },
        ]}
      />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="apply-website">Website</label>
        <input
          id="apply-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
    </form>
  );
}

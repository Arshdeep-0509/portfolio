"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import { SELECT_ROLE_EVENT } from "@/components/sections/careers/ApplyButton";
import { Turnstile } from "@/components/ui/form/Turnstile";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { FieldError, HelperText, Label } from "@/components/ui/form/Field";
import { FileDrop } from "@/components/ui/form/FileDrop";
import { Input, Select } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
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

type FormCopy = {
  submit: string;
  privacy: { label: string; href: string };
  successTitle: string;
  successText: string;
  nextSteps: string[];
  another: string;
  error: string;
};

type ApplicationFormProps = {
  copy: FormCopy;
  roles: { id: string; title: string }[];
};

type FieldName = keyof CareerApplicationInput;

const FIELD_NAMES: FieldName[] = [
  "name",
  "email",
  "phone",
  "role",
  "experience",
  "portfolio",
  "linkedin",
  "resume",
  "availability",
  "message",
  "consent",
];

// Inlined at build time; without it the widget is skipped and the server skips verification too.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Career application form. Validates in the browser with the same zod schema the API uses, then
 * posts multipart form data (with the resume) to /api/careers. "Apply" buttons on role cards
 * pre-select a role via SELECT_ROLE_EVENT; ?role=<id> in the URL does the same on load.
 */
export function ApplicationForm({ copy, roles }: ApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  // Remounting the FileDrop clears its file list after "Send another application".
  const [formKey, setFormKey] = useState(0);

  const defaultRole = roles.length === 1 ? roles[0].id : "";
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    reset,
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

  // Pre-select a role from an "Apply" button or a ?role= link.
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

  async function onSubmit(values: CareerApplicationInput) {
    setServerError(null);
    if (TURNSTILE_SITE_KEY && !token) {
      setServerError("Please complete the quick human check above the button.");
      return;
    }

    const body = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || key === "resume") continue;
      body.append(key, String(value));
    }
    body.append("resume", values.resume);
    if (token) body.append("cf-turnstile-response", token);

    try {
      const response = await fetch("/api/careers", { method: "POST", body });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (response.ok && data.ok) {
        trackEvent("career_apply", { role: values.role });
        setSubmitted(true);
        return;
      }

      const fieldErrors = Object.entries(data.fieldErrors ?? {}).filter(([key]) =>
        FIELD_NAMES.includes(key as FieldName),
      );
      fieldErrors.forEach(([key, message]) => setError(key as FieldName, { message }));
      if (fieldErrors[0]) setFocus(fieldErrors[0][0] as FieldName);
      setServerError(data.error ?? copy.error);
    } catch {
      setServerError(copy.error);
    } finally {
      // Turnstile tokens are single-use: get a fresh one for the next attempt.
      setToken(null);
      setWidgetKey((key) => key + 1);
    }
  }

  function startOver() {
    reset();
    setSubmitted(false);
    setServerError(null);
    setFormKey((key) => key + 1);
  }

  if (submitted) {
    return (
      <div className="tone-light rounded-xl border border-border bg-surface p-8 text-center shadow-card sm:p-12">
        <CircleCheck aria-hidden="true" className="mx-auto size-12 text-success" />
        <h3
          ref={(heading) => heading?.focus()}
          tabIndex={-1}
          className="mt-4 text-h3 font-bold text-ink outline-none"
        >
          {copy.successTitle}
        </h3>
        <p className="mt-2 text-muted">{copy.successText}</p>
        <ol className="mx-auto mt-6 max-w-lg space-y-3 text-left">
          {copy.nextSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-ink">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-soft font-mono text-xs font-medium text-primary">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
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

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Career application"
      className="tone-light relative rounded-xl border border-border bg-surface p-6 shadow-card sm:p-10"
    >
      <p className="text-small text-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="apply-name" required>
            Full name
          </Label>
          <Input
            id="apply-name"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
            {...register("name")}
          />
          <FieldError id="apply-name-error">{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="apply-email" required>
            Email
          </Label>
          <Input
            id="apply-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
            {...register("email")}
          />
          <FieldError id="apply-email-error">{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="apply-phone" required>
            Phone
          </Label>
          <Input
            id="apply-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            invalid={Boolean(errors.phone)}
            aria-describedby={describe("phone")}
            {...register("phone")}
          />
          <FieldError id="apply-phone-error">{errors.phone?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="apply-role" required>
            Role
          </Label>
          <Select
            id="apply-role"
            placeholder="Choose a role"
            invalid={Boolean(errors.role)}
            aria-describedby={describe("role")}
            {...register("role")}
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
          <Label htmlFor="apply-experience">Experience</Label>
          <Select id="apply-experience" {...register("experience")}>
            <option value="">Prefer not to say</option>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="apply-availability">Availability</Label>
          <Select id="apply-availability" {...register("availability")}>
            <option value="">Not sure yet</option>
            {availabilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="apply-portfolio" required>
            Portfolio or GitHub URL
          </Label>
          <Input
            id="apply-portfolio"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://github.com/you"
            invalid={Boolean(errors.portfolio)}
            aria-describedby={describe("portfolio")}
            {...register("portfolio")}
          />
          <FieldError id="apply-portfolio-error">{errors.portfolio?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="apply-linkedin">LinkedIn URL</Label>
          <Input
            id="apply-linkedin"
            type="url"
            inputMode="url"
            placeholder="https://linkedin.com/in/you"
            invalid={Boolean(errors.linkedin)}
            aria-describedby={describe("linkedin")}
            {...register("linkedin")}
          />
          <FieldError id="apply-linkedin-error">{errors.linkedin?.message}</FieldError>
        </div>

        <div className="sm:col-span-2">
          {/* Not a <label>: FileDrop's drop zone is itself the label of the hidden file input. */}
          <p id="apply-resume-label" className="mb-1.5 text-small font-semibold text-tone-fg">
            Resume
            <span aria-hidden="true" className="ml-0.5 text-danger">
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
          <HelperText id="apply-resume-help">PDF only, up to {RESUME_MAX_MB} MB.</HelperText>
          <FieldError id="apply-resume-error">{errors.resume?.message}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="apply-message" required>
            Why do you want to work on this?
          </Label>
          <Textarea
            id="apply-message"
            rows={5}
            maxLength={MESSAGE_MAX}
            invalid={Boolean(errors.message)}
            aria-describedby={describe("message", true)}
            {...register("message")}
          />
          <HelperText id="apply-message-help">
            At least {MESSAGE_MIN} characters — what excites you, and what you&apos;d bring.
          </HelperText>
          <FieldError id="apply-message-error">{errors.message?.message}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <Checkbox
            id="apply-consent"
            invalid={Boolean(errors.consent)}
            aria-describedby={describe("consent")}
            label={
              <>
                I agree to the{" "}
                <Link href={copy.privacy.href} className="font-semibold text-primary underline">
                  {copy.privacy.label}
                </Link>{" "}
                and to my data being kept for hiring purposes for up to 12 months.
                <span aria-hidden="true" className="ml-0.5 text-danger">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </>
            }
            {...register("consent")}
          />
          <FieldError id="apply-consent-error" className="mt-0">
            {errors.consent?.message}
          </FieldError>
        </div>
      </div>

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

      {TURNSTILE_SITE_KEY ? (
        <div className="mt-6">
          <Turnstile key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={setToken} />
        </div>
      ) : null}

      <div aria-live="assertive">
        {serverError ? (
          <p
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 p-4 text-small text-danger"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {serverError}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" loading={isSubmitting} className="mt-6 w-full sm:w-auto">
        {copy.submit}
      </Button>
    </form>
  );
}

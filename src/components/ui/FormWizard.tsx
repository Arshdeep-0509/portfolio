"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, pad2 } from "@/lib/utils";

export type WizardStep = {
  id: string;
  title: string;
  /** One line under the step title. */
  description?: string;
  content: React.ReactNode;
};

type FormWizardProps = {
  steps: WizardStep[];
  /**
   * Validates the step at `index` before moving on (e.g. react-hook-form's
   * `trigger(fields, { shouldFocus: true })`). Resolve false to stay on the step.
   */
  validateStep: (index: number) => Promise<boolean>;
  /** A summary of every answer, shown on the last step above the submit button. */
  review?: React.ReactNode;
  reviewTitle?: string;
  submitLabel: string;
  submitting?: boolean;
  /** Content under the submit button (reassurance lines, a fallback email link). */
  footer?: React.ReactNode;
  labels?: { back: string; next: string; step: string; of: string };
  /** Controlled mode: the visible step, e.g. to jump back to a step whose field the server rejected. */
  step?: number;
  onStepChange?: (index: number) => void;
  className?: string;
};

const defaultLabels = { back: "Back", next: "Next", step: "Step", of: "of" };

/**
 * A multi-step form body: a progress bar, one step at a time, Back and Next, validation per step
 * and a review summary before submitting. It renders inside the caller's <form>, so the submit
 * button submits the real form (and Enter on the last step submits too).
 *
 * Every step stays mounted (hidden steps are `hidden`), so field values and registrations
 * survive moving back and forth. Moving between steps puts focus on the new step's heading.
 */
export function FormWizard({
  steps,
  validateStep,
  review,
  reviewTitle = "Check your answers",
  submitLabel,
  submitting = false,
  footer,
  labels = defaultLabels,
  step,
  onStepChange,
  className,
}: FormWizardProps) {
  const [internal, setInternal] = useState(0);
  const current = step ?? internal;
  const [checking, setChecking] = useState(false);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const baseId = useId();
  const last = current === steps.length - 1;

  function goTo(index: number) {
    setInternal(index);
    onStepChange?.(index);
    requestAnimationFrame(() => headings.current[index]?.focus());
  }

  async function next() {
    setChecking(true);
    const ok = await validateStep(current);
    setChecking(false);
    if (ok) goTo(Math.min(current + 1, steps.length - 1));
  }

  return (
    <div className={className}>
      {/* Progress */}
      <div>
        <p className="flex items-center justify-between label-mono text-fg-muted">
          <span>
            {labels.step} {pad2(current + 1)} {labels.of} {pad2(steps.length)}
          </span>
          <span aria-hidden="true">{Math.round(((current + 1) / steps.length) * 100)}%</span>
        </p>
        <div
          role="progressbar"
          aria-label={`${labels.step} ${current + 1} ${labels.of} ${steps.length}`}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={current + 1}
          className="mt-3 h-0.5 w-full bg-rule"
        >
          <div
            className="h-full origin-left bg-grad-flame transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${(current + 1) / steps.length})` }}
          />
        </div>
        <ol className="mt-4 hidden gap-6 sm:flex">
          {steps.map((step, index) => (
            <li
              key={step.id}
              aria-current={index === current ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 text-small",
                index === current ? "font-semibold text-fg" : "text-fg-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-dot",
                  index < current ? "bg-success" : index === current ? "bg-lamp-500" : "bg-rule",
                )}
              />
              {step.title}
            </li>
          ))}
        </ol>
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <section
          key={step.id}
          hidden={index !== current}
          aria-labelledby={`${baseId}-${step.id}`}
          className="mt-10"
        >
          <h3
            id={`${baseId}-${step.id}`}
            ref={(node) => {
              headings.current[index] = node;
            }}
            tabIndex={-1}
            className="text-h3 text-fg outline-none"
          >
            {step.title}
          </h3>
          {step.description ? <p className="mt-1.5 text-fg-muted">{step.description}</p> : null}
          <div className="mt-7">{step.content}</div>
          {index === steps.length - 1 && review ? (
            <div className="mt-10 border-t border-rule pt-8">
              <p className="label-mono text-accent">{reviewTitle}</p>
              <div className="mt-4">{review}</div>
            </div>
          ) : null}
        </section>
      ))}

      {/* Controls */}
      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-rule pt-6">
        {current > 0 ? (
          <Button
            variant="outline"
            onClick={() => goTo(current - 1)}
            leftIcon={<ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" />}
          >
            {labels.back}
          </Button>
        ) : null}
        {last ? (
          <Button type="submit" size="lg" loading={submitting} className="ml-auto">
            {submitLabel}
          </Button>
        ) : (
          <Button
            onClick={next}
            loading={checking}
            className="ml-auto"
            rightIcon={<ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />}
          >
            {labels.next}
          </Button>
        )}
      </div>
      {last && footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}

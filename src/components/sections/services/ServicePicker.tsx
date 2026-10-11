"use client";

import { useId, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PickerQuestion } from "@/content/servicesPage";
import { rankServices, type PickerAnswers } from "@/lib/servicePicker";
import { cn } from "@/lib/utils";

type ServicePickerProps = {
  questions: PickerQuestion[];
  /** One pre-rendered link card per service slug (rendered on the server, with icons). */
  cards: Record<string, React.ReactNode>;
  copy: { resultsTitle: string; resultsIntro: string; discussCta: string; resetLabel: string };
};

/**
 * Three questions as toggle chips. Once all three are answered, shows the two best-matching
 * services and a contact link carrying the answers as query parameters.
 * Results are announced politely to screen readers when they appear.
 */
export function ServicePicker({ questions, cards, copy }: ServicePickerProps) {
  const [answers, setAnswers] = useState<PickerAnswers>({});
  const baseId = useId();
  const complete = questions.every((question) => answers[question.id]);
  const matches = complete ? rankServices(questions, answers) : [];

  const contactHref = `/contact?${new URLSearchParams({
    ...(answers as Record<string, string>),
    services: matches.join(","),
  }).toString()}`;

  return (
    <div className="tone-light rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="space-y-6">
        {questions.map((question, index) => {
          const legendId = `${baseId}-${question.id}`;
          return (
            <div key={question.id} role="group" aria-labelledby={legendId}>
              <p id={legendId} className="text-small font-semibold text-ink">
                <span className="mr-2 font-mono text-eyebrow text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {question.question}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const pressed = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() =>
                        setAnswers((current) => ({ ...current, [question.id]: option.id }))
                      }
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-pill border px-4 text-small font-semibold transition-colors duration-200",
                        pressed
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-ink hover:border-primary hover:text-primary",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div aria-live="polite">
        {complete ? (
          <div className="mt-8 animate-fade-in border-t border-border pt-6">
            <h3 className="text-h3 font-bold">{copy.resultsTitle}</h3>
            <p className="mt-1 text-small text-muted">{copy.resultsIntro}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {matches.map((slug) => (
                <li key={slug}>{cards[slug]}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={contactHref}
                rightIcon={<ArrowRight aria-hidden="true" className="size-4" />}
              >
                {copy.discussCta}
              </Button>
              <Button
                variant="outline"
                onClick={() => setAnswers({})}
                leftIcon={<RotateCcw aria-hidden="true" className="size-4" />}
              >
                {copy.resetLabel}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

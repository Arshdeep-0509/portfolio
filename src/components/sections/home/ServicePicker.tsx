"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PickerQuestion } from "@/content/home";
import { rankServices, type PickerAnswers } from "@/lib/servicePicker";
import { cn, pad2 } from "@/lib/utils";

type ServicePickerProps = {
  questions: PickerQuestion[];
  /** Service titles by slug (passed from the server, so no content module ships to the browser). */
  titles: Record<string, string>;
  copy: { title: string; text: string; resultsTitle: string; discuss: string; reset: string };
};

/**
 * Three questions answered with square chips. Once all three are answered it names the two
 * best-matching services and offers a contact link carrying the answers. Results are announced
 * politely to screen readers.
 */
export function ServicePicker({ questions, titles, copy }: ServicePickerProps) {
  const [answers, setAnswers] = useState<PickerAnswers>({});
  const baseId = useId();
  const complete = questions.every((question) => answers[question.id]);
  const matches = complete ? rankServices(questions, answers) : [];
  const contactHref = `/contact?${new URLSearchParams({
    ...(answers as Record<string, string>),
    services: matches.join(","),
  }).toString()}`;

  return (
    <div>
      <p className="font-display-soft text-2xl text-fg">{copy.title}</p>
      <p className="mt-2 text-small text-fg-muted">{copy.text}</p>
      <div className="mt-6 space-y-5">
        {questions.map((question, index) => {
          const legendId = `${baseId}-${question.id}`;
          return (
            <div key={question.id} role="group" aria-labelledby={legendId}>
              <p id={legendId} className="text-small font-semibold text-fg">
                <span className="mr-2 font-mono text-xs text-fg-muted">{pad2(index + 1)}</span>
                {question.question}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
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
                        "inline-flex min-h-10 items-center rounded-card border px-3 font-mono text-xs tracking-wide uppercase transition-colors duration-200",
                        pressed
                          ? "border-lamp-500 bg-lamp-500 text-ink-900"
                          : "border-rule text-fg-muted hover:border-fg-muted hover:text-fg",
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
          <div className="mt-7 animate-fade-in border-t border-rule pt-5">
            <p className="label-mono text-accent">{copy.resultsTitle}</p>
            <ul className="mt-3">
              {matches.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/services/${slug}`}
                    className="group flex min-h-11 items-center justify-between gap-3 border-b border-rule font-semibold text-fg hover:text-accent"
                  >
                    {titles[slug] ?? slug}
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Button href={contactHref} size="sm" data-cta="service-picker">
                {copy.discuss}
              </Button>
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="min-h-10 link-underline text-small text-fg-muted hover:text-fg"
              >
                {copy.reset}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

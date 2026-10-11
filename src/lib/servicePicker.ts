import type { PickerQuestion } from "@/content/home";

export type PickerAnswers = Partial<Record<PickerQuestion["id"], string>>;

/**
 * Ranks services for the "Not sure where you fit?" picker on Home. Each answer adds its question's weight
 * to the services it points at; ties keep the order in which services were first suggested,
 * which favours the more specific answers (building → stage → timeline).
 */
export function rankServices(
  questions: PickerQuestion[],
  answers: PickerAnswers,
  limit = 2,
): string[] {
  const scores = new Map<string, number>();
  for (const question of questions) {
    const option = question.options.find((o) => o.id === answers[question.id]);
    option?.services.forEach((slug) => {
      scores.set(slug, (scores.get(slug) ?? 0) + question.weight);
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
}

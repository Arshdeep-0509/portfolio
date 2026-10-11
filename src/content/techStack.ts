import type { StackBand } from "@/components/ui/StackMap";

/**
 * The stack map: one band per layer of a product, with the tools used there. Shown on Home and
 * reused by /about and /collaborate. Keep only tools that are genuinely used in real work.
 */
export const stackBands: StackBand[] = [
  {
    id: "interface",
    label: "Interface",
    note: "What people see and tap: responsive, accessible screens and the designs behind them.",
    chips: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Figma",
      "FigJam",
    ],
  },
  {
    id: "logic",
    label: "Logic & APIs",
    note: "Business rules, sign-in and roles, queues, scheduled jobs and integrations.",
    chips: ["Node.js", "Express", "NestJS", "Python", "FastAPI", "Django", "REST", "GraphQL"],
  },
  {
    id: "data",
    label: "Data",
    note: "Relational and document stores, migrations, backups and quick indexed queries.",
    chips: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    note: "Pipelines, containers, hosting, monitoring, logs and alerts.",
    chips: ["AWS", "GCP", "Docker", "Kubernetes", "GitHub Actions", "Nginx"],
  },
  {
    id: "intelligence",
    label: "Intelligence (AI)",
    note: "LLM features, answers drawn from your own data, and automated workflows.",
    chips: ["OpenAI / Claude / Gemini APIs", "LangChain", "Vector databases", "RAG", "Python"],
  },
  {
    id: "mobile",
    label: "Mobile",
    note: "Android and iOS from one codebase, with offline mode and push notifications.",
    chips: ["React Native", "Expo", "Flutter", "Firebase"],
  },
];

/** Bands by id, for pages that show a subset. */
export function getStackBands(ids: string[]): StackBand[] {
  return ids.flatMap((id) => stackBands.filter((band) => band.id === id));
}

/**
 * Technology categories, shown on the home page and reused by About, Why Me and Services.
 * Keep only tools that are genuinely used in real work — remove anything that isn't.
 */

export type TechFilter = "web" | "mobile" | "ai-data" | "cloud";

export type TechCategory = {
  id: string;
  title: string;
  subtitle: string;
  /** Small pill in the card's top-right corner. */
  tag: string;
  /** Which filter tabs show this card ("All" always does). */
  filters: TechFilter[];
  points: string[];
  tech: string[];
};

export const techFilters: { id: "all" | TechFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "ai-data", label: "AI & Data" },
  { id: "cloud", label: "Cloud" },
];

export const techCategories: TechCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    subtitle: "Fast, responsive interfaces",
    tag: "Web UI",
    filters: ["web"],
    points: [
      "Responsive layouts and design systems",
      "Accessible components",
      "Animation and micro-interactions",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    id: "backend",
    title: "Backend",
    subtitle: "Robust APIs and business logic",
    tag: "APIs",
    filters: ["web", "cloud"],
    points: [
      "REST and GraphQL APIs",
      "Auth, roles and permissions",
      "Queues, scheduled jobs and integrations",
    ],
    tech: ["Node.js", "Express", "NestJS", "Python", "FastAPI", "Django"],
  },
  {
    id: "mobile",
    title: "Mobile",
    subtitle: "Android and iOS from one codebase",
    tag: "Apps",
    filters: ["mobile"],
    points: [
      "Cross-platform MVPs",
      "Push notifications and offline mode",
      "Play Store and App Store ready",
    ],
    tech: ["React Native", "Expo", "Flutter", "Firebase"],
  },
  {
    id: "design",
    title: "UI/UX Design",
    subtitle: "From flows to pixel-perfect screens",
    tag: "Product UX",
    filters: ["web", "mobile"],
    points: [
      "User flows and wireframes",
      "Clickable prototypes",
      "Design systems and style guides",
    ],
    tech: ["Figma", "FigJam"],
  },
  {
    id: "databases",
    title: "Databases",
    subtitle: "Reliable data layers",
    tag: "Data",
    filters: ["web", "ai-data"],
    points: ["Relational and document models", "Migrations and backups", "Fast, indexed queries"],
    tech: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    subtitle: "Deploy, scale, monitor",
    tag: "Infra",
    filters: ["cloud"],
    points: ["CI/CD pipelines", "Containerised deployments", "Monitoring, logs and alerts"],
    tech: ["AWS", "GCP", "Docker", "Kubernetes", "GitHub Actions", "Nginx"],
  },
  {
    id: "ai",
    title: "AI & Data",
    subtitle: "Practical AI features",
    tag: "AI",
    filters: ["ai-data"],
    points: [
      "LLM features and chatbots",
      "Search and answers over your own data (RAG)",
      "Workflow automation and agents",
    ],
    tech: ["OpenAI / Claude / Gemini APIs", "LangChain", "Vector databases", "Python"],
  },
];

export function getTechByFilter(filter: "all" | TechFilter): TechCategory[] {
  return filter === "all"
    ? techCategories
    : techCategories.filter((category) => category.filters.includes(filter));
}

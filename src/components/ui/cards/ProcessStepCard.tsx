import { cardBase } from "@/components/ui/cards/Card";
import { cn } from "@/lib/utils";

type ProcessStepCardProps = {
  step: number;
  title: string;
  text: string;
  className?: string;
};

export function ProcessStepCard({ step, title, text, className }: ProcessStepCardProps) {
  return (
    <div className={cn(cardBase, "h-full", className)}>
      <p className="font-mono text-eyebrow font-medium text-primary uppercase">
        Step {String(step).padStart(2, "0")}
      </p>
      <h3 className="mt-3 text-h3 font-bold">{title}</h3>
      <p className="mt-2 text-muted">{text}</p>
    </div>
  );
}

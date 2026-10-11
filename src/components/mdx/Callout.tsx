import { CircleAlert, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  info: { label: "Note", Icon: Info, className: "border-starlight bg-sand-100" },
  tip: { label: "Tip", Icon: Lightbulb, className: "border-success bg-sand-100" },
  warning: { label: "Watch out", Icon: CircleAlert, className: "border-lamp-500 bg-lamp-500/10" },
} as const;

type CalloutProps = {
  type?: keyof typeof variants;
  /** Optional heading; defaults to "Note", "Tip" or "Watch out". */
  title?: string;
  children: React.ReactNode;
};

/** Highlighted aside for MDX: <Callout type="tip">…</Callout>. The type is named in text too. */
export function Callout({ type = "info", title, children }: CalloutProps) {
  const { label, Icon, className } = variants[type];
  return (
    <aside
      className={cn(
        "not-prose my-8 flex gap-4 rounded-card border-l-2 p-5 text-ink-900",
        className,
      )}
    >
      <Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold">{title ?? label}</p>
        <div className="mt-1 text-body leading-relaxed [&_p]:mt-2 [&_p:first-child]:mt-0">
          {children}
        </div>
      </div>
    </aside>
  );
}

import { Icon, type IconProp } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div">;

/** Translucent card for dark or gradient backgrounds. Text colours follow the surrounding section tone. */
export function GlassCard({ className, ...props }: GlassCardProps) {
  return <div className={cn("rounded-lg glass p-card text-white", className)} {...props} />;
}

type MiniGlassProps = {
  icon?: IconProp;
  title: string;
  text?: string;
  className?: string;
};

/** Compact glass tile, e.g. for hero stats or quick facts. */
export function MiniGlass({ icon, title, text, className }: MiniGlassProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-md glass px-4 py-3", className)}>
      {icon ? <Icon icon={icon} className="size-5 shrink-0 text-tone-accent" /> : null}
      <div className="leading-tight">
        <p className="text-small font-semibold text-white">{title}</p>
        {text ? <p className="mt-0.5 text-xs text-white">{text}</p> : null}
      </div>
    </div>
  );
}

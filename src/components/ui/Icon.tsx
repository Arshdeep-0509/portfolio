import "server-only";
import { icons, type LucideIcon, type LucideProps } from "lucide-react";
import type { IconName } from "@/content/services";

/** Either a lucide icon name from content files ("Rocket") or an imported icon component. */
export type IconProp = IconName | LucideIcon;

/**
 * Resolves icon names stored in src/content. Server-only: the name lookup imports the full
 * icon set, which must never reach the client bundle. Client components should import icons directly.
 */
export function Icon({ icon, ...props }: { icon: IconProp } & LucideProps) {
  const Component = typeof icon === "string" ? icons[icon] : icon;
  return <Component aria-hidden="true" focusable="false" {...props} />;
}

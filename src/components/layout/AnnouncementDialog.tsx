"use client";

import { CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Announcement } from "@/content/site";

/** The announcement modal's content. Loaded on demand by AnnouncementPopup. */
export function AnnouncementDialog({
  config,
  href,
  open,
  onClose,
}: {
  config: Announcement;
  href: string;
  open: boolean;
  onClose: (method: "dismiss" | "secondary" | "cta") => void;
}) {
  const external = /^https?:\/\//.test(href);

  return (
    <Modal
      open={open}
      onClose={() => onClose("dismiss")}
      title={config.title}
      description={config.description}
      eyebrow={<Badge variant="limited">{config.badge}</Badge>}
      size="md"
    >
      <div>
        <ul className="space-y-2.5">
          {config.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5 text-ink">
              <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            href={href}
            data-cta="announcement"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => onClose("cta")}
          >
            {config.primaryCta.label}
            {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </Button>
          <Button variant="outline" onClick={() => onClose("secondary")}>
            {config.secondaryLabel}
          </Button>
        </div>
        <p className="mt-4 text-small text-muted">{config.footnote}</p>
      </div>
    </Modal>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";

/** Client widgets for /journal/[slug]: a hairline reading-progress bar and share links. */

/** A 2px lamp-coloured line across the top of the viewport showing how far through the post you are. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = document.getElementById(targetId);
    const bar = barRef.current;
    if (!target || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.setProperty("--progress", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  // Decorative: the position is already conveyed by the scrollbar.
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-60 h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-grad-flame"
        style={{ transform: "scaleX(var(--progress, 0))" }}
      />
    </div>
  );
}

/** LinkedIn, X, WhatsApp and copy-link actions. Every action has a text label. */
export function ShareButtons({
  url,
  title,
  label,
  copyLabel,
  copiedLabel,
}: {
  url: string;
  title: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);
  const targets = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <SocialIcon name="linkedin" className="size-4" />,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: <SocialIcon name="x" className="size-4" />,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-4" />,
    },
  ];
  const action =
    "inline-flex min-h-11 items-center gap-2 text-small font-semibold text-fg transition-colors hover:text-accent";

  return (
    <div>
      <p className="label-mono text-fg-muted">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-x-6">
        {targets.map((target) => (
          <li key={target.name}>
            <a
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className={action}
              aria-label={`Share on ${target.name} (opens in a new tab)`}
            >
              {target.icon}
              {target.name}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={action}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? (
              <Check aria-hidden="true" strokeWidth={1.5} className="size-4" />
            ) : (
              <Link2 aria-hidden="true" strokeWidth={1.5} className="size-4" />
            )}
            {copied ? copiedLabel : copyLabel}
          </button>
        </li>
      </ul>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}

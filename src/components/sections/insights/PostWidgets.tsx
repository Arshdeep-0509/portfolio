"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { Heading } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * Client widgets for /insights/[slug]: reading progress, table of contents with scroll-spy,
 * and share buttons.
 */

/** Thin bar at the very top of the viewport showing how far through the article you are. */
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
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-60 h-[3px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-primary"
        style={{ transform: "scaleX(var(--progress, 0))" }}
      />
    </div>
  );
}

/** h2/h3 outline. Highlights the section currently being read. */
export function TableOfContents({ headings, label }: { headings: Heading[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line =
        (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) ||
          72) + 32;
      let current: string | null = null;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top <= line) current = heading.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, [headings]);

  return (
    <nav aria-label={label}>
      <p className="font-mono text-eyebrow font-medium text-muted uppercase">{label}</p>
      <ol className="mt-3 border-l border-border">
        {headings.map((heading) => {
          const current = heading.id === active;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  // min-h-11: 44px tap targets.
                  "-ml-px flex min-h-11 items-center border-l-2 py-1 text-small transition-colors duration-200",
                  heading.level === 3 ? "pl-7" : "pl-4",
                  current
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** LinkedIn, X, WhatsApp and copy-link buttons. Every button has a text label. */
export function ShareButtons({
  url,
  title,
  label,
  copiedLabel,
}: {
  url: string;
  title: string;
  label: string;
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
      icon: <MessageCircle aria-hidden="true" className="size-4" />,
    },
  ];
  const button =
    "inline-flex min-h-11 items-center gap-2 rounded-pill border border-border bg-surface px-4 text-small font-semibold text-ink transition-colors duration-200 hover:border-primary hover:text-primary";

  return (
    <div>
      <p className="text-small font-semibold text-ink">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {targets.map((target) => (
          <li key={target.name}>
            <a
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className={button}
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
            className={button}
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
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Link2 aria-hidden="true" className="size-4" />
            )}
            {copied ? copiedLabel : "Copy link"}
          </button>
        </li>
      </ul>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}

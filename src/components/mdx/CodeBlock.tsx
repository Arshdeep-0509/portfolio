"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Wraps a highlighted <pre> (from rehype-pretty-code) with a copy button. The button reads the
 * rendered text, so it copies exactly what the reader sees.
 */
export function CodeBlock(props: React.ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="group/code relative">
      <pre ref={preRef} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-md border border-white/15 bg-navy-900 text-white transition-colors duration-200 hover:bg-navy-950"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}

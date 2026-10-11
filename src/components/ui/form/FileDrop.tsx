"use client";

import { useId, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropProps = {
  id?: string;
  name: string;
  /** e.g. ".pdf,.doc,.docx,image/*" */
  accept?: string;
  multiple?: boolean;
  /** Files above this size are rejected with a message. */
  maxSizeMB?: number;
  invalid?: boolean;
  "aria-describedby"?: string;
  onFilesChange?: (files: File[]) => void;
  className?: string;
};

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Drag-and-drop zone backed by a real <input type="file">, so it works with native form posts,
 * keyboard (Tab to focus, Enter/Space to browse) and screen readers.
 */
export function FileDrop({
  id,
  name,
  accept,
  multiple = false,
  maxSizeMB,
  invalid = false,
  "aria-describedby": describedBy,
  onFilesChange,
  className,
}: FileDropProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const statusId = `${inputId}-status`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);

  function commit(list: File[]) {
    const limit = maxSizeMB ? maxSizeMB * 1024 * 1024 : Infinity;
    const tooBig = list.filter((file) => file.size > limit);
    const accepted = (multiple ? list : list.slice(0, 1)).filter((file) => file.size <= limit);
    setRejected(
      tooBig.length ? `${tooBig.map((f) => f.name).join(", ")} exceeds ${maxSizeMB} MB.` : null,
    );

    // Mirror the accepted files back into the input so a native form submit sends them.
    if (inputRef.current) {
      const transfer = new DataTransfer();
      accepted.forEach((file) => transfer.items.add(file));
      inputRef.current.files = transfer.files;
    }
    setFiles(accepted);
    onFilesChange?.(accepted);
  }

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          commit(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed bg-field px-6 py-8 text-center transition-colors duration-200",
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[var(--focus)]",
          dragging
            ? "border-lamp-500 bg-lamp-500/10"
            : invalid
              ? "border-danger"
              : "border-fg-muted/60 hover:border-accent",
        )}
      >
        <UploadCloud aria-hidden="true" strokeWidth={1.5} className="size-7 text-accent" />
        <span className="text-small font-semibold text-fg">
          Drag &amp; drop {multiple ? "files" : "a file"}, or{" "}
          <span className="text-accent underline underline-offset-4">browse</span>
        </span>
        {accept || maxSizeMB ? (
          <span className="font-mono text-xs text-fg-muted">
            {[accept?.replaceAll(",", ", "), maxSizeMB ? `max ${maxSizeMB} MB` : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
        ) : null}
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-invalid={invalid || undefined}
          aria-describedby={cn(describedBy, statusId)}
          onChange={(event) => commit(Array.from(event.target.files ?? []))}
          className="sr-only"
        />
      </label>

      <div id={statusId} aria-live="polite">
        {rejected ? <p className="mt-2 text-small text-danger-fg">{rejected}</p> : null}
        {files.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {files.map((file) => (
              <li
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-3 rounded-card border border-rule bg-field px-3 py-2 text-small"
              >
                <FileText
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4 shrink-0 text-accent"
                />
                <span className="min-w-0 flex-1 truncate text-fg">{file.name}</span>
                <span className="font-mono text-xs text-fg-muted">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => commit(files.filter((f) => f !== file))}
                  aria-label={`Remove ${file.name}`}
                  className="inline-flex size-8 items-center justify-center rounded-card text-fg-muted hover:text-fg"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

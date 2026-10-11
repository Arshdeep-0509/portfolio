"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Rendered above the title, e.g. a badge. */
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

/**
 * Centred dialog on the native <dialog> element. Focus trap, Esc, outside click and scroll lock
 * come from useModalDialog; this adds the layout and the scale/fade entrance.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  eyebrow,
  children,
  size = "md",
  className,
}: ModalProps) {
  const dialogProps = useModalDialog(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog
      {...dialogProps}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "tone-light m-auto w-[calc(100%-2rem)] rounded-xl bg-surface p-0 text-ink shadow-card-hover",
        "backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm open:animate-modal-in open:backdrop:animate-backdrop-in",
        sizes[size],
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-pill text-muted transition-colors duration-200 hover:bg-soft hover:text-ink"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        {eyebrow ? <div className="mb-3 pr-10">{eyebrow}</div> : null}
        <h2 id={titleId} className="pr-10 text-h3 font-bold">
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className="mt-2 text-muted">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </dialog>
  );
}

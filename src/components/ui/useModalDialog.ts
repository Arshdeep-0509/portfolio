"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Drives a native <dialog> as a modal from React state.
 * showModal() makes the page inert, handles Esc and restores focus to the opener on close;
 * this adds scroll lock, a Tab focus trap (the browser would otherwise let Tab reach its own
 * toolbar) and routes Esc and backdrop clicks through `onClose`, so state stays the source of truth.
 */
export function useModalDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open || dialog.open) return;

    dialog.showModal();
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const dialogProps = {
    ref,
    "aria-modal": true,
    onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onClose();
    },
    // A click whose target is the <dialog> itself landed on the backdrop.
    onClick: (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key !== "Tab") return;
      const focusable = event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
  } as const;

  return dialogProps;
}

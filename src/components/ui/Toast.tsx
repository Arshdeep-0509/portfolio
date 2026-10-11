"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

type ToastInput = {
  type: ToastType;
  title: string;
  description?: string;
  /** Optional link, e.g. a mailto fallback when a form fails. */
  action?: { label: string; href: string };
  duration?: number;
};

type ToastEntry = ToastInput & { id: number };

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

/** Show a toast from any client component: `const toast = useToast(); toast({ type: "success", title })`. */
export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>.");
  return toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    ({ duration = 5000, ...toast }: ToastInput) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { ...toast, id }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Polite for success; errors use role="alert" on the toast itself. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastView key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastEntry; onDismiss: () => void }) {
  const success = toast.type === "success";
  const IconComponent = success ? CircleCheck : CircleAlert;

  return (
    <m.div
      layout
      role={success ? "status" : "alert"}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "tone-light pointer-events-auto flex w-full max-w-sm gap-3 rounded-lg border border-l-4 border-border bg-surface p-4 shadow-card-hover",
        success ? "border-l-success" : "border-l-danger",
      )}
    >
      <IconComponent
        aria-hidden="true"
        className={cn("mt-0.5 size-5 shrink-0", success ? "text-success" : "text-danger")}
      />
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-ink">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-small text-muted">{toast.description}</p>
        ) : null}
        {toast.action ? (
          <a
            href={toast.action.href}
            className="mt-2 inline-flex min-h-9 items-center text-small font-semibold text-primary underline"
          >
            {toast.action.label}
          </a>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-m-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-pill text-muted hover:bg-soft hover:text-ink"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </m.div>
  );
}

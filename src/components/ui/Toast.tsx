"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
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
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ toast, onDismiss }: { toast: ToastEntry; onDismiss: () => void }) {
  const success = toast.type === "success";
  const IconComponent = success ? CircleCheck : CircleAlert;

  return (
    <div
      role={success ? "status" : "alert"}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm animate-panel-in gap-3 rounded-card border border-l-2 border-border bg-surface p-4 motion-reduce:animate-none",
        success ? "border-l-success" : "border-l-danger",
      )}
    >
      <IconComponent
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn("mt-0.5 size-5 shrink-0", success ? "text-success" : "text-danger")}
      />
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-ink">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-small text-ink-muted">{toast.description}</p>
        ) : null}
        {toast.action ? (
          <a
            href={toast.action.href}
            className="mt-1 inline-flex min-h-11 items-center text-small font-semibold text-link underline underline-offset-4"
          >
            {toast.action.label}
          </a>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-m-3 inline-flex size-11 shrink-0 items-center justify-center rounded-button text-ink-muted hover:text-ink"
      >
        <X aria-hidden="true" strokeWidth={1.5} className="size-4" />
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { ConsentPrefs } from "@/lib/consent";
import { cn } from "@/lib/utils";

const POLICY_HREF = "/cookie-policy";

const categories: {
  id: "necessary" | keyof ConsentPrefs;
  title: string;
  text: string;
}[] = [
  {
    id: "necessary",
    title: "Necessary",
    text: "Remember the choice you make here and protect forms from spam. These stay on.",
  },
  {
    id: "analytics",
    title: "Analytics",
    text: "Google Analytics and Microsoft Clarity show me which pages people find useful and which campaign led them here. No advertising.",
  },
  {
    id: "marketing",
    title: "Marketing",
    text: "Allows Google to measure ad campaigns. I don't retarget visitors today, and this stays off unless you switch it on.",
  },
];

function Switch({
  id,
  checked,
  disabled,
  onChange,
  labelledBy,
  describedBy,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  labelledBy: string;
  describedBy: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-button border transition-colors duration-200",
        checked ? "border-lamp-500 bg-lamp-500" : "border-fg-muted/60 bg-field",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-5 rounded-[5px] transition-transform duration-200",
          checked ? "translate-x-6 bg-ink-900" : "translate-x-0.5 bg-fg-muted",
        )}
      />
    </button>
  );
}

/** Toggles inside the "Customise" panel. Mounted fresh each time the panel opens. */
function Preferences({
  initial,
  onSave,
  onAcceptAll,
}: {
  initial: ConsentPrefs;
  onSave: (prefs: ConsentPrefs) => void;
  onAcceptAll: () => void;
}) {
  const [prefs, setPrefs] = useState(initial);

  return (
    <div>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {categories.map((category) => {
          const necessary = category.id === "necessary";
          const checked = necessary ? true : prefs[category.id as keyof ConsentPrefs];
          return (
            <li key={category.id} className="flex items-start justify-between gap-4 py-4">
              <div>
                <p id={`consent-${category.id}-label`} className="font-semibold text-fg">
                  {category.title}
                </p>
                <p id={`consent-${category.id}-text`} className="mt-1 text-small text-fg-muted">
                  {category.text}
                </p>
              </div>
              <Switch
                id={`consent-${category.id}`}
                checked={checked}
                disabled={necessary}
                labelledBy={`consent-${category.id}-label`}
                describedBy={`consent-${category.id}-text`}
                onChange={(value) => setPrefs((current) => ({ ...current, [category.id]: value }))}
              />
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => onSave(prefs)}>
          Save my choices
        </Button>
        <Button onClick={onAcceptAll}>Allow all</Button>
      </div>
    </div>
  );
}

/** The "Customise" cookie settings panel. Loaded on demand by CookieConsent. */
export function ConsentSettingsDialog({
  open,
  initial,
  onSave,
  onAcceptAll,
  onClose,
}: {
  open: boolean;
  initial: ConsentPrefs;
  onSave: (prefs: ConsentPrefs) => void;
  onAcceptAll: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cookie settings"
      description="Decide which cookies this site may set. You can come back and change this from the footer whenever you like."
      size="lg"
    >
      {open ? (
        <>
          <Preferences initial={initial} onSave={onSave} onAcceptAll={onAcceptAll} />
          <p className="mt-5 text-small text-fg-muted">
            Each cookie is listed in the{" "}
            <Link
              href={POLICY_HREF}
              onClick={onClose}
              className="font-semibold text-accent underline underline-offset-4"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </>
      ) : null}
    </Modal>
  );
}

"use client";

import { Button } from "@/components/ui/Button";

/** Window event the application form listens for to pre-select a role. */
export const SELECT_ROLE_EVENT = "collaborate:select-role";

/**
 * "Apply" on a role row: jumps to the form (#apply) and pre-selects the role there.
 * Without JavaScript it is still a working link to the form.
 */
export function ApplyButton({
  roleId,
  label,
  roleTitle,
}: {
  roleId: string;
  label: string;
  roleTitle: string;
}) {
  return (
    <Button
      href="#apply"
      variant="text-link"
      data-cta="collaborate-role"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_ROLE_EVENT, { detail: roleId }));
      }}
    >
      {label}
      <span className="sr-only">: {roleTitle}</span>
    </Button>
  );
}

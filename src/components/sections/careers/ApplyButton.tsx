"use client";

import { Button } from "@/components/ui/Button";

/** Window event the application form listens for to pre-select a role. */
export const SELECT_ROLE_EVENT = "careers:select-role";

/**
 * "Apply" on a role card: jumps to the form (#apply) and pre-selects the role there.
 * Without JavaScript it is still a working link to the form.
 */
export function ApplyButton({ roleId, label }: { roleId: string; label: string }) {
  return (
    <Button
      href="#apply"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_ROLE_EVENT, { detail: roleId }));
      }}
    >
      {label}
    </Button>
  );
}

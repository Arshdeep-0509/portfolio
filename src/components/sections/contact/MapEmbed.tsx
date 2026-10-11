"use client";

import { useState } from "react";
import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Google Maps embed that loads only on request: no iframe, requests or cookies from Google until
 * the visitor clicks "Show map".
 */
export function MapEmbed({ query, label, title }: { query: string; label: string; title: string }) {
  const [shown, setShown] = useState(false);

  if (!shown) {
    return (
      <Button
        variant="outline"
        leftIcon={<MapPinned aria-hidden="true" className="size-4" />}
        onClick={() => setShown(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <iframe
      src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-80 w-full rounded-xl border border-border shadow-card"
    />
  );
}

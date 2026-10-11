"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/payment-button.js";

/**
 * Razorpay Payment Button. Razorpay's script must sit inside a <form> and renders the button
 * there, so it's injected on mount (React won't execute a <script> rendered in JSX). Checkout
 * opens in Razorpay's own secure window — this site never handles card or bank details.
 */
export function RazorpayButton({ buttonId }: { buttonId: string }) {
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const element = form.current;
    if (!element || element.querySelector("script")) return;
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.dataset.payment_button_id = buttonId;
    element.appendChild(script);
    return () => {
      element.replaceChildren();
    };
  }, [buttonId]);

  return <form ref={form} aria-label="Razorpay payment" className="min-h-12" />;
}

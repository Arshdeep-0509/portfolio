"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every `[data-reveal]` element on the page. Marks each with
 * `data-revealed` the first time it enters the viewport; CSS does the animation.
 * A MutationObserver picks up elements added later (client-side navigation, tab changes).
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const watch = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    };
    watch(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not([data-revealed])")) io.observe(node);
          watch(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

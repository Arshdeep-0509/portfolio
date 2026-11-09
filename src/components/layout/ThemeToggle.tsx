"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { brandColors, type Theme } from "@/lib/brandColors";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

function readSavedTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private windows can block storage; the choice then lasts for this page view.
  }
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

/** The theme the head script set. The server can't know it, so it renders the default. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  // The theme-color tags are media-based, so a manual choice has to overwrite both.
  useEffect(() => {
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", brandColors[theme].bg));
  }, [theme]);

  // Follow the system until the visitor makes a choice of their own.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const follow = () => {
      if (readSavedTheme()) return;
      document.documentElement.setAttribute("data-theme", query.matches ? "light" : "dark");
    };
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => {
        saveTheme(next);
        const root = document.documentElement;
        root.classList.add("theme-switching");
        root.setAttribute("data-theme", next);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => root.classList.remove("theme-switching")),
        );
      }}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-button text-ink transition-colors duration-200 hover:text-link",
        className,
      )}
    >
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
    </button>
  );
}

"use client";

import { useSyncExternalStore } from "react";

/**
 * The URL query string as React state. Filters and search boxes read from it and write back
 * with setUrlSearch, so the URL is the single source of truth and every filtered view can be
 * shared. Server render and hydration see "" (no filters); the real query applies right after.
 */

const EVENT = "url-search-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function useUrlSearch(): URLSearchParams {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  return new URLSearchParams(search);
}

/** Replace the query string (no new history entry) and notify useUrlSearch subscribers. */
export function setUrlSearch(params: URLSearchParams) {
  const url = new URL(window.location.href);
  url.search = params.toString();
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(EVENT));
}

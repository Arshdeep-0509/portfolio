export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before the body paints, so the first frame is already the right theme: a saved
 * choice wins, then the system preference, and dark is the default when neither is available.
 */
export const themeScript = `(function(){var r=document.documentElement,t;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}if(t!=="light"&&t!=="dark"){var m=window.matchMedia&&matchMedia("(prefers-color-scheme: light)");t=m&&m.matches?"light":"dark"}r.setAttribute("data-theme",t)})()`;

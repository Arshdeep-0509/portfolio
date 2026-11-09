"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, isOverHeroRoute, type HeaderNav } from "@/components/layout/navTypes";
import { ServicesMenu } from "@/components/layout/ServicesMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/brand/Logo";
import { Star } from "@/components/brand/Star";
import { Button } from "@/components/ui/Button";
import { LiveClock } from "@/components/ui/LiveClock";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";

const loadMobileMenu = () => import("@/components/layout/MobileMenu").then((mod) => mod.MobileMenu);

// Not part of the first load. Fetched on the visitor's first touch or scroll, so it's ready by the
// time they reach for Menu rather than leaving a pause after the tap.
const MobileMenu = dynamic(loadMobileMenu, { ssr: false });

const SOLID_AFTER_PX = 40;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * Two rows: a 32px night utility strip (desktop only: availability, local time, email) and the
 * 68px main bar. Over a hero the bar is transparent until 40px of scroll
 * (CSS in globals.css › HEADER STATES); this component reports the route, scroll and open menus.
 */
export function HeaderClient({ nav }: { nav: HeaderNav }) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SOLID_AFTER_PX,
    () => false,
  );

  // Menus remember the path they were opened on, so any route change closes them.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const mobileOpen = mobilePath === pathname;
  const { copy, contact } = nav;
  // Stays mounted after the first open, so the native dialog can restore focus on close.
  const [menuLoaded, setMenuLoaded] = useState(false);
  if (mobileOpen && !menuLoaded) setMenuLoaded(true);

  useEffect(() => {
    if (window.matchMedia("(min-width: 64rem)").matches) return;
    const events = ["pointerdown", "scroll", "keydown"] as const;
    const warm = () => {
      events.forEach((name) => window.removeEventListener(name, warm));
      // After the interaction has painted, so the fetch never slows the tap that triggered it.
      window.setTimeout(() => void loadMobileMenu(), 500);
    };
    events.forEach((name) => window.addEventListener(name, warm, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, warm));
  }, []);

  return (
    <header
      data-solid={scrolled || menuOpen ? "" : undefined}
      data-over-hero={isOverHeroRoute(pathname) ? "" : undefined}
      className="site-header fixed inset-x-0 top-0 z-50"
    >
      {/* Utility strip */}
      <div className="hidden h-(--strip-h) bg-surface text-ink-muted lg:block">
        <div className="container-site grid h-full grid-cols-3 items-center text-xs tabular-nums">
          <StatusDot
            status={nav.availability}
            label={copy.availability[nav.availability]}
            mono={false}
            className="text-xs text-ink-muted"
          />
          <p className="text-center">
            <PlaceholderText text={contact.city} /> · <LiveClock /> {copy.timezone}
          </p>
          <p className="text-right">
            {contact.email.href ? (
              <a href={contact.email.href} className="link-underline hover:text-ink">
                {contact.email.label}
              </a>
            ) : (
              <PlaceholderText text={contact.email.label} />
            )}
          </p>
        </div>
      </div>

      {/* Main bar */}
      <div className="site-bar h-(--bar-h) text-ink">
        <div className="container-site flex h-full items-center justify-between gap-6">
          <Logo variant="full" wordmarkClassName="max-[380px]:hidden" />

          <div className="hidden h-full items-center gap-8 lg:flex">
            <nav aria-label="Main" className="h-full">
              <ul className="flex h-full items-center gap-6 xl:gap-7">
                {nav.main.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} className="relative flex h-full items-center">
                      {/* In the gap before the label, so the bar doesn't shift between pages. */}
                      {active ? (
                        <Star className="absolute top-1/2 -left-3.5 size-2.5 -translate-y-1/2 text-accent" />
                      ) : null}
                      {item.hasMenu ? (
                        <ServicesMenu
                          label={item.label}
                          groups={nav.services}
                          copy={copy.menu}
                          open={menuOpen}
                          onOpenChange={(next) => setMenuPath(next ? pathname : null)}
                        />
                      ) : (
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="inline-flex min-h-11 items-center text-small font-semibold text-ink transition-colors duration-200 hover:text-link"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ThemeToggle />
            <Button href={copy.cta.href} variant="outline" size="sm" data-cta="header">
              {copy.cta.label}
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobilePath(pathname)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex min-h-11 label-text items-center gap-2.5 rounded-button px-1 text-ink lg:hidden",
              )}
            >
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3/4 bg-current" />
              </span>
              {copy.menu.open}
            </button>
          </div>
        </div>
      </div>

      {menuLoaded ? (
        <MobileMenu open={mobileOpen} onClose={() => setMobilePath(null)} nav={nav} />
      ) : null}
    </header>
  );
}

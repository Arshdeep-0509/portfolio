"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/layout/Logo";
import { isActivePath, isOverHeroRoute, type HeaderNav } from "@/components/layout/navTypes";
import { ServicesMenu } from "@/components/layout/ServicesMenu";
import { Button } from "@/components/ui/Button";
import { LiveClock } from "@/components/ui/LiveClock";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";

const SOLID_AFTER_PX = 40;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * Two rows: a 32px night utility strip (desktop only: availability, local time, email) and the
 * 68px main bar. Over a night hero the bar is transparent with ivory text until 40px of scroll
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

  return (
    <header
      data-solid={scrolled || menuOpen ? "" : undefined}
      data-over-hero={isOverHeroRoute(pathname) ? "" : undefined}
      className="site-header fixed inset-x-0 top-0 z-50"
    >
      {/* Utility strip */}
      <div className="tone-night hidden h-(--strip-h) bg-night-950 text-mist-300 lg:block">
        <div className="container-site grid h-full grid-cols-3 items-center font-mono text-xs">
          <StatusDot
            status={nav.availability}
            label={copy.availability[nav.availability]}
            mono={false}
            className="text-xs text-mist-300"
          />
          <p className="text-center">
            <PlaceholderText text={contact.city} /> · <LiveClock /> {copy.timezone}
          </p>
          <p className="text-right">
            {contact.email.href ? (
              <a href={contact.email.href} className="link-underline hover:text-ivory-50">
                {contact.email.label}
              </a>
            ) : (
              <PlaceholderText text={contact.email.label} />
            )}
          </p>
        </div>
      </div>

      {/* Main bar */}
      <div className="site-bar tone-ivory h-(--bar-h) text-fg">
        <div className="container-site flex h-full items-center justify-between gap-6">
          <Logo tone="auto" />

          <div className="hidden h-full items-center gap-8 lg:flex">
            <nav aria-label="Main" className="h-full">
              <ul className="flex h-full items-center gap-6 xl:gap-7">
                {nav.main.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href} className="relative flex h-full items-center">
                      {item.hasMenu ? (
                        <ServicesMenu
                          label={item.label}
                          groups={nav.services}
                          copy={copy.menu}
                          active={active}
                          open={menuOpen}
                          onOpenChange={(next) => setMenuPath(next ? pathname : null)}
                        />
                      ) : (
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="inline-flex min-h-11 items-center text-small font-semibold text-fg transition-colors duration-200 hover:text-accent"
                        >
                          {item.label}
                        </Link>
                      )}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-3.5 left-1/2 size-1.5 -translate-x-1/2 rounded-dot bg-lamp-500 shadow-[0_0_8px_1px_rgb(245_165_36/0.7)]"
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>
            <Button href={copy.cta.href} variant="outline" size="sm" data-cta="header">
              {copy.cta.label}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobilePath(pathname)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={cn(
              "inline-flex min-h-11 items-center gap-2.5 rounded-button px-1 label-mono text-fg lg:hidden",
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

      <MobileMenu open={mobileOpen} onClose={() => setMobilePath(null)} nav={nav} />
    </header>
  );
}

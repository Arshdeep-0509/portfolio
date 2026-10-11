"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, m } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { isActivePath, type HeaderNav, type MegaGroupView } from "@/components/layout/navTypes";
import { cn } from "@/lib/utils";

const SHADOW_AFTER_PX = 8;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function HeaderClient({ groups, nav }: { groups: MegaGroupView[]; nav: HeaderNav }) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SHADOW_AFTER_PX,
    () => false,
  );

  // Menus remember the path they were opened on, so any route change closes them
  // without an effect.
  const [megaPath, setMegaPath] = useState<string | null>(null);
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const megaOpen = megaPath === pathname;
  const mobileOpen = mobilePath === pathname;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-(--header-h) bg-surface/96 backdrop-blur-[18px]",
        // box-shadow never affects layout, so gaining it causes no shift.
        "transition-shadow duration-200",
        scrolled || megaOpen ? "shadow-nav" : "shadow-none",
      )}
    >
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden h-full lg:block">
          <LayoutGroup id="main-nav">
            <ul className="flex h-full items-center gap-1">
              {nav.main.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="relative flex h-full items-center">
                    {item.hasMega ? (
                      <MegaMenu
                        label={item.label}
                        groups={groups}
                        promo={nav.promo}
                        active={active}
                        open={megaOpen}
                        onOpenChange={(next) => setMegaPath(next ? pathname : null)}
                      />
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex min-h-11 items-center rounded-pill px-3.5 text-small font-semibold transition-colors duration-200",
                          active ? "text-primary" : "text-ink hover:text-primary",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                    {active ? <ActiveBar /> : null}
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={nav.cta.href}
            data-cta="header"
            size="md"
            className="hidden sm:inline-flex"
            rightIcon={<ArrowRight aria-hidden="true" className="size-4" />}
          >
            {nav.cta.label}
          </Button>
          <button
            type="button"
            onClick={() => setMobilePath(pathname)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="inline-flex size-11 items-center justify-center rounded-pill text-ink transition-colors duration-200 hover:bg-soft lg:hidden"
          >
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobilePath(null)} groups={groups} nav={nav} />
    </header>
  );
}

/** 2px bar under the active link; slides between links via a shared layoutId. */
function ActiveBar() {
  return (
    <m.span
      layoutId="nav-active-bar"
      aria-hidden="true"
      className="absolute inset-x-3.5 bottom-3 h-0.5 rounded-pill bg-primary lg:bottom-4"
      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
    />
  );
}

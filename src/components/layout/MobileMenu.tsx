"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Mail, MessageCircle, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Star } from "@/components/brand/Star";
import { isActivePath, type HeaderNav } from "@/components/layout/navTypes";
import { Button } from "@/components/ui/Button";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { StatusDot } from "@/components/ui/StatusDot";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { cn } from "@/lib/utils";

/**
 * Below 1024px: a full-screen night overlay on a native <dialog> (focus trap, Esc and scroll lock
 * come from useModalDialog). Large serif links, a services accordion, contact actions and the
 * availability dot. Every link closes it; route changes close it via the parent.
 */
export function MobileMenu({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: HeaderNav;
}) {
  const pathname = usePathname();
  const dialogProps = useModalDialog(open, onClose);
  const servicesPanelId = useId();
  const [servicesOpen, setServicesOpen] = useState(() => pathname.startsWith("/services"));
  const { copy, contact } = nav;

  const linkClass = "flex min-h-14 items-center font-semibold text-[2rem] leading-none";

  return (
    <dialog
      {...dialogProps}
      id="mobile-menu"
      aria-label={copy.menu.dialogLabel}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink backdrop:bg-transparent open:animate-overlay-in"
    >
      {/* Contents mount only while open, keeping them out of every page's DOM. */}
      {open ? (
        <div className="flex h-full flex-col">
          <div className="container-site flex h-(--bar-h) shrink-0 items-center justify-between">
            <Logo onClick={onClose} />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 label-text items-center gap-2 rounded-button px-1 text-ink"
            >
              <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
              {copy.menu.close}
            </button>
          </div>

          <div className="container-site flex-1 overflow-y-auto pt-6 pb-10">
            <StatusDot status={nav.availability} label={copy.availability[nav.availability]} />

            <nav aria-label="Mobile" className="mt-8">
              <ul className="border-t border-border">
                {nav.main.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  if (item.hasMenu) {
                    return (
                      <li key={item.href} className="border-b border-border">
                        <button
                          type="button"
                          aria-expanded={servicesOpen}
                          aria-controls={servicesPanelId}
                          onClick={() => setServicesOpen((value) => !value)}
                          className={cn(linkClass, "w-full justify-between text-left", "text-ink")}
                        >
                          <span className="flex items-center gap-3">
                            {active ? <Star className="size-3.5 shrink-0 text-accent" /> : null}
                            {item.label}
                          </span>
                          <ChevronDown
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className={cn(
                              "size-6 text-ink-muted transition-transform duration-200",
                              servicesOpen && "rotate-180",
                            )}
                          />
                        </button>
                        <div
                          id={servicesPanelId}
                          inert={!servicesOpen}
                          className={cn(
                            "grid transition-[grid-template-rows] duration-300 ease-out",
                            servicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="space-y-6 pt-2 pb-6">
                              {nav.services.map((group) => (
                                <div key={group.id}>
                                  <p
                                    id={`mobile-group-${group.id}`}
                                    className="label-text text-ink-muted"
                                  >
                                    {group.label}
                                  </p>
                                  <ul aria-labelledby={`mobile-group-${group.id}`} className="mt-1">
                                    {group.items.map((service) => (
                                      <li key={service.href}>
                                        <Link
                                          href={service.href}
                                          onClick={onClose}
                                          aria-current={
                                            pathname === service.href ? "page" : undefined
                                          }
                                          className="flex min-h-11 items-center gap-2.5 text-body text-ink-muted hover:text-ink aria-[current=page]:text-ink"
                                        >
                                          {pathname === service.href ? (
                                            <Star className="size-2.5 shrink-0 text-accent" />
                                          ) : null}
                                          {service.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              <Link
                                href={copy.menu.servicesOverview.href}
                                onClick={onClose}
                                className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-link"
                              >
                                {copy.menu.servicesOverview.label}
                                <ArrowRight
                                  aria-hidden="true"
                                  strokeWidth={1.5}
                                  className="size-4"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href} className="border-b border-border">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(linkClass, "gap-3 text-ink")}
                      >
                        {active ? <Star className="size-3.5 shrink-0 text-accent" /> : null}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={copy.book.href} size="lg" data-cta="mobile-menu" onClick={onClose}>
                {copy.book.label}
              </Button>
              <Button href={copy.cta.href} variant="outline" size="lg" onClick={onClose}>
                {copy.cta.label}
              </Button>
            </div>

            <ul className="mt-8 space-y-1 text-small text-ink-muted">
              <li className="flex min-h-11 items-center gap-3">
                <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
                {contact.email.href ? (
                  <a href={contact.email.href} className="link-underline hover:text-ink">
                    {contact.email.label}
                  </a>
                ) : (
                  <PlaceholderText text={contact.email.label} />
                )}
              </li>
              <li className="flex min-h-11 items-center gap-3">
                <MessageCircle
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-5 text-ink-muted"
                />
                {contact.whatsapp.href ? (
                  <a
                    href={contact.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="mobile-menu"
                    className="link-underline hover:text-ink"
                  >
                    WhatsApp {contact.whatsapp.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span>
                    WhatsApp <PlaceholderText text={contact.whatsapp.label} />
                  </span>
                )}
              </li>
            </ul>

            {nav.social.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {nav.social.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="inline-flex size-11 items-center justify-center rounded-button border border-border text-ink hover:border-link"
                    >
                      <SocialIcon name={social.key} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

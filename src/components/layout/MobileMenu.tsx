"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Mail, MessageCircle, X } from "lucide-react";
import { isActivePath, type HeaderNav, type MegaGroupView } from "@/components/layout/navTypes";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useModalDialog } from "@/components/ui/useModalDialog";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  groups: MegaGroupView[];
  nav: HeaderNav;
};

/**
 * Right-hand sheet below 1024px, on a native <dialog>: focus trap, Esc, backdrop click and scroll
 * lock come from useModalDialog. Every link closes it; route changes close it via the parent.
 */
export function MobileMenu({ open, onClose, groups, nav }: MobileMenuProps) {
  const pathname = usePathname();
  const dialogProps = useModalDialog(open, onClose);
  const servicesPanelId = useId();
  const [servicesOpen, setServicesOpen] = useState(() => pathname.startsWith("/services"));

  return (
    <dialog
      {...dialogProps}
      id="mobile-menu"
      aria-label="Site menu"
      className={cn(
        "tone-light fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[88%] max-w-[380px] bg-surface p-0 text-ink shadow-card-hover",
        "backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm open:animate-sheet-in open:backdrop:animate-backdrop-in",
      )}
    >
      {/* Contents mount only while open, keeping ~90 elements out of every page's DOM. */}
      {open ? (
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <Logo onClick={onClose} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-pill text-ink transition-colors duration-200 hover:bg-soft"
            >
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <nav aria-label="Mobile">
              <ul className="divide-y divide-border">
                {nav.main.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  if (item.hasMega) {
                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          aria-expanded={servicesOpen}
                          aria-controls={servicesPanelId}
                          onClick={() => setServicesOpen((value) => !value)}
                          className={cn(
                            "flex min-h-13 w-full items-center justify-between rounded-md text-left text-lg font-semibold",
                            active ? "text-primary" : "text-ink",
                          )}
                        >
                          {item.label}
                          <ChevronDown
                            aria-hidden="true"
                            className={cn(
                              "size-5 transition-transform duration-200",
                              servicesOpen && "rotate-180",
                            )}
                          />
                        </button>
                        <div
                          id={servicesPanelId}
                          inert={!servicesOpen}
                          className={cn(
                            "grid transition-[grid-template-rows] duration-200 ease-out",
                            servicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="space-y-5 pt-1 pb-5">
                              {groups.map((group) => (
                                <div key={group.id}>
                                  <p
                                    id={`mobile-group-${group.id}`}
                                    className="text-eyebrow font-semibold text-primary uppercase"
                                  >
                                    {group.label}
                                  </p>
                                  <ul
                                    aria-labelledby={`mobile-group-${group.id}`}
                                    className="mt-1.5"
                                  >
                                    {group.items.map((service) => (
                                      <li key={service.href}>
                                        <Link
                                          href={service.href}
                                          onClick={onClose}
                                          aria-current={
                                            pathname === service.href ? "page" : undefined
                                          }
                                          className="flex min-h-11 items-center rounded-md text-body text-muted hover:text-primary aria-[current=page]:font-semibold aria-[current=page]:text-primary"
                                        >
                                          {service.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-small font-semibold text-primary"
                              >
                                All services <ArrowRight aria-hidden="true" className="size-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-13 items-center rounded-md text-lg font-semibold",
                          active ? "text-primary" : "text-ink hover:text-primary",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Button
              href={nav.cta.href}
              data-cta="mobile-menu"
              onClick={onClose}
              size="lg"
              className="mt-6 w-full"
              rightIcon={<ArrowRight aria-hidden="true" className="size-5" />}
            >
              {nav.cta.label}
            </Button>

            <ul className="mt-6 space-y-1 text-small">
              <ContactRow
                icon={<Mail aria-hidden="true" className="size-4" />}
                {...nav.contact.email}
              />
              <ContactRow
                icon={<MessageCircle aria-hidden="true" className="size-4" />}
                {...nav.contact.whatsapp}
                prefix="WhatsApp: "
                external
              />
            </ul>

            {nav.social.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {nav.social.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="inline-flex size-11 items-center justify-center rounded-pill border border-border text-ink transition-colors duration-200 hover:border-primary hover:text-primary"
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

function ContactRow({
  icon,
  label,
  href,
  prefix = "",
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  prefix?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-soft text-primary">
        {icon}
      </span>
      <span>
        {prefix}
        {label}
      </span>
    </>
  );
  const rowClass = "flex min-h-11 items-center gap-3 rounded-md text-muted";

  // Until the real value replaces the [PLACEHOLDER], show it as plain text, not a broken link.
  return (
    <li>
      {href ? (
        <a
          href={href}
          className={cn(rowClass, "hover:text-primary")}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      ) : (
        <span className={rowClass}>{content}</span>
      )}
    </li>
  );
}

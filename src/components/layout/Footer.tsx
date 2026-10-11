import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contactDetails, footerNav, socialLinks } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm text-small text-white/80 transition-colors duration-200 hover:text-white hover:underline underline-offset-4";

/**
 * Cache Components forbids reading the clock while prerendering, so the year is computed in a
 * cached scope and refreshed daily.
 */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const gstin = siteConfig.gstin && !isPlaceholder(siteConfig.gstin) ? siteConfig.gstin : null;

  return (
    <footer className="tone-dark bg-grad-footer text-white/80">
      <Container className="pt-16 pb-8 lg:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] lg:gap-8">
          {/* 1. Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="white" />
            <p className="mt-5 max-w-xs text-small">
              I design, build and run web, mobile and AI products for founders and growing
              businesses — from first MVP to scale.
            </p>
            <p className="mt-5 text-small">{siteConfig.legalName}</p>
            {gstin ? <p className="mt-1 font-mono text-xs">GSTIN: {gstin}</p> : null}
          </div>

          {/* 2–4. Company, Services, Legal */}
          {footerNav.map((column) => (
            <nav key={column.title} aria-labelledby={`footer-${column.title.toLowerCase()}`}>
              <h2
                id={`footer-${column.title.toLowerCase()}`}
                className="text-small font-semibold text-white"
              >
                {column.title}
              </h2>
              <ul className="mt-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"action" in link ? (
                      <CookieSettingsButton label={link.label} className={linkClass} />
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* 5. Connect */}
          <div>
            <h2 className="text-small font-semibold text-white">Connect</h2>
            <ul className="mt-4 space-y-3 text-small">
              <ContactItem
                icon={<Mail aria-hidden="true" className="size-4" />}
                {...contactDetails.email}
              />
              <ContactItem
                icon={<MessageCircle aria-hidden="true" className="size-4" />}
                {...contactDetails.whatsapp}
                external
              />
              <ContactItem
                icon={<MapPin aria-hidden="true" className="size-4" />}
                label={contactDetails.location}
              />
              <ContactItem
                icon={<Clock aria-hidden="true" className="size-4" />}
                label={contactDetails.hours}
              />
            </ul>

            {socialLinks.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="inline-flex size-11 items-center justify-center rounded-pill border border-white/20 text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
                    >
                      <SocialIcon name={social.key} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-small sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>Made in {contactDetails.location}</p>
        </div>
      </Container>
    </footer>
  );
}

function ContactItem({
  icon,
  label,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="mt-0.5 shrink-0 text-sky-400">{icon}</span>
      <span className="break-all">{label}</span>
    </>
  );

  // Placeholders render as plain text rather than a broken mailto:/wa.me link.
  return (
    <li>
      {href ? (
        <a
          href={href}
          className="flex gap-2.5 rounded-sm underline-offset-4 hover:text-white hover:underline"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      ) : (
        <span className="flex gap-2.5">{content}</span>
      )}
    </li>
  );
}

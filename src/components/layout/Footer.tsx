import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/brand/Logo";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { LazyNewsletterForm } from "@/components/layout/LazyForms";
import { LiveClock } from "@/components/ui/LiveClock";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contactDetails, footerCopy, footerNav, socialLinks } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

const linkClass =
  "inline-flex min-h-11 items-center text-small text-ink transition-colors duration-200 hover:text-link link-underline";

/**
 * Cache Components forbids reading the clock while prerendering, so the year is computed in a
 * cached scope and refreshed daily.
 */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/**
 * Polar Night in both themes (a data-theme="dark" island), with Glacier text. The logo and tagline
 * lead, then three link columns, the newsletter field and a contact block with the local clock,
 * then the legal line.
 */
export function Footer() {
  const gstin = siteConfig.gstin && !isPlaceholder(siteConfig.gstin) ? siteConfig.gstin : null;
  const { contact } = footerCopy;

  return (
    <footer data-theme="dark" className="border-t border-border bg-bg text-ink">
      <div className="container-site pt-16 pb-10 lg:pt-20">
        <Logo variant="full" size={44} showTagline />
      </div>

      <div className="container-site">
        <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            {footerNav.map((column) => (
              <nav key={column.title} aria-labelledby={`footer-${column.title.toLowerCase()}`}>
                <h2
                  id={`footer-${column.title.toLowerCase()}`}
                  className="label-text text-ink-muted"
                >
                  {column.title}
                </h2>
                <ul className="mt-4">
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
          </div>

          <div className="lg:col-span-3">
            <LazyNewsletterForm copy={footerCopy.newsletter} location="footer" />
          </div>

          <div className="lg:col-span-3">
            <h2 className="label-text text-ink-muted">{contact.title}</h2>
            <ul className="mt-4 text-small text-ink">
              <li>
                {contactDetails.email.href ? (
                  <a href={contactDetails.email.href} className={linkClass}>
                    {contactDetails.email.label}
                  </a>
                ) : (
                  <PlaceholderText text={contactDetails.email.label} />
                )}
              </li>
              <li>
                {contactDetails.whatsapp.href ? (
                  <a
                    href={contactDetails.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="footer"
                    className={linkClass}
                  >
                    WhatsApp {contactDetails.whatsapp.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <>
                    WhatsApp <PlaceholderText text={contactDetails.whatsapp.label} />
                  </>
                )}
              </li>
              <li className="flex min-h-11 items-center">
                <span>
                  {contact.localTime} <PlaceholderText text={contactDetails.city} />:{" "}
                  <LiveClock className="tabular-nums" /> IST
                </span>
              </li>
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
                      className="inline-flex size-11 items-center justify-center rounded-button border border-border text-ink transition-colors duration-200 hover:border-link"
                    >
                      <SocialIcon name={social.key} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-site mt-14">
        <div className="border-t border-border py-6 text-small text-ink-muted">
          <p>
            © <CurrentYear /> {siteConfig.legalName}. {footerCopy.rights}
            {gstin ? <span className="ml-3 text-xs tabular-nums">GSTIN {gstin}</span> : null}
          </p>
        </div>
      </div>
    </footer>
  );
}

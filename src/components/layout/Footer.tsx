import Link from "next/link";
import { cacheLife } from "next/cache";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { LiveClock } from "@/components/ui/LiveClock";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contactDetails, footerCopy, footerNav, socialLinks } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

const linkClass =
  "inline-flex min-h-10 items-center text-small text-mist-300 transition-colors duration-200 hover:text-ivory-50 link-underline";

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
 * Night footer with the star texture. Top: three compact link columns, the newsletter field and
 * a contact block with the local clock. Bottom: the name and tagline, then the legal line.
 */
export function Footer() {
  const gstin = siteConfig.gstin && !isPlaceholder(siteConfig.gstin) ? siteConfig.gstin : null;
  const { contact } = footerCopy;

  return (
    <footer className="tone-night relative overflow-hidden border-t border-line-dark bg-night-950 bg-stars text-fg">
      <div className="container-site pt-20 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            {footerNav.map((column) => (
              <nav key={column.title} aria-labelledby={`footer-${column.title.toLowerCase()}`}>
                <h2
                  id={`footer-${column.title.toLowerCase()}`}
                  className="label-mono text-lamp-400"
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
            <NewsletterForm copy={footerCopy.newsletter} location="footer" />
          </div>

          <div className="lg:col-span-3">
            <h2 className="label-mono text-lamp-400">{contact.title}</h2>
            <ul className="mt-4 space-y-3 text-small text-mist-300">
              <li>
                {contactDetails.email.href ? (
                  <a href={contactDetails.email.href} className="link-underline text-ivory-50">
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
                    className="link-underline text-ivory-50"
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
              <li>
                {contact.localTime} <PlaceholderText text={contactDetails.city} />:{" "}
                <LiveClock className="font-mono text-ivory-50" /> IST
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
                      className="inline-flex size-11 items-center justify-center rounded-button border border-line-dark text-ivory-50 transition-colors duration-200 hover:border-lamp-500"
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

      <div className="container-site mt-14 flex flex-col gap-2 border-t border-line-dark pt-10 pb-8 md:flex-row md:items-baseline md:justify-between md:gap-8">
        <p className="font-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-tight text-ivory-50">
          {siteConfig.brand.wordmark}
        </p>
        <p className="text-lg text-lamp-400 md:text-right">{siteConfig.tagline}</p>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line-dark py-6 text-small text-mist-300">
        <p>
          © <CurrentYear /> <PlaceholderText text={siteConfig.legalName} />. {footerCopy.rights}
          {gstin ? <span className="ml-3 font-mono text-xs">GSTIN {gstin}</span> : null}
        </p>
      </div>
    </footer>
  );
}

import { CalendarClock, Mail, MessageCircle } from "lucide-react";
import { LazyContactForm } from "@/components/sections/LazyPageForms";
import { FaqJsonLd } from "@/components/sections/shared/FaqJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Emphasis } from "@/components/ui/Emphasis";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { StarPath } from "@/components/ui/StarPath";
import { contactContent } from "@/content/contact";
import { siteConfig } from "@/content/site";
import { bookingHref, bookingIsExternal } from "@/lib/booking";
import { isPlaceholder } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: contactContent.seo.title,
  description: contactContent.seo.description,
  path: "/contact",
});

/**
 * Split screen: a sticky night column (headline, direct contact methods, what happens next, the
 * reply promise) beside the three-step enquiry wizard on ivory; then four short answers.
 * The QuickStart section is hidden on this page.
 */
export default function ContactPage() {
  const { intro, form, faq, calendly } = contactContent;
  const { location, calendlyUrl } = siteConfig;
  const { email, phone, whatsapp: whatsappUrl } = siteConfig.contact;
  const emailHref = isPlaceholder(email) ? null : `mailto:${email}`;
  const whatsappHref = isPlaceholder(whatsappUrl) ? null : whatsappUrl;
  const calendlyReal = isPlaceholder(calendlyUrl) ? null : calendlyUrl;
  const method = "group flex min-h-16 items-center gap-4 border-b border-border py-3";
  const methodText = "font-semibold text-2xl text-ink transition-colors group-hover:text-link";

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 lg:items-start">
        <section
          aria-labelledby="contact-title"
          className="relative bg-bg bg-stars text-ink lg:sticky lg:top-(--header-h) lg:col-span-5 lg:min-h-[calc(100svh-var(--header-h))]"
        >
          <div className="px-4 pt-14 pb-16 sm:px-8 lg:px-12 lg:pt-16 xl:pl-[max(1.5rem,calc((100vw-1240px)/2))]">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <h1 id="contact-title" className="mt-8 text-h2 text-ink">
              <Emphasis text={intro.title} emphasis={intro.emphasis} />
            </h1>
            <p className="mt-5 text-ink-muted">{intro.text}</p>

            <p className="mt-10 label-text text-ink-muted">{intro.methodsLabel}</p>
            <ul className="mt-2 border-t border-border">
              <li>
                {emailHref ? (
                  <a href={emailHref} className={method} data-cta="contact-methods">
                    <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
                    <span className={methodText}>{intro.methods.email}</span>
                  </a>
                ) : (
                  <p className={method}>
                    <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
                    <span className="text-ink-muted">
                      {intro.methods.email}: <PlaceholderText text={email} />
                    </span>
                  </p>
                )}
              </li>
              <li>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={method}
                    data-cta="contact-methods"
                  >
                    <MessageCircle
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 text-ink-muted"
                    />
                    <span className={methodText}>{intro.methods.whatsapp}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <p className={method}>
                    <MessageCircle
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 text-ink-muted"
                    />
                    <span className="text-ink-muted">
                      {intro.methods.whatsapp}: <PlaceholderText text={phone} />
                    </span>
                  </p>
                )}
              </li>
              <li>
                <a
                  href={bookingHref}
                  className={method}
                  data-cta="contact-methods"
                  {...(bookingIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <CalendarClock
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-5 text-ink-muted"
                  />
                  <span className={methodText}>{intro.methods.book}</span>
                  {bookingIsExternal ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            </ul>

            <dl className="mt-6 grid gap-3 text-small sm:grid-cols-2 lg:grid-cols-1">
              {[
                [intro.labels.phone, phone],
                [intro.labels.location, `${location.city}, ${location.countryName}`],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="label-text text-ink-muted">{term}</dt>
                  <dd className="mt-0.5 text-ink">
                    <PlaceholderText text={detail} />
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 label-text text-ink-muted">{intro.nextTitle}</h2>
            <StarPath className="mt-5" items={intro.next.map((line) => ({ text: line }))} />
            <p className="mt-10 border-t border-border pt-5 text-lg font-medium text-ink">
              {intro.promise}
            </p>
          </div>
        </section>

        <section
          id={form.id}
          aria-label={form.ariaLabel}
          className="bg-surface px-4 py-14 text-ink sm:px-8 lg:col-span-7 lg:self-stretch lg:px-14 lg:py-16 xl:pr-[max(1.5rem,calc((100vw-1240px)/2))]"
        >
          <h2 className="sr-only">{form.ariaLabel}</h2>
          <div className="max-w-2xl">
            <LazyContactForm
              copy={form}
              emailHref={emailHref}
              calendlyUrl={calendlyReal}
              calendlyTitle={calendly.modalTitle}
              privacyHref="/privacy-policy"
            />
          </div>
        </section>
      </div>

      <section id={faq.id} aria-labelledby="contact-faq-title" className="bg-surface text-ink">
        <div className="container-site py-16 lg:py-20">
          <h2 id="contact-faq-title" className="label-text text-ink-muted">
            {faq.label}
          </h2>
          <dl className="mt-6 grid gap-x-10 border-t border-border md:grid-cols-2">
            {faq.items.map((item) => (
              <div key={item.q} className="border-b border-border py-6">
                <dt className="font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-small text-ink-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <FaqJsonLd items={faq.items} />
        </div>
      </section>
    </>
  );
}

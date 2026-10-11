import { CalendarClock, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { FaqJsonLd } from "@/components/sections/shared/FaqJsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Emphasis } from "@/components/ui/Emphasis";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
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
  const { email, phone, whatsappUrl, location, calendlyUrl } = siteConfig;
  const emailHref = isPlaceholder(email) ? null : `mailto:${email}`;
  const whatsappHref = isPlaceholder(whatsappUrl) ? null : whatsappUrl;
  const calendlyReal = isPlaceholder(calendlyUrl) ? null : calendlyUrl;
  const method = "group flex min-h-16 items-center gap-4 border-b border-line-dark py-3";
  const methodText =
    "font-display-soft text-2xl text-fg transition-colors group-hover:text-lamp-400";

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 lg:items-start">
        <section
          aria-labelledby="contact-title"
          className="tone-night relative bg-night-950 bg-stars text-fg lg:sticky lg:top-(--header-h) lg:col-span-5 lg:min-h-[calc(100svh-var(--header-h))]"
        >
          <div className="px-4 pt-14 pb-16 sm:px-8 lg:px-12 lg:pt-16 xl:pl-[max(1.5rem,calc((100vw-1240px)/2))]">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <h1 id="contact-title" className="mt-8 text-h2 text-fg">
              <Emphasis text={intro.title} emphasis={intro.emphasis} />
            </h1>
            <p className="mt-5 text-fg-muted">{intro.text}</p>

            <p className="mt-10 label-mono text-mist-300">{intro.methodsLabel}</p>
            <ul className="mt-2 border-t border-line-dark">
              <li>
                {emailHref ? (
                  <a href={emailHref} className={method} data-cta="contact-methods">
                    <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-lamp-400" />
                    <span className={methodText}>{intro.methods.email}</span>
                  </a>
                ) : (
                  <p className={method}>
                    <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-lamp-400" />
                    <span className="text-fg-muted">
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
                      className="size-5 text-lamp-400"
                    />
                    <span className={methodText}>{intro.methods.whatsapp}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <p className={method}>
                    <MessageCircle
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-5 text-lamp-400"
                    />
                    <span className="text-fg-muted">
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
                    className="size-5 text-lamp-400"
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
                [intro.labels.location, `${location.city}, ${location.country}`],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt className="label-mono text-mist-300">{term}</dt>
                  <dd className="mt-0.5 text-fg">
                    <PlaceholderText text={detail} />
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 label-mono text-lamp-400">{intro.nextTitle}</h2>
            <ol className="relative mt-5 space-y-5 pl-7">
              <span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[4px] w-px bg-line-dark"
              />
              {intro.next.map((line) => (
                <li key={line} className="relative text-small text-fg">
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.45em] -left-7 size-[9px] rounded-dot bg-lamp-500"
                  />
                  {line}
                </li>
              ))}
            </ol>
            <p className="mt-10 border-t border-line-dark pt-5 font-display-soft text-lg text-fg italic">
              {intro.promise}
            </p>
          </div>
        </section>

        <section
          id={form.id}
          aria-label={form.ariaLabel}
          className="tone-ivory grain bg-ivory-50 px-4 py-14 text-fg sm:px-8 lg:col-span-7 lg:px-14 lg:py-16 xl:pr-[max(1.5rem,calc((100vw-1240px)/2))]"
        >
          <div className="max-w-2xl">
            <ContactForm
              copy={form}
              emailHref={emailHref}
              calendlyUrl={calendlyReal}
              calendlyTitle={calendly.modalTitle}
              privacyHref="/privacy-policy"
            />
          </div>
        </section>
      </div>

      <section
        id={faq.id}
        aria-labelledby="contact-faq-title"
        className="tone-sand bg-sand-100 text-fg"
      >
        <div className="container-site py-16 lg:py-20">
          <h2 id="contact-faq-title" className="label-mono text-accent">
            {faq.label}
          </h2>
          <dl className="mt-6 grid gap-x-10 border-t border-rule md:grid-cols-2">
            {faq.items.map((item) => (
              <div key={item.q} className="border-b border-rule py-6">
                <dt className="font-semibold text-fg">{item.q}</dt>
                <dd className="mt-2 text-small text-fg-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <FaqJsonLd items={faq.items} />
        </div>
      </section>
    </>
  );
}

import { CalendlyButton } from "@/components/sections/contact/CalendlyButton";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { CopyButton } from "@/components/sections/contact/CopyButton";
import { MapEmbed } from "@/components/sections/contact/MapEmbed";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cardBase, CheckList } from "@/components/ui/cards/Card";
import { FeatureCard } from "@/components/ui/cards/FeatureCard";
import { InfoCard } from "@/components/ui/cards/InfoCard";
import { NumberedCard } from "@/components/ui/cards/NumberedCard";
import { IconTile } from "@/components/ui/IconTile";
import type { IconProp } from "@/components/ui/Icon";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactContent } from "@/content/contact";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Section components for /contact. Copy: src/content/contact.ts; facts: siteConfig. */

export function ContactIntro() {
  const { intro } = contactContent;
  return (
    <Section background="white">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Badge>{intro.eyebrow}</Badge>
          <SectionHeading
            align="left"
            className="mt-4"
            title={intro.title}
            highlight={intro.highlight}
          />
          <p className="mt-6 text-lg leading-relaxed text-muted">{intro.text}</p>
          <CheckList items={intro.bullets} className="mt-6 text-body text-ink" />
        </div>
        <InfoCard
          heading={intro.after.title}
          items={intro.after.steps}
          ordered
          footer={intro.after.footer}
        />
      </div>
    </Section>
  );
}

export function ContactWhyNow() {
  const { whyNow } = contactContent;
  return (
    <Section background="tint" aria-labelledby="why-now-title">
      <SectionHeading id="why-now-title" title={whyNow.title} highlight={whyNow.highlight} />
      <RevealGroup as="ul" className="mt-12 grid gap-6 md:grid-cols-3">
        {whyNow.items.map((item, index) => (
          <RevealItem as="li" key={item.title} index={index}>
            <FeatureCard icon={item.icon} title={item.title} text={item.text} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function ContactFaq() {
  const { faq } = contactContent;
  return (
    <Section id={faq.id} background="white">
      <SectionHeading title={faq.title} highlight={faq.highlight} subtitle={faq.subtitle} />
      <ul className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
        {faq.items.map((item, index) => (
          <li key={item.q}>
            <NumberedCard
              number={index + 1}
              label={item.label}
              icon={item.icon}
              title={item.q}
              text={item.a}
            />
          </li>
        ))}
      </ul>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </Section>
  );
}

function DetailRow({
  icon,
  label,
  copyValue,
  children,
}: {
  icon: IconProp;
  label: string;
  copyValue: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
      <IconTile icon={icon} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-eyebrow font-medium text-muted uppercase">{label}</p>
        <div className="mt-1 break-words text-ink">{children}</div>
      </div>
      <CopyButton value={copyValue} label={`Copy ${label.toLowerCase()}`} />
    </li>
  );
}

const linkClass = "font-semibold text-primary underline-offset-4 hover:underline";

export function ContactMain() {
  const { form, details, call, tips } = contactContent;
  const { email, phone, whatsappUrl, location, businessHours, calendlyUrl } = siteConfig;
  const emailHref = isPlaceholder(email) ? null : `mailto:${email}`;
  const phoneReal = !isPlaceholder(phone);
  const whatsappReal = !isPlaceholder(whatsappUrl);
  const calendly = isPlaceholder(calendlyUrl) ? null : calendlyUrl;
  const place = `${location.city}, ${location.state}, ${location.country}`;

  return (
    <Section id={form.id} background="section" aria-labelledby="contact-form-title">
      <SectionHeading id="contact-form-title" title={form.title} subtitle={form.subtitle} />
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className={cardBase}>
            <h3 className="text-h3 font-bold">{details.title}</h3>
            <ul className="mt-5 divide-y divide-border">
              <DetailRow icon="Mail" label={details.labels.email} copyValue={email}>
                {emailHref ? (
                  <a href={emailHref} className={linkClass}>
                    {email}
                  </a>
                ) : (
                  <PlaceholderText text={email} />
                )}
              </DetailRow>
              <DetailRow icon="Phone" label={details.labels.phone} copyValue={phone}>
                <PlaceholderText text={phone} />
                {phoneReal || whatsappReal ? (
                  <span className="mt-1 flex flex-wrap gap-x-4 text-small">
                    {phoneReal ? (
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                        Call
                      </a>
                    ) : null}
                    {whatsappReal ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : null}
                  </span>
                ) : null}
              </DetailRow>
              <DetailRow icon="MapPin" label={details.labels.location} copyValue={place}>
                <PlaceholderText text={place} />
              </DetailRow>
              <DetailRow icon="Clock" label={details.labels.hours} copyValue={businessHours}>
                <PlaceholderText text={businessHours} />
                <span className="mt-1 block text-small text-muted">{details.responseNote}</span>
              </DetailRow>
            </ul>
          </div>

          <div className={cn(cardBase, "tone-dark border-0 bg-navy-900 text-white")}>
            <h3 className="text-h3 font-bold text-white">{call.title}</h3>
            <p className="mt-2 text-tone-muted">{call.text}</p>
            {calendly ? (
              <CalendlyButton
                url={calendly}
                label={call.cta}
                modalTitle={call.modalTitle}
                variant="white"
                className="mt-5"
              />
            ) : (
              <>
                <Button href="#contact-message" variant="white" className="mt-5">
                  {call.cta}
                </Button>
                <p className="mt-3 text-small text-tone-muted">
                  {call.fallback} <PlaceholderText text={calendlyUrl} />
                </p>
              </>
            )}
          </div>

          <div className={cardBase}>
            <h3 className="text-h3 font-bold">{tips.title}</h3>
            <CheckList items={tips.items} className="mt-4" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <ContactForm
            copy={form}
            emailHref={emailHref}
            calendlyUrl={calendly}
            privacyHref="/privacy-policy"
          />
        </div>
      </div>
    </Section>
  );
}

export function ContactMap() {
  const { map } = contactContent;
  const { city, state, country } = siteConfig.location;
  const parts = [city, state].filter((part) => !isPlaceholder(part));
  const query = [...parts, country].join(", ");

  return (
    <Section background="white" padding="sm" aria-labelledby="contact-map-title">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="contact-map-title" className="text-h3 font-bold">
          {map.title}: <PlaceholderText text={`${city}, ${state}, ${country}`} />
        </h2>
        <p className="mt-2 text-small text-muted">{map.note}</p>
        <div className="mt-6">
          <MapEmbed query={query} label={map.show} title={`Map of ${query}`} />
        </div>
      </div>
    </Section>
  );
}

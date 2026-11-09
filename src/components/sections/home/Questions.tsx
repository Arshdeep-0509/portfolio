import { Mail, MessageCircle } from "lucide-react";
import { FaqJsonLd } from "@/components/sections/shared/FaqJsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Emphasis } from "@/components/ui/Emphasis";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { faqs } from "@/content/faqs";
import { homeContent } from "@/content/home";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { pad2 } from "@/lib/utils";

/**
 * "Questions" on ivory, split: a sticky serif heading and a small "ask me directly" card on the
 * left; the six questions in the hairline accordion on the right. Includes FAQPage JSON-LD.
 */
export function Questions({ index }: { index: number }) {
  const { questions } = homeContent;
  const emailHref = isPlaceholder(siteConfig.contact.email)
    ? null
    : `mailto:${siteConfig.contact.email}`;
  const whatsappHref = isPlaceholder(siteConfig.contact.whatsapp)
    ? null
    : siteConfig.contact.whatsapp;
  const row = "flex min-h-12 items-center gap-3 border-b border-border text-small";

  return (
    <Section id={questions.id} tone="base" aria-labelledby="faq-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <p className="label-text text-ink-muted">
              ({pad2(index)}) {questions.label}
            </p>
            <h2 id="faq-title" data-reveal="mask" className="mt-6 text-h2 text-ink">
              <Emphasis text={questions.title} emphasis={questions.emphasis} />
            </h2>
            <aside className="mt-10 rounded-card border border-border bg-surface-raised p-6">
              <p className="font-semibold text-ink">{questions.card.title}</p>
              <p className="mt-1 text-small text-ink-muted">{questions.card.text}</p>
              <ul className="mt-4 border-t border-border">
                <li className={row}>
                  <Mail aria-hidden="true" strokeWidth={1.5} className="size-4 text-ink-muted" />
                  {emailHref ? (
                    <a
                      href={emailHref}
                      className="inline-flex min-h-12 items-center font-semibold text-ink"
                    >
                      {questions.card.email}
                    </a>
                  ) : (
                    <span>
                      {questions.card.email}: <PlaceholderText text={siteConfig.contact.email} />
                    </span>
                  )}
                </li>
                <li className={row}>
                  <MessageCircle
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 text-ink-muted"
                  />
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta="home-faq"
                      className="inline-flex min-h-12 items-center font-semibold text-ink"
                    >
                      {questions.card.whatsapp}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span>
                      {questions.card.whatsapp}: <PlaceholderText text={siteConfig.contact.phone} />
                    </span>
                  )}
                </li>
              </ul>
            </aside>
          </div>
        </div>
        <Accordion
          className="lg:col-span-7 lg:col-start-6"
          items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
        />
      </div>
      <FaqJsonLd items={faqs} />
    </Section>
  );
}

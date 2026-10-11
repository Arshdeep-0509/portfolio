import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { RazorpayButton } from "@/components/sections/pay/RazorpayButton";
import { CompactPageHero } from "@/components/sections/shared/CompactPageHero";
import { Button } from "@/components/ui/Button";
import { cardBase } from "@/components/ui/cards/Card";
import { IconTile } from "@/components/ui/IconTile";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { payContent } from "@/content/pay";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: payContent.seo.title,
  description: payContent.seo.description,
  path: "/pay",
  noIndex: true,
});

/** Optional page for clients paying an invoice or deposit. noindex and not linked in navigation. */
export default function PayPage() {
  const { hero, steps, methods, security, card, policies } = payContent;
  const { razorpayPaymentButtonId: buttonId, paymentLinkUrl: link } = siteConfig.payments;
  const hasButton = !isPlaceholder(buttonId);
  const hasLink = !isPlaceholder(link);

  return (
    <>
      <CompactPageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Pay" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />
      <Section background="section">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="space-y-6">
            <div className={cardBase}>
              <h2 className="text-h3 font-bold">{steps.title}</h2>
              <ol className="mt-5 space-y-4">
                {steps.items.map((step, index) => (
                  <li key={step} className="flex gap-3.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-primary font-mono text-small font-medium text-white">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-ink">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={cardBase}>
              <h2 className="text-h3 font-bold">{methods.title}</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                {methods.items.map((method) => (
                  <li key={method.label} className="flex items-center gap-3">
                    <IconTile icon={method.icon} size="sm" />
                    <span className="text-small font-semibold text-ink">{method.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex gap-2.5 rounded-lg bg-soft p-4 text-small text-ink">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                {security}
              </p>
            </div>
          </div>

          <div
            className={cn(
              cardBase,
              "border-t-2 border-t-primary lg:sticky lg:top-[calc(var(--header-h)+2rem)]",
            )}
          >
            <h2 className="text-h3 font-bold">{card.title}</h2>
            <p className="mt-2 text-muted">{card.text}</p>
            <div className="mt-6">
              {hasButton ? (
                <RazorpayButton buttonId={buttonId} />
              ) : hasLink ? (
                <Button
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  rightIcon={<ExternalLink aria-hidden="true" className="size-4" />}
                  className="w-full"
                >
                  {card.linkCta}
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              ) : (
                <p className="rounded-lg border border-dashed border-subtle bg-tint p-4 text-small text-ink">
                  {card.placeholder} <PlaceholderText text={buttonId} />
                </p>
              )}
            </div>
            <p className="mt-5 text-small text-muted">{card.other}</p>
            <p className="mt-5 border-t border-border pt-5 text-small text-muted">
              {policies.text}{" "}
              <Link href={policies.terms.href} className="font-semibold text-primary underline">
                {policies.terms.label}
              </Link>{" "}
              and the{" "}
              <Link href={policies.refund.href} className="font-semibold text-primary underline">
                {policies.refund.label}
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

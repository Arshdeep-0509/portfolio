import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { RazorpayButton } from "@/components/sections/pay/RazorpayButton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { Section } from "@/components/ui/Section";
import { payContent } from "@/content/pay";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

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
    <Section tone="ivory" padding="none" className="pt-16 pb-24 lg:pt-24 lg:pb-32">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Pay" }]} />
      <p className="mt-8 label-mono text-accent">{hero.label}</p>
      <h1 className="mt-4 max-w-[18ch] text-h1 text-fg">{hero.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{hero.text}</p>

      <div className="mt-16 grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-h3 text-fg">{steps.title}</h2>
          <ol className="mt-5 border-t border-rule">
            {steps.items.map((step, index) => (
              <li key={step} className="flex gap-4 border-b border-rule py-4">
                <span className="font-mono text-sm text-accent">{pad2(index + 1)}</span>
                <span className="text-fg">{step}</span>
              </li>
            ))}
          </ol>
          <h2 className="mt-12 text-h3 text-fg">{methods.title}</h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-fg">
            {methods.items.map((method) => (
              <li key={method} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 rounded-dot bg-lamp-500" />
                {method}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex gap-3 border-l-2 border-lamp-500 bg-sand-100 py-4 pr-4 pl-5 text-small text-fg">
            <ShieldCheck
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-0.5 size-5 shrink-0 text-accent"
            />
            {security}
          </p>
        </div>

        <div className="rounded-card border border-lamp-500/60 p-7 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-5">
          <h2 className="text-h3 text-fg">{card.title}</h2>
          <p className="mt-2 text-fg-muted">{card.text}</p>
          <div className="mt-6">
            {hasButton ? (
              <RazorpayButton buttonId={buttonId} />
            ) : hasLink ? (
              <Button
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                rightIcon={<ExternalLink aria-hidden="true" strokeWidth={1.5} className="size-4" />}
                className="w-full"
              >
                {card.linkCta}
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            ) : (
              <p className="rounded-card border border-dashed border-fg-muted/50 p-4 text-small break-words text-fg">
                {card.placeholder} <PlaceholderText text={buttonId} />
              </p>
            )}
          </div>
          <p className="mt-5 text-small text-fg-muted">{card.other}</p>
          <p className="mt-5 border-t border-rule pt-5 text-small text-fg-muted">
            {policies.text}{" "}
            <Link
              href={policies.terms.href}
              className="font-semibold text-accent underline underline-offset-4"
            >
              {policies.terms.label}
            </Link>{" "}
            and the{" "}
            <Link
              href={policies.refund.href}
              className="font-semibold text-accent underline underline-offset-4"
            >
              {policies.refund.label}
            </Link>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}

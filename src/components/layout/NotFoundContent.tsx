import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/content/site";

const quickLinks = [
  { label: "Contact", href: "/contact", text: "Tell me about your project" },
  { label: "Work", href: "/work", text: "See what I've built" },
  ...(siteConfig.featureFlags.blog
    ? [{ label: "Insights", href: "/insights", text: "Notes on building products" }]
    : []),
];

/** Body of the 404 page, shared by the root and (site) not-found files. */
export function NotFoundContent() {
  return (
    <section className="bg-tint">
      <Container className="flex flex-col items-center section-y text-center">
        <p
          aria-hidden="true"
          className="bg-grad-hero bg-clip-text font-heading text-[clamp(6rem,4rem+10vw,10rem)] leading-none font-extrabold tracking-tight text-transparent"
        >
          404
        </p>
        <h1 className="mt-4 text-h2 font-extrabold tracking-tight">
          <span className="sr-only">Error 404: </span>This page took a wrong turn
        </h1>
        <p className="mt-4 max-w-md text-muted">
          The link may be out of date, or the page has moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" leftIcon={<Home aria-hidden="true" className="size-4" />}>
            Back to home
          </Button>
          <Button href="/services" variant="outline">
            Explore services
          </Button>
        </div>

        <nav aria-label="Popular pages" className="mt-12 w-full max-w-2xl">
          <ul className="grid gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4 text-left shadow-card transition-shadow duration-200 hover:shadow-card-hover"
                >
                  <span>
                    <span className="block font-semibold text-ink">{link.label}</span>
                    <span className="block text-small text-muted">{link.text}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}

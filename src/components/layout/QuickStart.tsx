import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LazyQuickStartForm, NotOnContact } from "@/components/layout/LazyForms";
import { quickStartCopy as copy } from "@/content/quickStart";

/**
 * The closing section of every page except /contact: night sky with the horizon glow, one line,
 * and the quick form. The words render on the server; the form loads as the visitor nears it.
 */
export function QuickStart({ emailHref }: { emailHref: string | null }) {
  return (
    <NotOnContact>
      <section
        aria-labelledby="quick-start-title"
        className="relative isolate overflow-hidden bg-bg bg-grad-horizon text-ink print:hidden"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-stars" />
        <div className="container-site section-y">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="label-text text-ink-muted">{copy.label}</p>
              <h2 id="quick-start-title" data-reveal="mask" className="mt-6 text-h2 text-ink">
                {copy.title}
              </h2>
              <p className="mt-6 max-w-md text-ink-muted">{copy.text}</p>
              <Link
                href={copy.fullForm.href}
                className="group/button mt-6 inline-flex min-h-11 items-center gap-1.5 link-underline font-semibold text-ink hover:text-link"
              >
                {copy.fullForm.label}
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4 transition-transform group-hover/button:translate-x-[3px]"
                />
              </Link>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <LazyQuickStartForm emailHref={emailHref} />
            </div>
          </div>
        </div>
      </section>
    </NotOnContact>
  );
}

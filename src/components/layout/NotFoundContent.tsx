import { Star } from "@/components/brand/Star";
import { Button } from "@/components/ui/Button";

/** Body of the 404 page, shared by the root and (site) not-found files: a night sky, one star. */
export function NotFoundContent() {
  return (
    <section
      data-under-header=""
      aria-labelledby="not-found-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-bg bg-stars pt-(--header-h) text-ink"
    >
      <div className="container-site py-24">
        <Star className="hero-polaris size-3.5" />
        <h1 id="not-found-title" className="mt-6 max-w-[16ch] text-h1 text-ink">
          This page is <em>off the map</em>.
        </h1>
        <p className="mt-6 max-w-md text-ink-muted">
          Head back to the homepage or tell us what you were looking for.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Home
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact
          </Button>
        </div>
      </div>
    </section>
  );
}

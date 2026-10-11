import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CursorGlow } from "@/components/ui/CursorGlow";

const links = [
  { label: "Home", href: "/", text: "Start again from the top" },
  { label: "Services", href: "/services", text: "Everything I can build for you" },
  { label: "Contact", href: "/contact", text: "Ask me where the page went" },
];

/** Body of the 404 page, shared by the root and (site) not-found files: a night sky, one lamp. */
export function NotFoundContent() {
  return (
    <section
      data-under-header=""
      aria-labelledby="not-found-title"
      className="tone-night relative isolate flex min-h-svh items-center overflow-hidden bg-night-950 bg-stars pt-(--header-h) text-fg"
    >
      <CursorGlow rest={{ x: "50%", y: "40%" }} size={640} />
      <div className="container-site py-24">
        <p className="label-mono text-accent">(404) Not found</p>
        <h1 id="not-found-title" className="mt-6 max-w-[16ch] text-h1 text-fg">
          This page is <em>off the map</em>
        </h1>
        <p className="mt-6 max-w-md text-fg-muted">
          The link may be old, or the page has moved. One of these will get you back on course.
        </p>
        <div className="mt-10">
          <Button href="/" size="lg">
            Return to the home page
          </Button>
        </div>
        <nav aria-label="Useful pages" className="mt-14 max-w-2xl border-t border-rule">
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-rule">
                <Link
                  href={link.href}
                  className="group flex min-h-16 items-center justify-between gap-4 py-3"
                >
                  <span>
                    <span className="block font-display-soft text-xl text-fg group-hover:text-accent">
                      {link.label}
                    </span>
                    <span className="block text-small text-fg-muted">{link.text}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-5 text-accent transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

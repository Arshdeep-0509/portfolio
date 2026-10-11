import { BuildLog } from "@/components/ui/BuildLog";
import { Button } from "@/components/ui/Button";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Emphasis } from "@/components/ui/Emphasis";
import { homeContent } from "@/content/home";
import { bookingIsExternal } from "@/lib/booking";

/**
 * Full-height night hero: the horizon glow, the star field and a lamp glow that follows the
 * cursor on desktop. Left (7 columns): label, headline, one sentence, two actions. Right
 * (5 columns): a build log typing the five milestones of a project. No illustration.
 */
export function HomeHero() {
  const { hero } = homeContent;
  return (
    <section
      data-under-header=""
      aria-labelledby="home-title"
      className="tone-night relative isolate flex min-h-svh flex-col overflow-hidden bg-night-950 bg-grad-horizon text-fg"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-stars" />
      <CursorGlow />
      <div className="container-site flex flex-1 flex-col pt-[calc(var(--header-h)+3.5rem)] pb-10 lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="grid flex-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label-mono text-starlight">{hero.label}</p>
            <h1 id="home-title" className="mt-7 animate-rise text-h1 text-fg">
              <Emphasis text={hero.title} emphasis={hero.emphasis} />
            </h1>
            <p className="mt-7 max-w-xl text-lg text-fg-muted">{hero.text}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                href={hero.primary.href}
                size="lg"
                data-cta="hero"
                {...(bookingIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {hero.primary.label}
                {bookingIsExternal ? <span className="sr-only"> (opens in a new tab)</span> : null}
              </Button>
              <Button href={hero.secondary.href} size="lg" variant="outline" data-cta="hero">
                {hero.secondary.label}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 lg:pl-6">
            <BuildLog lines={hero.log} title={hero.logTitle} />
          </div>
        </div>
        <ul className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-dark pt-6 label-mono text-mist-300">
          {hero.facts.map((fact, index) => (
            <li key={fact} className="flex items-center gap-4">
              {index > 0 ? (
                <span aria-hidden="true" className="size-1 rounded-dot bg-lamp-500/70" />
              ) : null}
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

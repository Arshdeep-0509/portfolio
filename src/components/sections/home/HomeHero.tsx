import { BuildLog } from "@/components/ui/BuildLog";
import { Button } from "@/components/ui/Button";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Emphasis } from "@/components/ui/Emphasis";
import { HeroPolaris, HeroSky } from "@/components/sections/home/HeroSky";
import { homeContent } from "@/content/home";
import { bookingIsExternal } from "@/lib/booking";

/**
 * Full-height hero with one signature moment: a quiet star field, Polaris, and a dotted bearing
 * line down to the buttons (HeroSky.tsx). Nothing else in the hero animates in. Left (7 columns):
 * label, headline, one sentence, two actions. Right (5 columns): the build log.
 */
export function HomeHero() {
  const { hero } = homeContent;
  return (
    <section
      data-under-header=""
      aria-labelledby="home-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg bg-grad-horizon text-ink"
    >
      <HeroSky />
      <CursorGlow />
      <div className="container-site flex flex-1 flex-col pt-[calc(var(--header-h)+3.5rem)] pb-10 lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="grid flex-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-7">
            <HeroPolaris />
            <p className="label-text text-ink-muted">{hero.label}</p>
            <h1 id="home-title" className="mt-7 text-h1 text-ink">
              <Emphasis text={hero.title} emphasis={hero.emphasis} />
            </h1>
            <p className="mt-7 max-w-xl text-lg text-ink-muted">{hero.text}</p>
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
        <ul className="mt-16 flex label-text flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6 text-ink-muted max-sm:flex-col max-sm:items-start">
          {hero.facts.map((fact, index) => (
            <li key={fact} className="flex items-center gap-4">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="size-1 rounded-dot bg-ink-muted max-sm:hidden"
                />
              ) : null}
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

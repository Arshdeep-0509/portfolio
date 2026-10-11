import { ContactDock } from "@/components/layout/ContactDock";
import { CornerCard } from "@/components/layout/CornerCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { QuickStart } from "@/components/layout/QuickStart";
import { SkipLink } from "@/components/layout/SkipLink";
import { ScrollProgressRing } from "@/components/ui/ScrollProgressRing";
import { siteConfig } from "@/content/site";
import { bookingHref } from "@/lib/booking";
import { isPlaceholder } from "@/lib/constants";

const emailHref = isPlaceholder(siteConfig.email) ? null : `mailto:${siteConfig.email}`;
const whatsappHref = isPlaceholder(siteConfig.whatsappUrl) ? null : siteConfig.whatsappUrl;

const dockLabels = {
  toggle: "Contact",
  close: "Close",
  whatsapp: "Message on WhatsApp",
  email: "Send an email",
  book: "Book a free call",
};

/**
 * Site chrome shared by the (site) layout and the root 404 page, which renders outside route
 * groups and so cannot inherit the (site) layout. Order: header, main, the QuickStart section
 * (hidden on /contact), footer, then the floating pieces — scroll ring, contact dock and the
 * corner card. Everything except <main> is hidden when printing.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <div className="contents print:hidden">
        <Header />
      </div>
      {/* tabIndex lets the skip link move focus here; the main region itself needs no ring. */}
      <main id="main" tabIndex={-1} className="flex-1 outline-none print:!pt-0">
        {children}
      </main>
      <div className="contents print:hidden">
        <QuickStart emailHref={emailHref} />
        <Footer />
        <ScrollProgressRing />
        <ContactDock
          whatsappHref={whatsappHref}
          emailHref={emailHref}
          bookingHref={bookingHref}
          firstName={siteConfig.founder.name.split(" ")[0] ?? siteConfig.founder.name}
          labels={dockLabels}
        />
      </div>
      {siteConfig.announcement.enabled ? (
        <CornerCard config={siteConfig.announcement} href={bookingHref} />
      ) : null}
    </>
  );
}

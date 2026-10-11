import { AnnouncementPopup } from "@/components/layout/AnnouncementPopup";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteCTABand } from "@/components/layout/SiteCTABand";
import { SkipLink } from "@/components/layout/SkipLink";
import { BackToTop } from "@/components/ui/BackToTop";
import { ctaBandOverrides } from "@/content/ctaBandOverrides";
import { siteConfig } from "@/content/site";
import { isPlaceholder } from "@/lib/constants";

// Until the Calendly link exists, "Book your slot" goes to the contact form's MVP scoping topic.
const announcementHref = isPlaceholder(siteConfig.announcement.primaryCta.href)
  ? "/contact?topic=mvp-scoping"
  : siteConfig.announcement.primaryCta.href;

/**
 * Site chrome shared by the (site) layout and the root 404 page, which renders outside
 * route groups and so cannot inherit the (site) layout. Everything except <main> is hidden when
 * printing (`print:hidden`), so printed legal pages contain only the document.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <div className="contents print:hidden">
        <Header />
      </div>
      {/* tabIndex lets the skip link move focus here; the main region itself needs no ring. */}
      <main id="main" tabIndex={-1} className="flex-1 pt-(--header-h) outline-none print:pt-0">
        {children}
      </main>
      <div className="contents print:hidden">
        <SiteCTABand overrides={ctaBandOverrides} />
        <Footer />
        {/* Shown once a real WhatsApp number is set in site.ts. */}
        {isPlaceholder(siteConfig.whatsappUrl) ? null : (
          <FloatingWhatsApp
            href={siteConfig.whatsappUrl}
            name={siteConfig.founder.name.split(" ")[0]}
          />
        )}
        <BackToTop />
      </div>
      {siteConfig.announcement.enabled ? (
        <AnnouncementPopup config={siteConfig.announcement} href={announcementHref} />
      ) : null}
    </>
  );
}

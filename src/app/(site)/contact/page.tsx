import {
  ContactFaq,
  ContactIntro,
  ContactMain,
  ContactMap,
  ContactWhyNow,
} from "@/components/sections/contact/ContactSections";
import { SplitHero } from "@/components/sections/shared/SplitHero";
import { contactContent } from "@/content/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: contactContent.seo.title,
  description: contactContent.seo.description,
  path: "/contact",
});

// The global CTA band is hidden on this page (ctaBandOverrides.ts sets "/contact" to null).
export default function ContactPage() {
  return (
    <>
      <SplitHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        {...contactContent.hero}
      />
      <ContactIntro />
      <ContactWhyNow />
      <ContactFaq />
      <ContactMain />
      <ContactMap />
    </>
  );
}

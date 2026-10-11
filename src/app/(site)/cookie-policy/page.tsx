import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { buttonVariants } from "@/components/ui/Button";
import { COOKIE_SETTINGS_SECTION, cookiePolicy } from "@/content/legal/cookies";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: cookiePolicy.title,
  description: cookiePolicy.description,
  path: cookiePolicy.path,
});

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      doc={cookiePolicy}
      extras={{
        [COOKIE_SETTINGS_SECTION]: (
          <CookieSettingsButton
            label="Update my cookie choices"
            className={`${buttonVariants()} print:hidden`}
          />
        ),
      }}
    />
  );
}

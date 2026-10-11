import { LegalLayout } from "@/components/layout/LegalLayout";
import { termsAndConditions } from "@/content/legal/terms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: termsAndConditions.title,
  description: termsAndConditions.description,
  path: termsAndConditions.path,
});

export default function TermsPage() {
  return <LegalLayout doc={termsAndConditions} />;
}

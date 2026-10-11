import { LegalLayout } from "@/components/layout/LegalLayout";
import { privacyPolicy } from "@/content/legal/privacy";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: privacyPolicy.path,
});

export default function PrivacyPolicyPage() {
  return <LegalLayout doc={privacyPolicy} />;
}

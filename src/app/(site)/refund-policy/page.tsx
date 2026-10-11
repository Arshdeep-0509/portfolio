import { LegalLayout } from "@/components/layout/LegalLayout";
import { refundPolicy } from "@/content/legal/refund";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: refundPolicy.title,
  description: refundPolicy.description,
  path: refundPolicy.path,
});

export default function RefundPolicyPage() {
  return <LegalLayout doc={refundPolicy} />;
}

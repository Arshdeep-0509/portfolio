import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteShell } from "@/components/layout/SiteShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Page Not Found", noIndex: true });

// Unmatched URLs render here, outside the (site) route group, so this page brings its own chrome.
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}

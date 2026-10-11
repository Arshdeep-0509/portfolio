import { NotFoundContent } from "@/components/layout/NotFoundContent";

// notFound() calls inside (site) pages render here, within the (site) layout's header and footer.
export default function SiteNotFound() {
  return <NotFoundContent />;
}

import { getService, getServiceGroup, services } from "@/content/services";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "A service offered by Arshdeep Singh";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOgImage({
    eyebrow: service ? `Services / ${getServiceGroup(service.group)?.label}` : "Services",
    title: service?.title ?? "Services",
    subtitle: service?.tagline,
    path: `/services/${slug}`,
  });
}

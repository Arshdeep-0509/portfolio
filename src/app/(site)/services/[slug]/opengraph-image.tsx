import { getService, services } from "@/content/services";
import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const title = getService(params.slug)?.title ?? "Services";
  return [{ id: "card", alt: ogAlt(title), size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderOgImage({ title: getService(slug)?.title ?? "Services" });
}

import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/content/site";
import { brandColors } from "@/lib/brandColors";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Press Kit",
  description: `Logo files for ${siteConfig.name}, for partners and directories.`,
  path: "/press",
  noIndex: true,
});

type BrandFile = {
  name: string;
  preview: string;
  /** The background the file is designed to sit on. */
  background: "dark" | "light";
  downloads: { label: string; href: string }[];
};

const files: BrandFile[] = [
  {
    name: "Logo for dark backgrounds",
    preview: "/brand/polestride-logo-on-dark.svg",
    background: "dark",
    downloads: [
      { label: "SVG", href: "/brand/polestride-logo-on-dark.svg" },
      { label: "PNG", href: "/brand/png/polestride-logo-on-dark.png" },
    ],
  },
  {
    name: "Logo for light backgrounds",
    preview: "/brand/polestride-logo-on-light.svg",
    background: "light",
    downloads: [
      { label: "SVG", href: "/brand/polestride-logo-on-light.svg" },
      { label: "PNG", href: "/brand/png/polestride-logo-on-light.png" },
    ],
  },
  {
    name: "Logo, transparent",
    preview: "/brand/polestride-logo-transparent.svg",
    background: "light",
    downloads: [{ label: "SVG", href: "/brand/polestride-logo-transparent.svg" }],
  },
  {
    name: "Wordmark",
    preview: "/brand/polestride-wordmark.svg",
    background: "light",
    downloads: [{ label: "SVG", href: "/brand/polestride-wordmark.svg" }],
  },
  {
    name: "Mark",
    preview: "/brand/polestride-mark.svg",
    background: "light",
    downloads: [{ label: "SVG", href: "/brand/polestride-mark.svg" }],
  },
  {
    name: "App icon",
    preview: "/brand/polestride-icon.svg",
    background: "dark",
    downloads: [
      { label: "SVG", href: "/brand/polestride-icon.svg" },
      { label: "PNG 512", href: "/brand/png/polestride-icon-512.png" },
      { label: "PNG 1024", href: "/brand/png/polestride-icon-1024.png" },
    ],
  },
];

/** Logo downloads for partners and directories. Not linked from the navigation, and noindex. */
export default function PressPage() {
  return (
    <Section tone="base" padding="none" className="pt-16 pb-24 lg:pt-24 lg:pb-32">
      <h1 className="text-h1 text-ink">Press kit</h1>
      <p className="mt-6 text-ink-muted">
        Logo files for partners and directories. {siteConfig.tagline}
      </p>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <li key={file.name} className="overflow-hidden rounded-card border border-border">
            <div
              className="flex h-44 items-center justify-center p-8"
              style={{ background: brandColors[file.background].bg }}
            >
              <Image
                src={file.preview}
                alt=""
                width={240}
                height={96}
                unoptimized
                className="max-h-full w-auto"
              />
            </div>
            <div className="bg-surface p-5">
              <h2 className="text-h3 text-ink">{file.name}</h2>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                {file.downloads.map((download) => (
                  <li key={download.href}>
                    <a
                      href={download.href}
                      download
                      aria-label={`Download ${file.name} as ${download.label}`}
                      className="inline-flex min-h-11 items-center font-semibold text-link underline underline-offset-4"
                    >
                      {download.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

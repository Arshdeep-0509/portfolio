import { ProductCard } from "@/components/ui/cards/ProductCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeContent, type SectionCopy } from "@/content/home";
import { products } from "@/content/products";
import { cn } from "@/lib/utils";

/** Own products and initiatives: two cards side by side, then a wide one. Data: products.ts. */
export function Products({
  copy = homeContent.products,
}: {
  copy?: SectionCopy & { eyebrow: string };
}) {
  return (
    <Section id={copy.id} background="tint">
      <SectionHeading
        align="left"
        eyebrow={copy.eyebrow}
        title={copy.title}
        highlight={copy.highlight}
        subtitle={copy.subtitle}
      />
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <li key={product.slug} className={cn(product.variant === "wide" && "md:col-span-2")}>
            <ProductCard
              icon={product.icon}
              title={product.name}
              text={product.description}
              statuses={product.statuses}
              features={product.features}
              cta={product.cta}
              variant={product.variant}
              bullets={product.bullets}
              note={product.note}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cardBase, cardHover } from "@/components/ui/cards/Card";
import type { PostCardData } from "@/lib/contentTypes";
import { isUnoptimized } from "@/lib/images";
import { cn, formatDate } from "@/lib/utils";

type PostCardProps = {
  post: PostCardData;
  /** "featured" is a large horizontal card for the lead post. */
  variant?: "default" | "featured";
  /** Text for the featured label. */
  featuredLabel?: string;
  /** Heading level of the title. Default "h3". */
  as?: "h2" | "h3";
  className?: string;
};

/**
 * Cover, category, title, excerpt, date and reading time. The title link is stretched over the
 * card. Client-safe (no server-only imports).
 */
export function PostCard({
  post,
  variant = "default",
  featuredLabel = "Featured",
  as: Heading = "h3",
  className,
}: PostCardProps) {
  const featured = variant === "featured";

  return (
    <article
      className={cn(
        cardBase,
        cardHover,
        "group relative flex h-full flex-col overflow-hidden p-0",
        featured && "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-soft",
          featured ? "aspect-[16/9] lg:aspect-auto lg:min-h-80" : "aspect-[16/9]",
        )}
      >
        <Image
          src={post.cover}
          alt={post.coverAlt ?? ""}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 700px, 100vw"
              : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          }
          unoptimized={isUnoptimized(post.cover)}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className={cn("flex flex-1 flex-col p-6", featured && "lg:justify-center lg:p-10")}>
        <div className="flex flex-wrap items-center gap-2">
          {featured ? <Badge variant="new">{featuredLabel}</Badge> : null}
          <Badge variant="soft">{post.category}</Badge>
          {post.draft ? <Badge variant="outline">Draft</Badge> : null}
        </div>
        <Heading className={cn("mt-4 font-bold text-ink", featured ? "text-h2" : "text-h3")}>
          <Link
            href={`/insights/${post.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </Heading>
        <p className={cn("mt-2 text-muted", featured ? "text-lg" : "line-clamp-3")}>
          {post.description}
        </p>
        <p className="mt-auto pt-5 text-small text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}

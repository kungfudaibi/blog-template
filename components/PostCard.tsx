import Link from "next/link";

import type { LoadedPost } from "@/lib/content";

type PostCardProps = {
  post: LoadedPost;
};

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PostCard({ post }: PostCardProps) {
  const { metadata, slug } = post;

  return (
    <article className="post-card">
      <div className="post-card__meta">
        <time dateTime={metadata.publishedAt}>
          {formatPublishedDate(metadata.publishedAt)}
        </time>
        <span aria-hidden="true">/</span>
        <ul aria-label="文章标签">
          {metadata.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <h2>
        <Link href={`/blog/${slug}`}>{metadata.title}</Link>
      </h2>
      <p>{metadata.summary}</p>
      <span className="post-card__read-more" aria-hidden="true">
        阅读全文 <span aria-hidden="true">→</span>
      </span>
    </article>
  );
}

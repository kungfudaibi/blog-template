import Link from "next/link";

import type { LoadedPost } from "@/lib/content";

import { AiCreationCredit } from "./AiCreationCredit";

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
      <time dateTime={metadata.publishedAt}>
        {formatPublishedDate(metadata.publishedAt)}
      </time>
      <div className="post-card__body">
        <h2><Link href={`/blog/${slug}`}>{metadata.title}</Link></h2>
        {metadata.summary ? <p>{metadata.summary}</p> : null}
        <div className="post-card__meta">
          <AiCreationCredit model={metadata.aiCreatedWith} />
          <ul aria-label="文章标签">
            {metadata.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
      <span className="post-card__arrow" aria-hidden="true">↗</span>
    </article>
  );
}

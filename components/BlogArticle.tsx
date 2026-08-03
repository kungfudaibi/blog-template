import type { ReactNode } from "react";
import Link from "next/link";

import type { LoadedPost } from "@/lib/content";

import { formatPublishedDate } from "./PostCard";

type BlogArticleProps = {
  post: LoadedPost;
  children: ReactNode;
};

export function BlogArticle({ post, children }: BlogArticleProps) {
  const { metadata } = post;

  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <Link className="back-link" href="/blog">
        <span aria-hidden="true">←</span> 返回文章列表
      </Link>
      <article className="blog-article">
        <header className="blog-article__header">
          <p className="eyebrow">POST / {post.slug}</p>
          <h1>{metadata.title}</h1>
          {metadata.summary ? (
            <p className="blog-article__summary">{metadata.summary}</p>
          ) : null}
          <div className="blog-article__meta">
            <time dateTime={metadata.publishedAt}>
              {formatPublishedDate(metadata.publishedAt)}
            </time>
            <ul aria-label="文章标签">
              {metadata.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </header>
        <div className="prose">{children}</div>
      </article>
    </main>
  );
}

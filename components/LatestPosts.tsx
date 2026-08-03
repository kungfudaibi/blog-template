import Link from "next/link";

import type { LoadedPost } from "@/lib/content";

import { formatPublishedDate } from "./PostCard";

type LatestPostsProps = {
  posts: LoadedPost[];
};

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section className="home-section" aria-labelledby="latest-posts-title">
      <div className="home-section__heading">
        <div>
          <p className="eyebrow">05 / WRITING</p>
          <h2 id="latest-posts-title">最新文章</h2>
        </div>
        <Link href="/blog">查看全部文章</Link>
      </div>

      {posts.length > 0 ? (
        <div className="latest-posts">
          {posts.map((post) => (
            <article key={post.slug}>
              <time dateTime={post.metadata.publishedAt}>
                {formatPublishedDate(post.metadata.publishedAt)}
              </time>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.metadata.title}</Link>
              </h3>
              <p>{post.metadata.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="home-section__empty">最新文章稍后补上</p>
      )}
    </section>
  );
}

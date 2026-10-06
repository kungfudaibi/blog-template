import Link from "next/link";

import type { LoadedPost } from "@/lib/content";

import { AiCreationCredit } from "./AiCreationCredit";
import { CharacterAccent } from "./CharacterAccent";
import { formatPublishedDate } from "./PostCard";

type LatestPostsProps = {
  posts: LoadedPost[];
};

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section className="home-section home-writing" aria-labelledby="latest-posts-title">
      <div className="home-section__heading">
        <h2 id="latest-posts-title">最近写下</h2>
        <Link href="/blog">全部文章 ↗</Link>
      </div>
      <span className="home-section__mascot"><CharacterAccent character="doro" /></span>

      {posts.length > 0 ? (
        <div className="latest-posts">
          {posts.map((post) => (
            <article className="latest-post" key={post.slug}>
              <time dateTime={post.metadata.publishedAt}>
                {formatPublishedDate(post.metadata.publishedAt)}
              </time>
              <div>
                <h3><Link href={`/blog/${post.slug}`}>{post.metadata.title}</Link></h3>
                {post.metadata.summary ? <p>{post.metadata.summary}</p> : null}
                <AiCreationCredit model={post.metadata.aiCreatedWith} />
              </div>
              <span className="latest-post__arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="home-section__empty">文章稍后补上</p>
      )}
    </section>
  );
}

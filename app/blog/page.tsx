import type { Metadata } from "next";

import { PostCard } from "@/components/PostCard";
import { loadPosts, type LoadedPost } from "@/lib/content";

export const metadata: Metadata = {
  title: "文章 | zhujiechong",
  description: "zhujiechong 的技术文章与实践记录。",
};

type BlogIndexProps = {
  posts: LoadedPost[];
};

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <main id="main-content" className="content-page" tabIndex={-1}>
      <header className="page-intro">
        <p className="eyebrow">NOTES / LOGS</p>
        <h1>文章</h1>
        <p>记录做项目时的判断、踩过的坑，以及还没有标准答案的问题。</p>
      </header>

      {posts.length > 0 ? (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <section className="empty-state" aria-labelledby="empty-posts-title">
          <p aria-hidden="true">[ empty ]</p>
          <h2 id="empty-posts-title">文章还在路上</h2>
          <p>
            在 <code>content/posts/</code> 添加第一篇 MDX，文章会自动出现在这里。
          </p>
        </section>
      )}
    </main>
  );
}

export default async function BlogPage() {
  const posts = await loadPosts({ includeDrafts: false });

  return <BlogIndex posts={posts} />;
}

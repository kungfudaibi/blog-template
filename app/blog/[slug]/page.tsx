import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { BlogArticle } from "@/components/BlogArticle";
import {
  ContentSecurityError,
  getPostBySlug,
  loadPosts,
} from "@/lib/content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await loadPosts({ includeDrafts: false });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPublishedPost(slug);

  if (!post) {
    return { title: "文章未找到 | zhujiechong" };
  }

  return {
    title: `${post.metadata.title} | zhujiechong`,
    description: post.metadata.summary,
  };
}

async function findPublishedPost(slug: string) {
  try {
    return await getPostBySlug(slug, { includeDrafts: false });
  } catch (error) {
    if (error instanceof ContentSecurityError) {
      return undefined;
    }

    throw error;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await findPublishedPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogArticle post={post}>
      <MDXRemote
        source={post.content}
        options={{
          blockJS: true,
          mdxOptions: { remarkPlugins: [remarkGfm] },
        }}
      />
    </BlogArticle>
  );
}

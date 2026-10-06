import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BlogPage, { BlogIndex } from "@/app/blog/page";
import { BlogArticle } from "@/components/BlogArticle";
import { PostCard } from "@/components/PostCard";
import type { LoadedPost } from "@/lib/content";

const examplePost: LoadedPost = {
  slug: "building-this-site",
  sourcePath: "posts/building-this-site.mdx",
  metadata: {
    title: "把个人站点当作长期项目",
    summary: "从需求、内容到可维护代码，记录这个站点的第一步。",
    publishedAt: "2026-07-30",
    tags: ["Next.js", "工程实践"],
    cover: "/images/posts/building-this-site.webp",
    draft: false,
  },
  content: "文章正文。",
};

describe("blog index", () => {
  it("loads only the author's written post", async () => {
    render(await BlogPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "文章" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("NOTES / LOGS")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "一次系统 SSD 损坏后的恢复：从 BMC 控制台到 ddrescue" }),
    ).toHaveAttribute("href", "/blog/运维日志-与codex救回系统盘");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("AI 创作 · Codex（基于 GPT-6）"))
      .toBeInTheDocument();
  });

  it("renders an honest empty state when no posts are available", () => {
    render(<BlogIndex posts={[]} />);

    expect(screen.getByText("文章还在路上")).toBeInTheDocument();
    expect(screen.getByText(/添加第一篇 MDX/)).toBeInTheDocument();
  });
});

describe("PostCard", () => {
  it("exposes a clear article link, machine-readable date, and tags", () => {
    render(<PostCard post={examplePost} />);

    const article = screen.getByRole("article");
    expect(
      within(article).getByRole("link", {
        name: "把个人站点当作长期项目",
      }),
    ).toHaveAttribute("href", "/blog/building-this-site");
    expect(within(article).getByText("2026年7月30日")).toHaveAttribute(
      "datetime",
      "2026-07-30",
    );
    expect(within(article).getByText("Next.js")).toBeInTheDocument();
    expect(within(article).getByText("工程实践")).toBeInTheDocument();
    expect(within(article).queryByText(/AI 创作/)).not.toBeInTheDocument();
  });

  it("does not render a paragraph placeholder for an undecided summary", () => {
    render(
      <PostCard
        post={{
          ...examplePost,
          metadata: { ...examplePost.metadata, summary: "" },
        }}
      />,
    );

    expect(screen.getByRole("article").querySelector(":scope > p")).toBeNull();
  });
});

describe("BlogArticle", () => {
  it("shows the model credit only when the post declares AI creation", () => {
    render(
      <BlogArticle
        post={{
          ...examplePost,
          metadata: { ...examplePost.metadata, aiCreatedWith: "Codex（基于 GPT-6）" },
        }}
      >
        <p>正文。</p>
      </BlogArticle>,
    );

    expect(screen.getByText("AI 创作 · Codex（基于 GPT-6）"))
      .toBeInTheDocument();
    expect(screen.queryByText("POST / building-this-site")).not.toBeInTheDocument();
  });

  it("provides article landmarks and a route back to the index", () => {
    render(
      <BlogArticle post={examplePost}>
        <h2>先从问题开始</h2>
        <p>文章正文。</p>
      </BlogArticle>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "把个人站点当作长期项目",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "先从问题开始" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回文章列表" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("does not render an empty article summary", () => {
    const { container } = render(
      <BlogArticle
        post={{
          ...examplePost,
          metadata: { ...examplePost.metadata, summary: "" },
        }}
      >
        <p>正文。</p>
      </BlogArticle>,
    );

    expect(container.querySelector(".blog-article__summary")).toBeNull();
  });
});

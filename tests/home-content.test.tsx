import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage, { HomeContent } from "@/app/page";
import type { LoadedCapability, LoadedPost, LoadedProject } from "@/lib/content";

describe("home content", () => {
  it("loads capabilities, projects, recent posts, and the honest agent preview", async () => {
    render(await HomePage());

    const capabilities = screen.getByRole("region", { name: "重点能力" });
    const featured = screen.getByRole("region", { name: "精选作品" });
    const recent = screen.getByRole("region", { name: "最新文章" });

    expect(
      within(capabilities).getByRole("link", { name: "超算与 AI Infra" }),
    ).toHaveAttribute("href", "/capabilities#hpc-ai-infra");
    expect(
      within(capabilities).getByRole("link", { name: "Agent 开发" }),
    ).toHaveAttribute("href", "/capabilities#agent-development");
    expect(
      within(capabilities).getByRole("link", { name: "体系结构与操作系统" }),
    ).toHaveAttribute("href", "/capabilities#systems");
    expect(within(capabilities).getAllByRole("article")).toHaveLength(3);

    expect(within(featured).getByRole("link", { name: "校园开源镜像站" }))
      .toHaveAttribute("href", "/projects/campus-mirror");
    expect(within(featured).getByRole("link", { name: "blog-template" }))
      .toHaveAttribute("href", "/projects/blog-template");
    expect(within(featured).queryByText("开源自学文档")).not.toBeInTheDocument();

    expect(within(recent).getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("阿竹正在准备中")).toBeInTheDocument();
    expect(screen.getByText(/尚未连接模型/)).toBeInTheDocument();
  });

  it("keeps stable empty states when featured and recent content is absent", () => {
    render(
      <HomeContent featuredCapabilities={[]} featuredProjects={[]} recentPosts={[]} />,
    );

    expect(screen.getByText("重点能力还在整理")).toBeInTheDocument();
    expect(screen.getByText("精选作品稍后补上")).toBeInTheDocument();
    expect(screen.getByText("最新文章稍后补上")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看完整能力地图" })).toHaveAttribute(
      "href",
      "/capabilities",
    );
    expect(screen.getByRole("link", { name: "查看全部作品" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: "查看全部文章" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("omits undecided summaries from every home content card", () => {
    const capability = {
      slug: "draft-capability",
      sourcePath: "capabilities/draft-capability.mdx",
      metadata: {
        title: "能力草稿",
        summary: "",
        status: "exploring",
        updatedAt: "2026-08-04",
        order: 1,
        featured: true,
        branches: ["待整理"],
      },
      content: "",
    } satisfies LoadedCapability;
    const project = {
      slug: "draft-project",
      sourcePath: "projects/draft-project.mdx",
      metadata: {
        title: "作品草稿",
        summary: "",
        period: "2026",
        role: "开发",
        tech: ["TypeScript"],
        cover: "/images/projects/draft.webp",
        featured: true,
      },
      content: "",
    } satisfies LoadedProject;
    const post = {
      slug: "draft-post",
      sourcePath: "posts/draft-post.mdx",
      metadata: {
        title: "文章草稿",
        summary: "",
        publishedAt: "2026-08-04",
        tags: ["草稿"],
        cover: "/images/posts/draft.webp",
        draft: false,
      },
      content: "",
    } satisfies LoadedPost;

    render(
      <HomeContent
        featuredCapabilities={[capability]}
        featuredProjects={[project]}
        recentPosts={[post]}
      />,
    );

    for (const title of ["能力草稿", "作品草稿", "文章草稿"]) {
      expect(
        screen.getByRole("link", { name: title }).closest("article")?.querySelector("h3 + p"),
      ).toBeNull();
    }
  });

  it("presents the supplied Disco Elysium screenshot as credited inspiration", () => {
    render(
      <HomeContent featuredCapabilities={[]} featuredProjects={[]} recentPosts={[]} />,
    );

    const inspiration = screen.getByRole("region", { name: "视觉灵感" });

    expect(
      within(inspiration).getByRole("heading", {
        level: 2,
        name: "最近让我着迷的世界",
      }),
    ).toBeInTheDocument();
    expect(
      within(inspiration).getByRole("img", {
        name: "《极乐迪斯科》游戏画面：人物站在明亮的抽象画作与昆虫前",
      }),
    ).toHaveAttribute("src", expect.stringContaining("disco-elysium-scene"));
    expect(within(inspiration).getByText(/《极乐迪斯科》游戏画面截图/))
      .toBeInTheDocument();
    expect(within(inspiration).getByText(/仅作个人审美与创作灵感展示/))
      .toBeInTheDocument();
  });
});

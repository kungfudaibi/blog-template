import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage, { HomeContent } from "@/app/page";
import type { LoadedCapability, LoadedPost, LoadedProject } from "@/lib/content";

describe("home content", () => {
  it("loads capabilities, projects, recent posts, and no question assistant", async () => {
    render(await HomePage());

    const capabilities = screen.getByRole("region", { name: "重点能力" });
    const featured = screen.getByRole("region", { name: "精选作品" });
    const recent = screen.getByRole("region", { name: "最新文章" });

    expect(
      recent.compareDocumentPosition(capabilities) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      recent.compareDocumentPosition(featured) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByLabelText("开发者状态")).not.toBeInTheDocument();
    const dailyQuote = screen.getByRole("region", { name: "每日一言" });
    expect(within(dailyQuote).getByText(/In dark times|Something beautiful/)).toBeInTheDocument();
    expect(within(dailyQuote).getByRole("link", { name: "出处" }))
      .toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    expect(within(dailyQuote).queryByText("核对出处")).not.toBeInTheDocument();
    expect(screen.queryByText(/我在这里整理做过的项目/)).not.toBeInTheDocument();

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
    expect(within(capabilities).queryAllByText("做过完整实践")).toHaveLength(0);
    expect(within(capabilities).queryAllByText("做过练习")).toHaveLength(0);

    expect(within(featured).getByRole("link", { name: "校园开源镜像站" }))
      .toHaveAttribute("href", "/projects/campus-mirror");
    expect(within(featured).getByRole("link", { name: "FPGA Verilog 智能小车" }))
      .toHaveAttribute("href", "/projects/fpga-smart-car");
    expect(within(featured).queryByText("blog-template")).not.toBeInTheDocument();
    expect(within(featured).queryByText("开源自学文档")).not.toBeInTheDocument();

    expect(within(recent).getAllByRole("article")).toHaveLength(1);
    expect(within(recent).getByText("AI 创作 · Codex（基于 GPT-6）"))
      .toBeInTheDocument();
    expect(screen.queryByText("咕咕嘎嘎正在准备中")).not.toBeInTheDocument();
    expect(screen.queryByText(/尚未连接模型/)).not.toBeInTheDocument();
  });

  it("keeps stable empty states when featured and recent content is absent", () => {
    render(
      <HomeContent featuredCapabilities={[]} featuredProjects={[]} recentPosts={[]} />,
    );

    expect(screen.getByText("重点能力还在整理")).toBeInTheDocument();
    expect(screen.getByText("精选作品稍后补上")).toBeInTheDocument();
    expect(screen.getByText("最新文章稍后补上")).toBeInTheDocument();
    expect(screen.getByText("还没有选好的句子。")).toBeInTheDocument();
    expect(screen.queryByText(/先看看/)).not.toBeInTheDocument();
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

  it("attributes a work quote and links its source and moment", () => {
    render(
      <HomeContent
        featuredCapabilities={[]}
        featuredProjects={[]}
        recentPosts={[]}
        dailyQuote={{
          text: "一段作品原句。",
          momentSlug: "disco-elysium",
          sourceTitle: "极乐迪斯科",
          sourceUrl: "https://example.org/source",
        }}
      />,
    );

    const dailyQuote = screen.getByRole("region", { name: "每日一言" });
    expect(within(dailyQuote).getByText("一段作品原句。"))
      .toBeInTheDocument();
    expect(within(dailyQuote).getByRole("link", { name: "极乐迪斯科" }))
      .toHaveAttribute("href", "/moments/disco-elysium");
    expect(within(dailyQuote).getByRole("link", { name: "出处" }))
      .toHaveAttribute("href", "https://example.org/source");
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

  it("presents the supplied Disco Elysium screenshot as a linked moment", async () => {
    render(await HomePage());

    const inspiration = screen.getByRole("region", { name: "视觉灵感" });

    expect(
      within(inspiration).getByRole("heading", {
        level: 2,
        name: "那些打动我的瞬间",
      }),
    ).toBeInTheDocument();
    expect(
      within(inspiration).getByRole("img", {
        name: "《极乐迪斯科》游戏画面：人物站在明亮的抽象画作与昆虫前",
      }),
    ).toHaveAttribute("src", expect.stringContaining("disco-elysium-scene"));
    expect(within(inspiration).getByRole("article", { name: "极乐迪斯科" }))
      .toBeInTheDocument();
    expect(within(inspiration).getByText("极乐迪斯科")).toBeInTheDocument();
    expect(within(inspiration).getByRole("link", { name: "查看极乐迪斯科的感受" }))
      .toHaveAttribute("href", "/moments/disco-elysium");
    expect(within(inspiration).queryByText(/VISUAL LOG|灵感档案/))
      .not.toBeInTheDocument();
    expect(screen.queryByText("写作 · 项目 · 一些还没想完的问题"))
      .not.toBeInTheDocument();
  });

  it("weaves four decorative characters into existing home sections", async () => {
    render(await HomePage());

    expect(screen.queryByRole("region", { name: "可爱小队" })).not.toBeInTheDocument();
    const placements = [
      ["zhujiechong", "咕咕嘎嘎"],
      ["最新文章", "Doro"],
      ["精选作品", "菲比啾比"],
      ["视觉灵感", "弗糯糯"],
    ] as const;
    for (const [regionName, name] of placements) {
      const region = screen.getByRole("region", { name: regionName });
      expect(within(region).queryByRole("link", { name: new RegExp(name) }))
        .not.toBeInTheDocument();
      expect(within(region).getByRole("img", { name })).toHaveAttribute(
        "src",
        expect.stringContaining("four-companions-v2.png"),
      );
    }
    expect(within(screen.getByRole("region", { name: "最新文章" }))
      .queryByRole("button", { name: /Doro 动画/ })).not.toBeInTheDocument();
  });
});

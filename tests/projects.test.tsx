import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectsPage, { ProjectIndex } from "@/app/projects/page";
import { ProjectArticle } from "@/components/ProjectArticle";
import { ProjectCard } from "@/components/ProjectCard";
import type { LoadedProject } from "@/lib/content";

const linkedProjectFixture: LoadedProject = {
  slug: "linked-project",
  sourcePath: "projects/linked-project.mdx",
  metadata: {
    title: "外链测试项目",
    summary: "用于验证外链安全属性的测试夹具。",
    period: "2026",
    role: "测试",
    tech: ["Next.js", "TypeScript"],
    cover: "/images/projects/observability-console.webp",
    featured: true,
    links: {
      demo: "https://demo.example.test/project",
      source: "https://code.example.test/project",
    },
  },
  content: "测试正文。",
};

describe("project index", () => {
  it("loads three anonymous projects and exposes their core facts", async () => {
    render(await ProjectsPage());

    expect(screen.getByRole("heading", { level: 1, name: "作品" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "校园开源镜像站" })).toHaveAttribute(
      "href",
      "/projects/campus-mirror",
    );
    expect(screen.getByRole("link", { name: "开源自学文档" })).toHaveAttribute(
      "href",
      "/projects/open-learning-docs",
    );
    expect(screen.getByRole("link", { name: "blog-template" })).toHaveAttribute(
      "href",
      "/projects/blog-template",
    );
    expect(screen.getByText("参与建设与维护（团队项目）")).toBeInTheDocument();
    expect(screen.getAllByText("精选作品")).toHaveLength(2);
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.queryByText(/【示例】/)).not.toBeInTheDocument();
    const campusMirrorCard = screen
      .getByRole("link", { name: "校园开源镜像站" })
      .closest("article");
    const learningDocsCard = screen
      .getByRole("link", { name: "开源自学文档" })
      .closest("article");
    const blogTemplateCard = screen
      .getByRole("link", { name: "blog-template" })
      .closest("article");

    expect(screen.getAllByLabelText("作品外部链接")).toHaveLength(3);
    expect(
      within(campusMirrorCard!).getByRole("link", {
        name: "查看源代码（新窗口）",
      }),
    ).toHaveAttribute("href", "https://github.com/kungfudaibi/sxu-mirror");
    expect(
      within(learningDocsCard!).getByRole("link", {
        name: "查看演示（新窗口）",
      }),
    ).toHaveAttribute("href", "https://kungfudaibi.github.io/");
    expect(
      within(learningDocsCard!).getByRole("link", {
        name: "查看源代码（新窗口）",
      }),
    ).toHaveAttribute(
      "href",
      "https://github.com/kungfudaibi/kungfudaibi.github.io",
    );
    expect(
      within(blogTemplateCard!).getByRole("link", {
        name: "查看源代码（新窗口）",
      }),
    ).toHaveAttribute("href", "https://github.com/kungfudaibi/blog-template");
  });

  it("renders a stable empty state", () => {
    render(<ProjectIndex projects={[]} />);

    expect(screen.getByText("作品还在整理")).toBeInTheDocument();
    expect(screen.getByText(/添加第一个 MDX/)).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("shows the role and tech stack with safe, clearly named external links", () => {
    render(<ProjectCard project={linkedProjectFixture} />);

    const article = screen.getByRole("article");
    expect(within(article).getByText("Next.js")).toBeInTheDocument();
    expect(within(article).getByText("TypeScript")).toBeInTheDocument();

    const demoLink = within(article).getByRole("link", {
      name: "查看演示（新窗口）",
    });
    expect(demoLink).toHaveAttribute(
      "href",
      "https://demo.example.test/project",
    );
    expect(demoLink).toHaveAttribute("target", "_blank");
    expect(demoLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("does not render an empty external-link group when links are omitted", () => {
    const projectWithoutLinks: LoadedProject = {
      ...linkedProjectFixture,
      slug: "anonymous-project",
      metadata: {
        ...linkedProjectFixture.metadata,
        title: "匿名项目",
        links: undefined,
      },
    };

    render(<ProjectCard project={projectWithoutLinks} />);

    expect(screen.queryByLabelText("作品外部链接")).not.toBeInTheDocument();
    expect(screen.queryByText(/暂无链接|即将公开/)).not.toBeInTheDocument();
  });
});

describe("ProjectArticle", () => {
  it("provides project semantics, detail content, and a route back", () => {
    render(
      <ProjectArticle project={linkedProjectFixture}>
        <h2>我的职责</h2>
        <p>测试职责。</p>
        <h2>成果</h2>
      </ProjectArticle>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "外链测试项目" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "我的职责" }))
      .toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "成果" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回作品列表" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("omits external-link markup when a project has no approved links", () => {
    const projectWithoutLinks: LoadedProject = {
      ...linkedProjectFixture,
      metadata: { ...linkedProjectFixture.metadata, links: undefined },
    };

    render(
      <ProjectArticle project={projectWithoutLinks}>
        <p>匿名项目正文。</p>
      </ProjectArticle>,
    );

    expect(screen.queryByLabelText("作品外部链接")).not.toBeInTheDocument();
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectsPage, { ProjectIndex } from "@/app/projects/page";
import { ProjectArticle } from "@/components/ProjectArticle";
import { ProjectCard } from "@/components/ProjectCard";
import type { LoadedProject } from "@/lib/content";

const exampleProject: LoadedProject = {
  slug: "example-observability-console",
  sourcePath: "projects/example-observability-console.mdx",
  metadata: {
    title: "【示例】API 观测台",
    summary: "把分散的请求日志整理成可追踪问题路径的样例工具。",
    period: "2026",
    role: "全栈开发（示例）",
    tech: ["Next.js", "TypeScript", "OpenTelemetry"],
    cover: "/images/projects/observability-console.webp",
    featured: true,
    links: {
      demo: "https://example.com/projects/observability",
      source: "https://github.com/example/observability-console",
    },
  },
  content: "这是等待站主替换的示例作品。",
};

describe("project index", () => {
  it("loads a repository project and exposes its core facts", async () => {
    render(await ProjectsPage());

    expect(screen.getByRole("heading", { level: 1, name: "作品" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "【示例】API 观测台" })).toHaveAttribute(
      "href",
      "/projects/example-observability-console",
    );
    expect(screen.getByText("全栈开发（示例）")).toBeInTheDocument();
    expect(screen.getAllByText("精选作品")).toHaveLength(2);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("renders a stable empty state", () => {
    render(<ProjectIndex projects={[]} />);

    expect(screen.getByText("作品还在整理")).toBeInTheDocument();
    expect(screen.getByText(/添加第一个 MDX/)).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("shows the role and tech stack with safe, clearly named external links", () => {
    render(<ProjectCard project={exampleProject} />);

    const article = screen.getByRole("article");
    expect(within(article).getByText("Next.js")).toBeInTheDocument();
    expect(within(article).getByText("TypeScript")).toBeInTheDocument();

    const demoLink = within(article).getByRole("link", {
      name: "查看演示（新窗口）",
    });
    expect(demoLink).toHaveAttribute(
      "href",
      "https://example.com/projects/observability",
    );
    expect(demoLink).toHaveAttribute("target", "_blank");
    expect(demoLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});

describe("ProjectArticle", () => {
  it("provides project semantics, detail content, and a route back", () => {
    render(
      <ProjectArticle project={exampleProject}>
        <h2>我的职责</h2>
        <p>样例职责。</p>
        <h2>样例成果</h2>
      </ProjectArticle>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "【示例】API 观测台" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "我的职责" }))
      .toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "样例成果" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回作品列表" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});

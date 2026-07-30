import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage, { HomeContent } from "@/app/page";

describe("home content", () => {
  it("loads featured projects, recent posts, and the honest agent preview", async () => {
    render(await HomePage());

    const featured = screen.getByRole("region", { name: "精选作品" });
    const recent = screen.getByRole("region", { name: "最新文章" });

    expect(
      within(featured).getByRole("link", { name: "【示例】API 观测台" }),
    ).toHaveAttribute("href", "/projects/example-observability-console");
    expect(
      within(featured).getByRole("link", { name: "【示例】本地开发工作台" }),
    ).toHaveAttribute("href", "/projects/example-dev-workbench");
    expect(
      within(featured).queryByText("【示例】数据整理流水线"),
    ).not.toBeInTheDocument();

    expect(within(recent).getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("阿竹正在准备中")).toBeInTheDocument();
    expect(screen.getByText(/尚未连接模型/)).toBeInTheDocument();
  });

  it("keeps stable empty states when no featured or recent content exists", () => {
    render(<HomeContent featuredProjects={[]} recentPosts={[]} />);

    expect(screen.getByText("精选作品稍后补上")).toBeInTheDocument();
    expect(screen.getByText("最新文章稍后补上")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看全部作品" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: "查看全部文章" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CapabilitiesPage, { CapabilityIndex } from "@/app/capabilities/page";

vi.mock("@/components/MdxContent", () => ({
  MdxContent: ({ source }: { source: string }) => <div>{source}</div>,
}));

describe("capability page", () => {
  it("loads the repository capability and exposes evidence without interaction", async () => {
    render(await CapabilitiesPage());

    expect(screen.getByRole("heading", { level: 1, name: "能力地图" }))
      .toBeInTheDocument();
    expect(screen.queryByText("CAPABILITY / EVIDENCE")).not.toBeInTheDocument();
    expect(screen.queryByText("FIELD INDEX")).not.toBeInTheDocument();

    const navigation = screen.getByRole("navigation", { name: "能力领域索引" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(6);
    expect(
      within(navigation).getByRole("link", { name: "超算与 AI Infra" }),
    ).toHaveAttribute("href", "#hpc-ai-infra");

    const article = screen.getByRole("article", { name: "超算与 AI Infra" });
    expect(within(article).queryByText("做过完整实践")).not.toBeInTheDocument();
    expect(within(article).queryByText("01")).not.toBeInTheDocument();
    expect(within(article).queryByText(/从体系结构、并行模型和真实工作负载出发/))
      .not.toBeInTheDocument();
    expect(within(article).getByText("2026年8月1日")).toHaveAttribute(
      "datetime",
      "2026-08-01",
    );
    expect(within(article).getByText("并行计算")).toBeInTheDocument();
    expect(within(article).getByText(/竞赛经历/)).toBeInTheDocument();
    expect(within(article).queryByRole("link", { name: "查看相关作品与实践" }))
      .not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(
      within(navigation).getByRole("link", { name: "算法与数据结构" }),
    ).toHaveAttribute("href", "#algorithms");
  });

  it("renders a stable empty state without invented capability levels", () => {
    render(<CapabilityIndex capabilities={[]} />);

    expect(screen.getByText("能力档案还在整理")).toBeInTheDocument();
    expect(screen.getByText(/content\/capabilities/)).toBeInTheDocument();
    expect(screen.queryByText("做过完整实践")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "能力领域索引" }),
    ).not.toBeInTheDocument();
  });

  it("does not render a summary placeholder for an unfinished capability", () => {
    const { container } = render(
      <CapabilityIndex
        capabilities={[
          {
            slug: "unfinished",
            sourcePath: "capabilities/unfinished.mdx",
            metadata: {
              title: "暂未命名能力",
              summary: "",
              status: "exploring",
              updatedAt: "2026-08-04",
              order: 1,
              featured: false,
              branches: ["待整理"],
            },
            content: "",
          },
        ]}
      />,
    );

    expect(container.querySelector("[class*='summary']")).toBeNull();
  });
});

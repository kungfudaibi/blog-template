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

    const navigation = screen.getByRole("navigation", { name: "能力领域索引" });
    expect(
      within(navigation).getByRole("link", { name: "超算与 AI Infra" }),
    ).toHaveAttribute("href", "#hpc-ai-infra");

    const article = screen.getByRole("article", { name: "超算与 AI Infra" });
    expect(within(article).getByText("做过完整实践")).toBeInTheDocument();
    expect(within(article).getByText("2026年8月1日")).toHaveAttribute(
      "datetime",
      "2026-08-01",
    );
    expect(within(article).getByText("并行计算")).toBeInTheDocument();
    expect(within(article).getByText(/边界与失败/)).toBeInTheDocument();
    expect(
      within(article).getByRole("link", { name: "查看相关作品与实践" }),
    ).toHaveAttribute("href", "/projects");
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
});

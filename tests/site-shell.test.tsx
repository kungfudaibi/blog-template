import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RootLayout from "../app/layout";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

const usePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/");
  });

  it("offers named primary navigation with the current page exposed", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "主导航" });
    const links = within(navigation).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "首页",
      "作品",
      "文章",
      "关于",
    ]);
    expect(screen.getByRole("link", { name: "首页" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

describe("RootLayout", () => {
  it("declares Chinese content and provides a skip link", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main id="main-content">内容</main>
      </RootLayout>,
    );

    expect(markup).toContain('lang="zh-CN"');
    expect(markup).toContain('href="#main-content"');
    expect(markup).toContain("跳到主要内容");
  });
});

describe("SiteFooter", () => {
  it("identifies the site without placeholder contact details", () => {
    render(<SiteFooter />);

    expect(screen.getByText(/zhujiechong/)).toBeInTheDocument();
    expect(screen.getByText("持续写代码，也持续记录。"))
      .toBeInTheDocument();
  });
});

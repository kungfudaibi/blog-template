import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "../app/page";

describe("HomePage", () => {
  it("introduces the zhujiechong site", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "zhujiechong" }),
    ).toBeInTheDocument();
    expect(screen.getByText("程序员的作品与思考")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "浏览作品" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: "阅读文章" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(screen.getByLabelText("开发者状态")).toHaveTextContent(
      "open_to_build",
    );
  });
});

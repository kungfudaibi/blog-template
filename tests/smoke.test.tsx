import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "../app/page";

describe("HomePage", () => {
  it("introduces the zhujiechong site", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "zhujiechong" }),
    ).toBeInTheDocument();
    expect(screen.getByText("程序员的作品与思考")).toBeInTheDocument();
  });
});

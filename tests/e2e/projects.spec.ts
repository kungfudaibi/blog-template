import { expect, test } from "@playwright/test";

test("a visitor can open a project and inspect its role and outcomes", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/projects");
  await page.getByRole("link", { name: "校园开源镜像站" }).click();

  await expect(page).toHaveURL(/\/projects\/campus-mirror$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "校园开源镜像站" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "想说的话" })).toBeVisible();
  await expect(page.getByText(/从零开始真正做成一个事情/)).toBeVisible();
  const sourceLink = page.getByRole("link", {
    name: "查看源代码（新窗口）",
  });
  await expect(sourceLink).toHaveAttribute(
    "href",
    "https://github.com/kungfudaibi/sxu-mirror",
  );
  await expect(sourceLink).toHaveAttribute("target", "_blank");
  await expect(sourceLink).toHaveAttribute("rel", "noopener noreferrer");
  expect(browserErrors).toEqual([]);
});

test("the project index shows only the mirror and FPGA car", async ({
  page,
}) => {
  await page.goto("/projects");

  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(page.getByLabel("作品外部链接")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: "查看源代码（新窗口）" }),
  ).toHaveCount(2);
  await expect(page.getByRole("link", { name: "FPGA Verilog 智能小车" })).toBeVisible();
  await expect(page.getByRole("link", { name: "blog-template" })).toHaveCount(0);
});

test("the FPGA car detail preserves team attribution and approved source link", async ({
  page,
}) => {
  await page.goto("/projects/fpga-smart-car");
  await expect(
    page.getByRole("heading", { level: 1, name: "FPGA Verilog 智能小车" }),
  ).toBeVisible();
  await expect(page.getByText(/团队项目/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "查看源代码（新窗口）" }),
  ).toHaveAttribute(
    "href",
    "https://github.com/kungfudaibi/fpga_smart_car_tank",
  );

});

test("unpublished project detail routes return HTTP 404", async ({ page }) => {
  for (const slug of ["open-learning-docs", "blog-template", "octoday-menu"]) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(404);
  }
});

test("a missing project returns an HTTP 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-real-project");

  expect(response?.status()).toBe(404);
});

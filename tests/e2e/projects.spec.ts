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
  await page.getByRole("link", { name: "【示例】API 观测台" }).click();

  await expect(page).toHaveURL(/\/projects\/example-observability-console$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "【示例】API 观测台" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "我的职责" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "样例成果" })).toBeVisible();

  const sourceLink = page.getByRole("link", { name: "查看源代码（新窗口）" });
  await expect(sourceLink).toHaveAttribute("target", "_blank");
  await expect(sourceLink).toHaveAttribute("rel", /noopener/);
  expect(browserErrors).toEqual([]);
});

test("a missing project returns an HTTP 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-real-project");

  expect(response?.status()).toBe(404);
});

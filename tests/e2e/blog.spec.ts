import { expect, test } from "@playwright/test";

test("a visitor can move from the article list to the sample article", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/blog");
  await page
    .getByRole("link", { name: "【示例】把个人站点当作长期项目" })
    .click();

  await expect(page).toHaveURL(/\/blog\/building-this-site$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "【示例】把个人站点当作长期项目",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "先从问题开始" })).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test("a missing article returns an HTTP 404", async ({ page }) => {
  const response = await page.goto("/blog/not-a-real-post");

  expect(response?.status()).toBe(404);
});

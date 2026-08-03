import { expect, test } from "@playwright/test";

test("a visitor can open a published note whose summary is still undecided", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/blog");
  await page
    .getByRole("link", { name: "充满信心期盼着明天" })
    .click();

  await expect(page).toHaveURL(/\/blog\/content-is-a-contract$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "充满信心期盼着明天",
    }),
  ).toBeVisible();
  await expect(page.locator(".blog-article__summary")).toHaveCount(0);
  expect(browserErrors).toEqual([]);
});

test("a missing article returns an HTTP 404", async ({ page }) => {
  const response = await page.goto("/blog/not-a-real-post");

  expect(response?.status()).toBe(404);
});

test("the RSS feed is directly accessible", async ({ page }) => {
  const response = await page.goto("/rss.xml");

  expect(response?.status()).toBe(200);
  expect(response?.headers()["content-type"]).toContain("application/rss+xml");
  expect(await response?.text()).toContain("<rss version=\"2.0\">");
});

import { expect, test } from "@playwright/test";

test("the article list only shows the author's written post", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/blog");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByText("AI 创作 · Codex（基于 GPT-6）")).toBeVisible();
  await page.getByRole("link", {
    name: "一次系统 SSD 损坏后的恢复：从 BMC 控制台到 ddrescue",
  }).click();

  await expect(page).toHaveURL(new RegExp(encodeURI("/blog/运维日志-与codex救回系统盘") + "$"));
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "一次系统 SSD 损坏后的恢复：从 BMC 控制台到 ddrescue",
    }),
  ).toBeVisible();
  await expect(page.getByText("AI 创作 · Codex（基于 GPT-6）")).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test("removed placeholder article routes return HTTP 404", async ({ page }) => {
  for (const slug of ["building-this-site", "content-is-a-contract"]) {
    const response = await page.goto(`/blog/${slug}`);
    expect(response?.status()).toBe(404);
  }
});

test("a missing article returns an HTTP 404", async ({ page }) => {
  const response = await page.goto("/blog/not-a-real-post");

  expect(response?.status()).toBe(404);
});

test("a Chinese-named article opens from the writing list", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("link", {
    name: "一次系统 SSD 损坏后的恢复：从 BMC 控制台到 ddrescue",
  }).click();

  await expect(page).toHaveURL(new RegExp(encodeURI("/blog/运维日志-与codex救回系统盘") + "$"));
  await expect(page.getByRole("heading", {
    level: 1,
    name: "一次系统 SSD 损坏后的恢复：从 BMC 控制台到 ddrescue",
  })).toBeVisible();
});

test("the RSS feed is directly accessible", async ({ page }) => {
  const response = await page.goto("/rss.xml");

  expect(response?.status()).toBe(200);
  expect(response?.headers()["content-type"]).toContain("application/rss+xml");
  expect(await response?.text()).toContain("<rss version=\"2.0\">");
});

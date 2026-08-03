import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`about page exposes only anonymous public records at ${viewport.name} width`, async ({
    page,
  }) => {
    const browserErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    await page.setViewportSize(viewport);
    const response = await page.goto("/about");

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "关于我" }))
      .toBeVisible();
    await expect(page.getByLabel("资料状态")).toContainText("匿名公开");

    const publicProfiles = page.getByRole("region", { name: "公开个人资料" });
    await expect(publicProfiles.getByRole("article")).toHaveCount(2);
    await expect(
      publicProfiles.getByRole("heading", {
        level: 2,
        name: "联系状态",
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "可以问的问题" }))
      .toHaveCount(0);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
    expect(browserErrors).toEqual([]);
  });
}

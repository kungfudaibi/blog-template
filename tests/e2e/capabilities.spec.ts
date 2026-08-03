import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`capability evidence stays readable at ${viewport.name} width`, async ({ page }) => {
    const browserErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    await page.setViewportSize(viewport);

    const response = await page.goto("/capabilities");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "能力地图" }),
    ).toBeVisible();
    await expect(
      page.getByRole("article", { name: "超算与 AI Infra" }),
    ).toBeVisible();
    await expect(
      page.getByRole("article", { name: "超算与 AI Infra" }).getByRole("heading", {
        name: "边界与失败",
      }),
    ).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    expect(browserErrors).toEqual([]);
  });
}

test("field index uses keyboard-accessible in-page links", async ({ page }) => {
  await page.goto("/capabilities");

  const fieldLink = page
    .getByRole("navigation", { name: "能力领域索引" })
    .getByRole("link", { name: "超算与 AI Infra" });

  await fieldLink.focus();
  await expect(fieldLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/capabilities#hpc-ai-infra$/);
});

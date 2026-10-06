import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`capability evidence stays readable at ${viewport.name} width`, async ({ page }, testInfo) => {
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
    await expect(page.getByText("CAPABILITY / EVIDENCE")).toHaveCount(0);
    await expect(page.getByText("FIELD INDEX")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "能力领域索引" }).getByRole("link"))
      .toHaveCount(6);
    const fieldNavigation = page.getByRole("navigation", { name: "能力领域索引" });
    await expect(fieldNavigation.locator("svg[aria-hidden='true']")).toHaveCount(6);
    await expect(page.getByRole("img", { name: "Doro" })).toBeVisible();
    const mascotSurface = page.locator("main > header > span");
    await expect(mascotSurface).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(mascotSurface).toHaveCSS("border-top-width", "0px");
    const layoutColumns = await fieldNavigation.evaluate((element) =>
      getComputedStyle(element.parentElement!).gridTemplateColumns.split(" ").length,
    );
    expect(layoutColumns).toBe(viewport.name === "desktop" ? 2 : 1);
    await expect(fieldNavigation).toHaveCSS(
      "position",
      viewport.name === "desktop" ? "sticky" : "static",
    );
    await expect(page.getByRole("article").first().locator("svg[aria-hidden='true']"))
      .toHaveCount(1);
    await expect(
      page.getByRole("article", { name: "超算与 AI Infra" }),
    ).toBeVisible();
    await expect(page.getByRole("article", { name: "超算与 AI Infra" })
      .getByText(/从体系结构、并行模型和真实工作负载出发/)).toHaveCount(0);
    await expect(page.getByRole("article", { name: "超算与 AI Infra" })
      .getByRole("link", { name: "查看相关作品与实践" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "主导航" })
      .locator("svg[aria-hidden='true']")).toHaveCount(5);
    await expect(page.getByRole("article", { name: "超算与 AI Infra" })
      .getByText("做过完整实践")).toHaveCount(0);
    await expect(
      page.getByRole("article", { name: "超算与 AI Infra" }).getByRole("heading", {
        name: "竞赛经历",
      }),
    ).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    expect(browserErrors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${viewport.name}.png`), fullPage: true });
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

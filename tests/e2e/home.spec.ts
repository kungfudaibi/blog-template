import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`home page is usable at ${viewport.name} width`, async ({ page }, testInfo) => {
    const browserErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) {
        browserErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "zhujiechong" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "浏览作品" })).toBeVisible();
    await expect(page.getByLabel("开发者状态")).toContainText("open_to_build");

    const inspiration = page.getByRole("region", { name: "视觉灵感" });
    const inspirationImage = inspiration.getByRole("img", {
      name: "《极乐迪斯科》游戏画面：人物站在明亮的抽象画作与昆虫前",
    });

    await expect(
      inspiration.getByRole("heading", {
        level: 2,
        name: "最近让我着迷的世界",
      }),
    ).toBeVisible();
    await expect(inspirationImage).toBeVisible();
    await expect(inspiration).toContainText("《极乐迪斯科》游戏画面截图");
    await expect
      .poll(() =>
        inspirationImage.evaluate(
          (image) => (image as HTMLImageElement).naturalWidth,
        ),
      )
      .toBeGreaterThan(0);

    const imageMetrics = await inspirationImage.evaluate((image) => {
      const element = image as HTMLImageElement;

      return {
        declaredWidth: Number(element.getAttribute("width")),
        declaredHeight: Number(element.getAttribute("height")),
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        renderedRatio: element.clientWidth / element.clientHeight,
      };
    });

    expect(imageMetrics.declaredWidth).toBe(1918);
    expect(imageMetrics.declaredHeight).toBe(1078);
    expect(imageMetrics.naturalWidth).toBeGreaterThan(0);
    expect(imageMetrics.naturalHeight).toBeGreaterThan(0);
    expect(
      Math.abs(
        imageMetrics.naturalWidth / imageMetrics.naturalHeight - 1918 / 1078,
      ),
    ).toBeLessThan(0.02);
    expect(imageMetrics.renderedRatio).toBeCloseTo(1918 / 1078, 2);

    const featuredProjects = page.getByRole("region", { name: "精选作品" });
    await expect(featuredProjects.getByRole("article")).toHaveCount(2);
    await expect(
      page.getByRole("region", { name: "最新文章" }).getByRole("article"),
    ).toHaveCount(3);
    await expect(page.getByText("阿竹正在准备中")).toBeVisible();
    await expect(page.getByText("尚未连接模型")).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
    expect(browserErrors).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${viewport.name}.png`),
      fullPage: true,
    });
  });
}

test("keyboard users can reveal the skip link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "跳到主要内容" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
});

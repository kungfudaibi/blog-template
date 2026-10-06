import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
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
      page.getByRole("heading", { level: 1, name: /写下做过的事.*也写下仍在思考的事/ }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "读点文章 ↗" })).toBeVisible();
    const dailyQuote = page.getByRole("region", { name: "每日一言" });
    await expect(dailyQuote.getByText(/In dark times|Something beautiful/)).toBeVisible();
    await expect(dailyQuote.getByRole("link", { name: "极乐迪斯科" }))
      .toHaveAttribute("href", "/moments/disco-elysium");
    await expect(dailyQuote.getByRole("link", { name: "出处" }))
      .toHaveAttribute("href", /^https:\/\//);
    await expect(page.getByText(/我在这里整理做过的项目/)).toHaveCount(0);
    await expect(page.getByLabel("开发者状态")).toHaveCount(0);

    const inspiration = page.getByRole("region", { name: "视觉灵感" });
    const inspirationImage = inspiration.getByRole("img", {
      name: "《极乐迪斯科》游戏画面：人物站在明亮的抽象画作与昆虫前",
    });

    await expect(
      inspiration.getByRole("heading", {
        level: 2,
        name: "那些打动我的瞬间",
      }),
    ).toBeVisible();
    await expect(inspirationImage).toBeVisible();
    await expect(inspiration.getByRole("article", { name: "极乐迪斯科" })).toBeVisible();
    await expect(inspiration.getByRole("heading", { level: 3, name: "极乐迪斯科" })).toBeVisible();
    await expect(inspiration.getByRole("link", { name: "查看极乐迪斯科的感受" }))
      .toHaveAttribute("href", "/moments/disco-elysium");
    await expect(page.getByText("写作 · 项目 · 一些还没想完的问题")).toHaveCount(0);
    await expect(inspiration.getByText(/VISUAL LOG|灵感档案/)).toHaveCount(0);
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

    const featuredCapabilities = page.getByRole("region", { name: "还在摸索" });
    await expect(featuredCapabilities.getByRole("article")).toHaveCount(3);
    await expect(
      featuredCapabilities.getByRole("link", { name: "超算与 AI Infra" }),
    ).toHaveAttribute("href", "/capabilities#hpc-ai-infra");

    const featuredProjects = page.getByRole("region", { name: "做过的东西" });
    await expect(featuredProjects.getByRole("article")).toHaveCount(2);
    await expect(featuredProjects.getByRole("link", { name: "校园开源镜像站" })).toBeVisible();
    await expect(featuredProjects.getByRole("link", { name: "FPGA Verilog 智能小车" })).toBeVisible();
    await expect(
      page.getByRole("region", { name: "最近写下" }).getByRole("article"),
    ).toHaveCount(1);
    await expect(page.getByRole("region", { name: "最近写下" })
      .getByText("AI 创作 · Codex（基于 GPT-6）")).toBeVisible();
    await expect(page.getByText("咕咕嘎嘎正在准备中")).toHaveCount(0);
    await expect(page.getByText("尚未连接模型")).toHaveCount(0);

    await expect(page.getByRole("region", { name: "可爱小队" })).toHaveCount(0);
    const placements = [
      ["写下做过的事，也写下仍在思考的事。", "咕咕嘎嘎"],
      ["最近写下", "Doro"],
      ["做过的东西", "菲比啾比"],
      ["视觉灵感", "弗糯糯"],
    ] as const;
    for (const [regionName, name] of placements) {
      const region = page.getByRole("region", { name: regionName === "写下做过的事，也写下仍在思考的事。" ? /写下做过的事/ : regionName });
      const image = region.getByRole("img", { name });
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate((element) =>
        (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(image).toHaveAttribute("src", /four-companions-v2\.png/);
      await expect(region.getByRole("link", { name: new RegExp(name) })).toHaveCount(0);
    }
    const latest = page.getByRole("region", { name: "最近写下" });
    await expect(latest.getByRole("button", { name: /Doro 动画/ })).toHaveCount(0);

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

test("a featured project card opens from its padding area", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("region", { name: "做过的东西" })
    .getByRole("article").first();
  await card.click({ position: { x: 10, y: 10 } });
  await expect(page).toHaveURL(/\/projects\/campus-mirror$/);
});

test("character accents honor reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const latest = page.getByRole("region", { name: "最近写下" });
  const doro = latest.getByRole("img", { name: "Doro" });
  await expect(doro).toHaveAttribute("src", /four-companions-v2\.png/);
  await expect.poll(() => doro.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element.parentElement as Element).transitionDuration)))
    .toBeLessThan(0.001);
});

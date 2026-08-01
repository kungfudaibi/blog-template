import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`agent dialog supports the keyboard flow at ${viewport.name} width`, async ({
    page,
  }) => {
    const browserErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    await page.route("**/api/agent", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: "他是一名程序员。",
          citations: [{ title: "公开介绍", href: "/about" }],
          scope: "personal",
          model: "mock",
        }),
      }),
    );

    await page.setViewportSize(viewport);
    await page.goto("/");

    const launcher = page.getByRole("button", { name: "询问阿竹" });
    await expect(launcher).toBeVisible();
    await expect(page.getByRole("img", { name: "阿竹像素机器人" }))
      .toBeVisible();

    await launcher.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "问问阿竹" });
    const input = page.getByRole("textbox", { name: "你的问题" });
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();

    await input.fill("zhujiechong 是做什么的？");
    await page.keyboard.press("Control+Enter");

    await expect(page.getByText("他是一名程序员。")).toBeVisible();
    await expect(page.getByRole("link", { name: "公开介绍" })).toHaveAttribute(
      "href",
      "/about",
    );

    const layout = await page.evaluate(() => ({
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      dialogFitsViewport: (
        document.querySelector("[role=dialog]")?.getBoundingClientRect().width
        ?? Number.POSITIVE_INFINITY
      ) <= window.innerWidth,
    }));
    expect(layout).toEqual({
      hasHorizontalOverflow: false,
      dialogFitsViewport: true,
    });
    expect(browserErrors).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(launcher).toBeFocused();
  });
}

test("agent entrance respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "询问阿竹" }).click();

  const duration = await page.getByRole("dialog", { name: "问问阿竹" }).evaluate(
    (element) => getComputedStyle(element).animationDuration,
  );

  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`about page shows the approved contact links at ${viewport.name} width`, async ({
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
    await expect(page.getByText(/我是 zhujiechong，一名程序员/)).toHaveCount(0);
    await expect(page.getByLabel("资料状态")).toHaveCount(0);

    const publicProfiles = page.getByRole("region", { name: "公开个人资料" });
    await expect(publicProfiles.getByRole("article")).toHaveCount(1);
    await expect(
      publicProfiles.getByRole("heading", {
        level: 2,
        name: "联系方式",
      }),
    ).toBeVisible();
    await expect(publicProfiles.getByRole("heading", { name: "公开介绍" })).toHaveCount(0);
    await expect(publicProfiles.getByRole("link", { name: "相关页面" })).toHaveCount(0);
    await expect(page.getByRole("img", { name: "咕咕嘎嘎" })).toBeVisible();
    const contactCards = publicProfiles.locator(".profile-section .prose > p");
    await expect(contactCards).toHaveCount(4);
    for (const card of await contactCards.all()) {
      await expect(card).toHaveCSS("border-top-style", "solid");
      expect(await card.locator("strong").evaluate(
        (element) => getComputedStyle(element, "::before").maskImage,
      )).not.toBe("none");
    }
    const columns = await publicProfiles.locator(".profile-section .prose").evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
    expect(columns).toBe(viewport.name === "desktop" ? 2 : 1);
    await expect(publicProfiles.getByRole("link", { name: "白天为什么要开灯" }))
      .toHaveAttribute("href", "https://space.bilibili.com/240822507?spm_id_from=333.1007.0.0");
    await expect(publicProfiles.getByRole("link", { name: "kungfudaibi" }))
      .toHaveAttribute("href", "https://github.com/kungfudaibi");
    for (const [index, name] of [
      [0, "1534779821@qq.com"],
      [2, "白天为什么要开灯"],
      [3, "kungfudaibi"],
    ] as const) {
      const link = publicProfiles.getByRole("link", { name });
      await expect(link).toHaveCSS("text-decoration-line", "none");
      const card = contactCards.nth(index);
      expect(await card.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return document.elementFromPoint(bounds.left + 12, bounds.top + 12)?.closest("a")?.getAttribute("href");
      })).toBe(await link.getAttribute("href"));
    }
    await expect(contactCards.nth(1).getByRole("link")).toHaveCount(0);
    for (const name of ["白天为什么要开灯", "kungfudaibi"]) {
      const link = publicProfiles.getByRole("link", { name });
      expect(
        await link.evaluate((element) => getComputedStyle(element, "::after").content),
      ).toContain("↗");
    }
    await expect(page.getByRole("heading", { name: "可以问的问题" }))
      .toHaveCount(0);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
    expect(browserErrors).toEqual([]);
  });
}

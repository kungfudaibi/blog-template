import { expect, test } from "@playwright/test";

test("a moment card opens a page where the author can later write reflections", async ({ page }) => {
  await page.goto("/");

  const card = page.getByRole("region", { name: "视觉灵感" })
    .getByRole("link", { name: "查看极乐迪斯科的感受" });
  await card.focus();
  await expect(card).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/moments\/disco-elysium$/);
  await expect(page.getByRole("heading", { level: 1, name: "极乐迪斯科" })).toBeVisible();
  await expect(page.getByRole("img", {
    name: "《极乐迪斯科》游戏画面：人物站在明亮的抽象画作与昆虫前",
  })).toBeVisible();
  await expect(page.getByText(/游戏及相关视觉资产归其权利人所有/)).toBeVisible();
  await expect(page.getByRole("link", { name: "返回那些打动我的瞬间" }))
    .toHaveAttribute("href", "/#moments");
});

test("an unknown moment returns HTTP 404", async ({ page }) => {
  const response = await page.goto("/moments/not-a-real-moment");
  expect(response?.status()).toBe(404);
});

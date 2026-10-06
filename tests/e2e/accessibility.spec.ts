import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/blog",
  "/blog/运维日志-与codex救回系统盘",
  "/moments/disco-elysium",
  "/capabilities",
  "/projects",
  "/projects/campus-mirror",
  "/about",
] as const;

test("removed question API returns 404", async ({ request }) => {
  const response = await request.post("/api/agent", {
    data: { question: "你好" },
  });

  expect(response.status()).toBe(404);
});

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`core pages stay usable and quiet at ${viewport.name} width`, async ({ page }) => {
    const browserErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    await page.setViewportSize(viewport);

    for (const route of publicRoutes) {
      const response = await page.goto(route);

      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main#main-content"), route).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 }), route).toHaveCount(1);
      await expect(page.getByRole("button", { name: "询问咕咕嘎嘎" }), route).toHaveCount(0);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(hasHorizontalOverflow, route).toBe(false);
    }

    expect(browserErrors).toEqual([]);
  });
}

test("keyboard users can skip, navigate, and open a project", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "跳到主要内容" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();

  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const projectsNavigation = page.getByRole("link", { name: "作品", exact: true });
  await expect(projectsNavigation).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects$/);

  const projectLink = page.getByRole("link", { name: "校园开源镜像站" });
  await projectLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/campus-mirror$/);
  await expect(page.getByRole("heading", { level: 1, name: "校园开源镜像站" }))
    .toBeVisible();
});

test("discovery endpoints, recovery page, and security headers work in-browser", async ({
  page,
  request,
}) => {
  const home = await request.get("/");
  const headers = home.headers();

  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["permissions-policy"]).toContain("camera=()");

  const sitemap = await request.get("/sitemap.xml");
  const robots = await request.get("/robots.txt");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/moments/disco-elysium");
  expect(await sitemap.text()).not.toContain("/blog/building-this-site");
  expect(await sitemap.text()).toContain("/capabilities");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /api/");

  const missing = await page.goto("/definitely-not-a-page");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "页面没有找到" })).toBeVisible();
  await expect(page.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
});

import { expect, test } from "@playwright/test";

test("a visitor can open a project and inspect its role and outcomes", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/projects");
  await page.getByRole("link", { name: "校园开源镜像站" }).click();

  await expect(page).toHaveURL(/\/projects\/campus-mirror$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "校园开源镜像站" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "我的职责" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "成果" })).toBeVisible();
  await expect(page.getByLabel("作品外部链接")).toHaveCount(0);
  expect(browserErrors).toEqual([]);
});

test("a missing project returns an HTTP 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-real-project");

  expect(response?.status()).toBe(404);
});

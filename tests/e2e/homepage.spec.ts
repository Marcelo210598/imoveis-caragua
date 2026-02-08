import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Verificar título
    await expect(page).toHaveTitle(/Litoral Norte/);

    // Verificar header
    await expect(page.locator("header")).toBeVisible();

    // Verificar hero section
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");

    // Clicar no link de imóveis
    await page.click('a[href="/imoveis"]');

    // Verificar que navegou
    await expect(page).toHaveURL(/imoveis/);
  });

  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const initialTheme = await html.getAttribute("class");

    // Clicar no toggle de tema (se existir)
    const themeToggle = page.locator(
      '[aria-label*="tema"], [aria-label*="theme"]',
    );
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      const newTheme = await html.getAttribute("class");
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});

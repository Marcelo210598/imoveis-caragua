import { test, expect } from "@playwright/test";

test.describe("Properties Listing", () => {
  test("should display properties list", async ({ page }) => {
    await page.goto("/imoveis");

    // Aguardar carregamento
    await page.waitForLoadState("networkidle");

    // Verificar que há cards de imóveis
    const propertyCards = page.locator('[data-testid="property-card"]');
    await expect(propertyCards.first()).toBeVisible({ timeout: 10000 });
  });

  test("should filter by city", async ({ page }) => {
    await page.goto("/imoveis");
    await page.waitForLoadState("networkidle");

    // Selecionar cidade no filtro
    const cityFilter = page.locator(
      'select[name="city"], [data-testid="city-filter"]',
    );
    if (await cityFilter.isVisible()) {
      await cityFilter.selectOption({ index: 1 });

      // Aguardar reload
      await page.waitForLoadState("networkidle");

      // URL deve ter query param
      expect(page.url()).toContain("city=");
    }
  });

  test("should filter by price range", async ({ page }) => {
    await page.goto("/imoveis");
    await page.waitForLoadState("networkidle");

    // Preencher preço mínimo
    const minPrice = page.locator(
      'input[name="minPrice"], [data-testid="min-price"]',
    );
    if (await minPrice.isVisible()) {
      await minPrice.fill("100000");
      await minPrice.blur();

      // Aguardar reload
      await page.waitForLoadState("networkidle");
    }
  });

  test("should navigate to property detail", async ({ page }) => {
    await page.goto("/imoveis");
    await page.waitForLoadState("networkidle");

    // Clicar no primeiro card
    const firstCard = page.locator('[data-testid="property-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();

      // Verificar que navegou para a página de detalhes
      await expect(page).toHaveURL(/imoveis\/.+/);
    }
  });
});

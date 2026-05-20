import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads with header visible', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header')).toContainText('Kuran Ajanı');
  });

  test('chat input is visible', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.getByPlaceholder(/ayet.*soru/i)).toBeVisible();
  });

  test('language toggle switches to English', async ({ page }) => {
    await page.goto('/tr');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator('header')).toContainText('Quran Agent');
  });

  test('language toggle switches to Turkish', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'TR', exact: true }).click();
    await expect(page).toHaveURL(/\/tr/);
    await expect(page.locator('header')).toContainText('Kuran Ajanı');
  });
});

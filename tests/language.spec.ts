import { test, expect } from '@playwright/test';

test.describe('Language Toggle', () => {
  test('default language is Turkish', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.locator('header')).toContainText('Kuran Ajanı');
  });

  test('can switch between languages multiple times', async ({ page }) => {
    await page.goto('/tr');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/en/);
    await page.getByRole('button', { name: 'TR', exact: true }).click();
    await expect(page).toHaveURL(/\/tr/);
  });

  test('chat placeholder changes with language', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByPlaceholder(/Ask about/i)).toBeVisible();
    await page.getByRole('button', { name: 'TR', exact: true }).click();
    await expect(page.getByPlaceholder(/konu sorun/i)).toBeVisible();
  });
});

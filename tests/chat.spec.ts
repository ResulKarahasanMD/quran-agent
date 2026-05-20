import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test('can type and enable submit button', async ({ page }) => {
    await page.goto('/tr');
    const input = page.getByPlaceholder(/ayet.*soru/i);
    await input.fill('1:7');
    const submitBtn = page.getByRole('button', { name: /gönder/i });
    await expect(submitBtn).toBeEnabled();
  });

  test('submit button disabled with empty input', async ({ page }) => {
    await page.goto('/tr');
    const submitBtn = page.getByRole('button', { name: /gönder/i });
    await expect(submitBtn).toBeDisabled();
  });

  test('shows empty state when no messages', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.getByText('Henüz soru sorulmadı')).toBeVisible();
  });

  test('example chip submits a verse query', async ({ page }) => {
    await page.goto('/tr');
    await page.getByRole('button', { name: 'Fatiha 1:7', exact: true }).click();
    await expect(page.getByText(/connections found/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('tab', { name: 'Ayet' })).toBeVisible();
  });
});

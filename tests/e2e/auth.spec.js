import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('unauthenticated visitor sees sign-in form when accessing protected URL', async ({ page }) => {
    // Navigate to a protected URL
    const protectedUrl = '/invoices/3';
    await page.goto(protectedUrl);
    
    // Check that we see a sign-in form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Verify the URL remains unchanged
    expect(page.url()).toContain(protectedUrl);
    
    // Verify the form posts to the same URL
    const formAction = await page.locator('form').getAttribute('action');
    expect(formAction).toBe(protectedUrl);
  });

  test('authenticated user sees invoice details when accessing invoice URL', async ({ page }) => {
    // Navigate to a protected URL
    const invoiceId = 3;
    const protectedUrl = `/invoices/${invoiceId}`;
    await page.goto(protectedUrl);
    
    // Fill in the login form
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Verify we're still on the same URL
    expect(page.url()).toContain(protectedUrl);
    
    // Verify we see invoice details instead of the login form
    await expect(page.locator('form')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Invoice #3")')).toBeVisible();
    
    // Verify we see specific invoice details
    await expect(page.locator('.invoice-details')).toBeVisible();
    await expect(page.locator('.invoice-details')).toContainText(`Invoice #${invoiceId}`);
  });
});

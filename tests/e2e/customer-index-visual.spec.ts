import { expect, test } from '@playwright/test';

for (const locale of ['en', 'de'] as const) {
  for (const width of [390, 1440]) {
    test(`${locale} case study directory and menu at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale === 'en' ? '/customers' : '/de/kunden');
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${locale}-customers-${width}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
      const menu =
        width > 1100 ? page.locator('[data-nav-menu="solutions"]') : page.locator('.mobile-menu');
      await menu.locator('summary').click();
      await expect(
        menu.getByRole('link', {
          name: locale === 'en' ? 'All case studies' : 'Alle Fallstudien',
          exact: true,
        }),
      ).toBeInViewport();
      await expect(page).toHaveScreenshot(`${locale}-case-study-menu-${width}.png`, {
        animations: 'disabled',
      });
    });
  }
}

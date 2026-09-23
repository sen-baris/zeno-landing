import { expect, test } from '@playwright/test';

for (const locale of ['en', 'de']) {
  for (const width of [390, 768, 1101, 1280, 1440]) {
    test(`${locale} Resources header and footer at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale === 'en' ? '/pricing' : '/de/business-case');
      await expect(page.locator('.business-case-calculator')).toHaveAttribute(
        'data-hydrated',
        'true',
      );
      await page.evaluate(() => document.fonts.ready);
      if (width <= 1100) {
        await page.locator('.mobile-menu > summary').click();
        await page.locator('.mobile-resource-label').scrollIntoViewIfNeeded();
      } else {
        await page.locator('[data-nav-menu="resources"] summary').focus();
        await page.keyboard.press('Enter');
      }
      await expect(page).toHaveScreenshot(`resources-${locale}-${width}.png`, {
        animations: 'disabled',
      });
      await page.keyboard.press('Escape');
      await page.locator('.mobile-menu').evaluate((element) => element.removeAttribute('open'));
      const footer = page.locator('.site-footer');
      const footerHeight = await footer.evaluate((element) =>
        Math.ceil(element.getBoundingClientRect().height),
      );
      await page.setViewportSize({ width, height: footerHeight + 100 });
      await footer.evaluate((element) =>
        window.scrollTo({
          top: window.scrollY + element.getBoundingClientRect().top - 100,
          behavior: 'instant',
        }),
      );
      await expect(page.locator('.site-footer')).toHaveScreenshot(`footer-${locale}-${width}.png`, {
        animations: 'disabled',
      });
    });
  }
}

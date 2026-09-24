import { expect, test } from '@playwright/test';

for (const locale of ['en', 'de']) {
  for (const width of [390, 768, 1101, 1440]) {
    test(`${locale} homepage business-case figures at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale === 'de' ? '/de/' : '/');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.business-case-figures')).toHaveScreenshot(
        `home-business-case-${locale}-${width}.png`,
        { animations: 'disabled', maxDiffPixelRatio: 0.01 },
      );
    });
  }
}

import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
] as const;

for (const viewport of viewports) {
  test(`homepage product narrative at ${viewport.width}px`, async ({ page }) => {
    // Reduced motion is the deterministic composition: the reveal runtime never arms, so every
    // section is captured in its finished state regardless of what the screenshot scroll observed.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

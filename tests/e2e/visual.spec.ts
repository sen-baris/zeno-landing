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

    // A full-page screenshot is stitched from scrolled captures, and images still marked lazy below
    // the fold never decode in time for it — the baseline would otherwise bake in empty frames where
    // the photographs belong. Promote every image and wait for it to decode before capturing.
    await page.evaluate(async () => {
      for (const image of document.querySelectorAll('img')) image.loading = 'eager';
      await Promise.all(
        Array.from(document.images)
          .filter((image) => !image.complete)
          .map((image) => image.decode().catch(() => undefined)),
      );
    });

    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

// One industry page, since all five are the same template with different words in it.
test('solutions page at 1440px', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/solutions/private-equity');
  await page.evaluate(async () => {
    for (const image of document.querySelectorAll('img')) image.loading = 'eager';
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
  await expect(page).toHaveScreenshot('solutions-private-equity-1440.png', {
    animations: 'disabled',
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});

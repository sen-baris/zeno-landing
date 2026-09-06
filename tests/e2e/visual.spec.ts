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

/* Two industry pages, not one: they share a template but no longer share their screens, and
   between these two all four surfaces are covered. Private equity carries the result and the
   automation, M&A the workflow and the assistant. The wide and narrow pair also catches the
   changeover where the rows stop alternating and stack. */
for (const shot of [
  {
    name: 'solutions-private-equity-1440',
    path: '/solutions/private-equity',
    width: 1440,
    height: 1000,
  },
  { name: 'solutions-m-and-a-390', path: '/solutions/m-and-a', width: 390, height: 844 },
]) {
  test(`${shot.name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(shot.path);
    await page.evaluate(async () => {
      for (const image of document.querySelectorAll('img')) image.loading = 'eager';
      await Promise.all(
        Array.from(document.images)
          .filter((image) => !image.complete)
          .map((image) => image.decode().catch(() => undefined)),
      );
    });
    await expect(page).toHaveScreenshot(`${shot.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

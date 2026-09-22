import { expect, test } from '@playwright/test';

const routes = [
  ['home', '/de/'],
  ['product', '/de/produkt'],
  ['pricing', '/de/business-case'],
  ['demo', '/de/demo'],
  ['security', '/de/sicherheit'],
  ['solutions', '/de/loesungen'],
  ['manufacturing', '/de/loesungen/fertigung'],
  ['consulting', '/de/loesungen/unternehmensberatung'],
  ['ma', '/de/loesungen/ma'],
  ['pe', '/de/loesungen/private-equity'],
  ['legal', '/de/loesungen/recht'],
  ...['atares', 'b2venture', 'mahle', 'kbc'].map((slug) => [slug, `/de/kunden/${slug}`]),
];

for (const [name, route] of routes)
  for (const width of [390, 1440]) {
    test(`German ${name} complete composition at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(route!);
      if (name === 'pricing' || name === 'demo')
        await expect(page.locator('[data-hydrated]')).toHaveAttribute('data-hydrated', 'true');
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const image of document.images) image.loading = 'eager';
        await Promise.all([...document.images].map((image) => image.decode()));
      });
      await expect(page).toHaveScreenshot(`de-${name}-${width}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
      });
    });
  }

for (const [stage, progress] of [
  ['find', 0.05],
  ['build', 0.5],
  ['adopt', 0.95],
] as const) {
  test(`German pinned hero ${stage}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/de/');
    const journey = page.locator('[data-journey]');
    await expect(journey).toHaveAttribute('data-journey', 'on');
    await page.evaluate(() => document.fonts.ready);
    await journey.evaluate((element, progress) => {
      const rect = element.getBoundingClientRect();
      const scene = element.querySelector('.hj-layout')!.getBoundingClientRect();
      window.scrollTo({
        top: scrollY + rect.top - 76 + (rect.height - scene.height) * progress,
        behavior: 'instant',
      });
    }, progress);
    await expect(journey).toHaveAttribute('data-stage', stage);
    await expect
      .poll(async () => Math.round((await page.locator('.hj-layout').boundingBox())!.y))
      .toBe(76);
    await expect(page.locator('.hj-layout')).toHaveScreenshot(`de-hero-${stage}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
  });
}

for (const [stage, progress] of [
  ['launch', 0],
  ['return', 0.5],
  ['habit', 1],
] as const) {
  test(`German pinned adoption ${stage}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/de/');
    const journey = page.locator('[data-adoption-journey]');
    await expect(journey).toHaveAttribute('data-adoption-journey', 'on');
    await page.evaluate(() => document.fonts.ready);
    await journey.evaluate((element, progress) => {
      const rect = element.getBoundingClientRect();
      const scene = element.querySelector('.adoption-partnership-scene')!.getBoundingClientRect();
      window.scrollTo({
        top: scrollY + rect.top - 76 + (rect.height - scene.height) * progress,
        behavior: 'instant',
      });
    }, progress);
    await expect(journey).toHaveAttribute('data-stage', stage);
    await expect(page.locator('.adoption-partnership-scene')).toHaveScreenshot(
      `de-adoption-${stage}.png`,
      { animations: 'disabled', maxDiffPixelRatio: 0.01 },
    );
  });
}

for (const width of [390, 1440]) {
  test(`German customer preview and completed estimate at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/de/');
    const details = page.locator('[data-customer-proof-detail]').first();
    await details.locator('summary').click();
    await expect(details.locator('.customer-proof-panel')).toBeVisible();
    await expect(page.locator('#audience')).toHaveScreenshot(`de-customer-open-${width}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
    await page.goto('/de/business-case');
    await page.getByRole('checkbox', { name: 'Berichte erstellen' }).check();
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.getByRole('radio', { name: 'Etwa 4 Stunden' }).check();
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.getByRole('radio', { name: '11 bis 25', exact: true }).check();
    await page.getByRole('button', { name: 'Schätzung anzeigen' }).click();
    await expect(page.getByText('41.400 €', { exact: true })).toBeVisible();
    await expect(page.locator('.business-case-calculator')).toHaveScreenshot(
      `de-calculator-complete-${width}.png`,
      { animations: 'disabled', maxDiffPixelRatio: 0.01 },
    );
  });
}

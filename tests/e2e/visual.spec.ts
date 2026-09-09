import { expect, test, type Locator, type Page } from '@playwright/test';

const expectSectionScreenshot = async (page: Page, section: Locator, snapshotName: string) => {
  const size = await section.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      height: Math.ceil(bounds.height),
      width: Math.round(bounds.width),
    };
  });

  await page.setViewportSize(size);
  await section.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + bounds.top,
      behavior: 'instant',
    });
  });
  await expect
    .poll(() => section.evaluate((element) => Math.abs(element.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(1);
  await expect(page).toHaveScreenshot(snapshotName, {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
};

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

test('desktop homepage starting path message', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.locator('.hero-intro')).toHaveScreenshot('home-hero-intro-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

for (const viewport of viewports) {
  test(`product narrative at ${viewport.width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/product');

    await expect(page).toHaveScreenshot(`product-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

test('desktop enterprise platform overview', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/product');
  await expect(page.locator('.product-intro')).toHaveScreenshot(
    'product-enterprise-overview-1440.png',
    {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    },
  );
});

test('desktop governance and adoption overview', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/product');
  const governance = page.locator('.product-governance');
  await governance.scrollIntoViewIfNeeded();
  await expect(governance).toHaveScreenshot('product-governance-overview-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

test('desktop hero adoption journey at each active stage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  const journey = page.locator('.hero-journey');
  const visual = journey.locator('.hj-visual');
  const scene = journey.locator('.hj-layout');
  await expect(journey).toHaveAttribute('data-journey', 'on');
  await expect
    .poll(() =>
      visual
        .locator('img')
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true);

  for (const stage of ['find', 'build', 'adopt'] as const) {
    const targetProgress = { find: 0.08, build: 0.5, adopt: 0.88 }[stage];
    await page.evaluate((progress) => {
      const journey = document.querySelector<HTMLElement>('.hero-journey');
      const scene = journey?.querySelector<HTMLElement>('.hj-layout');
      if (!journey || !scene) throw new Error('Missing hero scroll scene');
      const journeyRect = journey.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
      const journeyTop = window.scrollY + journeyRect.top;
      const travel = journeyRect.height - sceneRect.height;
      window.scrollTo({
        top: journeyTop - stickyTop + travel * progress,
        behavior: 'instant',
      });
    }, targetProgress);
    await expect(journey).toHaveAttribute('data-stage', stage);
    await expect(scene).toHaveScreenshot(`home-hero-${stage}-1440.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
  }
});

test('desktop post-launch adoption chart at each scroll stage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const journey = page.locator('.adoption-partnership-story');
  const scene = journey.locator('.adoption-partnership-scene');
  await expect(journey).toHaveAttribute('data-adoption-journey', 'on');

  for (const stage of ['launch', 'return', 'habit'] as const) {
    const targetProgress = { launch: 0.08, return: 0.5, habit: 0.88 }[stage];
    await page.evaluate((progress) => {
      const journey = document.querySelector<HTMLElement>('.adoption-partnership-story');
      const scene = journey?.querySelector<HTMLElement>('.adoption-partnership-scene');
      if (!journey || !scene) throw new Error('Missing adoption scroll scene');
      const journeyRect = journey.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const stickyTop = Number.parseFloat(getComputedStyle(scene).top) || 0;
      const journeyTop = window.scrollY + journeyRect.top;
      const travel = journeyRect.height - sceneRect.height;
      window.scrollTo({
        top: journeyTop - stickyTop + travel * progress,
        behavior: 'instant',
      });
    }, targetProgress);
    await expect(journey).toHaveAttribute('data-stage', stage);
    await expect(scene).toHaveScreenshot(`home-adoption-${stage}-1440.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    });
  }
});

test('customer proof grid when collapsed, hovered, and pinned', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const proof = page.locator('#audience');

  await expect(proof).toHaveScreenshot('home-customer-proof-collapsed-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });

  const atares = proof.locator('[data-logo="customer-logo-atares"] summary');
  await atares.locator('.customer-proof-control').hover();
  await expect(proof).toHaveScreenshot('home-customer-proof-hovered-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });

  await atares.click();
  await expect(proof).toHaveScreenshot('home-customer-proof-expanded-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

test('desktop vision keeps the photograph with its statement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const vision = page.locator('#vision');
  await vision.scrollIntoViewIfNeeded();
  await expectSectionScreenshot(page, vision, 'home-vision-1440.png');
});

test('mobile customer proof opens inline beneath its logo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const proof = page.locator('#audience');
  await proof.locator('[data-logo="customer-logo-atares"] summary').click();
  await page.addStyleTag({
    content: '.site-header, .skip-link { visibility: hidden !important; }',
  });
  await expectSectionScreenshot(page, proof, 'home-customer-proof-open-390.png');
});

for (const shot of [
  { name: 'customer-atares-1440', width: 1440, height: 1000 },
  { name: 'customer-atares-390', width: 390, height: 844 },
]) {
  test(`${shot.name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto('/customers/atares');
    await expect(page).toHaveScreenshot(`${shot.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
    await expect(page.locator('.customer-story-hero')).toHaveScreenshot(
      `customer-atares-hero-${shot.width}.png`,
      {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
      },
    );
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

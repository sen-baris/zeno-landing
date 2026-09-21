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

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
] as const) {
  test(`security page at ${viewport.width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/security');

    await expect(page).toHaveScreenshot(`security-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
] as const) {
  test(`privacy policy first view at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/privacy-policy');

    await expect(page).toHaveScreenshot(`privacy-policy-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: false,
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

for (const viewport of viewports) {
  test(`enterprise pricing at ${viewport.width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/pricing');
    const calculator = page.locator('.business-case-calculator');
    await calculator.scrollIntoViewIfNeeded();
    await expect(calculator).toHaveAttribute('data-hydrated', 'true');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    await expect(page).toHaveScreenshot(`pricing-${viewport.name}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}

test('desktop pricing navigation alignment', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await expect(page.locator('.business-case-calculator')).toHaveAttribute('data-hydrated', 'true');
  await page.locator('.nav-menu > summary').focus();
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', {
      name: 'Calculate business case',
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.locator('.site-header')).toHaveScreenshot('pricing-navigation-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

test('mobile pricing navigation actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/pricing');
  await expect(page.locator('.business-case-calculator')).toHaveAttribute('data-hydrated', 'true');
  await page.locator('.mobile-menu > summary').click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', {
      name: 'Calculate business case',
      exact: true,
    }),
  ).toBeVisible();

  await expect(page).toHaveScreenshot('pricing-navigation-mobile-390.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

test('desktop completed business-case calculator', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/pricing');
  const calculator = page.locator('.business-case-calculator');
  await calculator.scrollIntoViewIfNeeded();
  await expect(calculator).toHaveAttribute('data-hydrated', 'true');
  await page.getByRole('checkbox', { name: 'Report generation' }).check();
  await page.getByRole('checkbox', { name: 'Presentation creation' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: 'About 4 hours' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '11 to 25' }).check();
  await page.getByRole('button', { name: 'See estimate' }).click();
  await expect(page.getByText('€41,400', { exact: true })).toBeVisible();

  await expect(calculator).toHaveScreenshot('pricing-calculator-complete-1440.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

test('mobile completed business-case calculator', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/pricing');
  const calculator = page.locator('.business-case-calculator');
  await calculator.scrollIntoViewIfNeeded();
  await expect(calculator).toHaveAttribute('data-hydrated', 'true');
  await page.getByRole('checkbox', { name: 'Report generation' }).check();
  await page.getByRole('checkbox', { name: 'Presentation creation' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: 'About 4 hours' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '11 to 25' }).check();
  await page.getByRole('button', { name: 'See estimate' }).click();
  await expect(page.getByText('€41,400', { exact: true })).toBeVisible();

  await expect(calculator).toHaveScreenshot('pricing-calculator-complete-390.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

for (const viewport of viewports) {
  test(`demo request at ${viewport.width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/demo');
    await expect(page.locator('.demo-form')).toHaveAttribute('data-hydrated', 'true');

    await expect(page).toHaveScreenshot(`demo-${viewport.name}.png`, {
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

test('mobile vision and final business-case action stay readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expectSectionScreenshot(page, page.locator('#vision'), 'home-vision-390.png');
  await expectSectionScreenshot(page, page.locator('.conversion'), 'home-conversion-390.png');
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

/* Every industry carries different context, proof, and a different leading product scene. The
   desktop set protects those distinctions, while M&A and legal cover the dense mobile metric and
   quote variants. */
for (const shot of [
  {
    name: 'solutions-manufacturing-1440',
    path: '/solutions/manufacturing',
    width: 1440,
    height: 1000,
  },
  {
    name: 'solutions-management-consulting-1440',
    path: '/solutions/management-consulting',
    width: 1440,
    height: 1000,
  },
  {
    name: 'solutions-m-and-a-1440',
    path: '/solutions/m-and-a',
    width: 1440,
    height: 1000,
  },
  {
    name: 'solutions-private-equity-1440',
    path: '/solutions/private-equity',
    width: 1440,
    height: 1000,
  },
  { name: 'solutions-legal-1440', path: '/solutions/legal', width: 1440, height: 1000 },
  { name: 'solutions-m-and-a-390', path: '/solutions/m-and-a', width: 390, height: 844 },
  { name: 'solutions-legal-390', path: '/solutions/legal', width: 390, height: 844 },
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
    if (shot.width >= 1101) {
      await expect(page.locator('.solution-workspace-frame')).toHaveScreenshot(
        `${shot.name}-workspace.png`,
        {
          animations: 'disabled',
          maxDiffPixelRatio: 0.01,
        },
      );
    }
  });
}

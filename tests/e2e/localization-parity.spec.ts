import { expect, test, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { germanPageCopy } from '../../src/lib/i18n/page-copy';

const pairs = [
  ['/', '/de/'],
  ['/product', '/de/produkt'],
  ['/pricing', '/de/business-case'],
  ['/demo', '/de/demo'],
  ['/security', '/de/sicherheit'],
  ['/solutions', '/de/loesungen'],
  ['/customers', '/de/kunden'],
  ['/solutions/manufacturing', '/de/loesungen/fertigung'],
  ['/solutions/management-consulting', '/de/loesungen/unternehmensberatung'],
  ['/solutions/m-and-a', '/de/loesungen/ma'],
  ['/solutions/private-equity', '/de/loesungen/private-equity'],
  ['/solutions/legal', '/de/loesungen/recht'],
  ...['atares', 'b2venture', 'mahle', 'kbc'].map((slug) => [
    `/customers/${slug}`,
    `/de/kunden/${slug}`,
  ]),
];

for (const [english, german] of pairs) {
  test(`${german} preserves the English sections, figures and conversion paths`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(english!);
    const metadata = () =>
      page.locator('head').evaluate((head) => ({
        canonical: head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        alternates: [...head.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => ({
          language: link.getAttribute('hreflang'),
          url: link.getAttribute('href'),
        })),
      }));
    const englishMetadata = await metadata();
    expect(englishMetadata.canonical).toBe(`https://heyzeno.com${english}`);
    expect(englishMetadata.alternates).toEqual([
      { language: 'en', url: `https://heyzeno.com${english}` },
      { language: 'de', url: `https://heyzeno.com${german}` },
      { language: 'x-default', url: `https://heyzeno.com${english}` },
    ]);
    if (english === '/demo' || english === '/pricing')
      await expect(page.locator('[data-hydrated]')).toHaveAttribute('data-hydrated', 'true');
    const structure = () =>
      page.locator('main').evaluate((main) => ({
        sections: [...main.querySelectorAll('section[id], section[aria-labelledby]')].map(
          (section) => section.id || section.getAttribute('aria-labelledby'),
        ),
        figures: main.querySelectorAll('figure').length,
        disclosures: main.querySelectorAll('details').length,
        images: [...main.querySelectorAll('img')].map((image) => image.getAttribute('src')),
        articleSections: main.querySelectorAll('.customer-story-article-section').length,
        paragraphs: main.querySelectorAll('p').length,
        links: [...main.querySelectorAll('a[href]')].map((link) => link.getAttribute('href')),
      }));
    const expected = await structure();
    await page.goto(german!);
    if (english === '/demo' || english === '/pricing')
      await expect(page.locator('[data-hydrated]')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    expect(await metadata()).toEqual({
      canonical: `https://heyzeno.com${german}`,
      alternates: englishMetadata.alternates,
    });
    expect(await structure()).toEqual({
      ...expected,
      links: expected.links.map((link) => {
        const [path, fragment] = link!.split('#');
        return (
          (pairs.find(([englishPath]) => englishPath === path)?.[1] ?? path) +
          (fragment === undefined ? '' : `#${fragment}`)
        );
      }),
    });
    const untranslated = await page.locator('main').evaluate((main, catalog) => {
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      const missing = new Set<string>();
      while (walker.nextNode()) {
        if (walker.currentNode.parentElement?.closest('script, style, [lang="en"]')) continue;
        const value = walker.currentNode.textContent!.replace(/\s+/g, ' ').trim();
        if (Object.hasOwn(catalog, value) && catalog[value] !== value) missing.add(value);
      }
      return [...missing];
    }, germanPageCopy);
    expect(untranslated).toEqual([]);
    if (english?.startsWith('/customers/')) expect(expected.articleSections).toBe(5);
    if (english === '/solutions/private-equity') {
      await expect(page.locator('main')).toContainText(
        'Beispiel aus einem Venture-Capital-Investmentteam',
      );
    }
    const demoLinks = page.locator('main a[href="/de/demo"]');
    if (english !== '/demo') expect(await demoLinks.count()).toBeGreaterThan(0);
  });
}

test('German homepage retains both complete scroll stories', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/de/');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-journey', 'on');
  await expect(page.locator('[data-story-step]')).toHaveCount(3);
  await expect(page.locator('[data-adoption-journey]')).toHaveAttribute(
    'data-adoption-journey',
    'on',
  );
  await expect(page.locator('[data-adoption-stage]')).toHaveCount(3);
  await expect(page.locator('[data-logo]')).toHaveCount(8);
  await expect(page.locator('#vision')).toBeAttached();
});

test('German footer labels keep the shared compact type scale', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const labelSizes = () =>
    page
      .locator('footer h2')
      .evaluateAll((headings) => headings.map((heading) => getComputedStyle(heading).fontSize));
  await page.goto('/');
  const englishSizes = await labelSizes();
  expect(englishSizes).toHaveLength(4);
  await page.goto('/de/');
  expect(await labelSizes()).toEqual(englishSizes);
});

test('German display headings do not split short words into tiny fragments', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/de/loesungen/ma');
  await page.evaluate(() => document.fonts.ready);
  const lines = await page.locator('h1').evaluate((heading) => {
    const text = heading.firstChild!;
    const start = text.textContent!.indexOf('Urteil');
    const range = document.createRange();
    range.setStart(text, start);
    range.setEnd(text, start + 'Urteil'.length);
    return new Set([...range.getClientRects()].map((rect) => Math.round(rect.y))).size;
  });
  expect(lines).toBe(1);
});

async function scrollProgress(journey: Locator, sceneSelector: string, progress: number) {
  await journey.page().evaluate(async () => {
    let previous = scrollY;
    let stableFrames = 0;
    while (stableFrames < 4) {
      await new Promise(requestAnimationFrame);
      stableFrames = Math.abs(scrollY - previous) < 0.5 ? stableFrames + 1 : 0;
      previous = scrollY;
    }
  });
  await journey.evaluate(
    (element, { sceneSelector, progress }) => {
      const scene = element.querySelector(sceneSelector)!;
      const track = element.getBoundingClientRect();
      const height = scene.getBoundingClientRect().height;
      window.scrollTo({
        top: scrollY + track.top - 76 + (track.height - height) * progress,
        behavior: 'instant',
      });
    },
    { sceneSelector, progress },
  );
}

for (const route of ['/', '/de/']) {
  test(`${route} pinned journeys reverse, resize and fall back for enlarged text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator('[data-journey]');
    const adoption = page.locator('[data-adoption-journey]');
    await expect(hero).toHaveAttribute('data-journey', 'on');
    await expect(adoption).toHaveAttribute('data-adoption-journey', 'on');
    for (const [stage, progress] of [
      ['find', 0.05],
      ['build', 0.5],
      ['adopt', 0.95],
      ['build', 0.5],
      ['find', 0.05],
    ] as const) {
      await scrollProgress(hero, '.hj-layout', progress);
      await expect(hero).toHaveAttribute('data-stage', stage);
      await expect(hero.locator('[data-stage-panel][data-current]')).toHaveAttribute(
        'data-stage-panel',
        stage,
      );
      await expect
        .poll(async () => Math.round((await hero.locator('.hj-layout').boundingBox())!.y))
        .toBe(76);
    }
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await expect(hero).toHaveAttribute('data-stage', /build|adopt/);
    for (const [stage, progress] of [
      ['launch', 0],
      ['return', 0.5],
      ['habit', 1],
      ['return', 0.5],
      ['launch', 0],
    ] as const) {
      await scrollProgress(adoption, '.adoption-partnership-scene', progress);
      await expect(adoption).toHaveAttribute('data-stage', stage);
      await expect(adoption.locator('[data-partner-action][data-current]')).toHaveAttribute(
        'data-partner-action',
        stage,
      );
      await expect
        .poll(async () =>
          Math.abs((await adoption.locator('.adoption-partnership-scene').boundingBox())!.y - 76),
        )
        .toBeLessThanOrEqual(1);
      if (progress === 1)
        await expect(adoption.locator('[data-adoption-curve-clip]')).toHaveAttribute(
          'width',
          '1200',
        );
    }
    for (const [width, height, state] of [
      [1100, 900, 'static'],
      [1101, 900, 'on'],
      [1440, 719, 'static'],
      [1440, 720, 'on'],
      [1101, 720, 'on'],
    ] as const) {
      await page.setViewportSize({ width, height });
      await expect(hero).toHaveAttribute('data-journey', state);
      await expect(adoption).toHaveAttribute('data-adoption-journey', state);
    }
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await expect(hero).toHaveAttribute('data-journey', 'static');
    await expect(adoption).toHaveAttribute('data-adoption-journey', 'static');
    await expect(adoption.locator('[data-adoption-curve-clip]')).toHaveAttribute('width', '1200');
    for (const panel of await hero.locator('[data-stage-panel]').all())
      await expect(panel).toBeVisible();
  });

  test(`${route} customer previews and security disclosures work by keyboard`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const details = page.locator('[data-customer-proof-detail]').first();
    await details.locator('.customer-proof-control').hover();
    await expect(details).toHaveAttribute('open', '');
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('data-preview-state', 'pinned');
    await page.keyboard.press('Escape');
    await expect(details).not.toHaveAttribute('open', '');
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('data-preview-state', 'pinned');
    await expect(details.locator('.customer-proof-link')).toHaveAttribute(
      'href',
      route === '/' ? '/customers/atares' : '/de/kunden/atares',
    );
    await page.goto(route === '/' ? '/security' : '/de/sicherheit');
    const faq = page.locator('main details').first();
    await faq.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(faq).toHaveAttribute('open', '');
    await page.keyboard.press('Enter');
    await expect(faq).not.toHaveAttribute('open', '');
    await page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => undefined)),
      );
    });
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

for (const width of [390, 768, 1101, 1440]) {
  test(`all page pairs reflow with readable German headings at ${width}px`, async ({ page }) => {
    test.slow();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of pairs.flat()) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.site-footer')).toBeAttached();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        route,
      ).toBe(true);
      const outside = await page.locator('main h1, main h2, main h3').evaluateAll((headings) =>
        headings
          .filter((heading) => {
            const rect = heading.getBoundingClientRect();
            return (
              !heading.classList.contains('visually-hidden') &&
              rect.width > 0 &&
              (rect.left < -1 ||
                rect.right > innerWidth + 1 ||
                heading.scrollWidth > heading.clientWidth + 1)
            );
          })
          .map((heading) => heading.textContent),
      );
      expect(outside, route).toEqual([]);
      if (route.startsWith('/de/'))
        await expect(page.locator('h1')).not.toHaveCSS('overflow-wrap', 'anywhere');
    }
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
]) {
  test(`both conversion forms start within the first ${viewport.width}px view`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    for (const route of ['/pricing', '/de/business-case', '/demo', '/de/demo']) {
      await page.goto(route);
      await expect(page.locator('[data-hydrated]')).toHaveAttribute('data-hydrated', 'true');
      const control = page.locator('main input').first();
      const choice = page
        .locator('main label')
        .filter({ has: page.getByRole('checkbox') })
        .first();
      const target = route.endsWith('/demo') ? control : choice;
      const bounds = await target.boundingBox();
      expect(bounds!.y + bounds!.height, route).toBeLessThan(viewport.height);
      await expect(target).toBeVisible();
      await expect(control).toBeEnabled();
    }
  });
}

for (const width of [390, 1440]) {
  test(`German pages keep all content reachable at 200 percent text and ${width}px`, async ({
    page,
  }) => {
    test.slow();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    for (const [, route] of pairs) {
      await page.goto(route!);
      await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        route,
      ).toBe(true);
      await expect(page.locator('.site-footer')).toBeAttached();
    }
  });
}

test('German forms retain local calculations and gateway failure recovery', async ({ page }) => {
  // Two hydrated journeys plus a gateway failure and retry across all three browser engines.
  test.slow();
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') writes.push(request.url());
  });
  await page.goto('/de/business-case');
  await page.getByRole('checkbox', { name: 'Berichte erstellen' }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('radio', { name: 'Etwa 4 Stunden' }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('radio', { name: '11 bis 25', exact: true }).check();
  await page.getByRole('button', { name: 'Schätzung anzeigen' }).click();
  await expect(page.getByText('41.400 €', { exact: true })).toBeVisible();
  await expect(page.locator('.business-case-calculator')).toContainText('angezeigten Annahmen');
  expect(writes).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      search: location.search,
      hash: location.hash,
    })),
  ).toEqual({ local: 0, session: 0, search: '', hash: '' });
  let attempts = 0;
  await page.route('**/api/leads', async (route) => {
    attempts++;
    expect(route.request().postDataJSON()).toMatchObject({ consent: { marketing: false } });
    await route.fulfill(
      attempts === 1
        ? { status: 503, body: '' }
        : {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ submissionId: 'de-parity-fixture' }),
          },
    );
  });
  await page.goto('/de/demo');
  await page.getByRole('button', { name: 'Demo anfragen' }).click();
  await expect(page.getByLabel('Vollständiger Name')).toBeFocused();
  await page.getByLabel('Vollständiger Name').fill('Test Person');
  await page.getByLabel('Geschäftliche E-Mail-Adresse').fill('qa@example.com');
  await page.getByLabel('Unternehmen', { exact: true }).fill('Example GmbH');
  await page.locator('#demo-privacyAcknowledged').check();
  await page.getByRole('button', { name: 'Demo anfragen' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'Erneut versuchen' }).click();
  await expect(page.getByRole('status')).toContainText('bestätigt');
  expect(attempts).toBe(2);
});

test('all German pages remain complete without JavaScript', async ({ browser }) => {
  test.slow();
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const [, route] of pairs) {
    await page.goto(new URL(route!, test.info().project.use.baseURL).href);
    await expect(page.locator('.site-footer')).toBeAttached();
    await expect(page.locator('h1')).toBeVisible();
  }
  await page.goto(new URL('/de/', test.info().project.use.baseURL).href);
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-journey', 'static');
  await expect(page.locator('[data-adoption-curve-clip]')).toHaveAttribute('width', '1200');
  const disclosure = page.locator('[data-customer-proof-detail]').first();
  await disclosure.locator('summary').click();
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure.locator('a')).toBeVisible();
  await context.close();
});

for (const width of [390, 1440]) {
  test(`all German pages expose accessible content at ${width}px`, async ({ page }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [, route] of pairs) {
      await page.goto(route!);
      await page.evaluate(() => document.fonts.ready);
      if (await page.locator('[data-hydrated]').count())
        await expect(page.locator('[data-hydrated]')).toHaveAttribute('data-hydrated', 'true');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations, route).toEqual([]);
    }
  });
}

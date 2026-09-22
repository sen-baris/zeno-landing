import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('published language switcher lives in the footer and preserves the current page', async ({
  page,
}) => {
  await page.goto('/product');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/product',
  );
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/product',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/de/produkt',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/product',
  );
  await expect(
    page.locator('.site-header').getByRole('navigation', { name: 'Language' }),
  ).toHaveCount(0);
  const englishSwitcher = page.locator('.site-footer').getByRole('navigation', {
    name: 'Language',
  });
  await expect(englishSwitcher.locator('.footer-locale-separator')).toHaveText('/');
  await expect(englishSwitcher.getByRole('link', { name: 'English' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(englishSwitcher.getByRole('link', { name: 'Deutsch' })).toHaveAttribute(
    'href',
    '/de/produkt',
  );
  await expect(page.getByText(/English \/ V1 preview/i)).toHaveCount(0);

  await page.goto('/de/produkt');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/de/produkt',
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Enterprise AI im Unternehmenskontext.',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(3);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/product',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/de/produkt',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/product',
  );
  await expect(
    page.locator('.site-header').getByRole('navigation', { name: 'Sprache' }),
  ).toHaveCount(0);
  const germanSwitcher = page.locator('.site-footer').getByRole('navigation', { name: 'Sprache' });
  await expect(germanSwitcher.getByRole('link', { name: 'English' })).toHaveAttribute(
    'href',
    '/product',
  );
  await expect(germanSwitcher.getByRole('link', { name: 'Deutsch' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByText(/Deutsch \/ Vorschau/i)).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Datenschutz (Englisch)', exact: true }),
  ).toHaveAttribute('href', '/privacy-policy');
  await expect(
    page.getByRole('link', { name: 'Nutzungsbedingungen (Englisch)', exact: true }),
  ).toHaveAttribute('href', '/terms-of-service');
  await expect(
    page.getByRole('link', { name: 'Impressum (Englisch)', exact: true }),
  ).toHaveAttribute('href', '/imprint');
  expect(
    await page.evaluate(() => ({
      local: window.localStorage.length,
      session: window.sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
});

test('localized solution and customer links stay in the German route tree', async ({ page }) => {
  await page.goto('/de/loesungen/fertigung');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('link', { name: 'Produkt' }).first()).toHaveAttribute(
    'href',
    '/de/produkt',
  );

  await page.goto('/de/kunden/atares');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('link', { name: 'English', exact: true })).toHaveAttribute(
    'href',
    '/customers/atares',
  );
  await expect(page.locator('figure[lang="en"] blockquote')).toHaveCount(1);
});

test('browser language never redirects a direct English visit', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'de-DE' });
  const page = await context.newPage();
  await page.goto(new URL('/product', test.info().project.use.baseURL).toString());

  await expect(page).toHaveURL(/\/product$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await context.cookies()).toEqual([]);
  await context.close();
});

test('footer language switching remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL('/de/produkt', test.info().project.use.baseURL).toString());

  const switcher = page.locator('.site-footer').getByRole('navigation', { name: 'Sprache' });
  await expect(switcher.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/product');
  await expect(switcher.getByRole('link', { name: 'Deutsch' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await context.close();
});

test('held German legal routes do not exist or advertise an alternate', async ({ page }) => {
  const privacy = await page.request.get('/de/datenschutz');
  expect(privacy.status()).toBe(404);

  await page.goto('/privacy-policy');
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Language' })).toHaveCount(0);
});

test('sitemap includes published German routes and never duplicates hreflang in XML', async ({
  page,
}) => {
  const response = await page.request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const sitemap = await response.text();

  expect(sitemap).toContain('<loc>https://heyzeno.com/product</loc>');
  expect(sitemap).toContain('<loc>https://heyzeno.com/de/produkt</loc>');
  expect(sitemap).toContain('<loc>https://heyzeno.com/de/loesungen/fertigung</loc>');
  expect(sitemap).not.toContain('hreflang');
  expect(sitemap).not.toContain('/ai-readiness');
});

test('all published German routes render directly', async ({ page }) => {
  const paths = [
    '/de/',
    '/de/produkt',
    '/de/business-case',
    '/de/sicherheit',
    '/de/demo',
    '/de/loesungen',
    '/de/loesungen/fertigung',
    '/de/loesungen/unternehmensberatung',
    '/de/loesungen/ma',
    '/de/loesungen/private-equity',
    '/de/loesungen/recht',
    '/de/kunden/atares',
    '/de/kunden/b2venture',
    '/de/kunden/mahle',
    '/de/kunden/kbc',
  ];

  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  }
});

test('German calculator and demo form expose localized interaction states', async ({ page }) => {
  await page.goto('/de/business-case');
  const calculator = page.locator('.business-case-calculator');
  await expect(calculator).toHaveAttribute('data-hydrated', 'true');
  await calculator.getByRole('checkbox', { name: 'Berichte erstellen' }).check();
  await calculator.getByRole('button', { name: 'Weiter' }).click();
  await calculator.getByRole('radio', { name: 'Etwa 4 Stunden' }).check();
  await calculator.getByRole('button', { name: 'Weiter' }).click();
  await calculator.getByRole('radio', { name: '11 bis 25' }).check();
  await calculator.getByRole('button', { name: 'Schätzung anzeigen' }).click();

  await expect(
    calculator.getByRole('heading', { name: 'Was das Team zurückgewinnen kann' }),
  ).toBeVisible();
  await expect(calculator.getByText('41.400 €', { exact: true })).toBeVisible();

  await page.goto('/de/demo');
  const demoForm = page.locator('.demo-form');
  await expect(demoForm).toHaveAttribute('data-hydrated', 'true');
  await demoForm.getByRole('button', { name: 'Demo anfragen' }).click();
  await expect(demoForm.getByText('Vollständigen Namen eingeben.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Vollständiger Name')).toBeFocused();
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1101, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`German navigation and content reflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/de/produkt');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);

    if (viewport.width <= 1100) {
      await page.locator('.mobile-menu > summary').click();
      await expect(page.getByRole('link', { name: 'Business Case berechnen' })).toBeVisible();
      await expect(page.locator('.mobile-menu').getByRole('link', { name: 'English' })).toHaveCount(
        0,
      );
    }
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await expect(
      page.locator('.site-footer').getByRole('navigation', { name: 'Sprache' }),
    ).toBeVisible();
  });
}

test('German footer and language switcher reflow at 200 percent text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/de/produkt');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.locator('.site-footer').scrollIntoViewIfNeeded();

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
  await expect(
    page.locator('.site-footer').getByRole('navigation', { name: 'Sprache' }),
  ).toBeVisible();
});

test('published German product page has no automatically detectable WCAG A or AA violations', async ({
  page,
}) => {
  await page.goto('/de/produkt');
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

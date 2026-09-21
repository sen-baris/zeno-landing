import { expect, test } from '@playwright/test';

test('German preview routes preserve the current page in the review language switcher', async ({
  page,
}) => {
  await page.goto('/product');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/product',
  );
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Language' })).toHaveCount(0);

  await page.goto('/de/produkt');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://heyzeno.com/de/produkt',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Enterprise AI für Ihr Unternehmen.',
  );
  const switcher = page.getByRole('navigation', { name: 'Sprache' });
  await expect(switcher.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute(
    'href',
    '/product',
  );
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
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute(
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

test('held German legal routes do not exist or advertise an alternate', async ({ page }) => {
  const privacy = await page.request.get('/de/datenschutz');
  expect(privacy.status()).toBe(404);

  await page.goto('/privacy-policy');
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Language' })).toHaveCount(0);
});

test('preview sitemap excludes German drafts and never duplicates hreflang in XML', async ({
  page,
}) => {
  const response = await page.request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const sitemap = await response.text();

  expect(sitemap).toContain('<loc>https://heyzeno.com/product</loc>');
  expect(sitemap).not.toContain('/de/');
  expect(sitemap).not.toContain('hreflang');
  expect(sitemap).not.toContain('/ai-readiness');
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
      await expect(page.getByRole('link', { name: 'English' })).toBeVisible();
    } else {
      await expect(page.getByRole('navigation', { name: 'Sprache' })).toBeVisible();
    }
  });
}

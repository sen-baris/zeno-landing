import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const documents = [
  {
    path: '/privacy-policy',
    title: 'TextCortex Privacy Policy',
    revised: 'Last Revised : September 2, 2026',
    firstHeading: 'Privacy Policy',
    finalText:
      'By adhering to these measures, we can guarantee the security and integrity of your data, providing peace of mind for our enterprise clients.',
  },
  {
    path: '/terms-of-service',
    title: 'TextCortex Terms of Service',
    revised: 'Last Revised : April 2, 2025',
    firstHeading: 'Introduction',
    finalText: 'Germany',
  },
  {
    path: '/imprint',
    title: 'TextCortex AI Imprint',
    revised: null,
    firstHeading: 'Information in accordance with § 5 Telemedia Act (TMG)',
    finalText:
      'We hereby expressly prohibit the use of contact data published in the context of website legal notice requirements with regard to sending promotional and informational materials not expressly requested. The website operator reserves the right to take specific legal action if unsolicited advertising material, such as email spam, is received.',
  },
] as const;

test('the footer exposes all local legal routes', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('navigation', { name: 'Footer navigation' });

  for (const groupName of ['Explore', 'Company', 'Legal']) {
    await expect(
      footer.getByRole('heading', { name: groupName, exact: true, level: 2 }),
    ).toBeVisible();
  }

  for (const legalDocument of documents) {
    const label =
      legalDocument.path === '/privacy-policy'
        ? 'Privacy policy'
        : legalDocument.path === '/terms-of-service'
          ? 'Terms of service'
          : 'Imprint';
    await expect(footer.getByRole('link', { name: label, exact: true })).toHaveAttribute(
      'href',
      new RegExp(`${legalDocument.path}$`),
    );
  }
});

for (const legalDocument of documents) {
  test(`${legalDocument.path} renders the approved legal document and metadata`, async ({
    page,
  }) => {
    await page.goto(legalDocument.path);

    await expect(page.getByRole('heading', { level: 1, name: legalDocument.title })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: legalDocument.firstHeading, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(legalDocument.finalText, { exact: true }).last()).toBeVisible();
    if (legalDocument.revised) {
      await expect(page.getByText(legalDocument.revised, { exact: true })).toBeVisible();
    }

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`${legalDocument.path}$`),
    );
    await expect(page.locator('main script')).toHaveCount(0);
    await expect(page.locator('main iframe, main form')).toHaveCount(0);
  });
}

test('the Security privacy record opens the local policy', async ({ page }) => {
  await page.goto('/security');
  const privacy = page.getByRole('link', { name: 'Review privacy policy', exact: true });
  await expect(privacy).toHaveAttribute('href', /\/privacy-policy$/);
  await expect(privacy).not.toHaveAttribute('target', '_blank');
});

test('the sitemap includes every legal route', async ({ page }) => {
  const response = await page.request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const sitemap = await response.text();
  for (const legalDocument of documents) {
    expect(sitemap).toContain(`${legalDocument.path}</loc>`);
  }
});

test('all legal documents remain complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const legalDocument of documents) {
    await page.goto(new URL(legalDocument.path, test.info().project.use.baseURL).toString());
    await expect(page.getByRole('heading', { level: 1, name: legalDocument.title })).toBeVisible();
    await expect(page.getByText(legalDocument.finalText, { exact: true }).last()).toBeVisible();
  }

  await context.close();
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1101, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`legal documents reflow without horizontal overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    for (const legalDocument of documents) {
      await page.goto(legalDocument.path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        legalDocument.path,
      ).toBe(true);
    }
  });
}

test('the longest legal page supports 200 percent text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy-policy');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
  await expect(page.getByRole('heading', { name: 'TextCortex Privacy Policy' })).toBeVisible();
});

test('the legal documents have no automatically detectable accessibility violations', async ({
  page,
}) => {
  for (const legalDocument of documents) {
    await page.goto(legalDocument.path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, legalDocument.path).toEqual([]);
  }
});

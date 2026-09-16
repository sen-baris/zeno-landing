import { expect, test } from '@playwright/test';

const securityTitle = 'Scale AI without giving up control.';
const trustCenterUrl = 'https://trust.textcortex.com/home';

test('Security replaces Trust in site navigation and opens the dedicated route', async ({
  page,
}) => {
  await page.goto('/');

  const primary = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(primary.getByRole('link', { name: 'Trust', exact: true })).toHaveCount(0);
  await expect(primary.getByRole('link', { name: 'Security', exact: true })).toHaveAttribute(
    'href',
    /\/security$/,
  );

  await primary.getByRole('link', { name: 'Security', exact: true }).click();
  await expect(page).toHaveURL(/\/security$/);
  await expect(page.getByRole('heading', { name: securityTitle })).toBeVisible();

  await expect(
    page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', {
      name: 'Security',
      exact: true,
    }),
  ).toHaveAttribute('href', /\/security$/);
});

test('the mobile menu exposes Security as a real page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menu = page.locator('.mobile-menu');
  await page.getByLabel(/Menu.*open navigation/i).click();
  await menu.getByRole('link', { name: 'Security', exact: true }).click();

  await expect(page).toHaveURL(/\/security$/);
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.getByRole('heading', { name: securityTitle })).toBeVisible();
});

test('the homepage trust anchor remains and points buyers to Security', async ({ page }) => {
  await page.goto('/#trust');
  const teaser = page.locator('#trust');

  await expect(teaser).toBeVisible();
  await expect(teaser.getByText('Security and control', { exact: true })).toBeVisible();
  await expect(teaser.getByRole('link', { name: 'Explore security' })).toHaveAttribute(
    'href',
    /\/security$/,
  );
  await expect(teaser.getByRole('link', { name: /Open the trust center/i })).toHaveAttribute(
    'href',
    trustCenterUrl,
  );
});

test('the Security page publishes approved assurance and workspace controls', async ({ page }) => {
  await page.goto('/security');

  await expect(page.getByRole('heading', { name: securityTitle })).toBeVisible();
  for (const label of ['ISO 27001', 'SOC 2 Type I', 'SOC 2 Type II', 'GDPR']) {
    await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible();
  }

  await expect(page.getByText('Certified standard', { exact: true })).toHaveCount(1);
  await expect(page.getByText('Independent report', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Privacy framework', { exact: true })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Review certification' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Review report' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Review privacy policy' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Review evidence' })).toHaveCount(0);

  const workspace = page.getByRole('figure', { name: /Manage knowledge access/ });
  await expect(workspace.getByText('Z', { exact: true })).toHaveCount(0);
  await expect(
    page
      .getByRole('region', { name: 'Assurance you can verify.' })
      .getByText('Held by Text Cortex AI, the operating company behind Zeno.', { exact: true }),
  ).toBeVisible();

  const controls = page.getByRole('region', { name: 'Keep the rules close to the work.' });
  for (const label of ['Knowledge access', 'Model choice', 'Human checkpoints', 'EU hosting']) {
    await expect(controls.getByRole('heading', { name: label, exact: true })).toBeVisible();
  }
  await expect(
    controls.getByText('Available on dedicated single-tenant infrastructure.'),
  ).toBeVisible();
  await expect(controls.getByText(/alongside the shared deployment/)).toBeVisible();
});

test('Trust Center evidence links use verified HTTPS destinations and safe tabs', async ({
  page,
}) => {
  await page.goto('/security');

  const expected = new Map([
    ['Certifications', trustCenterUrl],
    ['Security and privacy policies', 'https://trust.textcortex.com/policies'],
    ['Monitored controls', 'https://trust.textcortex.com/controls'],
    ['Documents and reports', 'https://trust.textcortex.com/documents'],
    ['Subprocessors', 'https://trust.textcortex.com/subprocessors'],
  ]);

  for (const [name, href] of expected) {
    const link = page
      .getByRole('navigation', { name: 'Trust Center directory' })
      .getByRole('link', { name: new RegExp(name, 'i') });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }

  const trustCenter = page.getByRole('link', { name: /Open the Trust Center/ }).first();
  await expect(trustCenter).toHaveAttribute('href', trustCenterUrl);
  await expect(trustCenter).toHaveAttribute('target', '_blank');
});

test('native Security FAQs work with pointer and keyboard input', async ({ page }) => {
  await page.goto('/security');

  const first = page.locator('.security-faq-list details').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(first).toContainText('ISO 27001');

  const second = page.locator('.security-faq-list details').nth(1);
  await second.locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(second).toHaveAttribute('open', '');
  await expect(second).toContainText('Personal data is processed in line with the GDPR');
});

test('Security remains complete without JavaScript and excludes unsupported claims', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL('/security', test.info().project.use.baseURL).toString());

  await expect(page.getByRole('heading', { name: securityTitle })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Assurance you can verify.' })).toBeVisible();
  const faq = page.locator('.security-faq-list details').last();
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');

  const body = (await page.locator('body').innerText()).toLowerCase();
  for (const unsupported of [
    'byok',
    '24/7 monitoring',
    'penetration-test frequency',
    'incident-response sla',
    'data retention controls',
    'model training',
    'iso 42001',
    'eu ai act compliance',
  ]) {
    expect(body, `unsupported claim: ${unsupported}`).not.toContain(unsupported);
  }
  await context.close();
});

test('Security metadata and sitemap publish the canonical route', async ({ page }) => {
  await page.goto('/security');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/security$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Security and compliance | Zeno',
  );

  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('/security</loc>');
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1101, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`Security reflows without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize(viewport);
    await page.goto('/security');

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    await expect(page.getByRole('heading', { name: securityTitle })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Bring your security questions.' }),
    ).toBeVisible();
  });
}

test('Security supports 200 percent text size without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/security');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
  await expect(page.getByRole('heading', { name: securityTitle })).toBeVisible();
});

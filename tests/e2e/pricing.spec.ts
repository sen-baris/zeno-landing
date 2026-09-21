import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const disclaimer =
  'These estimates are for planning only. They combine the time and team size you choose with the displayed recovery and hourly-value assumptions. They do not guarantee time savings, financial benefit, or final Zeno pricing.';

async function openCalculator(page: Page) {
  const calculator = page.getByRole('region', { name: 'Business case calculator' });
  await expect(calculator).toHaveAttribute('data-hydrated', 'true');
  return calculator;
}

async function completeBusinessCase(page: Page) {
  await page.getByRole('checkbox', { name: 'Report generation' }).check();
  await page.getByRole('checkbox', { name: 'Presentation creation' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: 'About 4 hours' }).check();
  await page.getByRole('button', { name: 'Continue' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'How many people do this work?' })).toBeVisible();
  await page.getByText('11 to 25', { exact: true }).click();
  await expect(page.getByRole('radio', { name: '11 to 25' })).toBeChecked();
  await page.getByRole('button', { name: 'See estimate' }).click();
}

test('the calculator stays mounted after its development runtime hydrates', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/pricing');
  const calculator = await openCalculator(page);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );

  await expect(calculator).toBeVisible();
  await expect(
    calculator.getByRole('heading', { name: 'What work takes up your team’s time?' }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('Calculate business case is a clear header action', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const desktop = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(desktop.getByRole('link', { name: 'Why Zeno', exact: true })).toHaveCount(0);
  await expect(
    desktop.getByRole('link', { name: 'Calculate business case', exact: true }),
  ).toHaveAttribute('href', '/pricing');
  await expect(desktop.getByRole('link', { name: 'Pricing', exact: true })).toHaveCount(0);
  await expect(desktop.getByRole('link', { name: 'Business case', exact: true })).toHaveCount(0);
  await expect(
    desktop.getByRole('link', { name: 'Calculate business case', exact: true }),
  ).toHaveCount(1);
  await expect(desktop.getByRole('link', { name: 'Assess readiness', exact: true })).toHaveCount(0);
  const businessCase = desktop.getByRole('link', { name: 'Calculate business case', exact: true });
  await expect(businessCase.locator('.nav-action-arrow')).toHaveText('→');
  await expect(businessCase.locator('.nav-action-arrow')).toHaveAttribute('aria-hidden', 'true');
  const product = desktop.getByRole('link', { name: 'Product', exact: true });
  expect(await businessCase.evaluate((link) => getComputedStyle(link).color)).toBe(
    await product.evaluate((link) => getComputedStyle(link).color),
  );
  expect(await businessCase.evaluate((link) => getComputedStyle(link).backgroundColor)).toBe(
    'rgba(0, 0, 0, 0)',
  );
  expect(await businessCase.evaluate((link) => getComputedStyle(link).borderTopWidth)).toBe('0px');
  expect(await businessCase.evaluate((link) => getComputedStyle(link).textDecorationLine)).not.toBe(
    'underline',
  );
  await businessCase.hover();
  expect(await businessCase.evaluate((link) => getComputedStyle(link).textDecorationLine)).toBe(
    'underline',
  );
  await businessCase.focus();
  expect(await businessCase.evaluate((link) => getComputedStyle(link).outlineStyle)).toBe('solid');

  const header = page.locator('.site-header');
  await expect(header.getByRole('link', { name: 'Zeno home' })).toHaveAttribute('href', '/');
  const signIn = header.getByRole('link', { name: 'Sign in', exact: true });
  await expect(signIn).toHaveAttribute('href', 'https://app.textcortex.com/user/login');
  expect(await signIn.getAttribute('target')).toBeNull();
  await expect(header.getByRole('link', { name: 'Book a demo', exact: true })).toHaveAttribute(
    'href',
    '/demo',
  );

  const footer = page.getByRole('navigation', { name: 'Footer navigation' });
  await expect(footer.getByRole('link', { name: 'Why Zeno', exact: true })).toHaveAttribute(
    'href',
    '/#why',
  );
  await expect(footer.getByRole('link', { name: 'Business case', exact: true })).toHaveAttribute(
    'href',
    '/pricing',
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-menu > summary').click();
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(mobile.getByRole('link', { name: 'Why Zeno', exact: true })).toHaveCount(0);
  await expect(
    mobile.getByRole('link', { name: 'Calculate business case', exact: true }),
  ).toHaveAttribute('href', '/pricing');
  await expect(
    mobile
      .getByRole('link', { name: 'Calculate business case', exact: true })
      .locator('.nav-action-arrow'),
  ).toHaveText('→');
  expect(
    await mobile
      .getByRole('link', { name: 'Calculate business case', exact: true })
      .evaluate((link) => getComputedStyle(link).color),
  ).toBe(
    await mobile
      .getByRole('link', { name: 'Product', exact: true })
      .evaluate((link) => getComputedStyle(link).color),
  );
  await expect(mobile.getByRole('link', { name: 'Business case', exact: true })).toHaveCount(0);
  await expect(mobile.getByRole('link', { name: 'Assess readiness', exact: true })).toHaveCount(0);
  await expect(mobile.getByRole('link', { name: 'Sign in', exact: true })).toHaveAttribute(
    'href',
    'https://app.textcortex.com/user/login',
  );
});

test('the Solutions trigger remains centered and aligned after the label change', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const geometry = await page.evaluate(() => {
    const summary = document.querySelector<HTMLElement>('.nav-menu > summary');
    const label = summary?.querySelector<HTMLElement>('span');
    const product = Array.from(document.querySelectorAll<HTMLElement>('.desktop-nav > a')).find(
      (link) => link.textContent?.trim() === 'Product',
    );
    const businessCase = document.querySelector<HTMLElement>('.nav-business-case-cta');
    if (!summary || !label || !product || !businessCase) throw new Error('Missing navigation');
    const read = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        height: rect.height,
      };
    };
    return {
      summary: read(summary),
      label: read(label),
      product: read(product),
      businessCase: read(businessCase),
    };
  });

  expect(Math.abs(geometry.label.centerX - geometry.summary.centerX)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(geometry.summary.centerY - geometry.product.centerY)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(geometry.summary.centerY - geometry.businessCase.centerY)).toBeLessThanOrEqual(
    0.5,
  );
  expect(geometry.summary.height).toBe(geometry.product.height);
});

test('the first viewport leads with the business case and the first guided question', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/pricing');
    await openCalculator(page);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'What could your team get back?',
    );
    await expect(page.getByRole('link', { name: 'Book a demo' }).first()).toBeVisible();
    const firstQuestion = page.getByRole('heading', {
      name: 'What work takes up your team’s time?',
    });
    await expect(firstQuestion).toBeVisible();
    await expect(page.getByText(/Planning example:/)).toHaveCount(0);

    const questionBox = await firstQuestion.boundingBox();
    expect(questionBox?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(viewport.height);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      `pricing must not overflow at ${viewport.width}px`,
    ).toBe(true);
  }
});

test('guided choices support keyboard selection and retained custom amounts', async ({ page }) => {
  await page.goto('/pricing');
  const calculator = await openCalculator(page);

  const report = calculator.getByRole('checkbox', { name: 'Report generation' });
  await report.focus();
  await page.keyboard.press('Space');
  await expect(report).toBeChecked();
  await calculator.getByRole('checkbox', { name: 'Email triage' }).check();
  await calculator.getByRole('button', { name: 'Continue' }).click();
  await calculator.getByRole('radio', { name: 'Custom hours' }).check();
  await calculator.getByLabel('Custom weekly hours').fill('3.5');
  await calculator.getByRole('radio', { name: 'About 4 hours' }).check();
  await calculator.getByRole('radio', { name: 'Custom hours' }).check();
  await expect(calculator.getByLabel('Custom weekly hours')).toHaveValue('3.5');
  await calculator.getByRole('button', { name: 'Continue' }).click();

  const firstRange = calculator.getByRole('radio', { name: '1 to 10', exact: true });
  await firstRange.focus();
  await page.keyboard.press('ArrowRight');
  await expect(calculator.getByRole('radio', { name: '11 to 25' })).toBeChecked();
  await expect(calculator.getByText('18 people', { exact: true })).toBeVisible();

  await calculator.getByRole('radio', { name: 'Custom amount' }).check();
  const exactPeople = calculator.getByLabel('Exact number of people');
  await expect(exactPeople).toBeFocused();
  await exactPeople.fill('73');
  await calculator.getByRole('radio', { name: '51 to 100' }).check();
  await calculator.getByRole('radio', { name: 'Custom amount' }).check();
  await expect(calculator.getByLabel('Exact number of people')).toHaveValue('73');
});

test('the revised header reflows without horizontal overflow', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 900, height: 900 },
    { width: 1100, height: 900 },
    { width: 1101, height: 900 },
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      `header must not overflow at ${viewport.width}px`,
    ).toBe(true);
    if (viewport.width >= 1101) {
      await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
      await expect(
        page.locator('.header-actions').getByRole('link', { name: 'Sign in' }),
      ).toBeVisible();
    } else {
      await expect(page.locator('.mobile-menu > summary')).toBeVisible();
    }
  }
});

test('the guided calculator follows the documented formulas and supports editing', async ({
  page,
}) => {
  await page.goto('/pricing');
  const calculator = await openCalculator(page);
  await completeBusinessCase(page);

  await expect(calculator.getByText('828 hours', { exact: true })).toBeVisible();
  await expect(calculator.getByText('€41,400', { exact: true })).toBeVisible();
  await expect(
    calculator.getByRole('heading', { name: 'Test the case with 5 people.' }),
  ).toBeVisible();
  await expect(calculator.getByText('230 hours', { exact: true })).toBeVisible();
  await expect(calculator.getByText('€11,500', { exact: true })).toHaveCount(0);
  await expect(calculator.getByRole('link', { name: 'Plan this pilot' })).toHaveAttribute(
    'href',
    '/demo',
  );
  await expect(calculator.getByText(/annual budget|estimated ROI/i)).toHaveCount(0);
  await expect(calculator.getByText(disclaimer, { exact: true })).toBeVisible();

  await calculator.getByRole('button', { name: 'Edit answers' }).click();
  await expect(calculator.getByRole('checkbox', { name: 'Report generation' })).toBeChecked();
  await expect(calculator.getByRole('checkbox', { name: 'Presentation creation' })).toBeChecked();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('radio', { name: 'About 4 hours' })).toBeChecked();
  await page.getByRole('button', { name: 'Continue' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'How many people do this work?' })).toBeVisible();
  await expect(page.getByRole('radio', { name: '11 to 25' })).toBeChecked();
  await page.getByRole('button', { name: 'See estimate' }).click();
  await calculator.getByText('Calculation settings', { exact: true }).click();
  await expect(calculator.getByText(/Planning example:/)).toHaveCount(0);
  await page.getByLabel('Currency').selectOption('USD');
  await expect(calculator.getByText('US$41,400', { exact: true })).toBeVisible();
});

test('the completed result explains recovered time in plain language', async ({ page }) => {
  await page.goto('/pricing');
  const calculator = await openCalculator(page);

  await completeBusinessCase(page);

  await expect(
    calculator.getByRole('heading', { name: 'What your team could get back' }),
  ).toBeVisible();
  await expect(calculator.getByText('€41,400', { exact: true })).toBeVisible();
  await expect(calculator.getByText('828 hours', { exact: true })).toBeVisible();
  await expect(
    calculator.getByText(
      'Based on 18 people, 4 combined hours per person each week, 25% time recovered, €50 per hour, and 46 working weeks.',
    ),
  ).toBeVisible();
  await expect(
    calculator.getByRole('heading', { name: 'Test the case with 5 people.' }),
  ).toBeVisible();
  await expect(calculator.getByText('€11,500', { exact: true })).toHaveCount(0);
  await expect(calculator).not.toContainText('This pilot group could validate about');
  await expect(calculator.getByText('230 hours', { exact: true })).toBeVisible();
  await expect(calculator).not.toContainText(/annual capacity value/i);
});

test('calculator assumptions remain entirely inside the current page', async ({ page }) => {
  await page.goto('/pricing');
  await openCalculator(page);
  const beforeUrl = page.url();
  const beforeStorage = await page.evaluate(() => ({
    local: { ...localStorage },
    session: { ...sessionStorage },
  }));
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await completeBusinessCase(page);
  await expect(page.getByText('€41,400', { exact: true })).toBeVisible();

  expect(requests).toEqual([]);
  expect(page.url()).toBe(beforeUrl);
  expect(
    await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } })),
  ).toEqual(beforeStorage);
});

test('the calculator has a complete no-JavaScript fallback', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/pricing');

  await expect(page.getByRole('region', { name: 'Business case calculator' })).toBeHidden();
  await expect(
    page.getByRole('heading', { name: 'Estimate the time value manually.' }),
  ).toBeVisible();
  const fallback = page.locator('.pricing-calculator-fallback');
  await expect(fallback).toContainText(
    'Multiply people by combined weekly hours spent, then by the share of time recovered and working weeks.',
  );
  await expect(fallback).not.toContainText('Planning example:');
  await expect(fallback).toContainText('Pilot size uses 20 percent of the team');
  await expect(fallback).toContainText(disclaimer);
  await expect(page.getByRole('link', { name: 'Book a demo' }).last()).toHaveAttribute(
    'href',
    '/demo',
  );
  await context.close();
});

test('the compact enterprise close contains no public price and the page remains accessible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await openCalculator(page);

  const close = page.locator('.pricing-enterprise-close');
  await expect(close.getByRole('heading', { name: 'Pricing follows the rollout.' })).toBeVisible();
  await expect(close.getByText('Custom enterprise pricing', { exact: true })).toBeVisible();
  await expect(close.getByRole('listitem')).toHaveCount(4);
  await expect(close).not.toContainText(/(?:€|£|\$)\s*\d/);
  await expect(close.getByRole('link', { name: 'Book a demo' })).toHaveAttribute('href', '/demo');

  await expect(page).toHaveTitle('Business case and enterprise pricing | Zeno');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/pricing$/);
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);

  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<loc>https://heyzeno.com/pricing</loc>');
  expect(await sitemap.text()).not.toContain('/ai-readiness');
});

test('business-case and demo conversion reflow at 200 percent text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/pricing', '/demo']) {
    await page.goto(path);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      `${path} must not overflow at 200 percent text size`,
    ).toBe(true);
  }
});

test('completed results reflow at representative widths and 200 percent text size', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/pricing');
    const calculator = await openCalculator(page);
    await completeBusinessCase(page);
    await expect(calculator.getByText('€41,400', { exact: true })).toBeVisible();

    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      `completed result must not overflow at ${viewport.width}px and 200 percent text size`,
    ).toBe(true);
    await expect(calculator.getByRole('link', { name: 'Plan this pilot' })).toBeVisible();
  }
});

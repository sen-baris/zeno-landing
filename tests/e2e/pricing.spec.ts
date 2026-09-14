import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const disclaimer =
  'Estimates are for planning only and are based entirely on the values you enter. They do not guarantee time savings, financial benefit, or final Zeno pricing.';

async function openCalculator(page: Page) {
  const calculator = page.getByRole('region', { name: 'Business case calculator' });
  await expect(calculator).toHaveAttribute('data-hydrated', 'true');
  return calculator;
}

async function completeBusinessCase(page: Page, includeBudget = true) {
  await page.getByRole('radio', { name: '26 to 50' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '1 hour' }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: '€75' }).check();
  await page.getByRole('button', { name: 'See estimate' }).click();
  if (includeBudget) {
    await page.getByText('Compare with an annual budget').click();
    await page.getByLabel('Annual budget to compare').fill('200000');
  }
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
    calculator.getByRole('heading', { name: 'How many people do this work?' }),
  ).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('Business case replaces readiness as the compact header action', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const desktop = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(desktop.getByRole('link', { name: 'Why Zeno', exact: true })).toHaveCount(0);
  await expect(desktop.getByRole('link', { name: 'Business case', exact: true })).toHaveAttribute(
    'href',
    '/pricing',
  );
  await expect(desktop.getByRole('link', { name: 'Pricing', exact: true })).toHaveCount(0);
  await expect(desktop.getByRole('link', { name: 'Business case', exact: true })).toHaveCount(1);
  await expect(desktop.getByRole('link', { name: 'Assess readiness', exact: true })).toHaveCount(0);
  const businessCase = desktop.getByRole('link', { name: 'Business case', exact: true });
  expect(
    Number.parseFloat(await businessCase.evaluate((link) => getComputedStyle(link).borderRadius)),
  ).toBeLessThanOrEqual(4);
  expect(await businessCase.evaluate((link) => getComputedStyle(link).backgroundColor)).toBe(
    'rgba(0, 0, 0, 0)',
  );

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
  await expect(mobile.getByRole('link', { name: 'Business case', exact: true })).toHaveAttribute(
    'href',
    '/pricing',
  );
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
    const businessCase = Array.from(
      document.querySelectorAll<HTMLElement>('.desktop-nav > a'),
    ).find((link) => link.textContent?.trim() === 'Business case');
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
      'What could one workflow give back?',
    );
    await expect(page.getByRole('link', { name: 'Book a demo' }).first()).toBeVisible();
    const firstQuestion = page.getByRole('heading', { name: 'How many people do this work?' });
    await expect(firstQuestion).toBeVisible();

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

  await calculator.getByRole('button', { name: 'Continue' }).click();
  await calculator.getByRole('radio', { name: 'Custom hours' }).check();
  await calculator.getByLabel('Custom weekly hours').fill('3.5');
  await calculator.getByRole('radio', { name: '4 hours' }).check();
  await calculator.getByRole('radio', { name: 'Custom hours' }).check();
  await expect(calculator.getByLabel('Custom weekly hours')).toHaveValue('3.5');
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

  await expect(calculator.getByText('1,748 hours', { exact: true })).toBeVisible();
  await expect(calculator.getByText('€131,100', { exact: true })).toBeVisible();
  await expect(
    calculator.getByRole('heading', { name: 'Test the case with 8 people.' }),
  ).toBeVisible();
  await expect(calculator.getByText('368 hours', { exact: true })).toBeVisible();
  await expect(calculator.getByText('€27,600', { exact: true })).toBeVisible();
  await expect(calculator.getByRole('link', { name: 'Plan this pilot' })).toHaveAttribute(
    'href',
    '/demo',
  );
  await expect(calculator.getByText('-34.4%', { exact: true })).toBeVisible();
  await expect(calculator.getByText('Estimated ROI against this budget')).toBeVisible();
  await expect(calculator.getByText(/payback/i)).toHaveCount(0);
  await expect(calculator.getByText(disclaimer, { exact: true })).toBeVisible();
  await expect(calculator.getByText('Estimated net annual value')).toHaveCount(0);
  await expect(calculator.getByText('Estimated return multiple')).toHaveCount(0);

  await calculator.getByRole('button', { name: 'Edit answers' }).click();
  await expect(page.getByRole('radio', { name: '26 to 50' })).toBeChecked();
  await expect(calculator.getByText('38 people', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('radio', { name: '1 hour' })).toBeChecked();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Currency').selectOption('USD');
  await expect(page.getByRole('radio', { name: 'US$75' })).toBeChecked();
  await page.getByRole('button', { name: 'See estimate' }).click();
  await expect(calculator.getByText('US$131,100', { exact: true })).toBeVisible();
});

test('the completed result explains recovered time in plain language', async ({ page }) => {
  await page.goto('/pricing');
  const calculator = await openCalculator(page);

  await calculator.getByRole('radio', { name: '11 to 25' }).check();
  await calculator.getByRole('button', { name: 'Continue' }).click();
  await calculator.getByRole('radio', { name: '2 hours' }).check();
  await calculator.getByRole('button', { name: 'Continue' }).click();
  await calculator.getByRole('radio', { name: '€50' }).check();
  await calculator.getByRole('button', { name: 'See estimate' }).click();

  await expect(
    calculator.getByRole('heading', { name: 'What your team could get back' }),
  ).toBeVisible();
  await expect(calculator.getByText('€82,800', { exact: true })).toBeVisible();
  await expect(calculator.getByText('1,656 hours', { exact: true })).toBeVisible();
  await expect(
    calculator.getByText(
      'Based on 18 people, 2 hours each week, €50 per hour, and 46 working weeks.',
    ),
  ).toBeVisible();
  await expect(
    calculator.getByRole('heading', { name: 'Test the case with 5 people.' }),
  ).toBeVisible();
  await expect(calculator.getByText('€23,000', { exact: true })).toBeVisible();
  await expect(calculator.getByText('460 hours', { exact: true })).toBeVisible();
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

  await completeBusinessCase(page, false);
  await expect(page.getByText('€131,100', { exact: true })).toBeVisible();

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
  await expect(page.getByRole('heading', { name: 'Estimate the value manually.' })).toBeVisible();
  await expect(
    page.getByText(/Multiply the number of people by weekly hours returned/),
  ).toBeVisible();
  await expect(page.getByText(/For a focused pilot, start with 20 percent/)).toBeVisible();
  await expect(page.getByText(disclaimer, { exact: true })).toBeVisible();
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
  await expect(close.getByRole('link', { name: 'Assess AI readiness' })).toHaveAttribute(
    'href',
    '/ai-readiness',
  );

  await expect(page).toHaveTitle('Business case and enterprise pricing | Zeno');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/pricing$/);
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);

  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<loc>https://heyzeno.com/pricing</loc>');
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
    await calculator.getByRole('radio', { name: '11 to 25' }).check();
    await calculator.getByRole('button', { name: 'Continue' }).click();
    await calculator.getByRole('radio', { name: '2 hours' }).check();
    await calculator.getByRole('button', { name: 'Continue' }).click();
    await calculator.getByRole('radio', { name: '€50' }).check();
    await calculator.getByRole('button', { name: 'See estimate' }).click();
    await expect(calculator.getByText('€82,800', { exact: true })).toBeVisible();

    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      `completed result must not overflow at ${viewport.width}px and 200 percent text size`,
    ).toBe(true);
    await expect(calculator.getByRole('link', { name: 'Plan this pilot' })).toBeVisible();
  }
});

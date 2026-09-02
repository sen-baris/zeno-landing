import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { assessmentQuestions } from '../../src/lib/assessment/questions';

async function completeAssessment(page: Page) {
  await page.getByRole('radio', { name: /Research and synthesis/i }).check();
  await page.getByRole('button', { name: 'Begin assessment' }).click();
  for (const [index, question] of assessmentQuestions.entries()) {
    await page.getByRole('radio', { name: question.options[4]?.label ?? '' }).check();
    await page
      .getByRole('button', {
        name: index === assessmentQuestions.length - 1 ? 'See my result' : 'Next question',
      })
      .click();
  }
}

/**
 * Scrolls the page so every reveal target has been observed, then waits for the entrance motion to
 * finish. The looping "in progress" indicator never finishes, so only finite animations are awaited.
 */
async function settleRevealMotion(page: Page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    // The site sets scroll-behavior: smooth, so each step must be explicitly instant or the page
    // never reaches the sections whose observers are being triggered.
    for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await frame();
      await frame();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await expect.poll(() => page.locator('[data-reveal]:not([data-revealed])').count()).toBe(0);
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ).then(() => undefined),
  );
}

async function completeDemoForm(page: Page) {
  await page.getByLabel('Work email').fill('alex@example.test');
  await page.getByLabel('Company').fill('Example Test Company');
  await page.getByLabel('Role').fill('Innovation lead');
  await page.getByLabel('Organization size').selectOption('1000-4999');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Priority workflow').selectOption('consolidation-reporting');
  await page.getByLabel('Desired start window').selectOption('0-3-months');
  await page.getByRole('checkbox', { name: /Final privacy wording/i }).check();
}

test('homepage to assessment result to prefilled demo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Make AI part of everyday work.',
  );
  await page.getByRole('link', { name: 'Assess AI readiness' }).first().click();
  await expect(page).toHaveURL(/\/ai-readiness$/);
  await completeAssessment(page);
  await expect(page.getByRole('heading', { name: 'Launch candidate' })).toBeVisible();
  await expect(page.getByText('Launch research and synthesis.')).toBeVisible();
  await page.getByRole('link', { name: 'Discuss this workflow' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Assessment context added.')).toBeVisible();
  await page.getByLabel('Work email').fill('alex@example.test');
  await page.getByLabel('Company').fill('Example Test Company');
  await page.getByLabel('Role').fill('Innovation lead');
  await page.getByLabel('Organization size').selectOption('1000-4999');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByLabel('Priority workflow')).toHaveValue('research-synthesis');
  expect(new URL(page.url()).search).toBe('');
});

test('homepage to successful native demo submission', async ({ page }) => {
  await page.route('**/api/leads', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ submissionId: 'e2e-success' }),
    });
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Book a demo' }).first().click();
  await completeDemoForm(page);
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await expect(page.getByRole('status')).toContainText('Request confirmed');
});

test('demo server failure is understandable and retry succeeds', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/leads', async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({ status: 503, body: '' });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ submissionId: 'e2e-retry' }),
    });
  });
  await page.goto('/demo');
  await completeDemoForm(page);
  await page.getByRole('button', { name: 'Request a demo' }).click();
  await expect(page.getByRole('alert')).toContainText('not accepted');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('status')).toContainText('Request confirmed');
  expect(attempts).toBe(2);
});

test('homepage and interactive routes have no automatically detectable WCAG A/AA violations', async ({
  page,
}) => {
  for (const path of ['/', '/product', '/ai-readiness', '/demo']) {
    await page.goto(path);
    // Entrance motion fades content in from transparent, so audit the settled page rather than a
    // frame mid-transition.
    await settleRevealMotion(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, `${path} accessibility violations`).toEqual([]);
  }
});

test('homepage presents the why, how, and what hierarchy with a focused product view', async ({
  page,
}) => {
  await page.goto('/');
  const sectionHeadings = await page.locator('h2').allTextContents();
  const whyIndex = sectionHeadings.indexOf(
    "Most enterprises don't have an access problem. They have an adoption problem.",
  );
  const costIndex = sectionHeadings.indexOf('What happens when nobody uses it.');
  const proofIndex = sectionHeadings.indexOf('What enterprises are seeing.');
  const whatIndex = sectionHeadings.indexOf('One layer over the models you already buy.');
  const shiftIndex = sectionHeadings.indexOf('The same quarter, two ways.');

  // Proof sits with the logos at the top, so the problem and its cost stay adjacent rather than
  // being interrupted by it. Then one product moment, then the before and after. The mechanism
  // itself lives on /product so the homepage does not explain it twice.
  expect(proofIndex).toBeGreaterThanOrEqual(0);
  expect(whyIndex).toBeGreaterThan(proofIndex);
  expect(costIndex).toBeGreaterThan(whyIndex);
  expect(whatIndex).toBeGreaterThan(costIndex);
  expect(shiftIndex).toBeGreaterThan(whatIndex);
  expect(sectionHeadings, 'the mechanism belongs on /product').not.toContain(
    'Connect. Equip. Run. Govern.',
  );
  const heroAction = page.getByRole('group', { name: 'Hero call to action' });
  await expect(heroAction.getByRole('link')).toHaveCount(1);
  await expect(heroAction.getByRole('link', { name: 'Book a demo' })).toBeVisible();
  await expect(page.getByText('Enterprise AI layer', { exact: true })).toBeVisible();
  await expect(page.locator('.layer-agents > ul > li')).toHaveCount(4);
  await expect(page.getByRole('img', { name: 'MAHLE' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'TMG Consultants' })).toBeVisible();
  await expect(
    page.getByRole('list', { name: 'Selected customer logos' }).getByRole('img'),
  ).toHaveCount(8);
  await expect(
    page.getByText(/working copy|illustrative product view|no customer data/i),
  ).toHaveCount(0);
  await expect(page.getByText('Enterprise AI for everyday work', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/small pilot/i)).toHaveCount(0);
});

test('reduced motion preserves the complete static product story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByText('Enterprise AI layer', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Set by IT, and switchable without touching anything above.'),
  ).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on');
  for (const visual of ['.agent-layer', '.vision-media-lead', '.trust-certifications']) {
    await expect(page.locator(visual)).toBeVisible();
  }
  await expect(page.locator('.shift-compare')).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);

  // The mechanism visuals live on /product and must degrade the same way.
  await page.goto('/product');
  for (const visual of [
    '.layer-stack',
    '.product-workspace',
    '.workflow-run',
    '.adoption-gap',
    '.governance-console',
  ]) {
    await expect(page.locator(visual)).toBeVisible();
  }
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('every revealable product visual becomes visible once motion runs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await settleRevealMotion(page);

  const faded = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-reveal], [data-reveal] *'))
      .filter((element) => Number(getComputedStyle(element).opacity) < 1)
      .map((element) => element.className || element.tagName),
  );
  expect(faded, 'motion must leave every revealed element fully opaque').toEqual([]);

  await page.goto('/product');
  await settleRevealMotion(page);
  await expect(page.locator('.workflow-run-steps li')).toHaveCount(5);
  const fadedOnProduct = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-reveal], [data-reveal] *'))
      .filter((element) => Number(getComputedStyle(element).opacity) < 1)
      .map((element) => element.className || element.tagName),
  );
  expect(fadedOnProduct, 'motion must settle on the product page too').toEqual([]);
});

test('the product visuals survive a page with no JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on');
  await expect(page.getByText('Enterprise AI layer', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'ISO 27001' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open the trust center/ })).toBeVisible();

  await page.goto('/product');
  await expect(
    page.getByRole('heading', { name: 'Quarterly business review', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Consolidate findings')).toBeVisible();
  await context.close();
});

test('the product page carries the mechanism the homepage now links to', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Product' })
    .click();
  await expect(page).toHaveURL(/\/product$/);

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connect. Equip. Run. Govern.');
  await expect(
    page.getByRole('heading', { name: 'Six layers, from the models up.' }),
  ).toBeVisible();
  await expect(page.locator('.layer-step')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'Agents that know your company' })).toBeVisible();
  await expect(page.getByText('Presentation Agent', { exact: true })).toBeVisible();

  const gap = page.locator('.adoption-gap');
  await expect(gap.getByText('A rollout that took hold')).toBeVisible();
  await expect(gap.locator('.gap-stats > li')).toHaveCount(4);
  await expect(gap.locator('.gap-col')).toHaveCount(12);
  await expect(gap.getByText('from 21% in month one')).toBeVisible();

  const adoptionFramework = page.getByRole('list', {
    name: '90-day adoption observation framework',
  });
  await expect(adoptionFramework.getByText('30', { exact: true })).toBeVisible();
  await expect(adoptionFramework.getByText('60', { exact: true })).toBeVisible();
  await expect(adoptionFramework.getByText('90', { exact: true })).toBeVisible();
});

test('the argument sections carry the cost, the contrast, and a low-friction entry point', async ({
  page,
}) => {
  await page.goto('/');

  const cost = page.locator('#cost');
  await expect(
    cost.getByRole('heading', { name: 'You cannot tell what is worth paying for' }),
  ).toBeVisible();
  await expect(
    cost.getByRole('heading', { name: 'People go back to doing it by hand' }),
  ).toBeVisible();
  await expect(
    cost.getByRole('heading', { name: 'You end up shopping for another tool' }),
  ).toBeVisible();

  // Both columns of the contrast must survive; a one-sided version makes no argument.
  const shift = page.locator('#shift');
  await expect(shift.getByText('Today', { exact: true })).toBeVisible();
  await expect(shift.getByText('With Zeno', { exact: true })).toBeVisible();
  await expect(shift.locator('.shift-today li')).toHaveCount(4);
  await expect(shift.locator('.shift-zeno li')).toHaveCount(4);

  // The assessment is the self-serve entry point, so its cost to the visitor is stated up front.
  await expect(page.locator('.conversion-micro')).toHaveText(
    '9 questions · one workflow · no contact details',
  );
});

test('the business case publishes each figure with the qualifier it depends on', async ({
  page,
}) => {
  await page.goto('/');
  const businessCase = page.locator('#business-case');
  await expect(businessCase.getByRole('heading', { level: 2 })).toHaveText(
    'What enterprises are seeing.',
  );

  const expected = [
    ['3–10%', 'efficiency / time savings after a year', 'across enterprise consultancy accounts'],
    ['~200', 'monthly interactions per user', 'on full enterprise rollouts'],
    ['+65%', 'weekly active usage', 'usage growing after launch, not fading'],
    ['~€7–8M', 'projected annual savings', 'internal enterprise savings model, ~2,200 users'],
  ];

  const figures = businessCase.locator('.business-case-figures > li');
  await expect(figures).toHaveCount(expected.length);

  for (const [index, [value, label, qualifier]] of expected.entries()) {
    const figure = figures.nth(index);
    await expect(figure).toContainText(value ?? '');
    await expect(figure).toContainText(label ?? '');
    // A figure must never appear without the population or method that makes it meaningful.
    await expect(figure).toContainText(qualifier ?? '');
  }
});

const APPROVED_FIGURES = ['3–10%', '~200', '+65%', '~€7–8M'];
const APPROVED_ADOPTION_FIGURES = ['64%', '31', '11 of 14', '9%'];

test('the vision statement stays readable however it is reached', async ({ page, browser }) => {
  await page.goto('/');
  const lines = page.locator('.vision-line');
  await expect(lines).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Software is the easy half.' })).toBeVisible();

  // Every photograph carries a description; none is decorative.
  const photos = page.locator('#vision img');
  await expect(photos).toHaveCount(5);
  for (const photo of await photos.all()) {
    expect((await photo.getAttribute('alt'))?.trim().length ?? 0).toBeGreaterThan(0);
  }

  // Reading it through leaves every line at full ink, and none of it was dimmed with opacity.
  await settleRevealMotion(page);
  await expect(page.locator('.vision-line:not([data-read])')).toHaveCount(0);
  const faded = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll('.vision-line')).filter(
        (line) => Number(getComputedStyle(line).opacity) < 1,
      ).length,
  );
  expect(faded, 'lines dim with colour, never opacity').toBe(0);

  // With no JavaScript the statement is simply already read.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto('/');
  await expect(plain.locator('.vision-line')).toHaveCount(4);
  await expect(plain.getByRole('heading', { name: 'Software is the easy half.' })).toBeVisible();
  await context.close();
});

test('the layer sequence pins and steps, and reads plainly without it', async ({
  page,
  browser,
}) => {
  await page.goto('/product');
  const steps = page.locator('.layer-step');
  await expect(steps).toHaveCount(6);

  // The stack is a visual mirror of the list, so it must not be read out a second time.
  await expect(page.locator('.layer-stack')).toHaveAttribute('aria-hidden', 'true');
  // Nothing focusable inside it either, or it would add phantom stops to the tab order.
  expect(await page.locator('.layer-stack a, .layer-stack button').count()).toBe(0);

  await expect(page.locator('.layer-sequence')).toHaveAttribute('data-sequence', 'on');
  await expect(page.locator('.layer-stack')).toHaveCSS('position', 'sticky');

  // Walking the section marks every layer in turn, and walking back unmarks them again.
  const box = await page.locator('.layer-sequence').boundingBox();
  if (!box) throw new Error('the sequence should be laid out');
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    box.y + box.height - 400,
  );
  await expect.poll(() => page.locator('.layer-step[data-state="future"]').count()).toBe(0);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), box.y - 200);
  await expect
    .poll(() => page.locator('.layer-step[data-state="future"]').count())
    .toBeGreaterThan(0);

  // With no JavaScript it is a diagram and a list, with every layer visible and nothing pinned.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto('/product');
  await expect(plain.locator('.layer-sequence')).toHaveAttribute('data-sequence', 'off');
  await expect(plain.locator('.layer-stack')).toHaveCSS('position', 'static');
  for (const name of [
    'Model hub',
    'Connectors and data',
    'Context and knowledge',
    'Specialized agents',
    'Products and interfaces',
    'Security and governance',
  ]) {
    await expect(plain.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await context.close();
});

test('the layer sequence does not pin under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/product');
  await expect(page.locator('.layer-sequence')).toHaveAttribute('data-sequence', 'off');
  await expect(page.locator('.layer-stack')).toHaveCSS('position', 'static');
  await expect(page.locator('.layer-step')).toHaveCount(6);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('the customer quote is published from its approved record', async ({ page }) => {
  await page.goto('/');
  const quote = page.locator('.customer-quote');
  await expect(quote.locator('blockquote')).toHaveText(
    "Today it's already one of our core operational tools that runs our business.",
  );
  await expect(quote.locator('figcaption')).toHaveText('Partner, strategy consultancy');
  // The buzzword line it replaced must not come back alongside it.
  await expect(page.getByText(/Built for AI, innovation, IT, data/)).toHaveCount(0);
});

test('the adoption figures count up and settle exactly on /product', async ({ page }) => {
  await page.goto('/product');
  const counts = page.locator('.gap-value [data-figure]');
  await expect(counts).toHaveCount(APPROVED_ADOPTION_FIGURES.length);
  await page.locator('.adoption-gap').scrollIntoViewIfNeeded();
  await expect.poll(() => counts.allTextContents()).toEqual(APPROVED_ADOPTION_FIGURES);
});

test('the business case figures count up, settle exactly, and replay on return', async ({
  page,
}) => {
  await page.goto('/');
  const counts = page.locator('.business-case-count');
  await expect(counts).toHaveCount(APPROVED_FIGURES.length);

  // The animating copy is hidden from assistive technology and a twin carries the real value, so a
  // screen reader can never encounter a number mid-count.
  for (const count of await counts.all()) {
    await expect(count).toHaveAttribute('aria-hidden', 'true');
  }
  await expect(page.locator('#business-case .visually-hidden')).toHaveText(APPROVED_FIGURES);

  // Watch the first figure mutate as it arrives, rather than trying to catch a frame by timing.
  const mutations = await page.evaluate(async () => {
    const figure = document.querySelector('.business-case-count');
    const section = document.querySelector('#business-case');
    if (!figure || !section) return 0;
    let changes = 0;
    const observer = new MutationObserver(() => {
      changes += 1;
    });
    observer.observe(figure, { characterData: true, childList: true, subtree: true });
    section.scrollIntoView({ behavior: 'instant' });
    await new Promise((resolve) => setTimeout(resolve, 400));
    observer.disconnect();
    return changes;
  });
  expect(mutations, 'the figures should animate on arrival').toBeGreaterThan(0);

  // However it animates, it must land on the approved strings verbatim.
  await expect.poll(() => counts.allTextContents()).toEqual(APPROVED_FIGURES);

  // Leaving and returning replays it, and it lands on the same strings again.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('#business-case').scrollIntoViewIfNeeded();
  await expect.poll(() => counts.allTextContents()).toEqual(APPROVED_FIGURES);
});

test('the business case figures never move under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const settled = await page.evaluate(async () => {
    const figure = document.querySelector('.business-case-count');
    const section = document.querySelector('#business-case');
    if (!figure || !section) return -1;
    let changes = 0;
    const observer = new MutationObserver(() => {
      changes += 1;
    });
    observer.observe(figure, { characterData: true, childList: true, subtree: true });
    section.scrollIntoView({ behavior: 'instant' });
    await new Promise((resolve) => setTimeout(resolve, 400));
    observer.disconnect();
    return changes;
  });
  expect(settled, 'no counting when the reader asked for reduced motion').toBe(0);
  await expect(page.locator('.business-case-count')).toHaveText(APPROVED_FIGURES);
});

test('the trust section publishes approved certifications and a verifiable trust centre link', async ({
  page,
}) => {
  await page.goto('/');
  const trust = page.locator('#trust');
  for (const label of ['ISO 27001', 'SOC 2 Type I', 'SOC 2 Type II']) {
    await expect(trust.getByRole('heading', { name: label, exact: true })).toBeVisible();
  }
  await expect(trust.getByText(/Held by Text Cortex AI/)).toBeVisible();

  const trustCenter = trust.getByRole('link', { name: /Open the trust center/ });
  await expect(trustCenter).toHaveAttribute('href', 'https://trust.textcortex.com/home');
  await expect(trustCenter).toHaveAttribute('target', '_blank');
  await expect(trustCenter).toHaveAttribute('rel', /noopener/);
});

test('internal navigation resolves to real pages or homepage sections', async ({ page }) => {
  await page.goto('/');
  const origin = new URL(page.url()).origin;
  const links = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute('href') ?? '',
      resolved: (anchor as HTMLAnchorElement).href,
      target: anchor.getAttribute('target'),
      rel: anchor.getAttribute('rel'),
    })),
  );
  const unique = [...new Map(links.map((link) => [link.resolved, link])).values()];
  const internal = unique.filter((link) => new URL(link.resolved).origin === origin);
  const external = unique.filter((link) => new URL(link.resolved).origin !== origin);

  for (const link of internal) {
    const target = new URL(link.resolved);
    const response = await page.request.get(target.href);
    expect(response.status(), link.href).toBeLessThan(400);
    if (target.hash && target.pathname === '/') {
      await expect(page.locator(target.hash)).toHaveCount(1);
    }
  }

  // External destinations are not fetched, so the suite stays deterministic offline. They are
  // still held to the safety contract every outbound link on the site must meet.
  expect(external.length, 'the trust centre is the only outbound homepage link').toBeGreaterThan(0);
  for (const link of external) {
    expect(new URL(link.resolved).protocol, link.href).toBe('https:');
    expect(link.target, link.href).toBe('_blank');
    expect(link.rel ?? '', link.href).toContain('noopener');
  }
});

test('mobile reflow, 200 percent text zoom, and keyboard focus remain usable', async ({
  browserName,
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);

  // Safari/WebKit follows the platform preference that uses Option+Tab for links.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeVisible();
});

test('mobile same-page navigation closes after an anchor is selected', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.mobile-menu');
  await page.getByLabel(/Menu.*open navigation/i).click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Why Zeno' }).click();
  await expect(page).toHaveURL(/#why$/);
  await expect(menu).not.toHaveAttribute('open', '');
});

test('interactive routes explain the JavaScript fallback', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ['/ai-readiness', '/demo']) {
    await page.goto(`http://127.0.0.1:4321${path}`);
    await expect(page.getByRole('status')).toContainText('enable JavaScript and reload');
  }
  await context.close();
});

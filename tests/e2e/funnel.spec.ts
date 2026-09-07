import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { assessmentQuestions } from '../../src/lib/assessment/questions';
import { solutions } from '../../src/lib/content/solutions';

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
  await settleAnimations(page);
}

/** Waits for every finite animation to finish. The looping indicators never do, so they are left. */
async function settleAnimations(page: Page) {
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
  // Loads the assessment or demo island, waits for it to hydrate, and drives a multi-step form.
  // Genuinely slow work, and the default half-minute leaves nothing for the contention of three
  // browsers running the rest of the suite alongside it.
  test.slow();

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'AI agents your teams actually use.',
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
  // Loads the assessment or demo island, waits for it to hydrate, and drives a multi-step form.
  // Genuinely slow work, and the default half-minute leaves nothing for the contention of three
  // browsers running the rest of the suite alongside it.
  test.slow();

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
  // Loads the assessment or demo island, waits for it to hydrate, and drives a multi-step form.
  // Genuinely slow work, and the default half-minute leaves nothing for the contention of three
  // browsers running the rest of the suite alongside it.
  test.slow();

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
  // Four full axe passes, each preceded by a page load and a settle. It runs close to twenty
  // seconds on an idle machine, so the default half-minute leaves nothing for the contention of
  // three browsers running the rest of the suite alongside it.
  test.slow();

  // The index and one industry page, not all six: the five industry pages are one template with
  // different words in it, and each route here costs a full axe pass on a test already marked slow.
  for (const path of [
    '/',
    '/product',
    '/solutions',
    '/solutions/manufacturing',
    '/ai-readiness',
    '/demo',
  ]) {
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
  const whyIndex = sectionHeadings.indexOf('Adoption is built together.');
  const proofIndex = sectionHeadings.indexOf('What enterprises are seeing.');
  const visionIndex = sectionHeadings.indexOf('Software is the easy half.');
  const shiftIndex = sectionHeadings.indexOf('The same quarter, two ways.');

  // One line through the page: proof, then the work that turns launch into adoption, then the
  // people who work on it, then the before and after. The mechanism lives on /product, so the
  // homepage does not explain it twice.
  expect(proofIndex).toBeGreaterThanOrEqual(0);
  expect(whyIndex).toBeGreaterThan(proofIndex);
  expect(visionIndex).toBeGreaterThan(whyIndex);
  expect(shiftIndex).toBeGreaterThan(visionIndex);
  expect(sectionHeadings, 'the mechanism belongs on /product').not.toContain(
    'Connect. Equip. Run. Govern.',
  );
  expect(
    sectionHeadings,
    'the cost of low adoption is the "Today" column of the contrast',
  ).not.toContain('What happens when nobody uses it.');
  expect(sectionHeadings, 'the hero stack already shows how it fits').not.toContain(
    'One layer over the models you already buy.',
  );
  const heroAction = page.getByRole('group', { name: 'Hero call to action' });
  await expect(heroAction.getByRole('link')).toHaveCount(1);
  await expect(heroAction.getByRole('link', { name: 'Book a demo' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'MAHLE' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'TMG Consultants' })).toBeVisible();
  const customers = page.getByRole('region', { name: 'In good company' });
  await expect(
    customers.getByRole('list', { name: 'Customer logos' }).getByRole('img'),
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
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on');
  // Scrolling is an optional presentation. The complete story remains in the normal document flow
  // when the reader asks for less motion.
  const hero = page.locator('.hero-journey');
  await expect(hero).toHaveAttribute('data-journey', 'static');
  await expect(hero.locator('.hj-panel')).toHaveCount(3);
  for (const panel of await hero.locator('.hj-panel').all()) await expect(panel).toBeVisible();
  await expect(hero.locator('.hw-controls li')).toHaveCount(3);
  await expect(hero.getByText('Healthy adoption', { exact: true })).toBeVisible();
  // The complete partnership chapter is present without internal choreography waiting to run.
  await expect(page.locator('.adoption-partnership-story')).toBeVisible();
  await expect(page.locator('.adoption-stages > li')).toHaveCount(3);
  await expect(page.locator('.adoption-partner-band li')).toHaveCount(3);
  await expect(page.getByText('Draft the monthly finance report.')).toBeVisible();
  for (const visual of ['.hero-journey', '.vision-media-lead', '.trust-certifications']) {
    await expect(page.locator(visual)).toBeVisible();
  }
  await expect(page.locator('.shift-compare')).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);

  // The mechanism visuals live on /product and must degrade the same way.
  await page.goto('/product');
  for (const visual of [
    '.platform-overview',
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
      .filter(
        (element) =>
          Number(getComputedStyle(element).opacity) < 1 &&
          !element.closest('.hero-journey[data-journey="on"] .hj-panel:not([data-current])') &&
          !element.closest('.hero-journey[data-journey="on"] .hj-story > li:not([data-current])'),
      )
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
  const hero = page.locator('.hero-journey');
  await expect(hero).toHaveAttribute('data-journey', 'static');
  await expect(hero.locator('.hw-controls li')).toHaveCount(3);
  // Every finished stage is in normal flow, while the semantic narrative carries the connector
  // names and qualitative adoption state that the supporting visual hides from assistive technology.
  await expect(hero.locator('.hj-panel')).toHaveCount(3);
  for (const panel of await hero.locator('.hj-panel').all()) await expect(panel).toBeVisible();
  await expect(hero.locator('.hj-story')).toContainText('Outlook, SharePoint, and Salesforce');
  await expect(hero.locator('.hj-story')).toContainText('source permissions, IT-approved models');
  await expect(hero.locator('.hj-story')).toContainText(
    'weekly activity rises after launch, more teams return, and fewer seats remain inactive',
  );
  await expect(hero.locator('.hj-story')).not.toContainText('percent');
  await expect(hero.locator('[role="button"]')).toHaveCount(0);
  await expect(hero.locator('img')).toHaveCount(3);
  expect(
    await hero
      .locator('img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            image.getAttribute('src')?.includes('/connector-logos/') &&
            (image.getAttribute('alt') ?? '').length > 0,
        ),
      ),
    'the only hero images are named connector marks',
  ).toBe(true);
  await expect(page.locator('.adoption-partnership-story')).toBeVisible();
  await expect(page.locator('.adoption-stages > li')).toHaveCount(3);
  await expect(page.locator('.adoption-partner-band')).toContainText('Zeno + your team');
  await expect(page.locator('.adoption-partner-band li')).toHaveCount(3);
  await expect(page.locator('.benefit-visual, .benefit-item')).toHaveCount(0);
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
  // The platform overview is the page's opening visual, and the four steps its heading names are
  // the three stages plus the governance strip underneath them.
  await expect(page.getByText('The enterprise AI platform', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Company knowledge and tools' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Specialized agents for teams' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Everyday work and repeatable workflows' }),
  ).toBeVisible();
  await expect(page.locator('.agent-roster > li')).toHaveCount(3);
  await expect(page.locator('.platform-governance li')).toHaveCount(4);
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

test('the argument sections carry the contrast and a low-friction entry point', async ({
  page,
}) => {
  await page.goto('/');

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

test('the hero scroll-locks one scene from first workflow to healthy adoption', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'AI agents your teams actually use.',
  );
  await expect(page.locator('.hero-subhead')).toHaveText(
    'We find the workflows worth automating, build the agents with your people, and stay through rollout and adoption.',
  );
  const heroAction = page.getByRole('group', { name: 'Hero call to action' });
  await expect(heroAction.getByRole('link')).toHaveCount(1);
  await expect(heroAction.getByRole('link', { name: 'Book a demo' })).toHaveAttribute(
    'href',
    '/demo',
  );

  // The next section continues the story after launch instead of replaying the three hero stages.
  const why = page.getByRole('region', { name: 'Adoption is built together.' });
  await expect(why.getByText('After launch')).toBeVisible();
  await expect(why.locator('.split-heading > p')).toHaveText(
    'We stay in the rollout after the first agent goes live. Together, we watch where teams return, remove friction, and turn what works into the next workflow.',
  );

  const hero = page.locator('.hero-journey');
  await expect(hero).toBeVisible();
  await expect(hero).toHaveAttribute('data-journey', 'on');
  await expect(hero.locator('.hj-story-title')).toHaveText([
    'We find the workflow with you',
    'We build the agent with you',
    'We stay through adoption',
  ]);
  await expect(hero.locator('.hj-story-title + p')).toHaveText([
    'We start with the monthly finance report: repeated, important, and still assembled by hand.',
    'We build it around your systems and documents. Your team reviews the work; the owner approves it.',
    'After launch, we watch who returns, where use stalls, and what to improve before expanding.',
  ]);
  await expect(hero.locator('.hj-progress-node')).toHaveCount(3);
  await expect(hero.locator('.hj-progress-segment')).toHaveCount(2);
  await expect(hero.locator('button, [role="button"], [aria-pressed]')).toHaveCount(0);

  // Find selects one clear candidate; Build keeps that same agent, its task and three real system
  // marks; Adopt makes a qualitative adoption view the dominant state.
  const findPanel = hero.locator('[data-stage-panel="find"]');
  await expect(findPanel.locator('.hj-find-shortlist li')).toHaveText([
    '✓Finance report',
    'Supplier contract',
    'Project updates',
  ]);
  await expect(findPanel.locator('.hj-find li[data-selected="true"]')).toHaveCount(1);
  await expect(findPanel.locator('.hj-selection-title')).toHaveText('Finance report');
  await expect(findPanel.locator('.hj-selection-summary li')).toHaveText([
    '✓Every month',
    '✓Assembled by hand',
    '✓Owned by Finance',
  ]);

  const buildPanel = hero.locator('[data-stage-panel="build"]');
  await expect(buildPanel).toContainText('Finance report agent');
  await expect(buildPanel).toContainText('Draft the monthly finance report.');
  await expect(buildPanel).toContainText('Draft ready');
  await expect(buildPanel).toContainText('Owner approves');
  await expect(buildPanel).toContainText('Built withZeno + your team');
  await expect(buildPanel).toContainText('Human approval required');

  // The people photography belongs to the later team section. Every hero image is a local,
  // explicitly named connector mark with reserved dimensions.
  await expect(hero.locator('img')).toHaveCount(3);
  expect(
    await hero
      .locator('img')
      .evaluateAll((images) =>
        images.every(
          (image) =>
            image.getAttribute('src')?.includes('/connector-logos/') &&
            (image.getAttribute('alt') ?? '').length > 0 &&
            image.getAttribute('width') === '24' &&
            image.getAttribute('height') === '24' &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
      ),
    'only loaded, named connector SVGs may appear in the hero',
  ).toBe(true);
  expect(
    await hero
      .locator('.hj-connected li')
      .evaluateAll((items) => items.every((item) => (item.textContent ?? '').trim() === '')),
    'connector names are accessible alternatives, not visible pills',
  ).toBe(true);

  const adoptPanel = hero.locator('[data-stage-panel="adopt"]');
  await expect(adoptPanel.locator('.hj-panel-title')).toHaveText('Adoption');
  await expect(adoptPanel.locator('.hj-status')).toHaveText('Healthy adoption');
  await expect(adoptPanel.locator('.hj-chart-plot > span')).toHaveCount(12);
  await expect(adoptPanel.locator('.hj-chart-axis')).toHaveText('LaunchNow');
  await expect(adoptPanel.locator('.hj-adoption-stats li')).toHaveText([
    'Teams returningGrowing',
    'Inactive seatsFalling',
  ]);
  await expect(hero).not.toContainText(/Illustrative|21%|64%|11 of 14|46%|\+65%/i);

  // The product foundation is one restrained policy rail, with Europe positioned separately.
  await expect(hero.locator('.hw-controls li')).toHaveText([
    'Source permissions',
    'IT-approved models',
    'Human approval',
  ]);
  await expect(hero).not.toContainText('Runs under IT policy');
  await expect(hero.locator('.hw-europe')).toHaveText('Built for Europe');

  const desktopGeometry = await hero.evaluate((element) => {
    const scene = element.querySelector<HTMLElement>('.hj-layout');
    const title = element.querySelector<HTMLElement>('.hj-story-title');
    const body = element.querySelector<HTMLElement>('.hj-story-title + p');
    if (!scene || !title || !body) throw new Error('Missing hero geometry');
    const columns = getComputedStyle(scene)
      .gridTemplateColumns.split(' ')
      .map((value) => Number.parseFloat(value));
    const [leftColumn, rightColumn] = columns;
    if (!leftColumn || !rightColumn) throw new Error('Missing hero grid columns');
    return {
      bodySize: Number.parseFloat(getComputedStyle(body).fontSize),
      height: element.getBoundingClientRect().height,
      leftShare: leftColumn / (leftColumn + rightColumn),
      titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
    };
  });
  expect(desktopGeometry.leftShare).toBeGreaterThan(0.35);
  expect(desktopGeometry.leftShare).toBeLessThan(0.37);
  expect(desktopGeometry.titleSize).toBeGreaterThanOrEqual(28);
  expect(desktopGeometry.bodySize).toBeGreaterThanOrEqual(14.5);
  expect(desktopGeometry.height).toBeGreaterThanOrEqual(2698);
  expect(desktopGeometry.height).toBeLessThanOrEqual(2702);

  const reachStage = async (stage: 'find' | 'build' | 'adopt') => {
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
    await expect(hero).toHaveAttribute('data-stage', stage);
    await expect(hero.locator('.hj-panel[data-current]')).toHaveAttribute(
      'data-stage-panel',
      stage,
    );
    await expect(hero.locator('.hj-story > li[data-current]')).toHaveAttribute(
      'data-story-step',
      stage,
    );
    await expect
      .poll(async () => {
        const scene = hero.locator('.hj-layout');
        const box = await scene.boundingBox();
        const stickyTop = await scene.evaluate(
          (element) => Number.parseFloat(getComputedStyle(element).top) || 0,
        );
        return Math.abs((box?.y ?? -1) - stickyTop);
      })
      .toBeLessThanOrEqual(1);
    await settleAnimations(page);
    const frame = await hero.locator('.hj-frame').boundingBox();
    const scene = await hero.locator('.hj-layout').boundingBox();
    const progress = await hero.locator('.hj-progress-segment').evaluateAll((segments) =>
      segments.map((segment) => {
        const trackWidth = segment.getBoundingClientRect().width;
        const fillWidth = segment.firstElementChild?.getBoundingClientRect().width ?? 0;
        return trackWidth === 0 ? 0 : fillWidth / trackWidth;
      }),
    );
    const narrativeOpacity = await hero
      .locator('.hj-story > li')
      .evaluateAll((steps) => steps.map((step) => Number(getComputedStyle(step).opacity)));
    if (!frame || !scene) throw new Error('Hero scene should be laid out');
    return { frame, narrativeOpacity, progress, scene };
  };

  // The introduction scrolls away, then the complete narrative-and-visual scene stays locked below
  // the header while scroll progress changes its contents and fills the connecting segments.
  const headlineBefore = await page.getByRole('heading', { level: 1 }).boundingBox();
  const find = await reachStage('find');
  const headlineAfter = await page.getByRole('heading', { level: 1 }).boundingBox();
  expect(headlineAfter?.y ?? 0, 'the headline scrolls normally').toBeLessThan(
    (headlineBefore?.y ?? 0) - 100,
  );
  expect(find.progress[0]).toBeGreaterThan(0.15);
  expect(find.progress[0]).toBeLessThan(0.35);
  expect(find.progress[1]).toBeLessThan(0.05);
  expect(find.narrativeOpacity).toEqual([1, 0, 0]);

  const build = await reachStage('build');
  expect(build.progress[0]).toBeGreaterThan(0.95);
  expect(build.progress[1]).toBeGreaterThan(0.4);
  expect(build.progress[1]).toBeLessThan(0.6);
  expect(build.narrativeOpacity).toEqual([0, 1, 0]);

  const adopt = await reachStage('adopt');
  expect(
    adopt.progress.every((fill) => fill > 0.95),
    'Adopt completes both connectors',
  ).toBe(true);
  expect(adopt.narrativeOpacity).toEqual([0, 0, 1]);
  const frameWidths = [find.frame.width, build.frame.width, adopt.frame.width];
  const frameHeights = [find.frame.height, build.frame.height, adopt.frame.height];
  expect(Math.max(...frameWidths) - Math.min(...frameWidths)).toBeLessThanOrEqual(1);
  expect(Math.max(...frameHeights) - Math.min(...frameHeights)).toBeLessThanOrEqual(1);
  expect(find.frame.height).toBeGreaterThanOrEqual(460);
  expect(find.frame.height).toBeLessThanOrEqual(500.5);
  const pinnedTops = [find.scene.y, build.scene.y];
  expect(Math.max(...pinnedTops) - Math.min(...pinnedTops)).toBeLessThanOrEqual(1);
  expect(Math.round(find.scene.y), 'the complete scene stays below the sticky header').toBe(76);
  const frameOffsets = [find, build, adopt].map((state) => state.frame.y - state.scene.y);
  expect(
    Math.max(...frameOffsets) - Math.min(...frameOffsets),
    'the frame must not move inside the scene as stages change',
  ).toBeLessThanOrEqual(1);

  const reversed = await reachStage('find');
  expect(reversed.progress[0]).toBeLessThan(0.35);
  expect(reversed.progress[1]).toBeLessThan(0.05);

  // This is ordinary page scrolling, so keyboard paging must drive the same geometry-based state.
  const pressPageKey = async (key: 'PageDown' | 'PageUp') => {
    await page.keyboard.press(key);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
  };
  await pressPageKey('PageDown');
  await pressPageKey('PageDown');
  await expect(hero).toHaveAttribute('data-stage', /build|adopt/);
  await pressPageKey('PageUp');
  await pressPageKey('PageUp');
  await expect(hero).toHaveAttribute('data-stage', 'find');

  const customerSection = page.getByRole('region', { name: 'In good company' });
  await customerSection.evaluate((element) =>
    window.scrollTo({
      top: window.scrollY + element.getBoundingClientRect().top - 120,
      behavior: 'instant',
    }),
  );
  const releasedScene = await hero.locator('.hj-layout').boundingBox();
  const customerBox = await customerSection.boundingBox();
  expect(releasedScene?.y ?? 0).toBeLessThan(customerBox?.y ?? 0);
  expect((releasedScene?.y ?? 0) + (releasedScene?.height ?? 0)).toBeLessThanOrEqual(
    (customerBox?.y ?? 0) + 1,
  );

  // Tablet, mobile and shallow desktops render the same stages as ordinary document content.
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(hero).toHaveAttribute('data-journey', 'static');
  for (const panel of await hero.locator('.hj-panel').all()) await expect(panel).toBeVisible();
  const tabletOrder = await page.evaluate(() =>
    [
      '[data-story-step="find"]',
      '[data-stage-panel="find"]',
      '[data-story-step="build"]',
      '[data-stage-panel="build"]',
      '[data-story-step="adopt"]',
      '[data-stage-panel="adopt"]',
    ].map((selector) =>
      Math.round(document.querySelector(selector)?.getBoundingClientRect().top ?? -1),
    ),
  );
  expect(tabletOrder).toEqual([...tabletOrder].sort((a, b) => a - b));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(hero).toHaveAttribute('data-journey', 'static');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    'the complete mobile story must not overflow horizontally',
  ).toBe(true);

  await page.setViewportSize({ width: 1440, height: 700 });
  await expect(hero).toHaveAttribute('data-journey', 'static');

  // The enhancement changes over exactly at the documented width and height boundaries.
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect(hero).toHaveAttribute('data-journey', 'static');
  await page.setViewportSize({ width: 1101, height: 900 });
  await expect(hero).toHaveAttribute('data-journey', 'on');
  await page.setViewportSize({ width: 1440, height: 719 });
  await expect(hero).toHaveAttribute('data-journey', 'static');
  await page.setViewportSize({ width: 1440, height: 720 });
  await expect(hero).toHaveAttribute('data-journey', 'on');
  await reachStage('build');
  const boundaryVisual = await hero.locator('.hj-visual').boundingBox();
  if (!boundaryVisual) throw new Error('Hero visual should be laid out at its height boundary');
  expect(boundaryVisual.y).toBeGreaterThanOrEqual(76);
  expect(boundaryVisual.y + boundaryVisual.height).toBeLessThanOrEqual(720);
});
test('the adoption chapter shows how Zeno and the customer build platform habits together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const section = page.getByRole('region', { name: 'Adoption is built together.' });
  await expect(section.getByText('After launch', { exact: true })).toBeVisible();
  await expect(section.locator('.split-heading > p')).toHaveText(
    'We stay in the rollout after the first agent goes live. Together, we watch where teams return, remove friction, and turn what works into the next workflow.',
  );

  const story = section.locator('.adoption-partnership-story');
  await expect(story).toHaveCount(1);
  await expect(story).not.toContainText(/illustrative/i);

  const stages = story
    .getByRole('list', { name: 'Platform adoption after launch' })
    .getByRole('listitem');
  await expect(stages).toHaveCount(3);
  for (const [index, stage] of ['launch', 'return', 'habit'].entries()) {
    await expect(stages.nth(index)).toHaveAttribute('data-adoption-stage', stage);
  }
  await expect(stages).toHaveText([
    'First team live',
    'Teams returning',
    'Platform in everyday use',
  ]);

  const partnerBand = story.locator('.adoption-partner-band');
  await expect(partnerBand).toContainText('Zeno + your team');
  const actions = partnerBand
    .getByRole('list', { name: 'Partnership actions after launch' })
    .getByRole('listitem');
  await expect(actions).toHaveCount(3);
  for (const [index, stage] of ['launch', 'return', 'habit'].entries()) {
    await expect(actions.nth(index)).toHaveAttribute('data-partner-action', stage);
  }
  await expect(actions).toHaveText([
    'Review real usage',
    'Improve with the team',
    'Expand what works',
  ]);

  // The rejected controls composition and older deployment miniatures are gone. On desktop the
  // stage labels follow the rising curve and the shared action band sits beneath the whole journey.
  await expect(
    section.locator(
      '.benefit-grid, .benefit-item, .benefit-visual, .scale-story, .scale-budget, .scale-principles',
    ),
  ).toHaveCount(0);
  const desktopStages = await stages.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  );
  const desktopBand = await partnerBand.boundingBox();
  const [launchTop, returnTop, habitTop] = desktopStages;
  if (
    !desktopBand ||
    launchTop === undefined ||
    returnTop === undefined ||
    habitTop === undefined
  ) {
    throw new Error('Adoption partnership composition should be laid out');
  }
  expect(launchTop).toBeGreaterThan(returnTop);
  expect(returnTop).toBeGreaterThan(habitTop);
  expect(desktopBand.y).toBeGreaterThan(Math.max(...desktopStages));

  // At tablet width the adoption stages become one ordinary reading sequence. The partnership
  // actions remain complete, and neither layout introduces horizontal overflow.
  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletStages = await stages.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  );
  expect(tabletStages).toEqual([...tabletStages].sort((a, b) => a - b));
  expect(new Set(tabletStages).size).toBe(3);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    'the adoption partnership must not overflow at tablet width',
  ).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileColumns = await partnerBand
    .locator('ol')
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(mobileColumns).toBe(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    'the adoption partnership must not overflow on mobile',
  ).toBe(true);
});
test('every solutions page is written for its own industry', async ({ page }) => {
  const seenAgents = new Set<string>();
  const seenHeadings = new Set<string>();

  for (const solution of solutions) {
    await page.goto(`/solutions/${solution.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(solution.headline);

    // A heading that reads the same on two industries is boilerplate, not targeting.
    for (const heading of await page.locator('main h2:not(.visually-hidden)').allTextContents()) {
      expect(seenHeadings.has(heading), `"${heading}" is used on more than one page`).toBe(false);
      seenHeadings.add(heading);
    }

    // The agents are the substance of these pages. Each page carries its own, and no agent name is
    // reused: one that fits two industries is written too generally to be worth naming.
    // The two shown on a screen come first, then the rest, so the page order is the two groups in
    // sequence rather than the order they happen to be declared in.
    const shown = [
      ...solution.agents.filter((agent) => agent.surface),
      ...solution.agents.filter((agent) => !agent.surface),
    ].map((agent) => agent.name);
    const agents = await page.locator('.solution-agent-head b').allTextContents();
    expect(agents, `${solution.slug} agents`).toEqual(shown);
    for (const agent of agents) {
      expect(seenAgents.has(agent), `"${agent}" appears on more than one solutions page`).toBe(
        false,
      );
      seenAgents.add(agent);
    }

    // Every agent states what it is allowed to read, which is half the argument on these pages.
    await expect(page.locator('.solution-agent-from')).toHaveCount(solution.agents.length);

    // Two of them are shown on the screen they run on, and the rest stay as text.
    const featured = solution.agents.filter((agent) => agent.surface);
    expect(featured, `${solution.slug} featured agents`).toHaveLength(2);
    const rows = page.locator('.solution-case');
    await expect(rows).toHaveCount(2);
    await expect(page.locator('.solution-agent-rest > li')).toHaveCount(solution.agents.length - 2);

    for (const [index, agent] of featured.entries()) {
      const row = rows.nth(index);
      // The screen drawn is the one the agent declares. A surface we do not ship is a capability
      // claim, so which kind renders is worth pinning rather than trusting the template.
      await expect(row.locator('.solution-surface')).toHaveAttribute(
        'data-surface',
        agent.surface!.kind,
      );

      // The screen is hidden from assistive technology, so the caption beside it is the whole
      // accessible account of the row and has to carry the name, the job and the sources.
      await expect(row.locator('.solution-surface')).toHaveAttribute('aria-hidden', 'true');
      const caption = row.locator('.solution-case-copy');
      await expect(caption).toContainText(agent.name);
      await expect(caption).toContainText(agent.does);
      await expect(caption).toContainText(agent.from);
    }

    // The figures are planning ranges, so each one publishes its qualifier next to the number. A
    // figure without it reads as a measured result.
    const qualifiers = await page.locator('.business-case-qualifier').allTextContents();
    expect(qualifiers).toHaveLength(solution.figureClaimIds.length);
    for (const qualifier of qualifiers) {
      expect(qualifier, `${solution.slug} figure qualifier`).toContain('not a measured result');
    }
    await expect(page.locator('.solution-figures-note')).toContainText('not results anyone has');

    await expect(page.locator('.solution-wall-list li')).toHaveCount(solution.walls.length);
    await expect(page.locator('.solution-question-list dt')).toHaveCount(solution.questions.length);
    await expect(page.locator('.customer-logo-list img')).toHaveCount(8);

    const layout = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const heading = box('.page-intro h1');
      const lede = document.querySelector('.page-intro h1 + p')!.getBoundingClientRect();
      const cells = [...document.querySelectorAll('.business-case-figures > li')].map((cell) =>
        cell.getBoundingClientRect(),
      );
      const wall = [...document.querySelectorAll('.solution-wall-list > li')].map((item) =>
        item.getBoundingClientRect(),
      );
      return {
        ledeGap: lede.top - heading.bottom,
        ledeWidth: lede.width,
        figureRows: new Set(cells.map((cell) => Math.round(cell.top))).size,
        figureWidths: new Set(cells.map((cell) => Math.round(cell.width))).size,
        // The rule under a two-column row belongs to the row: a column gap splits it into two
        // hairlines with a hole between them.
        wallSeam: Math.round(wall[1]!.left - wall[0]!.right),
        caseCopyFirst: [...document.querySelectorAll('.solution-case')].every((row) => {
          const copy = row.querySelector('.solution-case-copy')!;
          const visual = row.querySelector('.solution-case-visual')!;
          // DOCUMENT_POSITION_FOLLOWING: the screen comes after the caption in the source.
          return (copy.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
        }),
        headingColumn: Math.round(
          document.querySelector('.split-heading > p')!.getBoundingClientRect().left,
        ),
        // The item's own left edge carries the rule; its content sits inside the half-gutter, and
        // that is the line the heading above has to meet.
        wallColumn: Math.round(
          document
            .querySelectorAll('.solution-wall-list > li')[1]!
            .querySelector('svg')!
            .getBoundingClientRect().left,
        ),
      };
    });

    // The lede is styled by a rule that once matched on :last-child, so adding anything after it
    // silently stripped its spacing and its measure and dropped it onto the headline's descenders.
    expect(layout.ledeGap, `${solution.slug} lede spacing`).toBeGreaterThan(24);
    expect(layout.ledeWidth, `${solution.slug} lede measure`).toBeLessThanOrEqual(700);

    // Three figures in a grid sized for four leaves the last one spanning the empty track.
    expect(layout.figureRows, `${solution.slug} figures sit on one row`).toBe(1);
    expect(layout.figureWidths, `${solution.slug} figures share one width`).toBe(1);

    // The rows alternate sides on a wide viewport, and the copy is first in the source both ways,
    // so the arrangement is never a reading order.
    expect(layout.caseCopyFirst, `${solution.slug} copy precedes its screen`).toBe(true);

    expect(layout.wallSeam, `${solution.slug} wall rule is continuous`).toBe(0);
    expect(layout.headingColumn, `${solution.slug} heading aligns with its list`).toBe(
      layout.wallColumn,
    );
  }
});

test('the use-case rows stack and stop alternating before the mobile breakpoint', async ({
  page,
}) => {
  const read = async () =>
    page.evaluate(() =>
      [...document.querySelectorAll('.solution-case')].map((row) => {
        const copy = row.querySelector('.solution-case-copy')!.getBoundingClientRect();
        const visual = row.querySelector('.solution-case-visual')!.getBoundingClientRect();
        return {
          stacked: visual.top >= copy.bottom - 1,
          copyLeft: Math.round(copy.left),
          visualLeft: Math.round(visual.left),
          visualWidth: Math.round(visual.width),
        };
      }),
    );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/solutions/manufacturing');
  const wide = await read();
  expect(wide).toHaveLength(2);
  // Side by side, and the second row swaps which side each half is on.
  expect(wide.every((row) => !row.stacked)).toBe(true);
  expect(wide[0]!.copyLeft).toBeLessThan(wide[0]!.visualLeft);
  expect(wide[1]!.copyLeft).toBeGreaterThan(wide[1]!.visualLeft);
  // Swapping sides has to swap the track widths with it, or the screen lands in the column sized
  // for the copy and the second row renders visibly narrower than the first.
  expect(wide[1]!.visualWidth).toBe(wide[0]!.visualWidth);

  // Half of 1100px is not enough for a product screen. The rows stack there, not at 820.
  for (const width of [1100, 820, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const narrow = await read();
    expect(
      narrow.every((row) => row.stacked),
      `stacked at ${width}px`,
    ).toBe(true);
    // The alternation stops with the stacking: both halves start on the same edge on every row.
    for (const row of narrow) {
      expect(row.copyLeft, `alternation reset at ${width}px`).toBe(row.visualLeft);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
      `no horizontal overflow at ${width}px`,
    ).toBe(false);
  }
});

test('the solutions menu opens without scripting and closes once armed', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  const menu = page.locator('.nav-menu');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(menu.locator('a')).toHaveCount(solutions.length + 1);

  // Opening is native to details. Closing again is not, so it is the part worth testing.
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  expect(
    await page.evaluate(
      () => document.activeElement === document.querySelector('.nav-menu summary'),
    ),
    'Escape must leave focus where the reader was',
  ).toBe(true);

  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await page.mouse.click(1200, 500);
  await expect(menu).not.toHaveAttribute('open', '');

  // The whole point of building it on details: it still opens with no JavaScript at all.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto('/');
  await plain.locator('.nav-menu summary').click();
  await expect(plain.locator('.nav-menu')).toHaveAttribute('open', '');
  await expect(plain.locator('.nav-menu-panel a')).toHaveCount(solutions.length + 1);
  await context.close();
});

test('the solutions menu follows the pointer and still answers the keyboard', async ({ page }) => {
  await page.goto('/');
  const menu = page.locator('.nav-menu');
  const summary = menu.locator('summary');
  const away = async () => {
    await page.mouse.move(1200, 600);
    await expect(menu).not.toHaveAttribute('open', '');
  };

  // The trigger is a summary, not an anchor, so it does not pick up the nav link rule on its own.
  // Left unnamed there it renders a size larger and a weight lighter than every link beside it.
  const [triggerType, linkType] = await page.evaluate(() => {
    const type = (element: Element) => {
      const style = getComputedStyle(element);
      return `${style.fontSize}/${style.fontWeight}/${style.fontFamily}`;
    };
    return [
      type(document.querySelector('.nav-menu > summary')!),
      type(document.querySelector('.desktop-nav a')!),
    ];
  });
  expect(triggerType, 'the trigger is set like the links beside it').toBe(linkType);

  await expect(menu).not.toHaveAttribute('open', '');
  await summary.hover();
  await expect(menu).toHaveAttribute('open', '');

  // The panel hangs below the header rule, so the pointer crosses a gap to reach it. It must not
  // shut on the way down.
  await menu.locator('.nav-menu-panel a').first().hover();
  await page.waitForTimeout(220);
  await expect(menu).toHaveAttribute('open', '');
  await away();

  // A click lands on a menu the pointer has already opened, so the native toggle would close it.
  await summary.click();
  await expect(menu).toHaveAttribute('open', '');
  await away();

  // Enter is pressed with the pointer elsewhere, and keeps the toggle it depends on.
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('open', '');

  // Closing it under a reader working through the panel would throw their focus to the top of the
  // page, so a panel holding focus stays open however the pointer moves. Focus is set directly
  // rather than by Tab: WebKit leaves links out of the tab order unless full keyboard access is on.
  await page.locator('.nav-menu-panel a').first().focus();
  await page.mouse.move(1200, 600);
  await page.waitForTimeout(220);
  await expect(menu).toHaveAttribute('open', '');
  await expect(page.locator('.nav-menu-panel a').first()).toBeFocused();
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

test('the deployment fact publishes with the qualifier that keeps it honest', async ({ page }) => {
  await page.goto('/');
  const line = page.locator('.trust-deployment');
  await expect(line).toHaveCount(1);

  // "Available" is not "default". The qualifier is part of the claim record and has to be on the
  // page with it, the way the business-case figures carry theirs.
  await expect(line).toContainText('dedicated single-tenant infrastructure');
  await expect(line.locator('span')).toHaveText(
    'offered alongside the shared deployment, not in place of it',
  );

  // The models the owner did not confirm must not appear anywhere on the page.
  const body = (await page.locator('body').innerText()).toLowerCase();
  for (const unconfirmed of ['on-premise', 'on premise', 'air-gapped', 'bring your own cloud']) {
    expect(body, `"${unconfirmed}" is not an approved deployment claim`).not.toContain(unconfirmed);
  }
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

test('the header stays put, and an anchor never lands underneath it', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('.site-header');
  await expect(header).toHaveCSS('position', 'sticky');

  await page.evaluate(() => window.scrollTo({ top: 2400, behavior: 'instant' }));
  await page.waitForFunction(() => window.scrollY >= 2400);
  const box = await header.boundingBox();
  expect(Math.round(box?.y ?? -1), 'the header must hold the top of the viewport').toBe(0);
  await expect(header.getByRole('link', { name: 'Book a demo' })).toBeVisible();

  // scroll-padding-top has to clear it, or the section a reader asked for opens behind the bar.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Why Zeno' })
    .click();
  const headerHeight = Math.round((await header.boundingBox())?.height ?? 0);
  await expect
    .poll(async () => Math.round((await page.locator('#why').boundingBox())?.y ?? -1))
    .toBeGreaterThanOrEqual(headerHeight);
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

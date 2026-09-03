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
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Governed AI for Europe.');
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
  // Four full axe passes, each preceded by a page load and a settle. It runs close to twenty
  // seconds on an idle machine, so the default half-minute leaves nothing for the contention of
  // three browsers running the rest of the suite alongside it.
  test.slow();

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
  const proofIndex = sectionHeadings.indexOf('What enterprises are seeing.');
  const visionIndex = sectionHeadings.indexOf('Software is the easy half.');
  const shiftIndex = sectionHeadings.indexOf('The same quarter, two ways.');

  // One line through the page: proof, then the problem, then the people who work on it, then the
  // before and after. The mechanism lives on /product, and the hero's stack is the only place the
  // homepage draws it, so nothing here explains it twice.
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
  await expect(page.locator('html')).not.toHaveAttribute('data-motion', 'on');
  // The hero scene is simply already finished, which is the state its choreography settles into.
  // Choosing an agent still works — that is interaction, not motion — so one panel is on screen.
  await expect(page.locator('.hw-controls li')).toHaveCount(4);
  await expect(page.locator('.hw-job[data-current]')).toHaveCount(1);
  await expect(page.locator('.hw-job[data-current] .hw-result')).toBeVisible();
  // And the card visuals are drawn in full: bars at height, the figure at its final value.
  await expect(page.locator('.benefit-visual')).toHaveCount(3);
  await expect(page.locator('.bv-figure span[data-figure]')).toHaveText('64%');
  expect(
    await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('.bv-col i')).filter(
          (bar) => getComputedStyle(bar).transform !== 'none',
        ).length,
    ),
    'no bar may be left scaled down',
  ).toBe(0);
  await expect(page.getByText('Draft the Q3 board update.')).toBeVisible();
  for (const visual of ['.hero-workspace', '.vision-media-lead', '.trust-certifications']) {
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
  await expect(page.locator('.hw-controls li')).toHaveCount(4);
  // Every agent's job and sources are simply on the page, and nothing is offered that cannot be
  // clicked.
  await expect(page.locator('.hw-job')).toHaveCount(3);
  await expect(page.locator('.hw-source-set:visible')).toHaveCount(3);
  await expect(page.getByText('Draft the Q3 board update.')).toBeVisible();
  await expect(page.getByText('Build the weekly ops pack.')).toBeVisible();
  await expect(page.locator('.hero-workspace [role="button"]')).toHaveCount(0);
  await expect(page.locator('.hw-pick')).toBeHidden();
  await expect(page.locator('.benefit-visual')).toHaveCount(3);
  await expect(page.locator('.bv-figure span[data-figure]')).toHaveText('64%');
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

test('the hero states the angle, and picking an agent shows the job it is running', async ({
  page,
}) => {
  await page.goto('/');
  const hero = page.locator('.hero-workspace');
  await expect(hero).toBeVisible();
  await expect(hero).toHaveAttribute('data-workspace', 'on');

  // Named as the platform, and stamped with the region it runs in.
  await expect(hero.getByText('The enterprise AI platform')).toBeVisible();
  await expect(hero.locator('.hw-region-stars')).toBeVisible();

  // Three agents, one running, and every mark is a drawn glyph rather than a letter.
  await expect(hero.locator('.hw-agent')).toHaveCount(3);
  await expect(hero.locator('.hw-mark .glyph')).toHaveCount(3);
  await expect(hero.locator('.hw-agent[data-running]')).toHaveCount(1);
  await expect(hero.locator('.hw-agent[data-running]')).toContainText('Finance');
  await expect(hero.locator('.hw-job[data-current]')).toHaveAttribute('data-job', 'finance');

  // Three stages read left to right: the agent, what it is connected to, what it is doing.
  await expect(hero.locator('.hw-source-set')).toHaveCount(3);
  await expect(hero.locator('.hw-source-set[data-current]')).toHaveCount(1);
  await expect(hero.locator('.hw-source-set[data-current]')).toHaveAttribute(
    'data-sources',
    'finance',
  );
  await expect(hero.locator('.hw-source-set[data-current] li')).toHaveCount(3);
  // Real connectors, drawn: the mark carries recognition, the name beside it carries meaning, and
  // the image is decorative because the name is already text.
  await expect(hero.locator('.hw-source-set[data-current] img')).toHaveCount(3);
  // Nothing labels the marks in text, so every one has to name itself in alt or the column says
  // nothing at all to a screen reader.
  await expect(
    hero.locator('.hw-source-set[data-current]').getByRole('img', { name: 'SharePoint' }),
  ).toBeVisible();
  expect(
    await hero
      .locator('.hw-source-set img')
      .evaluateAll((nodes) => nodes.every((node) => (node.getAttribute('alt') ?? '').length > 0)),
    'a mark with no label beside it must carry its own name',
  ).toBe(true);
  expect(
    await hero
      .locator('.hw-source-set img')
      .evaluateAll((nodes) => nodes.every((node) => (node as HTMLImageElement).naturalWidth > 0)),
    'every connector mark must actually load',
  ).toBe(true);

  // The four controls are the argument, so they are named here as well as on /product.
  await expect(hero.locator('.hw-controls li')).toHaveCount(4);
  for (const control of ['Knowledge access', 'Model choice', 'Human checkpoint', 'EU operating']) {
    await expect(hero.locator('.hw-controls')).toContainText(control);
  }

  // Picking an agent changes the job, by pointer and by keyboard, and marks which one is current.
  await hero.locator('.hw-agent[data-agent="legal"]').click();
  await expect(hero.locator('.hw-job[data-current]')).toHaveAttribute('data-job', 'legal');
  await expect(hero.getByText('Check the supplier renewal.')).toBeVisible();
  // The sources follow the agent: each one only ever lists what that team may reach.
  await expect(hero.locator('.hw-source-set[data-current]')).toHaveAttribute(
    'data-sources',
    'legal',
  );
  await expect(
    hero.locator('.hw-source-set[data-current]').getByRole('img', { name: 'Spellbook' }),
  ).toBeVisible();
  // No mark appears twice across the three agents: a repeat reads as padding rather than as the
  // systems that team actually works in.
  const marks = await hero
    .locator('.hw-source-set img')
    .evaluateAll((nodes) =>
      nodes.map(
        (node) =>
          `${node.closest('[data-sources]')?.getAttribute('data-sources')}:${node.getAttribute('alt')}`,
      ),
    );
  expect(new Set(marks).size, 'every agent + connector pairing must be distinct').toBe(
    marks.length,
  );
  await expect(hero.locator('.hw-agent[data-agent="legal"]')).toHaveAttribute(
    'aria-current',
    'true',
  );
  await expect(hero.locator('.hw-agent[aria-current="true"]')).toHaveCount(1);

  await hero.locator('.hw-agent[data-agent="operations"]').focus();
  await page.keyboard.press('Enter');
  await expect(hero.locator('.hw-job[data-current]')).toHaveAttribute('data-job', 'operations');

  // Switching agent must move nothing at all — not the frame, and not a single thing inside it.
  // Every landmark is sampled, because the shift that gets noticed is never the one in the frame's
  // own height: it is a nine-pixel step in one column that only shows up when you click through.
  const landmarks = [
    '.hero-workspace',
    '.hw-sources .product-label',
    '.hw-source-sets',
    '.hw-source-set[data-current]',
    '.hw-source-set[data-current] li',
    '.hw-source-note',
    '.hw-job[data-current]',
    '.hw-job[data-current] .hw-job-title',
    '.hw-job[data-current] .hw-result',
    '.hw-controls',
  ];
  const layouts: number[][] = [];
  for (const agent of ['finance', 'legal', 'operations']) {
    await hero.locator(`.hw-agent[data-agent="${agent}"]`).click();
    await expect(hero.locator('.hw-job[data-current]')).toHaveAttribute('data-job', agent);
    // The panel replays its entrance on every switch, so measuring straight after the click reads
    // a frame of that animation and calls it a layout shift.
    await settleAnimations(page);
    layouts.push(
      // Offsets from the frame, not from the viewport: clicking scrolls the target into view, and a
      // viewport-relative reading would call that scroll a layout shift.
      await page.evaluate((selectors) => {
        const frame = document.querySelector('.hero-workspace')?.getBoundingClientRect();
        const boxes: number[] = [];
        for (const selector of selectors) {
          const box = document.querySelector(selector)?.getBoundingClientRect();
          boxes.push(box && frame ? box.top - frame.top : -1, box?.height ?? -1);
        }
        return boxes;
      }, landmarks),
    );
  }

  // A pixel of tolerance, because two different strings in the same box land on slightly different
  // fractional baselines in Firefox and WebKit. That is type metrics, not movement, and it leaves
  // the check far tighter than anything a reader could see.
  const moved = landmarks
    .map((selector, index) => {
      const spread = (offset: number) => {
        const values = layouts.map((layout) => layout[index * 2 + offset] ?? 0);
        return Math.max(...values) - Math.min(...values);
      };
      return { selector, top: spread(0), height: spread(1) };
    })
    .filter((entry) => entry.top > 1 || entry.height > 1)
    .map((entry) => `${entry.selector} moved ${entry.top.toFixed(1)}/${entry.height.toFixed(1)}`);
  expect(moved, 'nothing may move between agents').toEqual([]);

  // The choreography is a single run that finishes rather than a loop that never does.
  await settleRevealMotion(page);
  expect(
    await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === 'running').length,
    ),
    'the hero scene must settle',
  ).toBe(0);

  // And once it has, the scene travels with the page one pixel per pixel: nothing here pins, holds,
  // or waits on a timer.
  const before = await hero.boundingBox();
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }));
  await page.waitForFunction(() => window.scrollY >= 300);
  const after = await hero.boundingBox();
  if (!before || !after) throw new Error('the hero scene should be laid out');
  expect(Math.round(before.y - after.y), 'the hero scene must not pin').toBe(300);
});

test('each why-card carries its own small product visual', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.benefit-item');
  await expect(cards).toHaveCount(3);
  await expect(page.locator('.benefit-visual')).toHaveCount(3);

  // Each visual belongs to its own card rather than being repeated or mismatched.
  await expect(cards.nth(0).locator('.benefit-visual')).toHaveAttribute('data-visual', 'workspace');
  await expect(cards.nth(1).locator('.benefit-visual')).toHaveAttribute('data-visual', 'access');
  await expect(cards.nth(2).locator('.benefit-visual')).toHaveAttribute('data-visual', 'adoption');

  // Each illustrates the sentence above it, so none of them is read out a second time.
  for (const index of [0, 1, 2]) {
    await expect(cards.nth(index).locator('.benefit-visual')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  }

  await expect(cards.nth(0).locator('.bv-rows li')).toHaveCount(3);
  await expect(cards.nth(0).locator('.bv-foot')).toContainText('Your company information');
  await expect(cards.nth(1).locator('.bv-access')).toHaveCount(3);
  await expect(cards.nth(1).locator('[data-level="own"]')).toHaveText('Owner');
  await expect(cards.nth(2).locator('.bv-col')).toHaveCount(8);

  // All three are the same panel: a header band, a body and a footer band, at one size. This is
  // what makes the row read as three of one thing rather than three loose sketches.
  for (const index of [0, 1, 2]) {
    await expect(cards.nth(index).locator('.bv-head')).toBeVisible();
    await expect(cards.nth(index).locator('.bv-foot')).toBeVisible();
  }
  const boxes = await page.locator('.benefit-visual').evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return `${Math.round(box.width)}x${Math.round(box.height)}@${Math.round(box.top)}`;
    }),
  );
  expect(new Set(boxes).size, 'the three panels must be one size on one line').toBe(1);

  // The adoption figure counts up and lands on its value exactly, the same contract the business
  // case figures are held to: an animation must never leave a wrong number on screen.
  await settleRevealMotion(page);
  await expect(page.locator('.bv-figure span[data-figure]')).toHaveText('64%');
  const bars = await page
    .locator('.bv-col i')
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).transform));
  expect(
    bars.every((transform) => transform === 'none'),
    'every bar must finish at height',
  ).toBe(true);
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

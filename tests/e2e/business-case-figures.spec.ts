import { expect, test } from '@playwright/test';

const locales = [
  {
    locale: 'en',
    path: '/',
    figures: ['~92 hrs', '2,000+', '+65%', '~€7–8M'],
    labels: ['saved per person each year', 'agents created'],
    qualifiers: ['Annualized team estimate', 'across hundreds of enterprises'],
  },
  {
    locale: 'de',
    path: '/de/',
    figures: ['~92 Std.', '2.000+', '+65%', '~€7–8 Mio.'],
    labels: ['Zeitersparnis pro Person und Jahr', 'erstellte KI-Agenten'],
    qualifiers: ['Hochrechnung auf Teambasis', 'in Hunderten Unternehmen'],
  },
] as const;

for (const copy of locales) {
  test(`${copy.locale} business-case figures preserve the exact meanings and static accessibility`, async ({
    page,
    browser,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(copy.path);
    const section = page.locator('#business-case');
    await expect(section.locator('.business-case-count')).toHaveText([...copy.figures]);
    await expect(section.locator('.visually-hidden')).toHaveText([...copy.figures]);
    for (const [index, label] of copy.labels.entries()) {
      const card = section.getByRole('listitem').nth(index);
      await expect(card).toContainText(label);
      await expect(card).toContainText(copy.qualifiers[index]!);
    }
    await expect(section).not.toContainText(
      /3–10%|~200|monthly interactions|monatliche Interaktionen|20 hours|20 Stunden|46 working weeks|46 Arbeitswochen|150/,
    );

    const context = await browser.newContext({ javaScriptEnabled: false });
    const plain = await context.newPage();
    await plain.goto(copy.path);
    await expect(plain.locator('#business-case .business-case-count')).toHaveText([
      ...copy.figures,
    ]);
    for (const qualifier of copy.qualifiers)
      await expect(
        plain.locator('#business-case').getByText(qualifier, { exact: true }),
      ).toBeVisible();
    await context.close();
  });

  test(`${copy.locale} grouped agent count animates one quantity and replays`, async ({ page }) => {
    await page.goto(copy.path);
    await expect(page.locator('html')).toHaveAttribute('data-motion-ready', 'on');
    for (let arrival = 0; arrival < 2; arrival++) {
      await page.evaluate(async () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
      });
      const frames = await page.evaluate(async (target) => {
        const figure = document.querySelector(
          '[data-metric="metric-agents-created"] .business-case-count',
        );
        if (!figure) throw new Error('Missing agent count');
        return new Promise<string[]>((resolve, reject) => {
          const frames: string[] = [];
          const timeout = window.setTimeout(() => {
            observer.disconnect();
            reject(new Error('Counter did not complete'));
          }, 5000);
          const observer = new MutationObserver(() => {
            const value = figure.textContent ?? '';
            // The previous arrival can restore its exact final string after rounding up to it.
            // Sample the new count only once it leaves that static, approved value.
            if (frames.length === 0 && value === target) return;
            frames.push(value);
            if (frames.length > 1 && frames.at(-1) === target) {
              window.clearTimeout(timeout);
              observer.disconnect();
              resolve(frames);
            }
          });
          observer.observe(figure, { childList: true, characterData: true, subtree: true });
          figure.scrollIntoView({ behavior: 'instant', block: 'center' });
        });
      }, copy.figures[1]);
      const numbers = frames.map((frame) => Number(frame.replace(/[.,+]/g, '')));
      expect(numbers.some((value) => value > 2 && value < 2000)).toBe(true);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      for (const frame of frames) {
        expect(frame).toMatch(
          copy.locale === 'de'
            ? /^(?:\d{1,3}|\d{1,3}(?:\.\d{3})+)\+$/
            : /^(?:\d{1,3}|\d{1,3}(?:,\d{3})+)\+$/,
        );
      }
      await expect(page.locator('#business-case .business-case-count')).toHaveText([
        ...copy.figures,
      ]);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('#business-case .business-case-count')).toHaveText([...copy.figures]);
  });

  for (const width of [390, 768, 1101, 1440]) {
    test(`${copy.locale} business-case qualifiers reflow at ${width}px and enlarged text`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(copy.path);
      const section = page.locator('#business-case');
      await section.scrollIntoViewIfNeeded();
      for (const scale of [100, 200]) {
        await page.addStyleTag({ content: `html { font-size: ${scale}%; }` });
        const columns = await section.getByRole('listitem').evaluateAll((cards) => {
          const bounds = cards.map((card) => card.getBoundingClientRect());
          return bounds.filter((card) => Math.abs(card.top - bounds[0]!.top) < 1).length;
        });
        expect(columns).toBe(
          scale === 200 ? (width >= 1101 ? 2 : 1) : width <= 560 ? 1 : width <= 1100 ? 2 : 4,
        );
        const violations = await section.evaluate((element) => {
          const failures: string[] = [];
          for (const card of element.querySelectorAll('li')) {
            const outer = card.getBoundingClientRect();
            for (const paragraph of card.querySelectorAll('p')) {
              const range = document.createRange();
              // The clipped screen-reader twin has text bounds but no visible footprint.
              range.selectNodeContents(
                paragraph.querySelector('.business-case-count') ?? paragraph,
              );
              const text = range.getBoundingClientRect();
              if (
                text.left < outer.left - 1 ||
                text.right > outer.right + 1 ||
                text.bottom > outer.bottom + 1
              )
                failures.push(paragraph.textContent ?? '');
            }
          }
          if (document.documentElement.scrollWidth > window.innerWidth + 1)
            failures.push('page overflow');
          return failures;
        });
        expect(violations, `${width}px at ${scale}%`).toEqual([]);
        if (scale === 100) {
          const line = await section
            .getByText(copy.qualifiers[0], { exact: true })
            .evaluate((element) => {
              const text = document.createRange();
              text.selectNodeContents(element);
              return {
                height: text.getBoundingClientRect().height,
                lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
              };
            });
          expect(line.height).toBeLessThanOrEqual(line.lineHeight + 1);
          const figureLines = await section
            .locator('.business-case-count')
            .first()
            .evaluate((element) => {
              const text = document.createRange();
              text.selectNodeContents(element);
              return text.getClientRects().length;
            });
          expect(figureLines).toBe(1);
        }
        if (scale === 200) {
          await section.locator('.business-case-figures').screenshot({
            path: test.info().outputPath('figures-200-percent.png'),
          });
        }
      }
    });
  }
}

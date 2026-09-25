import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { customerStoryDrafts } from '../../src/lib/content/customer-stories';
import { translatePageText } from '../../src/lib/i18n/page-copy';

const industryLabels: Record<string, string> = {
  atares: 'M&A',
  b2venture: 'Venture capital',
  mahle: 'Manufacturing',
  kbc: 'Management consulting',
};

test('both directory languages retain the same readable heading scale', async ({ page }) => {
  for (const width of [390, 768, 1101, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const scale of [100, 200]) {
      const sizes: string[][] = [];
      for (const path of ['/customers', '/de/kunden']) {
        await page.goto(path);
        await page.addStyleTag({ content: `html { font-size: ${scale}%; }` });
        await page.evaluate(() => document.fonts.ready);
        sizes.push(
          await page
            .locator('main h1, main ul h2')
            .evaluateAll((headings) =>
              headings.map((heading) => getComputedStyle(heading).fontSize),
            ),
        );
        if (width === 390 && scale === 200) {
          const lineCount = await page.getByRole('heading', { level: 1 }).evaluate((heading) => {
            const range = document.createRange();
            range.selectNodeContents(heading);
            return new Set([...range.getClientRects()].map((box) => Math.round(box.top))).size;
          });
          expect(lineCount).toBeLessThanOrEqual(2);
        }
      }
      expect(sizes[1]).toEqual(sizes[0]);
    }
  }
});

for (const locale of ['en', 'de'] as const) {
  const copy = { text: (value: string) => translatePageText(locale, value) };
  const destination = locale === 'en' ? '/customers' : '/de/kunden';
  const allLabel = locale === 'en' ? 'All case studies' : 'Alle Fallstudien';
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale} case studies are reachable from desktop and mobile without logo previews, JS ${javaScriptEnabled}`, async ({
      browser,
      browserName,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
      const page = await context.newPage();
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(locale === 'en' ? '/product' : '/de/produkt');
        const menu =
          width === 1440
            ? page.locator('[data-nav-menu="solutions"]')
            : page.locator('.mobile-menu');
        await menu.locator('summary').focus();
        await page.keyboard.press('Enter');
        await expect(menu.getByRole('link', { name: /All industries|Alle Branchen/ })).toHaveCount(
          0,
        );
        const link = menu.getByRole('link', { name: allLabel, exact: true });
        await expect(link).toHaveAttribute('href', destination);
        await menu.locator('summary').focus();
        if (browserName === 'chromium') {
          for (let position = 0; position < (width === 1440 ? 6 : 8); position++)
            await page.keyboard.press('Tab');
        } else {
          // macOS Firefox/WebKit can omit links from Tab navigation without full keyboard access.
          // The menu was opened by keyboard, so check the same focused activation and outline.
          await link.focus();
        }
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS('outline-style', 'solid');
        await link.press('Enter');
        await expect(page).toHaveURL(new RegExp(`${destination}$`));
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
          copy.text('Customer stories.'),
        );
        await expect(page.locator('main ul li')).toHaveCount(4);
        for (const story of customerStoryDrafts) {
          const storyLink = page
            .locator('main')
            .getByRole('link')
            .filter({
              has: page.getByRole('heading', { name: copy.text(story.title), exact: true }),
            });
          await expect(storyLink).toHaveAttribute('href', `${destination}/${story.slug}`);
          await expect(storyLink.getByRole('paragraph').first()).toHaveText(
            copy.text(industryLabels[story.slug]!),
          );
          await expect(storyLink.getByText(story.company, { exact: true })).toHaveCount(0);
          await storyLink.click();
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.text(story.title));
          const back = page.getByRole('link', {
            name: copy.text('← Customer stories'),
            exact: true,
          });
          await expect(back).toHaveAttribute('href', destination);
          await back.click();
          await expect(page).toHaveURL(new RegExp(`${destination}$`));
        }
      }
      await context.close();
    });
  }

  test(`${locale} case study index has reciprocal SEO and a page-preserving language switcher`, async ({
    page,
    request,
  }) => {
    await page.goto(destination);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://heyzeno.com${destination}`,
    );
    for (const [language, path] of [
      ['en', '/customers'],
      ['de', '/de/kunden'],
      ['x-default', '/customers'],
    ]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute(
        'href',
        `https://heyzeno.com${path}`,
      );
    }
    const other =
      locale === 'en'
        ? { label: 'Deutsch', path: '/de/kunden' }
        : { label: 'English', path: '/customers' };
    await page
      .locator('.site-footer')
      .getByRole('link', { name: other.label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${other.path}$`));
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('<loc>https://heyzeno.com/customers</loc>');
    expect(sitemap).toContain('<loc>https://heyzeno.com/de/kunden</loc>');
  });

  test(`${locale} case study index and navigation reflow`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [390, 768, 1101, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(destination);
      await page.evaluate(() => document.fonts.ready);
      for (const scale of [100, 200]) {
        await page.addStyleTag({ content: `html { font-size: ${scale}%; }` });
        const violations = await page.locator('main').evaluate((main) =>
          [...main.querySelectorAll('h1, h2, p, a')]
            .filter((element) => {
              const range = document.createRange();
              range.selectNodeContents(element);
              return [...range.getClientRects()].some(
                (box) => box.left < -1 || box.right > innerWidth + 1,
              );
            })
            .map((element) => element.textContent),
        );
        expect(violations).toEqual([]);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
        if (info.project.name === 'chromium') {
          await page.screenshot({
            path: info.outputPath(`index-${width}-${scale}.png`),
            fullPage: true,
          });
        }
      }
      await page.addStyleTag({ content: 'html { font-size: 100%; }' });
      const menu =
        width > 1100 ? page.locator('[data-nav-menu="solutions"]') : page.locator('.mobile-menu');
      await menu.locator('summary').click();
      const link = menu.getByRole('link', { name: allLabel, exact: true });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeInViewport();
      if (info.project.name === 'chromium')
        await page.screenshot({ path: info.outputPath(`menu-${width}.png`) });
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
  });
}

import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const locales = [
  {
    locale: 'en',
    routes: ['manufacturing', 'management-consulting', 'm-and-a', 'private-equity', 'legal'].map(
      (slug) => `/solutions/${slug}`,
    ),
    destination: '/security',
    link: 'Security and Trust Center →',
    policy: 'model-training policies',
    trustCenter: 'Open the Trust Center',
  },
  {
    locale: 'de',
    routes: ['fertigung', 'unternehmensberatung', 'ma', 'private-equity', 'recht'].map(
      (slug) => `/de/loesungen/${slug}`,
    ),
    destination: '/de/sicherheit',
    link: 'Sicherheit und Trust Center →',
    policy: 'Richtlinien zum Modelltraining',
    trustCenter: 'Trust Center öffnen',
  },
] as const;

for (const copy of locales) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${copy.locale} solution security links work with JavaScript ${javaScriptEnabled}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
      const page = await context.newPage();
      for (const route of copy.routes) {
        await page.goto(route);
        const faq = page.locator('.solution-questions');
        await expect(faq.locator('dt')).toHaveCount(4);
        await expect(faq).toContainText('Zero Data Retention (ZDR)');
        await expect(faq).toContainText(copy.policy);
        const link = faq.getByRole('link', { name: copy.link, exact: true });
        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute('href', copy.destination);
        await link.focus();
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS('outline-style', 'solid');
        await expect(link).not.toHaveCSS('outline-width', '0px');
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(new RegExp(`${copy.destination}$`));
        const trust = page.getByRole('link', { name: copy.trustCenter }).first();
        await expect(trust).toHaveAttribute('href', 'https://trust.textcortex.com/home');
        await expect(trust).toHaveAttribute('target', '_blank');
        await expect(trust).toHaveAttribute('rel', /noopener/);
        await expect(trust).toHaveAttribute('rel', /noreferrer/);
      }
      await context.close();
    });
  }

  for (const width of [390, 768, 1101, 1440]) {
    test(`${copy.locale} security references reflow at ${width}px`, async ({ page }, info) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      for (const [index, route] of copy.routes.entries()) {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        const faq = page.locator('.solution-questions');
        for (const scale of [100, 200]) {
          await page.addStyleTag({ content: `html { font-size: ${scale}%; }` });
          await faq.scrollIntoViewIfNeeded();
          const violations = await faq.evaluate((section) => {
            const outside = [...section.querySelectorAll('dt, dd, a')].filter((element) => {
              const range = document.createRange();
              range.selectNodeContents(element);
              const bounds = range.getBoundingClientRect();
              return bounds.left < -1 || bounds.right > innerWidth + 1;
            });
            return {
              pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
              outside: outside.map((element) => element.textContent),
            };
          });
          expect(violations, `${route} at ${scale}%`).toEqual({
            pageOverflow: false,
            outside: [],
          });
          if (
            info.project.name === 'chromium' &&
            (width === 390 || width === 1440) &&
            (scale === 100 || index === 0)
          )
            await faq.screenshot({ path: info.outputPath(`faq-${index}-${scale}.png`) });
        }
      }
      await page.addStyleTag({ content: 'html { font-size: 100%; }' });
      const results = await new AxeBuilder({ page })
        .include('.solution-questions')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

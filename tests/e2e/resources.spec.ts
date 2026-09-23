import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resourceLinks } from '../../src/lib/content/resources';

for (const locale of ['en', 'de'] as const) {
  const path = locale === 'en' ? '/pricing' : '/de/business-case';
  const label = locale === 'en' ? 'Resources' : 'Ressourcen';

  test(`${locale} resources preserve destinations, safe external links and footer order`, async ({
    page,
  }) => {
    await page.goto(path);
    const resources = page.locator('[data-nav-menu="resources"]');
    await resources.locator('summary').click();
    await expect(resources.locator('summary')).toHaveText(label);
    const footer = page.locator('.footer-navigation');
    await expect(footer.getByRole('heading')).toHaveText(
      locale === 'en'
        ? ['Explore', 'Company', 'Resources', 'Legal']
        : ['Entdecken', 'Unternehmen', 'Ressourcen', 'Rechtliches'],
    );
    for (const container of [resources, footer]) {
      for (const resource of resourceLinks) {
        const link = container.getByRole('link', { name: resource.labels[locale], exact: false });
        await expect(link).toHaveAttribute('href', resource.destination);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        await expect(link).toHaveAccessibleName(
          `${resource.labels[locale]}${locale === 'en' ? ' (opens in a new tab)' : ' (öffnet in einem neuen Tab)'}`,
        );
      }
    }
  });

  test(`${locale} dropdowns are exclusive and support hover, click, focus exit and keyboard`, async ({
    page,
  }) => {
    await page.goto(path);
    const solutions = page.locator('[data-nav-menu="solutions"]');
    const resources = page.locator('[data-nav-menu="resources"]');
    await solutions.locator('summary').hover();
    await expect(solutions).toHaveAttribute('open', '');
    await resources.locator('summary').hover();
    await expect(solutions).not.toHaveAttribute('open', '');
    await expect(resources).toHaveAttribute('open', '');
    await resources.getByRole('link').first().hover();
    await expect(resources).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(resources).not.toHaveAttribute('open', '');
    await expect(resources.locator('summary')).toBeFocused();
    await page.mouse.move(5, 500);
    for (const key of ['Enter', 'Space']) {
      await resources.locator('summary').focus();
      await page.keyboard.press(key);
      await expect(resources).toHaveAttribute('open', '');
      await page.keyboard.press(key);
      await expect(resources).not.toHaveAttribute('open', '');
    }
    await resources.locator('summary').click();
    await expect(resources).toHaveAttribute('open', '');
    await resources.locator('summary').click();
    await expect(resources).not.toHaveAttribute('open', '');
    await resources.locator('summary').press('Enter');
    await resources.getByRole('link').first().focus();
    await expect(resources).toHaveAttribute('open', '');
    await page.locator('.nav-business-case-cta').focus();
    await expect(resources).not.toHaveAttribute('open', '');
    await resources.locator('summary').press('Enter');
    await page.locator('h1').click();
    await expect(resources).not.toHaveAttribute('open', '');
    await resources.locator('summary').focus();
    expect(
      await resources
        .locator('summary')
        .evaluate((element) => getComputedStyle(element).outlineStyle),
    ).not.toBe('none');
    await resources.locator('summary').press('Enter');
    expect(
      (await new AxeBuilder({ page }).include('.site-header').include('.site-footer').analyze())
        .violations,
    ).toEqual([]);
  });

  test(`${locale} resource clicks open isolated tabs and close the mobile disclosure`, async ({
    page,
    context,
  }) => {
    await context.route('https://www.youtube.com/@textcortex/videos', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>Synthetic resource</title>' }),
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await page.locator('.mobile-menu > summary').click();
    const popupReady = context.waitForEvent('page');
    await page.locator('.mobile-resource-group').getByRole('link', { name: 'YouTube' }).click();
    const popup = await popupReady;
    await popup.waitForLoadState();
    expect(popup.url()).toBe('https://www.youtube.com/@textcortex/videos');
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
    await popup.close();
  });

  for (const width of [390, 768, 1101, 1280, 1440]) {
    test(`${locale} resources reflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const header = page.locator('.site-header');
      const footer = page.locator('.site-footer');
      if (width <= 1100) {
        await page.locator('.mobile-menu > summary').click();
        await expect(page.locator('.mobile-resource-label')).toHaveText(label);
        for (const resource of resourceLinks) {
          const link = page
            .locator('.mobile-resource-group')
            .getByRole('link', { name: resource.labels[locale] });
          await link.scrollIntoViewIfNeeded();
          await expect(link).toBeInViewport();
          await expect(link).toHaveAttribute('href', resource.destination);
        }
        const demo = page.locator('.mobile-menu nav').getByRole('link', {
          name: locale === 'en' ? 'Book a demo' : 'Demo buchen',
          exact: true,
        });
        await demo.scrollIntoViewIfNeeded();
        await expect(demo).toBeInViewport();
      } else {
        expect((await header.boundingBox())!.height).toBe(77);
        const boxes = await page
          .locator('.desktop-nav > a, .desktop-nav > details, .header-actions')
          .evaluateAll((elements) =>
            elements.map((element) => {
              const box = element.getBoundingClientRect();
              return { left: box.left, right: box.right, top: box.top };
            }),
          );
        for (let index = 1; index < boxes.length; index++)
          expect(boxes[index]!.left).toBeGreaterThanOrEqual(boxes[index - 1]!.right);
      }
      const columns = await footer
        .locator('.footer-navigation')
        .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
      expect(columns).toBe(width <= 560 ? 1 : width <= 1100 ? 2 : 4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    });
  }

  test(`${locale} both native dropdowns and mobile resources work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(path);
    for (const id of ['solutions', 'resources']) {
      const menu = page.locator(`[data-nav-menu="${id}"]`);
      await menu.locator('summary').click();
      await expect(menu).toHaveAttribute('open', '');
      await expect(page.locator('.nav-menu[open]')).toHaveCount(1);
      await expect(menu.getByRole('link').first()).toBeVisible();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.mobile-menu > summary').click();
    await expect(page.locator('.mobile-resource-group a')).toHaveCount(3);
    await context.close();
  });

  test(`${locale} enlarged navigation stays readable without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const width of [390, 768, 1101, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      if (width <= 1100) await page.locator('.mobile-menu > summary').click();
      const collisions = await page.locator('.site-header').evaluate((header) => {
        const boxes = [
          ...header.querySelectorAll(
            '.wordmark, .desktop-nav > a, .desktop-nav > details, .header-actions, .mobile-menu',
          ),
        ]
          .map((element) => element.getBoundingClientRect())
          .filter((box) => box.width > 0);
        return boxes.flatMap((box, index) =>
          boxes
            .slice(index + 1)
            .filter(
              (other) =>
                box.left < other.right - 1 &&
                box.right > other.left + 1 &&
                box.top < other.bottom - 1 &&
                box.bottom > other.top + 1,
            ),
        );
      });
      expect(collisions).toHaveLength(0);
      expect(
        await page.locator('.site-footer').evaluate((footer) => footer.scrollWidth <= innerWidth),
      ).toBe(true);
      if (width > 1100) {
        await page.locator('[data-nav-menu="resources"] > summary').click();
        await expect(page.locator('[data-nav-menu="resources"] a').first()).toBeVisible();
      }
    }
    await context.close();
  });
}

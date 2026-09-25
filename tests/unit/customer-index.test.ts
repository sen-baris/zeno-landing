import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import { customerStoryDrafts } from '../../src/lib/content/customer-stories';
import { createPageClaimResolver } from '../../src/lib/i18n/de-claims';
import { createPageLocale } from '../../src/lib/i18n/page-copy';
import { staticRouteDefinitions, getAllLocalizedRouteEntries } from '../../src/lib/i18n/routes';
import { sharedUiCopy } from '../../src/lib/i18n/ui';

describe('case study discovery', () => {
  it('labels each story with its approved industry in both languages', () => {
    const expected = [
      ['atares', 'M&A', 'M&A'],
      ['b2venture', 'Venture capital', 'Venture Capital'],
      ['mahle', 'Manufacturing', 'Fertigung'],
      ['kbc', 'Management consulting', 'Unternehmensberatung'],
    ] as const;
    for (const [slug, english, german] of expected) {
      const story = customerStoryDrafts.find((story) => story.slug === slug)!;
      expect(story.industryClaimId).toBe(`customer-industry-${slug}`);
      for (const locale of ['en', 'de'] as const) {
        const [claim] = createPageClaimResolver(locale)(
          claimRegistry,
          [story.industryClaimId],
          'customers.index',
        );
        expect(claim?.statement).toBe(english);
        expect(claim?.allowed_surfaces).toEqual(['customers.index']);
        expect(claim?.evidence).toBe(story.sourceUrl);
        expect(claim?.approved_on).toBe('2026-09-25');
        expect(createPageLocale(locale).text(claim!.statement)).toBe(
          locale === 'en' ? english : german,
        );
      }
    }
  });

  it('requires complete German index labels and metadata', () => {
    const german = createPageLocale('de');
    for (const text of [
      'Customer stories | Zeno',
      'Explore our customer case studies.',
      'Case studies',
      'Customer stories.',
      'Read case study',
    ]) {
      expect(german.text(text)).not.toBe(text);
      expect(german.text(text)).not.toContain('—');
    }
  });
  it('gives both navigation labels a published, localized index destination', () => {
    expect(staticRouteDefinitions).toHaveProperty('customers', {
      en: '/customers',
      de: '/de/kunden',
    });
    expect(sharedUiCopy.en.header).toHaveProperty('allCaseStudies', 'All case studies');
    expect(sharedUiCopy.de.header).toHaveProperty('allCaseStudies', 'Alle Fallstudien');
    for (const locale of ['en', 'de'] as const) {
      const path = locale === 'en' ? '/customers' : '/de/kunden';
      expect(createPageLocale(locale).path('/customers')).toBe(path);
      expect(getAllLocalizedRouteEntries()).toContainEqual({
        locale,
        path,
        reference: { kind: 'static', key: 'customers' },
      });
      expect(sharedUiCopy[locale].header).not.toHaveProperty('allIndustries');
    }
  });

  it('uses exact approved narratives without widening metric or quote placement', () => {
    for (const locale of ['en', 'de'] as const) {
      const resolve = createPageClaimResolver(locale);
      for (const story of customerStoryDrafts) {
        const [claim] = resolve(claimRegistry, [story.narrativeClaimId], 'customers.index');
        expect(claim?.statement).toBe(`${story.title} ${story.summary}`);
        expect(claim?.notes).toContain('2026-09-25');
        for (const result of story.qualifiedResults) {
          expect(() => resolve(claimRegistry, [result.claimId], 'customers.index')).toThrow();
        }
      }
    }
  });
});

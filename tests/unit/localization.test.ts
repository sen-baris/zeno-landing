import { describe, expect, it } from 'vitest';
import { customerStoryDrafts } from '../../src/lib/content/customer-stories';
import { solutions } from '../../src/lib/content/solutions';
import {
  groupPublishedLocalizedContent,
  resolveLocalizedContentGroup,
} from '../../src/lib/i18n/content';
import {
  assertGermanClaimsApprovedForPublication,
  germanLocalizedClaimDrafts,
} from '../../src/lib/i18n/de-claims';
import {
  germanCustomerStories,
  germanSolutions,
  germanStaticPages,
  getGermanCustomerStory,
  getGermanSolution,
} from '../../src/lib/i18n/de-content';
import { businessCaseUiCopy, demoFormUiCopy } from '../../src/lib/i18n/forms';
import { isLocale, isPublishedLocale, localeDefinitions } from '../../src/lib/i18n/locales';
import {
  assertLocalizationRouteIntegrity,
  buildHreflangLinks,
  getAllLocalizedRouteEntries,
  getLocalizedPath,
  getPublishedHreflangLinks,
  getRouteSwitcherLinks,
} from '../../src/lib/i18n/routes';
import { createLocalizedSeo, createStandaloneSeo } from '../../src/lib/i18n/seo';

describe('localized route registry', () => {
  it('preserves English routes and maps the approved German slugs', () => {
    expect(getLocalizedPath({ kind: 'static', key: 'product' }, 'en')).toBe('/product');
    expect(getLocalizedPath({ kind: 'static', key: 'product' }, 'de')).toBe('/de/produkt');
    expect(getLocalizedPath({ kind: 'solution', slug: 'manufacturing' }, 'de')).toBe(
      '/de/loesungen/fertigung',
    );
    expect(getLocalizedPath({ kind: 'customer', slug: 'atares' }, 'de')).toBe('/de/kunden/atares');
  });

  it('reserves German legal routes by omitting them until approval', () => {
    expect(getLocalizedPath({ kind: 'static', key: 'privacy' }, 'de')).toBeUndefined();
    expect(getRouteSwitcherLinks({ kind: 'static', key: 'privacy' })).toEqual([
      { locale: 'en', lang: 'en', label: 'English', path: '/privacy-policy' },
    ]);
  });

  it('keeps preview routes out of production hreflang until publication', () => {
    expect(getRouteSwitcherLinks({ kind: 'static', key: 'home' })).toHaveLength(2);
    expect(getPublishedHreflangLinks({ kind: 'static', key: 'home' })).toEqual([]);
    expect(getAllLocalizedRouteEntries()).not.toContainEqual(
      expect.objectContaining({ locale: 'de' }),
    );
  });

  it('builds reciprocal English, German, and x-default annotations after publication', () => {
    expect(buildHreflangLinks({ kind: 'static', key: 'product' }, ['en', 'de'])).toEqual([
      { hreflang: 'en', path: '/product' },
      { hreflang: 'de', path: '/de/produkt' },
      { hreflang: 'x-default', path: '/product' },
    ]);
  });

  it('has no missing solution mappings or duplicate localized paths', () => {
    expect(assertLocalizationRouteIntegrity).not.toThrow();
  });

  it('validates locales and produces gated SEO records', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isPublishedLocale('en')).toBe(true);
    expect(isPublishedLocale('de')).toBe(false);

    expect(
      createLocalizedSeo({ kind: 'static', key: 'product' }, 'de', {
        includePreviewLocales: false,
      }),
    ).toEqual({
      locale: 'de',
      canonicalPath: '/de/produkt',
      hreflangLinks: [],
      switcherLinks: [{ locale: 'en', lang: 'en', label: 'English', path: '/product' }],
      isPublished: false,
    });
    expect(() => createLocalizedSeo({ kind: 'static', key: 'privacy' }, 'de')).toThrow(
      /does not have a localized path/,
    );
    expect(createStandaloneSeo('en', '/404')).toEqual({
      locale: 'en',
      canonicalPath: '/404',
      hreflangLinks: [],
      switcherLinks: [],
      isPublished: false,
    });
  });
});

describe('future localized content contract', () => {
  const baseEntry = {
    title: 'A title',
    description: 'A description',
    claimIds: [] as const,
    status: 'published' as const,
    indexingStatus: 'index' as const,
  };

  it('groups published CMS entries by stable translation key instead of slug', () => {
    const groups = groupPublishedLocalizedContent([
      { ...baseEntry, translationKey: 'article-one', locale: 'en', slug: 'article-one' },
      { ...baseEntry, translationKey: 'article-one', locale: 'de', slug: 'artikel-eins' },
      {
        ...baseEntry,
        translationKey: 'draft',
        locale: 'de',
        slug: 'entwurf',
        status: 'draft',
      },
    ]);

    expect(groups).toEqual([
      {
        translationKey: 'article-one',
        entries: [
          expect.objectContaining({ locale: 'en', slug: 'article-one' }),
          expect.objectContaining({ locale: 'de', slug: 'artikel-eins' }),
        ],
      },
    ]);
  });

  it('rejects duplicate locale and slug combinations', () => {
    expect(() =>
      groupPublishedLocalizedContent([
        { ...baseEntry, translationKey: 'one', locale: 'en', slug: 'same' },
        { ...baseEntry, translationKey: 'two', locale: 'en', slug: 'same' },
      ]),
    ).toThrow(/duplicated/);

    expect(() =>
      groupPublishedLocalizedContent([
        { ...baseEntry, translationKey: 'one', locale: 'en', slug: 'one' },
        { ...baseEntry, translationKey: 'one', locale: 'en', slug: 'two' },
      ]),
    ).toThrow(/duplicate locale/);
  });

  it('rejects empty stable keys and excludes draft-only groups', () => {
    expect(() =>
      groupPublishedLocalizedContent([
        { ...baseEntry, translationKey: ' ', locale: 'en', slug: 'article' },
      ]),
    ).toThrow(/requires a translation key and slug/);
    expect(
      groupPublishedLocalizedContent([
        { ...baseEntry, translationKey: 'draft', locale: 'de', slug: 'entwurf', status: 'draft' },
      ]),
    ).toEqual([]);
  });

  it('rejects duplicate locales even when one entry is a draft', () => {
    expect(() =>
      groupPublishedLocalizedContent([
        { ...baseEntry, translationKey: 'one', locale: 'en', slug: 'manufacturing' },
        {
          ...baseEntry,
          translationKey: 'one',
          locale: 'en',
          slug: 'manufacturing-draft',
          status: 'draft',
        },
      ]),
    ).toThrow(/duplicate locale/);
  });

  it('derives CMS canonicals and reciprocal alternates from the route registry', () => {
    const updatedAt = new Date('2026-09-21T00:00:00.000Z');
    const [group] = groupPublishedLocalizedContent([
      {
        ...baseEntry,
        translationKey: 'manufacturing',
        locale: 'en',
        slug: 'manufacturing',
        updatedAt,
      },
      {
        ...baseEntry,
        translationKey: 'manufacturing',
        locale: 'de',
        slug: 'fertigung',
      },
    ]);

    expect(
      resolveLocalizedContentGroup(group!, { kind: 'solution', slug: 'manufacturing' }),
    ).toEqual({
      translationKey: 'manufacturing',
      routes: [
        { locale: 'en', path: '/solutions/manufacturing', lastmod: updatedAt },
        { locale: 'de', path: '/de/loesungen/fertigung' },
      ],
      hreflangLinks: [
        { hreflang: 'en', path: '/solutions/manufacturing' },
        { hreflang: 'de', path: '/de/loesungen/fertigung' },
        { hreflang: 'x-default', path: '/solutions/manufacturing' },
      ],
    });
  });

  it('omits hreflang without an indexable English counterpart', () => {
    const [group] = groupPublishedLocalizedContent([
      {
        ...baseEntry,
        translationKey: 'manufacturing',
        locale: 'en',
        slug: 'manufacturing',
        indexingStatus: 'noindex',
      },
      {
        ...baseEntry,
        translationKey: 'manufacturing',
        locale: 'de',
        slug: 'fertigung',
      },
    ]);

    expect(
      resolveLocalizedContentGroup(group!, { kind: 'solution', slug: 'manufacturing' }),
    ).toEqual({
      translationKey: 'manufacturing',
      routes: [{ locale: 'de', path: '/de/loesungen/fertigung' }],
      hreflangLinks: [],
    });
  });

  it('rejects CMS slugs that disagree with the route registry', () => {
    const [group] = groupPublishedLocalizedContent([
      {
        ...baseEntry,
        translationKey: 'manufacturing',
        locale: 'en',
        slug: 'wrong-slug',
      },
    ]);

    expect(() =>
      resolveLocalizedContentGroup(group!, { kind: 'solution', slug: 'manufacturing' }),
    ).toThrow(/does not match route/);
  });
});

describe('German claim publication gate', () => {
  it('keeps every translated factual claim in draft until exact wording is approved', () => {
    expect(germanLocalizedClaimDrafts.length).toBeGreaterThan(0);
    expect(germanLocalizedClaimDrafts.every((claim) => claim.approvalStatus === 'draft')).toBe(
      true,
    );
    expect(germanLocalizedClaimDrafts.every((claim) => claim.locale === 'de')).toBe(true);
    expect(germanLocalizedClaimDrafts.every((claim) => !claim.statement.includes('—'))).toBe(true);
    expect(new Set(germanLocalizedClaimDrafts.map((claim) => claim.id)).size).toBe(
      germanLocalizedClaimDrafts.length,
    );
    expect(
      germanLocalizedClaimDrafts.every(
        (claim) =>
          claim.sourceClaimId.length > 0 &&
          claim.allowedSurface.startsWith('de.') &&
          claim.evidence.includes('requires approval'),
      ),
    ).toBe(true);
    expect(assertGermanClaimsApprovedForPublication).toThrow(/publication is blocked/);
  });

  it('keeps new nonlegal German copy free of em dashes', () => {
    const serialized = JSON.stringify({
      localeDefinitions,
      germanStaticPages,
      germanSolutions,
      germanCustomerStories,
      businessCaseUiCopy,
      demoFormUiCopy,
    });
    expect(serialized).not.toContain('—');
  });

  it('resolves translated solution and customer records and rejects missing ones', () => {
    expect(getGermanSolution(solutions[0]!)).toBe(germanSolutions.manufacturing);
    expect(getGermanCustomerStory(customerStoryDrafts[0]!)).toBe(germanCustomerStories.atares);
    expect(() => getGermanSolution({ ...solutions[0]!, slug: 'missing' })).toThrow(
      /Missing German solution/,
    );
    expect(() =>
      getGermanCustomerStory({
        ...customerStoryDrafts[0]!,
        slug: 'missing',
      }),
    ).toThrow(/Missing German customer story/);
  });
});

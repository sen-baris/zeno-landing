import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  groupPublishedLocalizedContent,
  resolveLocalizedContentGroup,
} from '../../src/lib/i18n/content';
import {
  assertGermanClaimsApprovedForPublication,
  germanLocalizedClaims,
} from '../../src/lib/i18n/de-claims';
import { germanPageCopy, translatePageText } from '../../src/lib/i18n/page-copy';
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
import { sharedUiCopy } from '../../src/lib/i18n/ui';

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

  it('publishes complete reciprocal English and German route clusters', () => {
    expect(getRouteSwitcherLinks({ kind: 'static', key: 'home' })).toHaveLength(2);
    expect(getPublishedHreflangLinks({ kind: 'static', key: 'home' })).toEqual([
      { hreflang: 'en', path: '/' },
      { hreflang: 'de', path: '/de/' },
      { hreflang: 'x-default', path: '/' },
    ]);
    expect(getAllLocalizedRouteEntries()).toContainEqual(
      expect.objectContaining({ locale: 'de', path: '/de/' }),
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
    expect(isPublishedLocale('de')).toBe(true);

    expect(
      createLocalizedSeo({ kind: 'static', key: 'product' }, 'de', {
        includePreviewLocales: false,
      }),
    ).toEqual({
      locale: 'de',
      canonicalPath: '/de/produkt',
      hreflangLinks: [
        { hreflang: 'en', path: '/product' },
        { hreflang: 'de', path: '/de/produkt' },
        { hreflang: 'x-default', path: '/product' },
      ],
      switcherLinks: [
        { locale: 'en', lang: 'en', label: 'English', path: '/product' },
        { locale: 'de', lang: 'de', label: 'Deutsch', path: '/de/produkt' },
      ],
      isPublished: true,
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
  it('requires complete approval for every published German claim', () => {
    expect(germanLocalizedClaims.length).toBeGreaterThan(0);
    expect(germanLocalizedClaims.every((claim) => claim.approvalStatus === 'approved')).toBe(true);
    expect(germanLocalizedClaims.every((claim) => claim.locale === 'de')).toBe(true);
    expect(germanLocalizedClaims.every((claim) => !claim.statement.includes('—'))).toBe(true);
    expect(new Set(germanLocalizedClaims.map((claim) => claim.id)).size).toBe(
      germanLocalizedClaims.length,
    );
    const revisedFigureIds = ['metric-annualized-time-per-person', 'metric-agents-created'];
    for (const claim of germanLocalizedClaims) {
      const revised = revisedFigureIds.includes(claim.sourceClaimId);
      const approvedAt = revised ? '2026-09-24' : '2026-09-22';
      expect(claim.sourceClaimId.length).toBeGreaterThan(0);
      expect(claim.allowedSurfaces.length).toBeGreaterThan(0);
      expect(claim.evidence).toContain(approvedAt);
      expect(claim.approvedBy).toBe(
        revised ? 'Baris, homepage figures direction' : 'Baris, German parity direction',
      );
      expect(claim.approvedAt).toBe(approvedAt);
    }
    expect(assertGermanClaimsApprovedForPublication).not.toThrow();
  });

  it('keeps public German copy neutral and free of experimental labels', () => {
    const germanRouteSource = readFileSync(
      resolve(process.cwd(), 'src/pages/de/[...path].astro'),
      'utf8',
    );
    const serialized = JSON.stringify({
      localeDefinitions,
      germanCopy: Object.values(germanPageCopy),
      businessCaseUiCopy,
      demoFormUiCopy,
      sharedUiCopy,
    });
    const publicGerman = `${serialized}\n${germanRouteSource}`;
    expect(publicGerman).not.toMatch(/\b(?:Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\b/);
    expect(publicGerman).not.toMatch(
      /\b(?:du|dein|deine|deinen|deinem|deiner|deines|euch|euer|eure|euren|eurem|eurer|eures)\b/i,
    );
    expect(publicGerman).not.toMatch(/\b(?:Preview|Vorschau|V1)\b/i);
    expect(publicGerman).not.toContain('—');
  });

  it('requires exact translated page copy instead of silently omitting content', () => {
    expect(translatePageText('de', 'Customer context')).toBe('Kundenkontext');
    expect(() => translatePageText('de', 'Missing page translation')).toThrow(
      /Missing German page copy/,
    );
  });
});

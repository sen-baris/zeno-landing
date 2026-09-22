import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import {
  germanLocalizedClaims,
  createPageClaimResolver,
  validateGermanClaim,
} from '../../src/lib/i18n/de-claims';
import {
  createPageLocale,
  translatePageText,
  agentStartingPointCopy,
} from '../../src/lib/i18n/page-copy';

describe('shared localized page copy', () => {
  it('keeps English intact, translates metadata and preserves structured emphasis', () => {
    expect(translatePageText('en', 'An unchanged sentence.')).toBe('An unchanged sentence.');
    expect(translatePageText('de', '  Product\n | Zeno')).toBe('Produkt | Zeno');
    expect(translatePageText('de', 71)).toBe('71');
    expect(translatePageText('de', '20%')).toBe('20%');
    for (const locale of ['en', 'de'] as const) {
      const emphasis = agentStartingPointCopy[locale];
      expect(emphasis.before + emphasis.text + emphasis.after).toBe(
        translatePageText(locale, 'Start with a prebuilt agent or build your own.'),
      );
    }
    expect(() => translatePageText('de', undefined)).toThrow(/Required page copy/);
    expect(() => translatePageText('de', 'toString')).toThrow(/Missing German/);
    expect(() => translatePageText('de', 'untranslated')).toThrow(/Missing German/);
  });

  it('localizes destinations and anchors without inventing German legal routes', () => {
    const en = createPageLocale('en');
    const de = createPageLocale('de');
    expect(en.path('/product')).toBe('/product');
    expect(de.path('/')).toBe('/de/');
    expect(de.path('/#audience')).toBe('/de/#audience');
    expect(de.path('/pricing')).toBe('/de/business-case');
    expect(de.path('/solutions/private-equity')).toBe('/de/loesungen/private-equity');
    expect(de.path('/customers/mahle')).toBe('/de/kunden/mahle');
    expect(de.path('/privacy-policy')).toBe('/privacy-policy');
    expect(de.path('/customer-logos/mahle.svg')).toBe('/customer-logos/mahle.svg');
    expect(de.text('Book a demo')).toBe('Demo buchen');
  });
});

describe('exact source-linked German claim approval', () => {
  const translated = germanLocalizedClaims.find(
    (claim) => claim.sourceClaimId === 'home-agent-starting-point',
  )!;
  const source = claimRegistry.find((claim) => claim.id === translated.sourceClaimId)!;
  const now = new Date('2026-09-22');

  it('resolves both locales at the same surface and keeps real English claim identifiers', () => {
    for (const locale of ['en', 'de'] as const) {
      expect(createPageClaimResolver(locale)(claimRegistry, [source.id], 'home.hero', now)).toEqual(
        [source],
      );
    }
    for (const record of germanLocalizedClaims) {
      const original = claimRegistry.find((claim) => claim.id === record.sourceClaimId);
      expect(original).toBeDefined();
      expect(record.sourceStatement).toBe(original!.statement);
      expect(
        record.allowedSurfaces.every((surface) => original!.allowed_surfaces.includes(surface)),
      ).toBe(true);
    }
  });

  it('rejects missing, draft, stale and materially changed translations', () => {
    expect(() => validateGermanClaim(source, undefined, 'home.hero', now)).toThrow(/not approved/);
    expect(() =>
      validateGermanClaim(source, { ...translated, approvalStatus: 'draft' }, 'home.hero', now),
    ).toThrow(/not approved/);
    expect(() =>
      validateGermanClaim(
        source,
        { ...translated, statement: 'Arbitrary new claim' },
        'home.hero',
        now,
      ),
    ).toThrow(/exact approved wording/);
    expect(() =>
      validateGermanClaim(
        { ...source, statement: 'Changed English meaning' },
        translated,
        'home.hero',
        now,
      ),
    ).toThrow(/exact approved wording/);
    expect(() =>
      validateGermanClaim({ ...source, reverify_on: '2025-01-01' }, translated, 'home.hero', now),
    ).toThrow(/not approved/);
    expect(() =>
      validateGermanClaim(
        source,
        { ...translated, allowedSurfaces: ['security.hero'] },
        'security.hero',
        now,
      ),
    ).toThrow(/not approved for/);
    expect(() =>
      createPageClaimResolver('de')(
        [{ ...source, id: 'future-claim' }],
        ['future-claim'],
        'home.hero',
        now,
      ),
    ).toThrow(/not approved/);
  });
});

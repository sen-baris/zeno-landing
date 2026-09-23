import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import { approvedResources, resourceLinks } from '../../src/lib/content/resources';
import {
  bannerClaimIds,
  bannerHeadline,
  banners,
  concepts,
  narrativeLabels,
  placements,
} from '../../marketing/linkedin/manifest';

const now = new Date('2026-09-23');

describe('approved navigation resources', () => {
  it('shares exactly the supplied destinations and localized labels across both surfaces', () => {
    expect(
      resourceLinks.map(({ id, destination, labels }) => [id, destination, labels.en, labels.de]),
    ).toEqual([
      ['help-center', 'https://help.textcortex.com/hc/en-us', 'Help Center', 'Hilfe-Center'],
      ['youtube', 'https://www.youtube.com/@textcortex/videos', 'YouTube', 'YouTube'],
      ['linkedin', 'https://www.linkedin.com/company/textcortex-ai', 'LinkedIn', 'LinkedIn'],
    ]);
    expect(new Set(resourceLinks.map((resource) => resource.claimId)).size).toBe(3);
    for (const surface of ['navigation.resources', 'footer.resources'] as const) {
      expect(approvedResources(claimRegistry, surface, now)).toEqual(resourceLinks);
      expect(approvedResources(claimRegistry, surface)).toEqual(resourceLinks);
    }
    for (const resource of resourceLinks) {
      const url = new URL(resource.destination);
      expect(url.protocol).toBe('https:');
      expect(url.search).toBe('');
      expect(JSON.stringify(resource.labels)).not.toMatch(/—|\b(Sie|Ihnen|Ihr|du|dein)\b/);
    }
  });

  it('rejects stale approvals, unapproved wording and destination changes', () => {
    expect(() =>
      approvedResources(claimRegistry, 'navigation.resources', new Date('2028-01-01')),
    ).toThrow(/not approved/);
    for (const edit of [{ public_url: 'https://example.com' }, { statement: 'A changed label' }]) {
      const altered = claimRegistry.map((claim) =>
        claim.id === 'resource-help-center' ? { ...claim, ...edit } : claim,
      );
      expect(() => approvedResources(altered, 'footer.resources', now)).toThrow(/does not match/);
    }
    expect(() =>
      resolveApprovedClaims(claimRegistry, ['resource-linkedin'], 'home.hero', now),
    ).toThrow(/not approved for/);
  });
});

describe('LinkedIn placements and approved copy', () => {
  it('defines three paired compositions with unique filenames and requested dimensions', () => {
    expect(concepts).toHaveLength(3);
    expect(banners).toHaveLength(6);
    expect(new Set(banners.map((banner) => banner.filename)).size).toBe(6);
    expect(placements).toEqual({
      profile: { width: 1584, height: 396, maxBytes: 8_000_000 },
      company: { width: 4200, height: 700, maxBytes: 3_000_000 },
    });
    for (const concept of concepts)
      expect(
        banners.filter((banner) => banner.id === concept.id).map((banner) => banner.placement),
      ).toEqual(['profile', 'company']);
  });

  it('limits exact campaign approval to the two LinkedIn placements', () => {
    for (const placement of ['profile', 'company']) {
      const claims = resolveApprovedClaims(
        claimRegistry,
        bannerClaimIds,
        `marketing.linkedin.${placement}`,
        now,
      );
      expect(claims.map((claim) => claim.statement)).toEqual([
        bannerHeadline,
        narrativeLabels.join(' → '),
      ]);
      for (const claim of claims) {
        expect(claim.allowed_surfaces).toEqual([
          'marketing.linkedin.profile',
          'marketing.linkedin.company',
        ]);
        expect(claim.statement).not.toContain('—');
      }
    }
    expect(() => resolveApprovedClaims(claimRegistry, bannerClaimIds, 'home.hero', now)).toThrow(
      /not approved for/,
    );
  });
});

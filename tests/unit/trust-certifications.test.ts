import { describe, expect, it } from 'vitest';
import { certificationAssets } from '../../src/lib/claims/certification-assets';
import {
  claimRegistry,
  homepageCertificationClaimIds,
  trustCenterUrl,
} from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';

const now = new Date('2026-08-27T12:00:00Z');

describe('homepage certification proof', () => {
  const claims = resolveApprovedClaims(
    claimRegistry,
    homepageCertificationClaimIds,
    'home.trust',
    now,
  );

  it('publishes every referenced certification in order', () => {
    expect(claims.map((claim) => claim.id)).toEqual(homepageCertificationClaimIds);
  });

  it('gives each certification a unique public label', () => {
    const labels = certificationAssets.map((asset) => asset.label);
    expect(new Set(labels).size).toBe(labels.length);

    for (const claim of claims) {
      const asset = certificationAssets.find((candidate) => candidate.claimId === claim.id);
      expect(asset, claim.id).toBeDefined();
      expect(asset?.label.trim().length, claim.id).toBeGreaterThan(0);
    }
  });

  it('categorises the records and points them at the public trust centre', () => {
    for (const claim of claims) {
      expect(claim.category, claim.id).toBe('certification');
      expect(claim.public_url, claim.id).toBe(trustCenterUrl);
      expect(claim.attribution.trim().length, claim.id).toBeGreaterThan(0);
    }
    expect(new URL(trustCenterUrl).protocol).toBe('https:');
  });

  it('keeps the certifications off surfaces that have not approved them', () => {
    for (const id of homepageCertificationClaimIds) {
      expect(() => resolveApprovedClaims(claimRegistry, [id], 'home.proof', now)).toThrow(
        /not approved for home\.proof/,
      );
    }
  });
});

import { describe, expect, it } from 'vitest';
import { businessCaseAssets } from '../../src/lib/claims/business-case-assets';
import { claimRegistry, homepageBusinessCaseClaimIds } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';

const now = new Date('2026-08-27T12:00:00Z');

describe('homepage business case figures', () => {
  const claims = resolveApprovedClaims(
    claimRegistry,
    homepageBusinessCaseClaimIds,
    'home.business-case',
    now,
  );

  it('publishes every referenced figure in order', () => {
    expect(claims.map((claim) => claim.id)).toEqual(homepageBusinessCaseClaimIds);
    expect(businessCaseAssets.map((asset) => asset.claimId)).toEqual(homepageBusinessCaseClaimIds);
  });

  it('renders only figures whose value and label match the approved statement', () => {
    for (const claim of claims) {
      const asset = businessCaseAssets.find((candidate) => candidate.claimId === claim.id);
      expect(asset, claim.id).toBeDefined();
      expect(claim.statement, `${claim.id} value`).toContain(asset?.value ?? '');
      expect(claim.statement, `${claim.id} label`).toContain(asset?.label ?? '');
    }
  });

  it('keeps the exact approved figures', () => {
    expect(businessCaseAssets.map((asset) => asset.value)).toEqual([
      '3–10%',
      '~200',
      '+65%',
      '~€7–8M',
    ]);
  });

  it('carries a population or method qualifier with every figure', () => {
    for (const claim of claims) {
      expect(claim.category, claim.id).toBe('metric');
      expect(claim.attribution.trim().length, `${claim.id} qualifier`).toBeGreaterThan(0);
      expect(claim.evidence.trim().length, `${claim.id} evidence`).toBeGreaterThan(0);
    }
  });

  it('keeps the projection marked as a projection rather than a realised result', () => {
    const projection = claims.find((claim) => claim.id === 'metric-projected-annual-savings');
    expect(projection?.statement).toContain('projected');
    expect(projection?.attribution).toContain('internal enterprise savings model');
    expect(projection?.attribution).toContain('2,200 users');
  });

  it('keeps the figures off surfaces that have not approved them', () => {
    for (const id of homepageBusinessCaseClaimIds) {
      expect(() => resolveApprovedClaims(claimRegistry, [id], 'home.proof', now)).toThrow(
        /not approved for home\.proof/,
      );
    }
  });
});

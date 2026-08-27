import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { customerLogoAssets } from '../../src/lib/claims/customer-logo-assets';
import { claimRegistry, homepageCustomerLogoClaimIds } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';

describe('customer logo proof', () => {
  it('renders only current claims with a unique local asset', () => {
    const claims = resolveApprovedClaims(
      claimRegistry,
      homepageCustomerLogoClaimIds,
      'home.customer-logos',
      new Date('2026-08-27T12:00:00Z'),
    );
    const assetIds = customerLogoAssets.map((asset) => asset.claimId);

    expect(claims.map((claim) => claim.id)).toEqual(homepageCustomerLogoClaimIds);
    expect(new Set(assetIds).size).toBe(assetIds.length);
    expect(new Set(customerLogoAssets.map((asset) => asset.src)).size).toBe(
      customerLogoAssets.length,
    );

    for (const claim of claims) {
      const asset = customerLogoAssets.find((candidate) => candidate.claimId === claim.id);
      expect(asset, claim.id).toBeDefined();
      expect(existsSync(`public${asset?.src}`), asset?.src).toBe(true);
    }
  });
});

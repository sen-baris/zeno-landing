import { describe, expect, it } from 'vitest';
import { appLoginClaimId, claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';

describe('navigation content', () => {
  it('resolves the approved current application sign-in destination', () => {
    const [claim] = resolveApprovedClaims(
      claimRegistry,
      [appLoginClaimId],
      'navigation.sign-in',
      new Date('2026-09-14T12:00:00Z'),
    );

    expect(claim?.statement).toBe('Sign in');
    expect(claim?.category).toBe('product');
    expect(claim?.public_url).toBe('https://app.textcortex.com/user/login');
    expect(new URL(claim!.public_url!).protocol).toBe('https:');
    expect(claim?.statement).not.toContain('—');
  });
});

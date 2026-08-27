import { describe, expect, it } from 'vitest';
import {
  ClaimRegistryError,
  isClaimAllowedOnSurface,
  isClaimCurrent,
  resolveApprovedClaims,
} from '../../src/lib/claims/public-claims';
import type { ClaimRecord } from '../../src/lib/claims/types';

const approved: ClaimRecord = {
  id: 'zeno-proof-001',
  statement: 'Approved synthetic test statement.',
  category: 'metric',
  evidence: 'internal-evidence-id',
  verified_on: '2026-08-01',
  approval_status: 'approved',
  approved_by: 'Test approver',
  approved_on: '2026-08-02',
  allowed_surfaces: ['home.proof'],
  attribution: 'Synthetic test fixture.',
  reverify_on: '2026-12-31',
  notes: 'Test only.',
};

describe('claims publication boundary', () => {
  const now = new Date('2026-08-27T12:00:00Z');

  it('resolves only an approved, current claim on the requested surface', () => {
    expect(resolveApprovedClaims([approved], [approved.id], 'home.proof', now)).toEqual([approved]);
  });

  it('supports an explicitly global surface approval', () => {
    const global = { ...approved, allowed_surfaces: ['*'] };
    expect(isClaimAllowedOnSurface(global, 'metadata.social')).toBe(true);
  });

  it.each(['draft', 'rejected', 'superseded', 'expired'] as const)(
    'rejects %s claims',
    (approval_status) => {
      const claim = { ...approved, approval_status };
      expect(isClaimCurrent(claim, now)).toBe(false);
      expect(() => resolveApprovedClaims([claim], [claim.id], 'home.proof', now)).toThrow(
        ClaimRegistryError,
      );
    },
  );

  it('rejects expired or non-date reverification values', () => {
    expect(isClaimCurrent({ ...approved, reverify_on: '2026-08-26' }, now)).toBe(false);
    expect(isClaimCurrent({ ...approved, reverify_on: 'on product change' }, now)).toBe(false);
  });

  it('rejects an incomplete approval record', () => {
    expect(isClaimCurrent({ ...approved, evidence: '' }, now)).toBe(false);
    expect(isClaimCurrent({ ...approved, allowed_surfaces: [] }, now)).toBe(false);
    expect(isClaimCurrent({ ...approved, verified_on: 'not-a-date' }, now)).toBe(false);
  });

  it('publishes an https public reference and rejects any other destination', () => {
    expect(
      isClaimCurrent({ ...approved, public_url: 'https://trust.example.test/home' }, now),
    ).toBe(true);
    expect(isClaimCurrent({ ...approved, public_url: 'http://trust.example.test' }, now)).toBe(
      false,
    );
    expect(isClaimCurrent({ ...approved, public_url: '/trust' }, now)).toBe(false);
    expect(isClaimCurrent({ ...approved, public_url: '' }, now)).toBe(false);
    expect(
      isClaimCurrent({ ...approved, public_url: 'javascript:alert(1)' }, now),
      'non-https schemes must never reach a rendered link',
    ).toBe(false);
  });

  it('rejects missing, duplicated, and wrong-surface references', () => {
    expect(() => resolveApprovedClaims([], ['missing'], 'home.proof', now)).toThrow(/missing/);
    expect(() =>
      resolveApprovedClaims([approved], [approved.id, approved.id], 'home.proof', now),
    ).toThrow(/duplicated/);
    expect(() => resolveApprovedClaims([approved], [approved.id], 'demo', now)).toThrow(
      /not approved for demo/,
    );
  });
});

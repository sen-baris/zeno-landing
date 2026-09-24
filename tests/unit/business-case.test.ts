import { describe, expect, it } from 'vitest';
import { businessCaseAssets } from '../../src/lib/claims/business-case-assets';
import { claimRegistry, homepageBusinessCaseClaimIds } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import { createPageClaimResolver, germanLocalizedClaims } from '../../src/lib/i18n/de-claims';
import supersededGermanClaims from '../../src/lib/i18n/de-superseded-claims.json';
import { translatePageText } from '../../src/lib/i18n/page-copy';

const now = new Date('2026-09-24T12:00:00Z');

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
      '~92 hrs',
      '2,000+',
      '+65%',
      '~€7–8M',
    ]);
  });

  it('annualizes the team total using ten people, without claiming a measured individual average', () => {
    const savings = claims.find((claim) => claim.id === 'metric-annualized-time-per-person');
    expect(savings?.statement).toBe('~92 hrs saved per person each year.');
    expect(savings?.attribution).toBe('Annualized team estimate');
    expect(savings?.evidence).toContain('20 / 10 * 46 = 92');
    expect(savings?.attribution).not.toMatch(/150|measured/i);
    expect((20 / 10) * 46).toBe(Number.parseFloat(businessCaseAssets[0]!.value.slice(1)));
    expect(savings?.notes).toContain('Individual savings can differ');
    expect(savings?.notes).toContain('before the production release');
    expect(savings?.approved_on).toBe('2026-09-24');
  });

  it('counts agents created, not agents active or tasks executed', () => {
    const agents = claims.find((claim) => claim.id === 'metric-agents-created');
    expect(agents?.statement).toBe('2,000+ agents created.');
    expect(agents?.attribution).toBe('across hundreds of enterprises');
    expect(agents?.notes).toContain('not active agents');
    expect(agents?.notes).toContain('before the production release');
    expect(agents?.approved_on).toBe('2026-09-24');
    for (const claim of [agents, claims[0]]) {
      expect(claim?.allowed_surfaces).toEqual(['home.business-case']);
      expect(`${claim?.statement} ${claim?.attribution}`).not.toContain('—');
    }
  });

  it('keeps the old metrics as superseded records that cannot be rendered', () => {
    for (const id of ['metric-efficiency-time-savings', 'metric-monthly-interactions']) {
      expect(claimRegistry.find((claim) => claim.id === id)?.approval_status).toBe('superseded');
      expect(homepageBusinessCaseClaimIds).not.toContain(id);
      expect(() => resolveApprovedClaims(claimRegistry, [id], 'home.business-case', now)).toThrow(
        /not approved and current/,
      );
      const archived = supersededGermanClaims.find((claim) => claim.sourceClaimId === id);
      expect(archived?.approvalStatus).toBe('superseded');
      expect(archived?.sourceStatement).toBe(
        claimRegistry.find((claim) => claim.id === id)?.statement,
      );
      expect(germanLocalizedClaims.find((claim) => claim.sourceClaimId === id)).toBeUndefined();
      expect(
        germanLocalizedClaims.find((claim) => claim.id === archived?.replacementId)?.approvedAt,
      ).toBe('2026-09-24');
    }
  });

  it('resolves the exact German figures and qualifiers under the same limited approvals', () => {
    expect(
      createPageClaimResolver('de')(
        claimRegistry,
        homepageBusinessCaseClaimIds,
        'home.business-case',
        now,
      ),
    ).toEqual(claims);
    expect(
      businessCaseAssets
        .slice(0, 2)
        .map(({ value, label }) => [
          translatePageText('de', value),
          translatePageText('de', label),
        ]),
    ).toEqual([
      ['~92 Std.', 'Zeitersparnis pro Person und Jahr'],
      ['2.000+', 'erstellte KI-Agenten'],
    ]);
    expect(
      claims.slice(0, 2).map(({ attribution }) => translatePageText('de', attribution)),
    ).toEqual(['Hochrechnung auf Teambasis', 'in Hunderten Unternehmen']);
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

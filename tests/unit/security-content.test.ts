import { describe, expect, it } from 'vitest';
import { claimRegistry, trustCenterUrl } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import { securityPageContent, securityPageClaimIds } from '../../src/lib/content/security';
import { releaseContentStatus } from '../../src/lib/content/site-content';

const now = new Date('2026-09-16T12:00:00Z');

describe('security page content', () => {
  it('keeps the approved assurance records in the intended order', () => {
    expect(securityPageContent.assurances.map((item) => item.label)).toEqual([
      'ISO 27001',
      'SOC 2 Type I',
      'SOC 2 Type II',
      'GDPR',
    ]);
    expect(securityPageContent.assurances.at(-1)?.kind).toBe('privacy');
  });

  it('resolves every factual record on its exact security surface', () => {
    const surfaces = [
      ['security.metadata', [securityPageContent.metadata.claimId]],
      ['security.hero', [securityPageContent.hero.claimId]],
      ['security.assurance', securityPageContent.assurances.map((assurance) => assurance.claimId)],
      [
        'security.controls',
        [
          securityPageContent.controlsSummaryClaimId,
          ...securityPageContent.controls.map((control) => control.claimId),
        ],
      ],
      ['security.deployment', [securityPageContent.deploymentClaimId]],
      ['security.evidence', [securityPageContent.evidence.claimId]],
    ] as const;

    for (const [surface, ids] of surfaces) {
      expect(resolveApprovedClaims(claimRegistry, ids, surface, now)).toHaveLength(ids.length);
    }

    for (const faq of securityPageContent.faqs) {
      expect(resolveApprovedClaims(claimRegistry, faq.claimIds, 'security.faq', now)).toHaveLength(
        faq.claimIds.length,
      );
    }
  });

  it('uses current HTTPS evidence and public destinations', () => {
    const claims = securityPageClaimIds.map((id) => {
      const claim = claimRegistry.find((candidate) => candidate.id === id);
      expect(claim, id).toBeDefined();
      return claim!;
    });

    for (const claim of claims) {
      expect(new Date(`${claim.reverify_on}T23:59:59.999Z`).getTime(), claim.id).toBeGreaterThan(
        now.getTime(),
      );
      if (claim.public_url) expect(new URL(claim.public_url).protocol, claim.id).toBe('https:');
    }

    expect(securityPageContent.evidence.url).toBe(trustCenterUrl);
    for (const item of securityPageContent.evidence.items) {
      const url = new URL(item.url);
      expect(url.protocol, item.label).toBe('https:');
      expect(url.hostname, item.label).toBe('trust.textcortex.com');
    }
  });

  it('keeps GDPR separate from certifications and retains operating-company attribution', () => {
    const gdpr = claimRegistry.find((claim) => claim.id === 'security-gdpr-data-protection');
    expect(gdpr?.category).toBe('privacy');
    expect(gdpr?.statement).toBe(
      'Personal data is processed in line with the GDPR and applicable national data-protection rules.',
    );

    for (const id of [
      'certification-iso-27001',
      'certification-soc-2-type-1',
      'certification-soc-2-type-2',
      'security-gdpr-data-protection',
    ]) {
      expect(claimRegistry.find((claim) => claim.id === id)?.attribution).toContain(
        'operating company behind Zeno',
      );
    }
  });

  it('keeps the production trust gate blocked pending legal entity confirmation', () => {
    expect(releaseContentStatus.trust).toBe('draft');
    for (const id of [
      'certification-iso-27001',
      'certification-soc-2-type-1',
      'certification-soc-2-type-2',
    ]) {
      expect(claimRegistry.find((claim) => claim.id === id)?.notes).toContain(
        'Counsel must confirm the operating-entity attribution before the production release.',
      );
    }
  });

  it('contains no public em dash or unsupported security promise', () => {
    const publicContent = JSON.stringify(securityPageContent);
    expect(publicContent).not.toContain('—');

    const statements = securityPageClaimIds
      .map((id) => claimRegistry.find((claim) => claim.id === id)?.statement ?? '')
      .join(' ')
      .toLowerCase();
    for (const unsupported of [
      'aes-256',
      'byok',
      '24/7',
      'penetration test',
      'incident response sla',
      'iso 42001',
      'eu ai act',
    ]) {
      expect(statements).not.toContain(unsupported);
    }
  });
});

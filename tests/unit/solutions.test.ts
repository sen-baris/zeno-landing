import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import { customerStoryDrafts, customerVoiceDrafts } from '../../src/lib/content/customer-stories';
import { solutions, solutionSecurityReference } from '../../src/lib/content/solutions';
import { createPageLocale } from '../../src/lib/i18n/page-copy';

const now = new Date('2026-09-10T12:00:00Z');

describe('solution page narrative', () => {
  it('points one security answer per industry to the localized security page', () => {
    const germanSecurityQuestions = [
      'Wie werden Zeichnungen unter NDA behandelt?',
      'Wie bleiben die Unterlagen verschiedener Kunden getrennt?',
      'Wo werden die Deal-Unterlagen verarbeitet?',
      'Welche Modelle stehen zur Verfügung?',
      'Wie wird der Zugriff auf Kanzleiunterlagen gesteuert?',
    ];
    for (const solution of solutions) {
      const securityAnswers = solution.questions.filter((entry) => entry.showSecurityReference);
      expect(securityAnswers).toHaveLength(1);
      expect(securityAnswers[0]?.answer).toMatch(/access|approved models/i);
      const german = createPageLocale('de');
      expect(german.text(securityAnswers[0]?.question)).toBe(
        germanSecurityQuestions[solutions.indexOf(solution)],
      );
      expect(german.text(securityAnswers[0]?.answer)).toMatch(/Zugriff|Modelle/);
    }
    expect(solutionSecurityReference.href).toBe('/security');
    expect(solutionSecurityReference.description).toContain('Zero Data Retention (ZDR)');
    expect(solutionSecurityReference.description).toContain('model-training policies');
    expect(solutionSecurityReference.description).not.toMatch(/all providers|compliant|guarantee/i);
    for (const locale of ['en', 'de'] as const) {
      const page = createPageLocale(locale);
      expect(page.path(solutionSecurityReference.href)).toBe(
        locale === 'de' ? '/de/sicherheit' : '/security',
      );
      expect(page.text(solutionSecurityReference.description)).toContain(
        'Zero Data Retention (ZDR)',
      );
      expect(page.text(solutionSecurityReference.label)).toContain('Trust Center');
    }
  });
  it('uses one ordered product story and one unique customer proof mapping per industry', () => {
    expect(solutions).toHaveLength(5);
    expect(solutions.map((solution) => solution.journey.map((step) => step.id))).toEqual(
      solutions.map(() => ['context', 'agent', 'review']),
    );

    const proofOwners = solutions.map((solution) =>
      solution.customerProof.kind === 'story'
        ? solution.customerProof.storySlug
        : solution.customerProof.logoClaimId,
    );
    expect(new Set(proofOwners).size).toBe(solutions.length);
    expect(solutions.every((solution) => solution.controls.length === 4)).toBe(true);
    expect(solutions.every((solution) => solution.agents.length === 4)).toBe(true);
  });

  it('resolves every product scene and customer statement only on its named solution surface', () => {
    for (const solution of solutions) {
      const surface = `solutions.${solution.slug}`;
      const [startingPoint, workspace, hosting] = resolveApprovedClaims(
        claimRegistry,
        [
          solution.startingPointClaimId,
          solution.workspace.claimId,
          'product-major-models-eu-hosting',
        ],
        surface,
        now,
      );

      expect(startingPoint?.statement).toBe(solution.journey[1]?.description);
      expect(workspace?.statement).toBe(solution.workspace.caption);
      expect(hosting?.statement).toBe('Access major AI models with EU hosting in one place.');

      const proofConfig = solution.customerProof;
      if (proofConfig.kind === 'story') {
        const story = customerStoryDrafts.find(
          (candidate) => candidate.slug === proofConfig.storySlug,
        );
        expect(story).toBeDefined();
        if (!story) continue;

        const proof = resolveApprovedClaims(
          claimRegistry,
          [story.logoClaimId, story.narrativeClaimId, ...proofConfig.resultClaimIds],
          surface,
          now,
        );
        expect(proof[1]?.statement).toBe(`${story.title} ${story.summary}`);
        for (const claimId of proofConfig.resultClaimIds) {
          const result = story.qualifiedResults.find((candidate) => candidate.claimId === claimId);
          const claim = proof.find((candidate) => candidate.id === claimId);
          expect(result).toBeDefined();
          expect(claim?.statement).toContain(result?.value);
          expect(claim?.statement).toContain(result?.label);
          expect(claim?.evidence.startsWith('https://')).toBe(true);
        }
      } else {
        const voice = customerVoiceDrafts.find((candidate) => candidate.id === proofConfig.voiceId);
        const [, quote] = resolveApprovedClaims(
          claimRegistry,
          [proofConfig.logoClaimId, proofConfig.voiceId],
          surface,
          now,
        );
        expect(voice?.company).toBe('Frommer Legal');
        expect(quote?.statement).toBe(voice?.verbatimExcerpt);
        expect(quote?.attribution).toBe('Managing Partner, Frommer Legal');
      }
    }
  });

  it('qualifies the adjacent venture-capital proof and gives legal no invented metric', () => {
    const privateEquity = solutions.find((solution) => solution.slug === 'private-equity');
    const legal = solutions.find((solution) => solution.slug === 'legal');

    expect(privateEquity?.customerProof).toMatchObject({
      kind: 'story',
      storySlug: 'b2venture',
      label: 'Venture capital investment-team example',
    });
    expect(legal?.customerProof).toEqual({
      kind: 'quote',
      voiceId: 'customer-voice-frommer-legal',
      logoClaimId: 'customer-logo-frommer-legal',
      label: 'Legal customer story',
    });
  });

  it('keeps all public solution strings free of em dashes', () => {
    const strings: string[] = [];
    const collect = (value: unknown): void => {
      if (typeof value === 'string') strings.push(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === 'object') {
        Object.values(value as Record<string, unknown>).forEach(collect);
      }
    };
    collect(solutions);
    expect(strings.join('\n')).not.toContain('—');
  });
});

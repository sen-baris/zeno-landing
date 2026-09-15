import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import {
  businessCaseHoursOptions,
  businessCaseQuestions,
  businessCaseTeamSizeOptions,
  businessCaseWorkTypeOptions,
  pricingPageClaimIds,
  pricingPageContent,
} from '../../src/lib/content/pricing';

const now = new Date('2026-09-15T12:00:00Z');

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

describe('pricing page content', () => {
  it('keeps claim references unique and resolves each statement on its approved surface', () => {
    expect(new Set(pricingPageClaimIds).size).toBe(pricingPageClaimIds.length);

    const [metadata] = resolveApprovedClaims(
      claimRegistry,
      [pricingPageContent.metadata.claimId],
      'pricing.metadata',
      now,
    );
    const [title, summary] = resolveApprovedClaims(
      claimRegistry,
      [pricingPageContent.hero.titleClaimId, pricingPageContent.hero.summaryClaimId],
      'pricing.hero',
      now,
    );
    const enterpriseClaims = resolveApprovedClaims(
      claimRegistry,
      [
        pricingPageContent.enterprise.offerClaimId,
        pricingPageContent.enterprise.titleClaimId,
        pricingPageContent.enterprise.summaryClaimId,
      ],
      'pricing.enterprise',
      now,
    );
    const calculatorClaims = resolveApprovedClaims(
      claimRegistry,
      [
        pricingPageContent.calculator.titleClaimId,
        pricingPageContent.calculator.pilotClaimId,
        pricingPageContent.calculator.disclaimerClaimId,
        pricingPageContent.calculator.privacyClaimId,
      ],
      'pricing.calculator',
      now,
    );

    expect(metadata?.statement).toContain('potential yearly time value');
    expect(title?.statement).toBe('What could your team get back?');
    expect(summary?.statement).toBe(
      'Choose the work taking your team’s time. Add a rough weekly total. See a planning estimate and a focused pilot.',
    );
    expect(enterpriseClaims.map((claim) => claim.statement)).toEqual([
      'Custom enterprise pricing',
      'Pricing follows the rollout.',
      'Scope the platform around your teams and workflows. Add connected systems and controls as needed.',
    ]);
    expect(calculatorClaims.at(-2)?.category).toBe('legal');
    expect(calculatorClaims.at(-1)?.category).toBe('privacy');
    expect(calculatorClaims.at(-2)?.statement).toBe(
      'These estimates are for planning only. They combine the time and team size you choose with the displayed recovery and hourly-value assumptions. They do not guarantee time savings, financial benefit, or final Zeno pricing.',
    );
    expect(calculatorClaims.at(1)?.statement).toBe(
      'A focused pilot gives you a value to validate before a wider rollout.',
    );
    expect(pricingPageContent.enterprise).toMatchObject({
      action: 'Book a demo',
      actionHref: '/demo',
    });
  });

  it('publishes no price, transferred proof, or em dash', () => {
    const publicStrings = collectStrings(pricingPageContent).join('\n');

    expect(publicStrings).not.toMatch(/[€£$]\s*\d/);
    expect(publicStrings).not.toContain('TextCortex');
    expect(publicStrings).not.toContain('—');
  });

  it('retires the repeated planning-example claim from active pricing content', () => {
    expect(pricingPageClaimIds).not.toContain('pricing-calculator-method');
    expect(
      claimRegistry.find((claim) => claim.id === 'pricing-calculator-method')?.approval_status,
    ).toBe('superseded');
  });

  it('defines the guided questions in calculation order', () => {
    expect(businessCaseQuestions.map((question) => question.field)).toEqual([
      'workTypeIds',
      'weeklyHoursSpent',
      'people',
    ]);
    expect(businessCaseQuestions.map((question) => question.heading)).toEqual([
      'What work takes up your team’s time?',
      'About how many hours does one person spend on this work each week?',
      'How many people do this work?',
    ]);
  });

  it('keeps work types unique and never assigns each one an automatic time figure', () => {
    expect(businessCaseWorkTypeOptions.map((option) => option.id)).toEqual([
      'report-generation',
      'financial-analysis',
      'presentation-creation',
      'email-triage',
      'document-review',
      'other-work',
    ]);
    expect(new Set(businessCaseWorkTypeOptions.map((option) => option.id)).size).toBe(
      businessCaseWorkTypeOptions.length,
    );
    expect(businessCaseWorkTypeOptions.every((option) => !('hours' in option))).toBe(true);
  });

  it('maps every team-size range to its disclosed rounded midpoint', () => {
    expect(businessCaseTeamSizeOptions).toEqual([
      { id: '1-to-10', label: '1 to 10', people: 6 },
      { id: '11-to-25', label: '11 to 25', people: 18 },
      { id: '26-to-50', label: '26 to 50', people: 38 },
      { id: '51-to-100', label: '51 to 100', people: 76 },
      { id: '101-to-250', label: '101 to 250', people: 176 },
      { id: '251-to-500', label: '251 to 500', people: 376 },
      { id: 'custom', label: 'Custom amount' },
    ]);
    expect(new Set(businessCaseTeamSizeOptions.map((option) => option.id)).size).toBe(
      businessCaseTeamSizeOptions.length,
    );
    expect(collectStrings(businessCaseTeamSizeOptions).join('\n')).not.toContain('—');
  });

  it('offers quick combined-time choices with a custom path', () => {
    expect(businessCaseHoursOptions).toEqual([
      { id: '1-hour', label: 'About 1 hour', value: 1 },
      { id: '2-hours', label: 'About 2 hours', value: 2 },
      { id: '4-hours', label: 'About 4 hours', value: 4 },
      { id: '8-hours', label: 'About 8 hours', value: 8 },
      { id: '16-hours', label: 'About 16 hours', value: 16 },
      { id: 'custom', label: 'Custom hours' },
    ]);
    expect(new Set(businessCaseHoursOptions.map((option) => option.id)).size).toBe(
      businessCaseHoursOptions.length,
    );
    expect(businessCaseHoursOptions.at(-1)?.id).toBe('custom');
  });
});

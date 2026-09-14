import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import {
  businessCaseHourlyValueOptions,
  businessCaseHoursOptions,
  businessCaseQuestions,
  businessCaseTeamSizeOptions,
  pricingPageClaimIds,
  pricingPageContent,
} from '../../src/lib/content/pricing';

const now = new Date('2026-09-14T12:00:00Z');

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
        pricingPageContent.calculator.descriptionClaimId,
        pricingPageContent.calculator.pilotClaimId,
        pricingPageContent.calculator.disclaimerClaimId,
        pricingPageContent.calculator.privacyClaimId,
      ],
      'pricing.calculator',
      now,
    );

    expect(metadata?.statement).toContain('yearly value of time');
    expect(title?.statement).toBe('What could one workflow give back?');
    expect(summary?.statement).toBe(
      'Estimate the time your team could recover and what that time is worth, then scope an enterprise rollout around the result.',
    );
    expect(enterpriseClaims.map((claim) => claim.statement)).toEqual([
      'Custom enterprise pricing',
      'Pricing follows the rollout.',
      'Scope the platform around the teams, workflows, connected systems, and controls you need.',
    ]);
    expect(calculatorClaims.at(-2)?.category).toBe('legal');
    expect(calculatorClaims.at(-1)?.category).toBe('privacy');
    expect(calculatorClaims.at(1)?.statement).toBe(
      'Choose a team-size range or exact amount, then select weekly hours returned and hourly value. Team ranges use the displayed rounded midpoint. Add an annual budget only to compare it with the estimated yearly value of recovered time.',
    );
    expect(calculatorClaims.at(2)?.statement).toBe(
      'A focused pilot gives you a value to validate before a wider rollout.',
    );
    expect(pricingPageContent.enterprise).toMatchObject({
      action: 'Assess AI readiness',
      actionHref: '/ai-readiness',
    });
  });

  it('publishes no price, transferred proof, or em dash', () => {
    const publicStrings = collectStrings(pricingPageContent).join('\n');

    expect(publicStrings).not.toMatch(/[€£$]\s*\d/);
    expect(publicStrings).not.toContain('TextCortex');
    expect(publicStrings).not.toContain('—');
  });

  it('defines the guided questions in calculation order', () => {
    expect(businessCaseQuestions.map((question) => question.field)).toEqual([
      'people',
      'hoursReturnedPerWeek',
      'hourlyValue',
    ]);
    expect(businessCaseQuestions.map((question) => question.heading)).toEqual([
      'How many people do this work?',
      'How many hours could each person get back each week?',
      'What is one hour of their time worth?',
    ]);
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

  it('offers exact weekly-hour and hourly-value presets with a custom path', () => {
    expect(businessCaseHoursOptions).toEqual([
      { id: '30-minutes', label: '30 minutes', value: 0.5 },
      { id: '1-hour', label: '1 hour', value: 1 },
      { id: '2-hours', label: '2 hours', value: 2 },
      { id: '4-hours', label: '4 hours', value: 4 },
      { id: '8-hours', label: '8 hours', value: 8 },
      { id: 'custom', label: 'Custom hours' },
    ]);
    expect(businessCaseHourlyValueOptions).toEqual([
      { id: '25', value: 25 },
      { id: '50', value: 50 },
      { id: '75', value: 75 },
      { id: '100', value: 100 },
      { id: '150', value: 150 },
      { id: 'custom', label: 'Custom value' },
    ]);
    for (const options of [businessCaseHoursOptions, businessCaseHourlyValueOptions]) {
      expect(new Set(options.map((option) => option.id)).size).toBe(options.length);
      expect(options.at(-1)?.id).toBe('custom');
    }
  });
});

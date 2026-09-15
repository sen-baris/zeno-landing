import type { BusinessCaseWorkTypeId } from '../pricing/business-case';

interface BusinessCaseQuestionBase {
  description: string;
  heading: string;
}

export type BusinessCaseQuestion =
  | (BusinessCaseQuestionBase & { field: 'workTypeIds' })
  | (BusinessCaseQuestionBase & {
      field: 'people' | 'weeklyHoursSpent';
      max: number;
      min: number;
      step: number;
    });

export interface BusinessCaseWorkTypeOption {
  id: BusinessCaseWorkTypeId;
  label: string;
}

export interface BusinessCaseTeamSizeOption {
  id: string;
  label: string;
  people?: number | undefined;
}

export interface BusinessCaseHoursOption {
  id: string;
  label: string;
  value?: number | undefined;
}

export interface PricingScopePrompt {
  label: string;
  number: string;
  question: string;
}

export const businessCaseWorkTypeOptions = [
  { id: 'report-generation', label: 'Report generation' },
  { id: 'financial-analysis', label: 'Financial analysis' },
  { id: 'presentation-creation', label: 'Presentation creation' },
  { id: 'email-triage', label: 'Email triage' },
  { id: 'document-review', label: 'Document review' },
  { id: 'other-work', label: 'Other recurring work' },
] as const satisfies readonly BusinessCaseWorkTypeOption[];

export const businessCaseTeamSizeOptions = [
  { id: '1-to-10', label: '1 to 10', people: 6 },
  { id: '11-to-25', label: '11 to 25', people: 18 },
  { id: '26-to-50', label: '26 to 50', people: 38 },
  { id: '51-to-100', label: '51 to 100', people: 76 },
  { id: '101-to-250', label: '101 to 250', people: 176 },
  { id: '251-to-500', label: '251 to 500', people: 376 },
  { id: 'custom', label: 'Custom amount' },
] as const satisfies readonly BusinessCaseTeamSizeOption[];

export const businessCaseHoursOptions = [
  { id: '1-hour', label: 'About 1 hour', value: 1 },
  { id: '2-hours', label: 'About 2 hours', value: 2 },
  { id: '4-hours', label: 'About 4 hours', value: 4 },
  { id: '8-hours', label: 'About 8 hours', value: 8 },
  { id: '16-hours', label: 'About 16 hours', value: 16 },
  { id: 'custom', label: 'Custom hours' },
] as const satisfies readonly BusinessCaseHoursOption[];

export const businessCaseQuestions: readonly BusinessCaseQuestion[] = [
  {
    field: 'workTypeIds',
    heading: 'What work takes up your team’s time?',
    description: 'Choose all that apply. Count the time across these tasks together.',
  },
  {
    field: 'weeklyHoursSpent',
    heading: 'About how many hours does one person spend on this work each week?',
    description: 'Use one combined total for everything you selected.',
    min: 0.5,
    max: 80,
    step: 0.5,
  },
  {
    field: 'people',
    heading: 'How many people do this work?',
    description: 'Choose a team range or enter the exact number.',
    min: 1,
    max: 100_000,
    step: 1,
  },
] as const;

export const pricingPageContent = {
  metadata: {
    claimId: 'pricing-page-metadata',
  },
  hero: {
    eyebrow: 'Business case',
    titleClaimId: 'pricing-enterprise-title',
    summaryClaimId: 'pricing-enterprise-summary',
    primaryAction: 'Book a demo',
  },
  calculator: {
    titleClaimId: 'pricing-calculator-title',
    pilotClaimId: 'pricing-calculator-pilot',
    disclaimerClaimId: 'pricing-calculator-disclaimer',
    privacyClaimId: 'pricing-calculator-local-data',
    fallbackTitle: 'Estimate the time value manually.',
    fallbackMethod:
      'Multiply people by combined weekly hours spent, then by the share of time recovered and working weeks. Multiply annual hours recovered by the planning value of one hour.',
    fallbackPilotMethod:
      'Pilot size uses 20 percent of the team, rounded to a whole person. Use at least five people when the team allows it and no more than 20. The pilot never exceeds the team entered.',
    fallbackAction: 'Book a demo',
    questions: businessCaseQuestions,
  },
  enterprise: {
    eyebrow: 'Enterprise plan',
    offerClaimId: 'pricing-enterprise-offer',
    titleClaimId: 'pricing-enterprise-close-title',
    summaryClaimId: 'pricing-enterprise-close-summary',
    action: 'Book a demo',
    actionHref: '/demo',
    scopePrompts: [
      { number: '01', label: 'People', question: 'Which teams should start?' },
      { number: '02', label: 'Workflows', question: 'Which work matters first?' },
      { number: '03', label: 'Systems', question: 'What needs to connect?' },
      { number: '04', label: 'Controls', question: 'Which rules apply?' },
    ] satisfies readonly PricingScopePrompt[],
  },
} as const;

export const pricingPageClaimIds = [
  pricingPageContent.metadata.claimId,
  pricingPageContent.hero.titleClaimId,
  pricingPageContent.hero.summaryClaimId,
  pricingPageContent.calculator.titleClaimId,
  pricingPageContent.calculator.pilotClaimId,
  pricingPageContent.calculator.disclaimerClaimId,
  pricingPageContent.calculator.privacyClaimId,
  pricingPageContent.enterprise.offerClaimId,
  pricingPageContent.enterprise.titleClaimId,
  pricingPageContent.enterprise.summaryClaimId,
] as const;

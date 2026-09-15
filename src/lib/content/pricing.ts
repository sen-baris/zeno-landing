import type { BusinessCaseNumericField } from '../pricing/business-case';

export interface BusinessCaseQuestion {
  description: string;
  field: Extract<BusinessCaseNumericField, 'people' | 'hoursReturnedPerWeek' | 'hourlyValue'>;
  heading: string;
  max: number;
  min: number;
  step: number;
}

export interface BusinessCaseTeamSizeOption {
  id: string;
  label: string;
  people?: number | undefined;
}

export interface BusinessCaseValueOption {
  id: string;
  label?: string | undefined;
  value?: number | undefined;
}

export interface PricingScopePrompt {
  label: string;
  number: string;
  question: string;
}

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
  { id: '30-minutes', label: '30 minutes', value: 0.5 },
  { id: '1-hour', label: '1 hour', value: 1 },
  { id: '2-hours', label: '2 hours', value: 2 },
  { id: '4-hours', label: '4 hours', value: 4 },
  { id: '8-hours', label: '8 hours', value: 8 },
  { id: 'custom', label: 'Custom hours' },
] as const satisfies readonly BusinessCaseValueOption[];

export const businessCaseHourlyValueOptions = [
  { id: '25', value: 25 },
  { id: '50', value: 50 },
  { id: '75', value: 75 },
  { id: '100', value: 100 },
  { id: '150', value: 150 },
  { id: 'custom', label: 'Custom value' },
] as const satisfies readonly BusinessCaseValueOption[];

export const businessCaseQuestions: readonly BusinessCaseQuestion[] = [
  {
    field: 'people',
    heading: 'How many people do this work?',
    description: 'Choose a range or enter the exact number of people on this workflow.',
    min: 1,
    max: 100_000,
    step: 1,
  },
  {
    field: 'hoursReturnedPerWeek',
    heading: 'How many hours could each person get back each week?',
    description: 'Choose a weekly estimate or enter your own.',
    min: 0.1,
    max: 168,
    step: 0.1,
  },
  {
    field: 'hourlyValue',
    heading: 'What is one hour of their time worth?',
    description: 'Choose a cost that includes salary and overhead, or enter your own.',
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
    descriptionClaimId: 'pricing-calculator-method',
    pilotClaimId: 'pricing-calculator-pilot',
    disclaimerClaimId: 'pricing-calculator-disclaimer',
    privacyClaimId: 'pricing-calculator-local-data',
    fallbackTitle: 'Estimate the value manually.',
    fallbackMethod:
      'Multiply people by weekly hours returned and working weeks to estimate time back. Then multiply annual hours by the value of one hour.',
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
  pricingPageContent.calculator.descriptionClaimId,
  pricingPageContent.calculator.pilotClaimId,
  pricingPageContent.calculator.disclaimerClaimId,
  pricingPageContent.calculator.privacyClaimId,
  pricingPageContent.enterprise.offerClaimId,
  pricingPageContent.enterprise.titleClaimId,
  pricingPageContent.enterprise.summaryClaimId,
] as const;

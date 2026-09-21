export const supportedBusinessCaseCurrencies = ['EUR', 'USD', 'GBP'] as const;

export const businessCaseWorkTypeIds = [
  'report-generation',
  'financial-analysis',
  'presentation-creation',
  'email-triage',
  'document-review',
  'other-work',
] as const;

export type BusinessCaseCurrency = (typeof supportedBusinessCaseCurrencies)[number];
export type BusinessCaseWorkTypeId = (typeof businessCaseWorkTypeIds)[number];

export interface BusinessCaseDraft {
  workTypeIds: BusinessCaseWorkTypeId[];
  people: string;
  weeklyHoursSpent: string;
  recoveryPercent: string;
  hourlyPlanningValue: string;
  workingWeeks: string;
  currency: BusinessCaseCurrency;
}

export interface BusinessCaseInputs {
  workTypeIds: readonly BusinessCaseWorkTypeId[];
  people: number;
  weeklyHoursSpent: number;
  recoveryPercent: number;
  hourlyPlanningValue: number;
  workingWeeks: number;
  currency: BusinessCaseCurrency;
}

export interface BusinessCaseResults {
  annualHoursReturned: number;
  annualTimeValue: number;
  currency: BusinessCaseCurrency;
}

export interface BusinessCasePilotEstimate {
  annualHoursReturned: number;
  annualTimeValue: number;
  people: number;
}

export const businessCasePilotRule = {
  minimumPeople: 5,
  maximumPeople: 20,
  teamShare: 0.2,
} as const;

export type BusinessCaseNumericField = Exclude<keyof BusinessCaseDraft, 'currency' | 'workTypeIds'>;
export type BusinessCaseErrors = Partial<Record<BusinessCaseNumericField | 'workTypeIds', string>>;

export type BusinessCaseValidation =
  | { ok: true; values: BusinessCaseInputs; errors: BusinessCaseErrors }
  | { ok: false; errors: BusinessCaseErrors };

export const defaultBusinessCaseDraft: BusinessCaseDraft = {
  workTypeIds: [],
  people: '',
  weeklyHoursSpent: '',
  recoveryPercent: '25',
  hourlyPlanningValue: '50',
  workingWeeks: '46',
  currency: 'EUR',
};

interface FieldRule {
  label: string;
  minimum: number;
  maximum: number;
  integer?: boolean;
}

const fieldRules: Record<BusinessCaseNumericField, FieldRule> = {
  people: {
    label: 'People doing this work',
    minimum: 1,
    maximum: 100_000,
    integer: true,
  },
  weeklyHoursSpent: {
    label: 'Weekly time spent per person',
    minimum: 0.5,
    maximum: 80,
  },
  recoveryPercent: {
    label: 'Time-recovery scenario',
    minimum: 0,
    maximum: 100,
  },
  hourlyPlanningValue: {
    label: 'Planning value per hour',
    minimum: 1,
    maximum: 100_000,
  },
  workingWeeks: {
    label: 'Working weeks per year',
    minimum: 1,
    maximum: 52,
    integer: true,
  },
};

function parseField(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function validateBusinessCaseDraft(draft: BusinessCaseDraft): BusinessCaseValidation {
  const errors: BusinessCaseErrors = {};
  const parsed: Partial<Record<BusinessCaseNumericField, number>> = {};
  const selectedIds = new Set(draft.workTypeIds);
  if (draft.workTypeIds.length === 0) {
    errors.workTypeIds = 'Choose at least one work type.';
  } else if (
    selectedIds.size !== draft.workTypeIds.length ||
    draft.workTypeIds.some((id) => !businessCaseWorkTypeIds.includes(id))
  ) {
    errors.workTypeIds = 'Choose valid work types without repeats.';
  }

  for (const field of Object.keys(fieldRules) as BusinessCaseNumericField[]) {
    const rule = fieldRules[field];
    const value = parseField(draft[field]);
    if (value === undefined) {
      errors[field] = `${rule.label} is required.`;
      continue;
    }
    if (value < rule.minimum || value > rule.maximum) {
      errors[field] =
        `${rule.label} must be between ${rule.minimum} and ${rule.maximum.toLocaleString('en-GB')}.`;
      continue;
    }
    if (rule.integer && !Number.isInteger(value)) {
      errors[field] = `${rule.label} must be a whole number.`;
      continue;
    }
    parsed[field] = value;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors,
    values: {
      workTypeIds: [...draft.workTypeIds],
      people: parsed.people!,
      weeklyHoursSpent: parsed.weeklyHoursSpent!,
      recoveryPercent: parsed.recoveryPercent!,
      hourlyPlanningValue: parsed.hourlyPlanningValue!,
      workingWeeks: parsed.workingWeeks!,
      currency: draft.currency,
    },
  };
}

export function calculateBusinessCase(inputs: BusinessCaseInputs): BusinessCaseResults {
  const annualHoursReturned =
    inputs.people * inputs.weeklyHoursSpent * (inputs.recoveryPercent / 100) * inputs.workingWeeks;
  return {
    annualHoursReturned,
    annualTimeValue: annualHoursReturned * inputs.hourlyPlanningValue,
    currency: inputs.currency,
  };
}

export function calculateBusinessCasePilot(
  inputs: Pick<
    BusinessCaseInputs,
    'people' | 'weeklyHoursSpent' | 'recoveryPercent' | 'hourlyPlanningValue' | 'workingWeeks'
  >,
): BusinessCasePilotEstimate {
  const availablePeople = Number.isFinite(inputs.people)
    ? Math.max(0, Math.floor(inputs.people))
    : 0;
  const proportionalPeople = Math.round(availablePeople * businessCasePilotRule.teamShare);
  const people = Math.min(
    availablePeople,
    businessCasePilotRule.maximumPeople,
    Math.max(businessCasePilotRule.minimumPeople, proportionalPeople),
  );
  const annualHoursReturned =
    people * inputs.weeklyHoursSpent * (inputs.recoveryPercent / 100) * inputs.workingWeeks;
  return {
    annualHoursReturned,
    annualTimeValue: annualHoursReturned * inputs.hourlyPlanningValue,
    people,
  };
}

export function formatBusinessCaseCurrency(
  value: number,
  currency: BusinessCaseCurrency,
  maximumFractionDigits = 0,
  locale = 'en-GB',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatBusinessCaseNumber(
  value: number,
  maximumFractionDigits = 0,
  locale = 'en-GB',
): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

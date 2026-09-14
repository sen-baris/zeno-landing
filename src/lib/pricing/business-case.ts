export const supportedBusinessCaseCurrencies = ['EUR', 'USD', 'GBP'] as const;

export type BusinessCaseCurrency = (typeof supportedBusinessCaseCurrencies)[number];

export interface BusinessCaseDraft {
  people: string;
  hoursReturnedPerWeek: string;
  hourlyValue: string;
  workingWeeks: string;
  annualBudget: string;
  currency: BusinessCaseCurrency;
}

export interface BusinessCaseInputs {
  people: number;
  hoursReturnedPerWeek: number;
  hourlyValue: number;
  workingWeeks: number;
  annualBudget?: number | undefined;
  currency: BusinessCaseCurrency;
}

export interface BusinessCaseResults {
  annualHoursReturned: number;
  annualCapacityValue: number;
  annualBudget?: number | undefined;
  roiPercent?: number | undefined;
  currency: BusinessCaseCurrency;
}

export interface BusinessCasePilotEstimate {
  annualCapacityValue: number;
  annualHoursReturned: number;
  people: number;
}

export const businessCasePilotRule = {
  minimumPeople: 5,
  maximumPeople: 20,
  teamShare: 0.2,
} as const;

export type BusinessCaseNumericField = Exclude<keyof BusinessCaseDraft, 'currency'>;
export type BusinessCaseErrors = Partial<Record<BusinessCaseNumericField, string>>;

export type BusinessCaseValidation =
  | { ok: true; values: BusinessCaseInputs; errors: BusinessCaseErrors }
  | { ok: false; errors: BusinessCaseErrors };

export const defaultBusinessCaseDraft: BusinessCaseDraft = {
  people: '',
  hoursReturnedPerWeek: '',
  hourlyValue: '',
  workingWeeks: '46',
  annualBudget: '',
  currency: 'EUR',
};

interface FieldRule {
  label: string;
  minimum: number;
  maximum: number;
  integer?: boolean;
  optional?: boolean;
}

const fieldRules: Record<BusinessCaseNumericField, FieldRule> = {
  people: {
    label: 'People doing this work',
    minimum: 1,
    maximum: 100_000,
    integer: true,
  },
  hoursReturnedPerWeek: {
    label: 'Hours returned per person each week',
    minimum: 0.1,
    maximum: 168,
  },
  hourlyValue: {
    label: 'Hourly value',
    minimum: 1,
    maximum: 100_000,
  },
  workingWeeks: {
    label: 'Working weeks per year',
    minimum: 1,
    maximum: 52,
    integer: true,
  },
  annualBudget: {
    label: 'Annual budget to compare',
    minimum: 1,
    maximum: 1_000_000_000_000,
    optional: true,
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

  for (const field of Object.keys(fieldRules) as BusinessCaseNumericField[]) {
    const rule = fieldRules[field];
    const rawValue = draft[field];
    const value = parseField(rawValue);

    if (value === undefined) {
      if (!rule.optional) errors[field] = `${rule.label} is required.`;
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
      people: parsed.people!,
      hoursReturnedPerWeek: parsed.hoursReturnedPerWeek!,
      hourlyValue: parsed.hourlyValue!,
      workingWeeks: parsed.workingWeeks!,
      annualBudget: parsed.annualBudget,
      currency: draft.currency,
    },
  };
}

export function calculateBusinessCase(inputs: BusinessCaseInputs): BusinessCaseResults {
  const annualHoursReturned = inputs.people * inputs.hoursReturnedPerWeek * inputs.workingWeeks;
  const annualCapacityValue = annualHoursReturned * inputs.hourlyValue;

  if (inputs.annualBudget === undefined) {
    return {
      annualHoursReturned,
      annualCapacityValue,
      currency: inputs.currency,
    };
  }

  return {
    annualHoursReturned,
    annualCapacityValue,
    annualBudget: inputs.annualBudget,
    roiPercent: ((annualCapacityValue - inputs.annualBudget) / inputs.annualBudget) * 100,
    currency: inputs.currency,
  };
}

export function calculateBusinessCasePilot(
  inputs: Pick<
    BusinessCaseInputs,
    'people' | 'hoursReturnedPerWeek' | 'hourlyValue' | 'workingWeeks'
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
  const annualHoursReturned = people * inputs.hoursReturnedPerWeek * inputs.workingWeeks;

  return {
    annualCapacityValue: annualHoursReturned * inputs.hourlyValue,
    annualHoursReturned,
    people,
  };
}

export function formatBusinessCaseCurrency(
  value: number,
  currency: BusinessCaseCurrency,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatBusinessCaseNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits }).format(value);
}

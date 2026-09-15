import { describe, expect, it } from 'vitest';
import {
  businessCasePilotRule,
  calculateBusinessCase,
  calculateBusinessCasePilot,
  defaultBusinessCaseDraft,
  formatBusinessCaseCurrency,
  formatBusinessCaseNumber,
  validateBusinessCaseDraft,
  type BusinessCaseDraft,
  type BusinessCaseInputs,
} from '../../src/lib/pricing/business-case';

const validDraft: BusinessCaseDraft = {
  workTypeIds: ['report-generation', 'presentation-creation'],
  people: '18',
  weeklyHoursSpent: '4',
  recoveryPercent: '25',
  hourlyPlanningValue: '50',
  workingWeeks: '46',
  currency: 'EUR',
};

const validInputs: BusinessCaseInputs = {
  workTypeIds: ['report-generation', 'presentation-creation'],
  people: 18,
  weeklyHoursSpent: 4,
  recoveryPercent: 25,
  hourlyPlanningValue: 50,
  workingWeeks: 46,
  currency: 'EUR',
};

describe('pricing business case', () => {
  it('starts without visitor choices and validates one combined weekly total', () => {
    expect(defaultBusinessCaseDraft).toEqual({
      workTypeIds: [],
      people: '',
      weeklyHoursSpent: '',
      recoveryPercent: '25',
      hourlyPlanningValue: '50',
      workingWeeks: '46',
      currency: 'EUR',
    });
    const initial = validateBusinessCaseDraft(defaultBusinessCaseDraft);
    expect(initial.ok).toBe(false);
    expect(initial.errors).toMatchObject({
      workTypeIds: 'Choose at least one work type.',
      people: 'People doing this work is required.',
      weeklyHoursSpent: 'Weekly time spent per person is required.',
    });
    expect(validateBusinessCaseDraft(validDraft)).toEqual({
      ok: true,
      errors: {},
      values: validInputs,
    });
  });

  it('applies one recovery scenario to combined time, not once per work type', () => {
    expect(calculateBusinessCase(validInputs)).toEqual({
      annualHoursReturned: 828,
      annualTimeValue: 41400,
      currency: 'EUR',
    });
    expect(calculateBusinessCase({ ...validInputs, workTypeIds: ['report-generation'] })).toEqual(
      calculateBusinessCase(validInputs),
    );
  });

  it('keeps the focused pilot rule and annualizes its value', () => {
    expect(businessCasePilotRule).toEqual({
      minimumPeople: 5,
      maximumPeople: 20,
      teamShare: 0.2,
    });
    expect(calculateBusinessCasePilot(validInputs)).toEqual({
      people: 5,
      annualHoursReturned: 230,
      annualTimeValue: 11500,
    });
    expect(calculateBusinessCasePilot({ ...validInputs, people: 4 }).people).toBe(4);
    expect(calculateBusinessCasePilot({ ...validInputs, people: 376 }).people).toBe(20);
    expect(calculateBusinessCasePilot({ ...validInputs, people: Number.NaN })).toEqual({
      people: 0,
      annualHoursReturned: 0,
      annualTimeValue: 0,
    });
  });

  it('recalculates edited assumptions without asserting guaranteed returns', () => {
    expect(calculateBusinessCase({ ...validInputs, recoveryPercent: 0 })).toMatchObject({
      annualHoursReturned: 0,
      annualTimeValue: 0,
    });
    expect(calculateBusinessCase({ ...validInputs, recoveryPercent: 50 })).toMatchObject({
      annualHoursReturned: 1656,
      annualTimeValue: 82800,
    });
    expect(calculateBusinessCase({ ...validInputs, hourlyPlanningValue: 75 })).toMatchObject({
      annualHoursReturned: 828,
      annualTimeValue: 62100,
    });
  });

  it('rejects unknown or repeated work types and invalid numeric settings', () => {
    expect(
      validateBusinessCaseDraft({
        ...validDraft,
        workTypeIds: ['report-generation', 'report-generation'],
      }).errors.workTypeIds,
    ).toBe('Choose valid work types without repeats.');
    expect(
      validateBusinessCaseDraft({
        ...validDraft,
        workTypeIds: ['unknown'] as unknown as BusinessCaseDraft['workTypeIds'],
      }).errors.workTypeIds,
    ).toBe('Choose valid work types without repeats.');
    expect(
      validateBusinessCaseDraft({
        ...validDraft,
        people: '2.5',
        weeklyHoursSpent: '81',
        recoveryPercent: '101',
        hourlyPlanningValue: '0',
        workingWeeks: '51.5',
      }).errors,
    ).toEqual({
      people: 'People doing this work must be a whole number.',
      weeklyHoursSpent: 'Weekly time spent per person must be between 0.5 and 80.',
      recoveryPercent: 'Time-recovery scenario must be between 0 and 100.',
      hourlyPlanningValue: 'Planning value per hour must be between 1 and 100,000.',
      workingWeeks: 'Working weeks per year must be a whole number.',
    });
  });

  it('changes currency formatting only and keeps deterministic rounding', () => {
    expect(formatBusinessCaseCurrency(41400, 'EUR')).toBe('€41,400');
    expect(formatBusinessCaseCurrency(41400, 'USD')).toBe('US$41,400');
    expect(formatBusinessCaseCurrency(41400, 'GBP')).toBe('£41,400');
    expect(formatBusinessCaseNumber(230.25, 1)).toBe('230.3');
  });
});

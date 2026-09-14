import { describe, expect, it } from 'vitest';
import {
  calculateBusinessCase,
  calculateBusinessCasePilot,
  businessCasePilotRule,
  defaultBusinessCaseDraft,
  formatBusinessCaseCurrency,
  formatBusinessCaseNumber,
  validateBusinessCaseDraft,
  type BusinessCaseDraft,
  type BusinessCaseInputs,
} from '../../src/lib/pricing/business-case';

const validDraft: BusinessCaseDraft = {
  people: '50',
  hoursReturnedPerWeek: '1',
  hourlyValue: '75',
  workingWeeks: '46',
  annualBudget: '',
  currency: 'EUR',
};

const validInputs: BusinessCaseInputs = {
  people: 50,
  hoursReturnedPerWeek: 1,
  hourlyValue: 75,
  workingWeeks: 46,
  currency: 'EUR',
};

describe('pricing business case', () => {
  it('starts without performance assumptions and validates a complete visitor estimate', () => {
    expect(defaultBusinessCaseDraft).toEqual({
      people: '',
      hoursReturnedPerWeek: '',
      hourlyValue: '',
      workingWeeks: '46',
      annualBudget: '',
      currency: 'EUR',
    });

    const initial = validateBusinessCaseDraft(defaultBusinessCaseDraft);
    expect(initial.ok).toBe(false);
    expect(initial.errors).toMatchObject({
      people: 'People doing this work is required.',
      hoursReturnedPerWeek: 'Hours returned per person each week is required.',
      hourlyValue: 'Hourly value is required.',
    });

    expect(validateBusinessCaseDraft(validDraft)).toEqual({
      ok: true,
      errors: {},
      values: validInputs,
    });
  });

  it('calculates annual hours and capacity value without inventing an investment', () => {
    expect(calculateBusinessCase(validInputs)).toEqual({
      annualHoursReturned: 2300,
      annualCapacityValue: 172500,
      currency: 'EUR',
    });
  });

  it('derives a focused pilot from the entered team without exceeding it', () => {
    expect(businessCasePilotRule).toEqual({
      minimumPeople: 5,
      maximumPeople: 20,
      teamShare: 0.2,
    });
    expect(calculateBusinessCasePilot(validInputs)).toEqual({
      people: 10,
      annualHoursReturned: 460,
      annualCapacityValue: 34500,
    });
    expect(calculateBusinessCasePilot({ ...validInputs, people: 4 })).toMatchObject({ people: 4 });
    expect(calculateBusinessCasePilot({ ...validInputs, people: 376 })).toMatchObject({
      people: 20,
    });
    expect(calculateBusinessCasePilot({ ...validInputs, people: Number.NaN })).toMatchObject({
      people: 0,
      annualHoursReturned: 0,
      annualCapacityValue: 0,
    });
  });

  it('calculates the disclosed 18-person example and its five-person pilot', () => {
    const example: BusinessCaseInputs = {
      people: 18,
      hoursReturnedPerWeek: 2,
      hourlyValue: 50,
      workingWeeks: 46,
      currency: 'EUR',
    };

    expect(calculateBusinessCase(example)).toEqual({
      annualHoursReturned: 1656,
      annualCapacityValue: 82800,
      currency: 'EUR',
    });
    expect(calculateBusinessCasePilot(example)).toEqual({
      people: 5,
      annualHoursReturned: 460,
      annualCapacityValue: 23000,
    });
  });

  it('reveals standard ROI only for a supplied annual budget', () => {
    const results = calculateBusinessCase({ ...validInputs, annualBudget: 200000 });

    expect(results).toMatchObject({
      annualHoursReturned: 2300,
      annualCapacityValue: 172500,
      annualBudget: 200000,
      currency: 'EUR',
    });
    expect(results.roiPercent).toBeCloseTo(-13.75, 8);
  });

  it('keeps zero-value direct calculations finite', () => {
    expect(calculateBusinessCase({ ...validInputs, people: 0, annualBudget: 100 })).toEqual({
      annualHoursReturned: 0,
      annualCapacityValue: 0,
      annualBudget: 100,
      roiPercent: -100,
      currency: 'EUR',
    });
  });

  it('rejects malformed, out-of-range, and fractional whole-number inputs', () => {
    const validation = validateBusinessCaseDraft({
      people: '2.5',
      hoursReturnedPerWeek: 'not-a-number',
      hourlyValue: '0',
      workingWeeks: '51.5',
      annualBudget: '0',
      currency: 'GBP',
    });

    expect(validation.ok).toBe(false);
    expect(validation.errors).toEqual({
      people: 'People doing this work must be a whole number.',
      hoursReturnedPerWeek: 'Hours returned per person each week is required.',
      hourlyValue: 'Hourly value must be between 1 and 100,000.',
      workingWeeks: 'Working weeks per year must be a whole number.',
      annualBudget: 'Annual budget to compare must be between 1 and 1,000,000,000,000.',
    });
  });

  it('formats values deterministically without converting currencies', () => {
    expect(formatBusinessCaseCurrency(172500, 'EUR')).toBe('€172,500');
    expect(formatBusinessCaseCurrency(172500, 'USD')).toBe('US$172,500');
    expect(formatBusinessCaseCurrency(-27500, 'GBP')).toBe('-£27,500');
    expect(formatBusinessCaseNumber(0.8625, 1)).toBe('0.9');
    expect(formatBusinessCaseNumber(2300)).toBe('2,300');
  });
});

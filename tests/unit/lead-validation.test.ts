import { describe, expect, it } from 'vitest';
import {
  isValidEmail,
  validateDemoStep,
  type DemoFormValues,
} from '../../src/lib/leads/validation';

const complete: DemoFormValues = {
  workEmail: 'alex@example.test',
  company: 'Example Test Company',
  role: 'Innovation lead',
  sizeBand: '1000-4999',
  priorityWorkflow: 'research-synthesis',
  desiredStart: '0-3-months',
  systemsContext: '',
  privacyAcknowledged: true,
  marketing: false,
};

describe('demo validation', () => {
  it.each(['alex@example.test', ' first.last+demo@enterprise.example '])('accepts %s', (email) =>
    expect(isValidEmail(email)).toBe(true),
  );

  it.each(['', 'alex', 'alex@', '@example.test', 'alex @example.test'])('rejects %s', (email) =>
    expect(isValidEmail(email)).toBe(false),
  );

  it('requires every step-one qualification field', () => {
    const errors = validateDemoStep(1, {
      ...complete,
      workEmail: 'invalid',
      company: ' ',
      role: '',
      sizeBand: '',
    });
    expect(errors).toEqual({
      workEmail: 'Enter a valid work email.',
      company: 'Enter your company name.',
      role: 'Enter your role.',
      sizeBand: 'Choose an organization size.',
    });
  });

  it('requires workflow, timing, and privacy but not marketing or systems context', () => {
    expect(
      validateDemoStep(2, {
        ...complete,
        priorityWorkflow: '',
        desiredStart: '',
        privacyAcknowledged: false,
      }),
    ).toEqual({
      priorityWorkflow: 'Choose a priority workflow.',
      desiredStart: 'Choose a desired start window.',
      privacyAcknowledged: 'Acknowledge how these details will be used.',
    });
    expect(validateDemoStep(1, complete)).toEqual({});
    expect(validateDemoStep(2, complete)).toEqual({});
  });
});

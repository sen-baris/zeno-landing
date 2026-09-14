import { describe, expect, it } from 'vitest';
import {
  isValidEmail,
  isValidPhoneNumber,
  validateDemoForm,
  type DemoFormValues,
} from '../../src/lib/leads/validation';

const complete: DemoFormValues = {
  fullName: 'Alex Example',
  workEmail: 'alex@example.test',
  company: 'Example Test Company',
  phoneNumber: '+49 30 1234567',
  role: 'Innovation lead',
  sizeBand: '1000-4999',
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

  it.each(['', '+49 30 1234567', '(212) 555-0188'])('accepts phone value %s', (phone) =>
    expect(isValidPhoneNumber(phone)).toBe(true),
  );

  it.each(['call me', '123', '+1 212 555 0188 ext 4'])('rejects phone value %s', (phone) =>
    expect(isValidPhoneNumber(phone)).toBe(false),
  );

  it('requires only the meeting request fields', () => {
    const errors = validateDemoForm({
      ...complete,
      fullName: ' ',
      workEmail: 'invalid',
      company: ' ',
      phoneNumber: 'not a phone',
      role: '',
      sizeBand: '',
      desiredStart: '',
      privacyAcknowledged: false,
    });
    expect(errors).toEqual({
      fullName: 'Enter your full name.',
      workEmail: 'Enter a valid work email.',
      company: 'Enter your company name.',
      phoneNumber: 'Enter a valid phone number or leave it blank.',
      privacyAcknowledged: 'Acknowledge how these details will be used.',
    });
    expect(validateDemoForm(complete)).toEqual({});
  });
});

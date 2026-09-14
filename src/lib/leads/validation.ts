export interface DemoFormValues {
  fullName: string;
  workEmail: string;
  company: string;
  phoneNumber: string;
  role: string;
  sizeBand: string;
  desiredStart: string;
  systemsContext: string;
  privacyAcknowledged: boolean;
  marketing: boolean;
}

export type DemoFormErrors = Partial<Record<keyof DemoFormValues, string>>;

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhoneNumber(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '') return true;
  if (!/^[+()\d\s.-]+$/.test(trimmed)) return false;
  const digitCount = trimmed.replace(/\D/g, '').length;
  return digitCount >= 7 && digitCount <= 15;
}

export function validateDemoForm(values: DemoFormValues): DemoFormErrors {
  const errors: DemoFormErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!isValidEmail(values.workEmail)) errors.workEmail = 'Enter a valid work email.';
  if (!values.company.trim()) errors.company = 'Enter your company name.';
  if (!isValidPhoneNumber(values.phoneNumber)) {
    errors.phoneNumber = 'Enter a valid phone number or leave it blank.';
  }
  if (!values.privacyAcknowledged) {
    errors.privacyAcknowledged = 'Acknowledge how these details will be used.';
  }
  return errors;
}

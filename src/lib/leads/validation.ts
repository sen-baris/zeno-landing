export interface DemoFormValues {
  workEmail: string;
  company: string;
  role: string;
  sizeBand: string;
  priorityWorkflow: string;
  desiredStart: string;
  systemsContext: string;
  privacyAcknowledged: boolean;
  marketing: boolean;
}

export type DemoFormErrors = Partial<Record<keyof DemoFormValues, string>>;

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateDemoStep(step: 1 | 2, values: DemoFormValues): DemoFormErrors {
  const errors: DemoFormErrors = {};

  if (step === 1) {
    if (!isValidEmail(values.workEmail)) errors.workEmail = 'Enter a valid work email.';
    if (!values.company.trim()) errors.company = 'Enter your company name.';
    if (!values.role.trim()) errors.role = 'Enter your role.';
    if (!values.sizeBand) errors.sizeBand = 'Choose an organization size.';
    return errors;
  }

  if (!values.priorityWorkflow) errors.priorityWorkflow = 'Choose a priority workflow.';
  if (!values.desiredStart) errors.desiredStart = 'Choose a desired start window.';
  if (!values.privacyAcknowledged) {
    errors.privacyAcknowledged = 'Acknowledge how these details will be used.';
  }
  return errors;
}

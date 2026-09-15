export type LeadSource = 'demo';

export interface LeadSubmission {
  source: LeadSource;
  contact: {
    fullName?: string;
    phoneNumber?: string;
    workEmail: string;
  };
  company: {
    name: string;
    role?: string;
    sizeBand?: string;
  };
  intent: {
    desiredStart?: string;
    systemsContext?: string;
  };
  consent: {
    privacyAcknowledged: boolean;
    marketing: boolean;
  };
  attribution: {
    landingPath: string;
  };
}

export interface LeadSubmissionReceipt {
  submissionId: string;
  nextStepUrl?: string;
}

export interface LeadSubmissionAdapter {
  submit(submission: LeadSubmission, signal?: AbortSignal): Promise<LeadSubmissionReceipt>;
}

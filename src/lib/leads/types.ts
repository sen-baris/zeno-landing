import type { AssessmentQuadrant, WorkflowCategory } from '../assessment/types';

export type LeadSource = 'demo' | 'assessment-email' | 'assessment-discussion';

export interface LeadSubmission {
  source: LeadSource;
  contact: {
    workEmail: string;
  };
  company: {
    name: string;
    role?: string;
    sizeBand?: string;
  };
  intent: {
    priorityWorkflow?: WorkflowCategory;
    desiredStart?: string;
    systemsContext?: string;
  };
  assessment?: {
    impactScore: number;
    readinessScore: number;
    quadrant: AssessmentQuadrant;
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

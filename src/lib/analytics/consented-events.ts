import type { AssessmentQuadrant } from '../assessment/types';

const CONSENT_KEY = 'zeno-analytics-consent';

export type AnalyticsEvent =
  | { name: 'assessment_started' }
  | {
      name: 'assessment_completed';
      impactScore: number;
      readinessScore: number;
      quadrant: AssessmentQuadrant;
    }
  | { name: 'result_cta_selected'; action: 'email-plan' | 'discuss-workflow' }
  | { name: 'demo_started'; source: 'direct' | 'assessment' }
  | { name: 'demo_submitted'; source: 'direct' | 'assessment' }
  | { name: 'submission_failed'; surface: 'demo' | 'assessment'; code: string }
  | { name: 'submission_retried'; surface: 'demo' | 'assessment' };

export function hasAnalyticsConsent(storage: Storage = window.localStorage): boolean {
  return storage.getItem(CONSENT_KEY) === 'granted';
}

export function trackConsentedEvent(
  event: AnalyticsEvent,
  storage: Storage = window.localStorage,
  target: EventTarget = window,
): boolean {
  if (!hasAnalyticsConsent(storage)) return false;
  target.dispatchEvent(new CustomEvent<AnalyticsEvent>('zeno:analytics', { detail: event }));
  return true;
}

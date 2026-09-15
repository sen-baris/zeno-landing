const CONSENT_KEY = 'zeno-analytics-consent';

export type AnalyticsEvent =
  | { name: 'demo_started' }
  | { name: 'demo_submitted' }
  | { name: 'submission_failed'; surface: 'demo'; code: string }
  | { name: 'submission_retried'; surface: 'demo' };

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

import { describe, expect, it, vi } from 'vitest';
import { hasAnalyticsConsent, trackConsentedEvent } from '../../src/lib/analytics/consented-events';

describe('consented analytics events', () => {
  it('does not dispatch before consent', () => {
    const listener = vi.fn();
    window.addEventListener('zeno:analytics', listener);
    expect(hasAnalyticsConsent()).toBe(false);
    expect(trackConsentedEvent({ name: 'assessment_started' })).toBe(false);
    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener('zeno:analytics', listener);
  });

  it('dispatches a typed non-PII event after consent', () => {
    window.localStorage.setItem('zeno-analytics-consent', 'granted');
    const listener = vi.fn();
    window.addEventListener('zeno:analytics', listener);
    expect(trackConsentedEvent({ name: 'demo_started', source: 'assessment' })).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      name: 'demo_started',
      source: 'assessment',
    });
    window.removeEventListener('zeno:analytics', listener);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { loadAssessmentContext, saveAssessmentContext } from '../../src/lib/assessment/storage';

describe('assessment session context', () => {
  it('stores only the result context and no answers or contact data', () => {
    vi.setSystemTime(new Date('2026-08-27T10:00:00Z'));
    saveAssessmentContext({
      impactScore: 75,
      readinessScore: 60,
      quadrant: 'launch-candidate',
      workflow: 'research-synthesis',
    });

    const raw = window.sessionStorage.getItem('zeno-assessment-context');
    expect(raw).not.toContain('answers');
    expect(raw).not.toContain('email');
    expect(loadAssessmentContext()).toEqual({
      impactScore: 75,
      readinessScore: 60,
      quadrant: 'launch-candidate',
      workflow: 'research-synthesis',
      savedAt: '2026-08-27T10:00:00.000Z',
    });
    vi.useRealTimers();
  });

  it('returns null when no context exists', () => {
    expect(loadAssessmentContext()).toBeNull();
  });

  it.each([
    '{not-json',
    JSON.stringify({ impactScore: 101 }),
    JSON.stringify({
      impactScore: 20,
      readinessScore: 20,
      quadrant: 'unknown',
      workflow: 'research-synthesis',
      savedAt: 'today',
    }),
  ])('removes malformed stored context', (value) => {
    window.sessionStorage.setItem('zeno-assessment-context', value);
    expect(loadAssessmentContext()).toBeNull();
    expect(window.sessionStorage.getItem('zeno-assessment-context')).toBeNull();
  });
});

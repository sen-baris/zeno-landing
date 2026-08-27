import { describe, expect, it } from 'vitest';
import { assessmentQuestions, workflowOptions } from '../../src/lib/assessment/questions';
import {
  calculateAssessment,
  HIGH_SCORE_THRESHOLD,
  recommendWorkflow,
  scoreAxis,
  selectQuadrant,
} from '../../src/lib/assessment/scoring';
import type { AssessmentAnswers, AssessmentQuadrant } from '../../src/lib/assessment/types';

function answersWith(value: number): AssessmentAnswers {
  return Object.fromEntries(assessmentQuestions.map((question) => [question.id, value]));
}

describe('assessment scoring', () => {
  it('normalizes the minimum and maximum answers to 0 and 100', () => {
    expect(scoreAxis(answersWith(0), 'impact')).toBe(0);
    expect(scoreAxis(answersWith(0), 'readiness')).toBe(0);
    expect(scoreAxis(answersWith(4), 'impact')).toBe(100);
    expect(scoreAxis(answersWith(4), 'readiness')).toBe(100);
  });

  it('applies equal impact weights and equal readiness weights', () => {
    const answers = { ...answersWith(0), 'workflow-frequency': 4, 'data-availability': 4 };
    expect(scoreAxis(answers, 'impact')).toBe(25);
    expect(scoreAxis(answers, 'readiness')).toBe(20);
  });

  it('rounds normalized scores to a whole number', () => {
    const answers = { ...answersWith(0), 'workflow-frequency': 3, 'people-time': 2 };
    expect(scoreAxis(answers, 'impact')).toBe(31);
  });

  it.each([
    [60, 60, 'launch-candidate'],
    [100, 100, 'launch-candidate'],
    [60, 59, 'prepare-foundation'],
    [100, 0, 'prepare-foundation'],
    [59, 60, 'quick-win'],
    [0, 100, 'quick-win'],
    [59, 59, 'narrow-validate'],
    [0, 0, 'narrow-validate'],
  ] as const)('maps impact %i and readiness %i to %s', (impact, readiness, expected) => {
    expect(selectQuadrant(impact, readiness)).toBe(expected);
  });

  it('keeps the published threshold at 60', () => {
    expect(HIGH_SCORE_THRESHOLD).toBe(60);
  });

  it('rejects missing, fractional, and out-of-range answers', () => {
    expect(() => scoreAxis({}, 'impact')).toThrow(RangeError);
    expect(() => scoreAxis({ ...answersWith(0), 'people-time': 2.5 }, 'impact')).toThrow(
      RangeError,
    );
    expect(() => scoreAxis({ ...answersWith(0), 'people-time': 5 }, 'impact')).toThrow(RangeError);
  });

  it.each(workflowOptions)('creates a recommendation for $label in every quadrant', (workflow) => {
    const quadrants: AssessmentQuadrant[] = [
      'launch-candidate',
      'prepare-foundation',
      'quick-win',
      'narrow-validate',
    ];
    for (const quadrant of quadrants) {
      expect(recommendWorkflow(workflow.id, quadrant)).toContain(workflow.label.toLowerCase());
    }
  });

  it('rejects an unknown workflow category', () => {
    expect(() => recommendWorkflow('unknown' as never, 'launch-candidate')).toThrow(RangeError);
  });

  it('returns a complete launch-candidate action plan', () => {
    const result = calculateAssessment(answersWith(4), 'consolidation-reporting');
    expect(result).toMatchObject({
      impactScore: 100,
      readinessScore: 100,
      quadrant: 'launch-candidate',
      quadrantLabel: 'Launch candidate',
    });
    expect(result.actions).toHaveLength(3);
    expect(result.workflowRecommendation).toBe('Launch consolidation and reporting.');
  });
});

import { assessmentQuestions, workflowOptions } from './questions';
import type {
  AssessmentAnswers,
  AssessmentAxis,
  AssessmentQuadrant,
  AssessmentResult,
  WorkflowCategory,
} from './types';

export const HIGH_SCORE_THRESHOLD = 60;

const quadrantContent: Record<
  AssessmentQuadrant,
  { label: string; actions: readonly [string, string, string] }
> = {
  'launch-candidate': {
    label: 'Launch candidate',
    actions: [
      'Confirm one accountable owner and a measurable success signal.',
      'Connect a representative, permissioned source of context.',
      'Launch the workflow with a human quality checkpoint and a clear expansion path.',
    ],
  },
  'prepare-foundation': {
    label: 'Prepare the foundation',
    actions: [
      'Name the workflow owner and the people who approve change.',
      'Document inputs, exceptions, outputs, and the human review point.',
      'Resolve the highest-risk data or system-access gap before implementation.',
    ],
  },
  'quick-win': {
    label: 'Quick win',
    actions: [
      'Choose one repeatable workflow with visible user value.',
      'Define a simple quality check and a stop condition.',
      'Start with an accountable team, then expand the workflow deliberately.',
    ],
  },
  'narrow-validate': {
    label: 'Narrow and validate',
    actions: [
      'Measure the current workflow before selecting a solution.',
      'Find a narrower, more frequent task with clearer inputs.',
      'Reassess when an owner and an approved context source are available.',
    ],
  },
};

export function scoreAxis(answers: AssessmentAnswers, axis: AssessmentAxis): number {
  const questions = assessmentQuestions.filter((question) => question.axis === axis);
  let weightedScore = 0;
  let totalWeight = 0;

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || !Number.isInteger(answer) || answer < 0 || answer > 4) {
      throw new RangeError(`Answer for "${question.id}" must be an integer from 0 to 4.`);
    }
    weightedScore += answer * question.weight;
    totalWeight += 4 * question.weight;
  }

  return Math.round((weightedScore / totalWeight) * 100);
}

export function selectQuadrant(impactScore: number, readinessScore: number): AssessmentQuadrant {
  const highImpact = impactScore >= HIGH_SCORE_THRESHOLD;
  const highReadiness = readinessScore >= HIGH_SCORE_THRESHOLD;

  if (highImpact && highReadiness) return 'launch-candidate';
  if (highImpact) return 'prepare-foundation';
  if (highReadiness) return 'quick-win';
  return 'narrow-validate';
}

export function recommendWorkflow(
  workflow: WorkflowCategory,
  quadrant: AssessmentQuadrant,
): string {
  const selected = workflowOptions.find((option) => option.id === workflow);
  if (!selected) {
    throw new RangeError(`Unknown workflow category "${String(workflow)}".`);
  }

  const prefixes: Record<AssessmentQuadrant, string> = {
    'launch-candidate': 'Launch',
    'prepare-foundation': 'Prepare',
    'quick-win': 'Start with a narrow slice of',
    'narrow-validate': 'Validate the baseline for',
  };
  return `${prefixes[quadrant]} ${selected.label.toLowerCase()}.`;
}

export function calculateAssessment(
  answers: AssessmentAnswers,
  workflow: WorkflowCategory,
): AssessmentResult {
  const impactScore = scoreAxis(answers, 'impact');
  const readinessScore = scoreAxis(answers, 'readiness');
  const quadrant = selectQuadrant(impactScore, readinessScore);
  const content = quadrantContent[quadrant];

  return {
    impactScore,
    readinessScore,
    quadrant,
    quadrantLabel: content.label,
    workflowRecommendation: recommendWorkflow(workflow, quadrant),
    actions: content.actions,
  };
}

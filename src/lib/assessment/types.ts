export type AssessmentAxis = 'impact' | 'readiness';

export type WorkflowCategory =
  'research-synthesis' | 'data-preparation' | 'consolidation-reporting' | 'visualization-decisions';

export interface AssessmentOption {
  id: string;
  label: string;
  value: 0 | 1 | 2 | 3 | 4;
}

export interface AssessmentQuestion {
  id: string;
  axis: AssessmentAxis;
  category: string;
  prompt: string;
  options: readonly AssessmentOption[];
  weight: number;
}

export type AssessmentQuadrant =
  'launch-candidate' | 'prepare-foundation' | 'quick-win' | 'narrow-validate';

export interface AssessmentResult {
  impactScore: number;
  readinessScore: number;
  quadrant: AssessmentQuadrant;
  quadrantLabel: string;
  workflowRecommendation: string;
  actions: readonly [string, string, string];
}

export type AssessmentAnswers = Readonly<Record<string, number>>;

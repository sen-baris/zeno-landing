import type { AssessmentQuadrant, WorkflowCategory } from './types';

const STORAGE_KEY = 'zeno-assessment-context';

export interface StoredAssessmentContext {
  impactScore: number;
  readinessScore: number;
  quadrant: AssessmentQuadrant;
  workflow: WorkflowCategory;
  savedAt: string;
}

function isScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 100;
}

const quadrants: readonly AssessmentQuadrant[] = [
  'launch-candidate',
  'prepare-foundation',
  'quick-win',
  'narrow-validate',
];

const workflows: readonly WorkflowCategory[] = [
  'research-synthesis',
  'data-preparation',
  'consolidation-reporting',
  'visualization-decisions',
];

export function saveAssessmentContext(
  context: Omit<StoredAssessmentContext, 'savedAt'>,
  storage: Storage = window.sessionStorage,
): void {
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...context, savedAt: new Date().toISOString() }));
}

export function loadAssessmentContext(
  storage: Storage = window.sessionStorage,
): StoredAssessmentContext | null {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<StoredAssessmentContext>;
    if (
      !isScore(value.impactScore) ||
      !isScore(value.readinessScore) ||
      !quadrants.includes(value.quadrant as AssessmentQuadrant) ||
      !workflows.includes(value.workflow as WorkflowCategory) ||
      typeof value.savedAt !== 'string'
    ) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return value as StoredAssessmentContext;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

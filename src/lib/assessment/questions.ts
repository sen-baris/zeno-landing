import type { AssessmentQuestion, WorkflowCategory } from './types';

const frequencyOptions = [
  { id: 'quarterly', label: 'Quarterly or less', value: 0 },
  { id: 'monthly', label: 'A few times a month', value: 1 },
  { id: 'weekly', label: 'Every week', value: 2 },
  { id: 'daily', label: 'Most working days', value: 3 },
  { id: 'many-daily', label: 'Several times a day', value: 4 },
] as const;

const maturityOptions = (labels: readonly [string, string, string, string, string]) =>
  labels.map((label, value) => ({
    id: `level-${value}`,
    label,
    value: value as 0 | 1 | 2 | 3 | 4,
  }));

export const assessmentQuestions: readonly AssessmentQuestion[] = [
  {
    id: 'workflow-frequency',
    axis: 'impact',
    category: 'frequency',
    prompt: 'How often does this workflow happen?',
    options: frequencyOptions,
    weight: 0.25,
  },
  {
    id: 'people-time',
    axis: 'impact',
    category: 'people-time',
    prompt: 'How much team capacity does it absorb?',
    options: maturityOptions([
      'One person, less than an hour a week',
      'One person, several hours a week',
      'One team, several hours a week',
      'Several teams, substantial time each week',
      'Many teams or a business-critical function',
    ]),
    weight: 0.25,
  },
  {
    id: 'repeatability',
    axis: 'impact',
    category: 'repeatability',
    prompt: 'How repeatable are the inputs and expected output?',
    options: maturityOptions([
      'Different every time',
      'A loose pattern with many exceptions',
      'A recognizable process with some variation',
      'Mostly standardized',
      'Highly standardized and rules-based',
    ]),
    weight: 0.25,
  },
  {
    id: 'business-consequence',
    axis: 'impact',
    category: 'consequence',
    prompt: 'What happens when the work is late or inconsistent?',
    options: maturityOptions([
      'Little downstream effect',
      'Local inconvenience',
      'A team decision or deadline is affected',
      'Multiple teams, customers, or costs are affected',
      'A material operational, financial, or risk consequence',
    ]),
    weight: 0.25,
  },
  {
    id: 'data-availability',
    axis: 'readiness',
    category: 'data',
    prompt: 'How available is the context needed to do the work?',
    options: maturityOptions([
      'Mostly unknown or inaccessible',
      'Scattered and difficult to retrieve',
      'Available with manual gathering',
      'Mostly organized and permissioned',
      'Clearly owned, accessible, and current',
    ]),
    weight: 0.2,
  },
  {
    id: 'process-clarity',
    axis: 'readiness',
    category: 'process',
    prompt: 'How clearly can the workflow be explained?',
    options: maturityOptions([
      'It lives in individual judgment',
      'People describe it differently',
      'The main steps are understood',
      'Steps and exceptions are documented',
      'Inputs, decisions, outputs, and checks are explicit',
    ]),
    weight: 0.2,
  },
  {
    id: 'integration-access',
    axis: 'readiness',
    category: 'integration',
    prompt: 'Can the necessary systems be accessed safely?',
    options: maturityOptions([
      'Access is unknown',
      'Manual access only with major constraints',
      'Exports or limited access are possible',
      'Approved APIs or connectors exist for most systems',
      'Access paths, permissions, and owners are established',
    ]),
    weight: 0.2,
  },
  {
    id: 'accountable-owner',
    axis: 'readiness',
    category: 'ownership',
    prompt: 'Who is accountable for the workflow and its outcome?',
    options: maturityOptions([
      'No owner',
      'An interested individual',
      'A likely team owner',
      'A named owner with time to participate',
      'A named owner with authority, users, and a success measure',
    ]),
    weight: 0.2,
  },
  {
    id: 'governance-change',
    axis: 'readiness',
    category: 'governance',
    prompt: 'How ready is the organization to govern and adopt the change?',
    options: maturityOptions([
      'No review path or user plan',
      'Review requirements are unclear',
      'Stakeholders are known but not aligned',
      'Review and rollout paths are mostly clear',
      'Controls, reviewers, users, and feedback loops are ready',
    ]),
    weight: 0.2,
  },
];

export const workflowOptions: readonly { id: WorkflowCategory; label: string; detail: string }[] = [
  {
    id: 'research-synthesis',
    label: 'Research and synthesis',
    detail: 'Gathering sources, comparing findings, and producing a usable brief.',
  },
  {
    id: 'data-preparation',
    label: 'Data collection and preparation',
    detail: 'Collecting, cleaning, classifying, and preparing information for the next step.',
  },
  {
    id: 'consolidation-reporting',
    label: 'Consolidation and reporting',
    detail: 'Combining updates, reconciling inputs, and producing a consistent report.',
  },
  {
    id: 'visualization-decisions',
    label: 'Visualization and decision support',
    detail: 'Turning complex inputs into an understandable view for a decision.',
  },
];

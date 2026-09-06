/**
 * The product surfaces an industry use case can be shown on.
 *
 * Four kinds, one per thing the product actually is: a chat product, a workflow product, an
 * automation product, and the governed result each of those hands back. A surface that is not one
 * of these does not get drawn, because a picture of a screen we do not ship reads to a buyer as a
 * description of the product.
 *
 * Everything inside a surface is illustrative and synthetic. Under the claims policy the same rules
 * that govern page copy govern image text, so no surface may carry a metric, a percentage, a
 * customer name, a certification, or a date that reads as a result.
 */

/** A question answered from connected sources, with the documents the answer came from. */
export interface AssistantSurface {
  kind: 'assistant';
  ask: string;
  answer: string;
  /** The documents the answer points back to. */
  cites: readonly string[];
}

/** A named workflow about to run: what it reads, the one thing it needs told, and the brief. */
export interface WorkflowSurface {
  kind: 'workflow';
  workflow: string;
  files: readonly string[];
  field: { label: string; value: string };
  prompt: string;
}

/** A recurring run, stopped at the checkpoint where a person has to decide. */
export interface AutomationSurface {
  kind: 'automation';
  run: string;
  trigger: string;
  steps: readonly { title: string; state: 'done' | 'running' | 'waiting' }[];
}

/** What comes back: a draft, and the findings behind it, waiting for sign-off. */
export interface ResultSurface {
  kind: 'result';
  document: string;
  status: string;
  findings: readonly { label: string; verdict: 'clear' | 'check' | 'blocked' }[];
}

export type SolutionSurface =
  AssistantSurface | WorkflowSurface | AutomationSurface | ResultSurface;

/** Rendered beside the verdict dot, so state is never carried by colour alone. */
export const verdictLabels = {
  clear: 'Matches',
  check: 'Check',
  blocked: 'Off playbook',
} as const satisfies Record<ResultSurface['findings'][number]['verdict'], string>;

/** Same reason: the step state is a word before it is a colour. */
export const stepLabels = {
  done: 'Complete',
  running: 'Running',
  waiting: 'Waiting for owner',
} as const satisfies Record<AutomationSurface['steps'][number]['state'], string>;

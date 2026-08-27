export const draftHomeCopy = {
  status: 'draft',
  headline: 'Make AI part of everyday work.',
  subhead:
    'Help teams adopt AI across real workflows while keeping rollout visible, governed, and manageable.',
} as const;

export const releaseContentStatus = {
  capabilities: 'draft',
  trust: 'draft',
  privacy: 'draft',
} as const;

export const audiences = ['AI', 'Innovation', 'IT', 'Data', 'Operations', 'Security'] as const;

export const benefits = [
  {
    number: '01',
    scene: 'ask',
    title: 'Useful in the work people already do',
    body: 'Give every team a familiar place to ask, create, analyze, and move work forward with company context close at hand.',
  },
  {
    number: '02',
    scene: 'reuse',
    title: 'Repeatable across teams and departments',
    body: 'Turn shared expertise into specialized agents and workflows that can be used on demand or run on a schedule.',
  },
  {
    number: '03',
    scene: 'oversight',
    title: 'Visible and manageable as adoption grows',
    body: 'Bring access, model choice, human review, and usage signals into the same operating view as the work itself.',
  },
] as const;

export const operatingModel = [
  {
    number: '01',
    title: 'Connect knowledge and tools',
    body: 'Bring approved company context and the systems teams already use into one workspace.',
  },
  {
    number: '02',
    title: 'Equip teams with agents',
    body: 'Give departments specialized assistants with the skills, context, and boundaries their work requires.',
  },
  {
    number: '03',
    title: 'Run repeatable workflows',
    body: 'Move from one-off assistance to multi-step work that runs on demand or on a schedule.',
  },
  {
    number: '04',
    title: 'Govern and improve',
    body: 'Keep human checkpoints explicit and make adoption visible as usage expands.',
  },
] as const;

export const workflowExamples = [
  'Research and synthesis',
  'Data collection and preparation',
  'Consolidation and reporting',
  'Visualization and decision support',
] as const;

export const platformPillars = [
  {
    label: 'Specialized agents',
    title: 'Create with company context',
    body: 'Agents that bring approved knowledge, tools, and brand standards into everyday work.',
  },
  {
    label: 'Recurring workflows',
    title: 'Run work beyond the first prompt',
    body: 'Connected steps, scheduled runs, clear owners, and review where judgment is needed.',
  },
  {
    label: 'Adoption governance',
    title: 'See how use grows',
    body: 'One place to manage access and model choice, and follow where teams adopt AI.',
  },
] as const;

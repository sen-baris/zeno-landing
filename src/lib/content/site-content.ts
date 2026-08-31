export const draftHomeCopy = {
  status: 'draft',
  headline: "Access is easy. Adoption isn't.",
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

/**
 * The cost of stopping at access. Market observation framing, not a claim about Zeno, a customer,
 * or a measured outcome, so it carries no registry record.
 */
export const adoptionCosts = [
  {
    number: '01',
    title: 'Budgets stay flat and undirected',
    body: 'Without usage anyone can point to, AI spend gets spread evenly instead of moved toward what is working.',
  },
  {
    number: '02',
    title: 'Manual work keeps winning',
    body: 'Reporting, research, and document review stay manual, or drift to unapproved tools, because the sanctioned one never became a habit.',
  },
  {
    number: '03',
    title: 'Providers get replaced, not proven',
    body: 'Another provider gets evaluated and none of them stick, because value was never demonstrated with the last one.',
  },
] as const;

/** Two columns of the same operating picture, before and after adoption becomes visible. */
export const operatingShift = {
  today: [
    'Two or three tools piloted, with no clear adoption story',
    'Reporting and document work done by hand, or in unapproved tools',
    'No way to show a budget owner what AI actually delivered',
    'Model choice decided by whichever provider was bought first',
  ],
  withZeno: [
    'One workspace, with reuse visible across teams',
    'Agents carry the repeatable work; people keep the judgment',
    'A case per workflow, tied to the time or cost it takes back',
    'Model choice across approved providers, changeable later',
  ],
} as const;

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

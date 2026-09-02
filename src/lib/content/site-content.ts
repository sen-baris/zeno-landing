export const draftHomeCopy = {
  status: 'draft',
  headline: 'Make AI part of everyday work.',
  subhead: 'Put AI into the work your teams already do, and see for yourself who is using it.',
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
    title: 'It fits the work people already do',
    body: 'One place to ask a question, draft a document, or check a number, using your own company information.',
  },
  {
    number: '02',
    title: 'What one team sets up, the next can use',
    body: 'Turn what a team worked out into an agent other teams can pick up, or a workflow that runs on a schedule.',
  },
  {
    number: '03',
    title: 'You can see who is actually using it',
    body: 'Who has access, which model they are on, and where a person still has to sign off. All on one screen.',
  },
] as const;

/**
 * The stack, read from the bottom up: the models underneath, everything built on them, and the
 * governance that covers all of it. Each line is one row of the hero's key, so it has to stay short
 * enough to read at a glance beside the diagram.
 */
export const platformLayers = [
  {
    name: 'Model hub',
    body: 'More than one provider, chosen by IT, switchable later.',
  },
  {
    name: 'Connectors and data',
    body: 'The drives, document stores and systems teams already work in.',
  },
  {
    name: 'Context and knowledge',
    body: 'Your own documents and figures, with permissions carried through.',
  },
  {
    name: 'Specialized agents',
    body: 'One agent per job, with limits on what it can reach.',
  },
  {
    name: 'Products and interfaces',
    body: 'Ask, draft, run a workflow, review what came back.',
  },
  {
    name: 'Security and governance',
    body: 'Access, allowed models, sign-off points, and who is using it.',
  },
] as const;

export const workflowExamples = [
  'Research and synthesis',
  'Data collection and preparation',
  'Consolidation and reporting',
  'Visualization and decision support',
] as const;

/** The same operating picture before and after the work happens somewhere you can see it. */
export const operatingShift = {
  today: [
    'Two or three AI tools in pilot, none of them finished',
    'The monthly report is still built by hand',
    'Nobody can answer what the AI spend bought',
    'You are stuck with whichever provider was bought first',
  ],
  withZeno: [
    'One place to work, and you can see who is in it',
    'Agents do the repetitive part, people make the calls',
    'Every workflow has a number attached to it',
    'You can switch model provider later',
  ],
} as const;

export const platformPillars = [
  {
    label: 'Specialized agents',
    title: 'Agents that know your company',
    body: 'They work from your documents, your data, and your templates.',
  },
  {
    label: 'Recurring workflows',
    title: 'Work that continues after the prompt',
    body: 'Steps that run in order, on a schedule, with an owner and a review point.',
  },
  {
    label: 'Adoption governance',
    title: 'One screen for administrators',
    body: 'Access, model choice, and usage figures in the same place.',
  },
] as const;

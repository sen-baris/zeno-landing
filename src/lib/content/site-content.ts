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
 * governance that covers all of it. Each one is a step in the pinned sequence on /product.
 */
export const platformLayers = [
  {
    name: 'Model hub',
    body: 'Approved models from more than one provider, chosen by IT and switchable later without touching anything above.',
  },
  {
    name: 'Connectors and data',
    body: 'The drives, document stores and business systems your teams already work in, connected once.',
  },
  {
    name: 'Context and knowledge',
    body: 'Your own documents and figures, with permissions carried through, so an agent only ever sees what the person using it may see.',
  },
  {
    name: 'Specialized agents',
    body: 'An agent per job, with the knowledge it needs, the template it has to follow, and limits on what it can reach.',
  },
  {
    name: 'Products and interfaces',
    body: 'Where the work actually happens: ask a question, draft a document, run a workflow, review what came back.',
  },
  {
    name: 'Security and governance',
    body: 'Who has access, which models are allowed, where a person has to sign off, and which teams are using any of it.',
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

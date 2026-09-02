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

export const operatingModel = [
  {
    number: '01',
    title: 'Connect knowledge and tools',
    body: 'Point Zeno at the documents, drives, and systems your teams already work in.',
  },
  {
    number: '02',
    title: 'Equip teams with agents',
    body: 'Set up an agent for one job, with the knowledge it needs and limits on what it can reach.',
  },
  {
    number: '03',
    title: 'Run repeatable workflows',
    body: 'Chain the steps together so the whole thing runs on a schedule instead of on request.',
  },
  {
    number: '04',
    title: 'Govern and improve',
    body: 'Decide where a person signs off, and watch which teams come back to it.',
  },
] as const;

export const workflowExamples = [
  'Research and synthesis',
  'Data collection and preparation',
  'Consolidation and reporting',
  'Visualization and decision support',
] as const;

/**
 * What it costs to stop at access. Market observation, not a claim about Zeno, a customer, or a
 * measured outcome, so these carry no registry record.
 */
export const adoptionCosts = [
  {
    number: '01',
    title: 'You cannot tell what is worth paying for',
    body: 'With no usage numbers, every team gets the same licence, whether they work in it daily or logged in once.',
  },
  {
    number: '02',
    title: 'People go back to doing it by hand',
    body: 'The monthly report still gets built in a spreadsheet, or in a tool IT never approved, because the official one never stuck.',
  },
  {
    number: '03',
    title: 'You end up shopping for another tool',
    body: 'A year later someone opens a new vendor review, because nobody could show what the last one was worth.',
  },
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

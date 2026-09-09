export const draftHomeCopy = {
  status: 'draft',
  title: 'AI agents your teams actually use | Zeno',
  description:
    'Find the workflows worth automating, build AI agents with the people who use them, and support adoption on a governed workspace built for Europe.',
  headline: 'AI agents your teams actually use.',
  startingPathLabel: 'Start your way',
  startingPathClaimId: 'home-supported-agent-starting-path',
} as const;

export const releaseContentStatus = {
  capabilities: 'draft',
  trust: 'draft',
  privacy: 'draft',
} as const;

export const audiences = ['AI', 'Innovation', 'IT', 'Data', 'Operations', 'Security'] as const;

/**
 * Draft service language for the work that continues after launch. It describes the intended
 * partnership model without a fixed duration, quantified result, or guaranteed adoption outcome.
 */
export const adoptionPartnership = {
  status: 'draft',
  eyebrow: 'After launch',
  title: 'Adoption is built together.',
  intro:
    'We stay in the rollout after the first agent goes live. Together, we watch where teams return, remove friction, and turn what works into the next workflow.',
  partnerLabel: 'Zeno + your team',
  stages: [
    {
      id: 'launch',
      label: 'First team live',
      action: 'Review real usage',
    },
    {
      id: 'return',
      label: 'Teams returning',
      action: 'Improve with the team',
    },
    {
      id: 'habit',
      label: 'Platform in everyday use',
      action: 'Expand what works',
    },
  ],
} as const;

/** Draft editorial positioning for the homepage vision section. */
export const companyVision = {
  status: 'draft',
  eyebrow: 'Our vision',
  title: 'AI should strengthen human expertise.',
  paragraphs: [
    'Enterprise AI should give people more capacity for judgment, creativity, and decision-making. It should not add another layer of tools to manage.',
    'That future depends on technology grounded in real work, governed with care, and shaped with the people who use it. Our ambition is to make AI a trusted part of how organisations operate, while keeping human expertise at the centre.',
  ],
} as const;

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

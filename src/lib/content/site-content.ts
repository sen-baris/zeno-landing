export const draftHomeCopy = {
  status: 'draft',
  title: 'AI agents your teams actually use | Zeno',
  description:
    'Find valuable workflows and build agents with the people who use them. Grow adoption in a governed workspace built for Europe.',
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
    'We stay with you after launch. We improve what teams use and turn it into the next workflow.',
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
    'Enterprise AI makes more room for judgment, creativity and decisions. It does not need to add another tool to manage.',
    'That future starts with technology grounded in real work and shaped with the people who use it. Governance matters. Our ambition is to make AI a trusted part of everyday operations while keeping human expertise at the centre.',
  ],
} as const;

/** The same operating picture before and after the work happens somewhere you can see it. */
export const operatingShift = {
  today: [
    'Several AI pilots, no clear next step',
    'The monthly report is still built by hand',
    'No clear view of what the AI spend delivers',
    'One model provider becomes hard to replace',
  ],
  withZeno: [
    'One workspace with visible usage',
    'Agents handle repeated work. People make the calls',
    'A business case for each workflow',
    'Model choice remains open',
  ],
} as const;

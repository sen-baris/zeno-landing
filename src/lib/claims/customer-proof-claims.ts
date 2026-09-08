import type { ClaimRecord } from './types';

const approval = {
  verified_on: '2026-09-08',
  approval_status: 'approved',
  approved_by: 'Baris, working-session direction',
  approved_on: '2026-09-08',
  reverify_on: '2027-03-08',
} as const;

const storyEvidence = {
  atares: 'https://textcortex.com/case-studies/atares-saves-20-hours-per-week-with-enterprise-ai',
  b2venture:
    'https://textcortex.com/case-studies/b2venture-increased-ai-usage-by-7x-across-their-investment-team',
  mahle: 'https://textcortex.com/case-studies/ai-driven-knowledge-management-at-mahle',
  kbc: 'https://textcortex.com/case-studies/knowledge-collaboration-with-ai',
} as const;

const approvedStory = (
  record: Pick<ClaimRecord, 'id' | 'statement' | 'category' | 'evidence' | 'allowed_surfaces'> &
    Partial<Pick<ClaimRecord, 'attribution' | 'notes'>>,
): ClaimRecord => ({
  ...record,
  ...approval,
  attribution: record.attribution ?? 'Customer story approved by the workspace owner.',
  notes:
    record.notes ??
    'Approved for the named homepage and customer-story surfaces. Keep the stated scope and qualifiers intact.',
});

export const customerProofClaims: readonly ClaimRecord[] = [
  approvedStory({
    id: 'customer-voice-global-energy-enterprise',
    statement:
      'What we only get with TextCortex is education, customization, agents built for our process, and hence adoption.',
    category: 'customer',
    evidence:
      'Verbatim excerpt supplied by the workspace owner on 2026-09-08. Full original: "We can get the models, we can get the connectors, basically the entire tech stack, from any provider. What we only get with TextCortex is education, customization, agents built for our process, and hence adoption."',
    allowed_surfaces: ['home.testimonials'],
    attribution: 'Head of Knowledge, global energy enterprise',
    notes: 'Publish as an anonymous verbatim excerpt with the role attribution shown.',
  }),
  approvedStory({
    id: 'customer-voice-frommer-legal',
    statement:
      'I only need to train my colleagues on one tool that continuously develops within the familiar interface.',
    category: 'customer',
    evidence:
      'Verbatim excerpt from a Frommer Legal customer statement supplied by the workspace owner on 2026-09-08.',
    allowed_surfaces: ['home.customer-proof'],
    attribution: 'Managing Partner, Frommer Legal',
    notes: 'Publish as a verbatim excerpt beside the approved Frommer Legal logo.',
  }),
  approvedStory({
    id: 'customer-voice-atares',
    statement: 'Real agents that can do things for you ... are my favorite part of TextCortex.',
    category: 'customer',
    evidence: `${storyEvidence.atares}; quotation supplied by the workspace owner on 2026-09-08.`,
    allowed_surfaces: ['home.customer-proof', 'customers.atares'],
    attribution: 'Consultant, atares',
    notes: 'Publish as a verbatim excerpt with omitted words marked by three periods.',
  }),
  approvedStory({
    id: 'customer-voice-mahle',
    statement:
      "TextCortex's Agent platform empowers MAHLE to swiftly and securely create customized AI agents on European infrastructure...",
    category: 'customer',
    evidence:
      'https://www.linkedin.com/posts/mahlenewventures_piloting-textcortex-mahlenewventures-activity-7307717508935921664-5Vid; wording and MAHLE attribution corrected by the workspace owner on 2026-09-08.',
    allowed_surfaces: ['home.customer-proof', 'customers.mahle'],
    attribution: 'MAHLE',
    notes: 'Publish with MAHLE attribution and the corrected TextCortex possessive.',
  }),
  approvedStory({
    id: 'customer-story-atares-narrative',
    statement:
      'How atares saves time on research and target discovery. atares uses connected knowledge and task-specific agents to accelerate research while advisers retain responsibility for the final work. Target and market research required repeated manual work across knowledge stored in Microsoft 365 and Confluence. The team built four active knowledge bases and seven active agents for recurring research. Advisers review the output and retain final signoff.',
    category: 'customer',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['home.customer-proof', 'customers.atares'],
  }),
  approvedStory({
    id: 'customer-result-atares-weekly-time',
    statement:
      'About 20 hours saved by the team each week. Team total for research workflows, not a per-user figure.',
    category: 'metric',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['home.customer-proof', 'customers.atares'],
  }),
  approvedStory({
    id: 'customer-result-atares-knowledge-bases',
    statement: '4 active knowledge bases in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['customers.atares'],
  }),
  approvedStory({
    id: 'customer-result-atares-agents',
    statement: '7 active agents in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['customers.atares'],
  }),
  approvedStory({
    id: 'customer-story-b2venture-narrative',
    statement:
      'How b2venture made AI part of the investment workflow. b2venture introduced focused agents for research and investment work, then measured how consistently the team used them. Investment teams were spending hours gathering information and preparing material for each opportunity. The team created more than 10 specialized agents and embedded them in recurring investment workflows.',
    category: 'customer',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['home.customer-proof', 'customers.b2venture'],
  }),
  approvedStory({
    id: 'customer-result-b2venture-activation',
    statement: 'Over 70% team activation in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['home.customer-proof', 'customers.b2venture'],
  }),
  approvedStory({
    id: 'customer-result-b2venture-usage',
    statement: '2x usage in four months in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['customers.b2venture'],
  }),
  approvedStory({
    id: 'customer-result-b2venture-memo-time',
    statement:
      '5 to 10 hours previously spent on memo work per investment opportunity. This is a baseline time figure.',
    category: 'metric',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['customers.b2venture'],
  }),
  approvedStory({
    id: 'customer-story-mahle-narrative',
    statement:
      'How MAHLE made technical knowledge easier to find. MAHLE introduced a knowledge assistant that helps teams reach technical information across existing company sources. Technical knowledge was distributed across systems, which made relevant information slower to locate and reuse. MAHLE introduced MARVIN and connected sources including SharePoint and Microsoft Teams for governed knowledge access.',
    category: 'customer',
    evidence: storyEvidence.mahle,
    allowed_surfaces: ['home.customer-proof', 'customers.mahle'],
  }),
  approvedStory({
    id: 'customer-result-mahle-activation',
    statement: 'Over 71% activation in less than one month.',
    category: 'metric',
    evidence: storyEvidence.mahle,
    allowed_surfaces: ['home.customer-proof', 'customers.mahle'],
  }),
  approvedStory({
    id: 'customer-result-mahle-time',
    statement: '5+ hours saved per user each week.',
    category: 'metric',
    evidence: storyEvidence.mahle,
    allowed_surfaces: ['customers.mahle'],
  }),
  approvedStory({
    id: 'customer-story-kbc-narrative',
    statement:
      'How KBC made company knowledge easier to use. KBC gave employees a faster way to find internal expertise and bring relevant knowledge into proposal work. Employees needed a more direct way to find internal expertise and reuse company knowledge in client work. KBC connected internal knowledge to a shared AI workspace and supported adoption over an 18-month period.',
    category: 'customer',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['home.customer-proof', 'customers.kbc'],
  }),
  approvedStory({
    id: 'customer-result-kbc-search-time',
    statement: 'Minutes to seconds for internal expertise search.',
    category: 'metric',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['home.customer-proof', 'customers.kbc'],
  }),
  approvedStory({
    id: 'customer-result-kbc-proposals',
    statement: '10 to 12% more efficient proposal creation.',
    category: 'metric',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['customers.kbc'],
  }),
  approvedStory({
    id: 'customer-result-kbc-weekly-usage',
    statement: 'Over 75% of employees active weekly after 18 months.',
    category: 'metric',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['customers.kbc'],
  }),
];

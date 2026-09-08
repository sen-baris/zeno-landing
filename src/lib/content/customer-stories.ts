export type CustomerProofApprovalStatus = 'approval-pending' | 'approved';
export type CustomerProofMode = 'preview' | 'production';

export interface CustomerResultDraft {
  claimId: string;
  value: string;
  label: string;
  qualifier: string;
}

export interface CustomerVoiceDraft {
  id: string;
  company: string;
  logoClaimId?: string;
  approvalStatus: CustomerProofApprovalStatus;
  sourceBrand: string;
  sourceUrl?: string;
  reviewedOn: string;
  attribution: string;
  fullQuote: string;
  verbatimExcerpt: string;
}

export interface CustomerStoryDraft {
  slug: string;
  company: string;
  logoClaimId: string;
  narrativeClaimId: string;
  approvalStatus: CustomerProofApprovalStatus;
  sourceBrand: 'TextCortex';
  sourceUrl: string;
  reviewedOn: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  qualifiedResults: readonly CustomerResultDraft[];
  quoteId?: string;
}

export interface CustomerVoice {
  id: string;
  excerpt: string;
  attribution: string;
  approvalStatus: CustomerProofApprovalStatus;
  logoClaimId?: string;
}

export const homepageCustomerProofLogoOrder = [
  'customer-logo-atares',
  'customer-logo-b2venture',
  'customer-logo-mahle',
  'customer-logo-kbc',
  'customer-logo-frommer-legal',
  'customer-logo-beeradvocaten',
  'customer-logo-bovensiepen',
  'customer-logo-tmg-consultants',
] as const;

export const customerVoiceDrafts: readonly CustomerVoiceDraft[] = [
  {
    id: 'customer-voice-global-energy-enterprise',
    company: 'Global energy enterprise',
    approvalStatus: 'approved',
    sourceBrand: 'Quotation supplied by the workspace owner',
    reviewedOn: '2026-09-08',
    attribution: 'Head of Knowledge, global energy enterprise',
    fullQuote:
      'We can get the models, we can get the connectors — basically the entire tech stack — from any provider. What we only get with TextCortex is education, customization, agents built for our process, and hence adoption.',
    verbatimExcerpt:
      'What we only get with TextCortex is education, customization, agents built for our process, and hence adoption.',
  },
  {
    id: 'customer-voice-frommer-legal',
    company: 'Frommer Legal',
    logoClaimId: 'customer-logo-frommer-legal',
    approvalStatus: 'approved',
    sourceBrand: 'Quotation supplied by the workspace owner',
    reviewedOn: '2026-09-08',
    attribution: 'Managing Partner, Frommer Legal',
    fullQuote:
      'I love that TextCortex gives me many tools in one platform, so I only need to train my colleagues on one tool that continuously develops within the familiar interface.',
    verbatimExcerpt:
      'I only need to train my colleagues on one tool that continuously develops within the familiar interface.',
  },
  {
    id: 'customer-voice-atares',
    company: 'atares',
    logoClaimId: 'customer-logo-atares',
    approvalStatus: 'approved',
    sourceBrand: 'Quotation supplied by the workspace owner',
    sourceUrl:
      'https://textcortex.com/case-studies/atares-saves-20-hours-per-week-with-enterprise-ai',
    reviewedOn: '2026-09-08',
    attribution: 'Consultant, atares',
    fullQuote:
      'Real agents that can do things for you — Outlook summaries, reporting — are my favorite part of TextCortex.',
    verbatimExcerpt:
      'Real agents that can do things for you ... are my favorite part of TextCortex.',
  },
  {
    id: 'customer-voice-mahle',
    company: 'MAHLE',
    logoClaimId: 'customer-logo-mahle',
    approvalStatus: 'approved',
    sourceBrand: 'MAHLE',
    sourceUrl:
      'https://www.linkedin.com/posts/mahlenewventures_piloting-textcortex-mahlenewventures-activity-7307717508935921664-5Vid',
    reviewedOn: '2026-09-08',
    attribution: 'MAHLE',
    fullQuote:
      "TextCortex's Agent platform empowers MAHLE to swiftly and securely create customized AI agents on European infrastructure by intelligently combining business knowledge with Large Language Models (LLM). These advanced AI models are designed to understand and generate human language using neural networks and large amounts of text data, enabling them to learn complex patterns and correlations in language. LLMs can be utilized for various tasks, such as text generation or translation, to mention a few.",
    verbatimExcerpt:
      "TextCortex's Agent platform empowers MAHLE to swiftly and securely create customized AI agents on European infrastructure...",
  },
];

export const customerStoryDrafts: readonly CustomerStoryDraft[] = [
  {
    slug: 'atares',
    company: 'atares',
    logoClaimId: 'customer-logo-atares',
    narrativeClaimId: 'customer-story-atares-narrative',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl:
      'https://textcortex.com/case-studies/atares-saves-20-hours-per-week-with-enterprise-ai',
    reviewedOn: '2026-09-08',
    title: 'How atares saves time on research and target discovery.',
    summary:
      'atares uses connected knowledge and task-specific agents to accelerate research while advisers retain responsibility for the final work.',
    challenge:
      'Target and market research required repeated manual work across knowledge stored in Microsoft 365 and Confluence.',
    approach:
      'The team built four active knowledge bases and seven active agents for recurring research. Advisers review the output and retain final signoff.',
    qualifiedResults: [
      {
        claimId: 'customer-result-atares-weekly-time',
        value: 'About 20 hours',
        label: 'saved by the team each week',
        qualifier: 'Team total for research workflows, not a per-user figure.',
      },
      {
        claimId: 'customer-result-atares-knowledge-bases',
        value: '4',
        label: 'active knowledge bases',
        qualifier: 'Active in the described rollout.',
      },
      {
        claimId: 'customer-result-atares-agents',
        value: '7',
        label: 'active agents',
        qualifier: 'Active in the described rollout.',
      },
    ],
    quoteId: 'customer-voice-atares',
  },
  {
    slug: 'b2venture',
    company: 'b2venture',
    logoClaimId: 'customer-logo-b2venture',
    narrativeClaimId: 'customer-story-b2venture-narrative',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl:
      'https://textcortex.com/case-studies/b2venture-increased-ai-usage-by-7x-across-their-investment-team',
    reviewedOn: '2026-09-08',
    title: 'How b2venture made AI part of the investment workflow.',
    summary:
      'b2venture introduced focused agents for research and investment work, then measured how consistently the team used them.',
    challenge:
      'Investment teams were spending hours gathering information and preparing material for each opportunity.',
    approach:
      'The team created more than 10 specialized agents and embedded them in recurring investment workflows.',
    qualifiedResults: [
      {
        claimId: 'customer-result-b2venture-activation',
        value: 'Over 70%',
        label: 'team activation',
        qualifier: 'Across the described investment-team rollout.',
      },
      {
        claimId: 'customer-result-b2venture-usage',
        value: '2x',
        label: 'usage in four months',
        qualifier: 'Across the described four-month period.',
      },
      {
        claimId: 'customer-result-b2venture-memo-time',
        value: '5 to 10 hours',
        label: 'previously spent on memo work per investment opportunity',
        qualifier: 'Baseline time per investment opportunity.',
      },
    ],
  },
  {
    slug: 'mahle',
    company: 'MAHLE',
    logoClaimId: 'customer-logo-mahle',
    narrativeClaimId: 'customer-story-mahle-narrative',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl: 'https://textcortex.com/case-studies/ai-driven-knowledge-management-at-mahle',
    reviewedOn: '2026-09-08',
    title: 'How MAHLE made technical knowledge easier to find.',
    summary:
      'MAHLE introduced a knowledge assistant that helps teams reach technical information across existing company sources.',
    challenge:
      'Technical knowledge was distributed across systems, which made relevant information slower to locate and reuse.',
    approach:
      'MAHLE introduced MARVIN and connected sources including SharePoint and Microsoft Teams for governed knowledge access.',
    qualifiedResults: [
      {
        claimId: 'customer-result-mahle-activation',
        value: 'Over 71%',
        label: 'activation in less than one month',
        qualifier: 'Measured within the first month of the rollout.',
      },
      {
        claimId: 'customer-result-mahle-time',
        value: '5+ hours',
        label: 'saved per user each week',
        qualifier: 'Weekly time saved per user in the described rollout.',
      },
    ],
    quoteId: 'customer-voice-mahle',
  },
  {
    slug: 'kbc',
    company: 'KBC',
    logoClaimId: 'customer-logo-kbc',
    narrativeClaimId: 'customer-story-kbc-narrative',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl: 'https://textcortex.com/case-studies/knowledge-collaboration-with-ai',
    reviewedOn: '2026-09-08',
    title: 'How KBC made company knowledge easier to use.',
    summary:
      'KBC gave employees a faster way to find internal expertise and bring relevant knowledge into proposal work.',
    challenge:
      'Employees needed a more direct way to find internal expertise and reuse company knowledge in client work.',
    approach:
      'KBC connected internal knowledge to a shared AI workspace and supported adoption over an 18-month period.',
    qualifiedResults: [
      {
        claimId: 'customer-result-kbc-search-time',
        value: 'Minutes to seconds',
        label: 'for internal expertise search',
        qualifier: 'For the internal expertise-search workflow.',
      },
      {
        claimId: 'customer-result-kbc-proposals',
        value: '10 to 12%',
        label: 'more efficient proposal creation',
        qualifier: 'Measured for the described proposal workflow.',
      },
      {
        claimId: 'customer-result-kbc-weekly-usage',
        value: 'Over 75%',
        label: 'of employees active weekly after 18 months',
        qualifier: 'Weekly usage after 18 months.',
      },
    ],
  },
];

export const resolveCustomerProofMode = (
  contentMode = process.env.CONTENT_MODE,
): CustomerProofMode => (contentMode === 'production' ? 'production' : 'preview');

export const selectCustomerStoriesForMode = (
  stories: readonly CustomerStoryDraft[],
  mode: CustomerProofMode,
): readonly CustomerStoryDraft[] =>
  mode === 'production' ? stories.filter((story) => story.approvalStatus === 'approved') : stories;

export const selectCustomerVoicesForMode = (
  voices: readonly CustomerVoiceDraft[],
  mode: CustomerProofMode,
): readonly CustomerVoiceDraft[] =>
  mode === 'production' ? voices.filter((voice) => voice.approvalStatus === 'approved') : voices;

export const getCustomerStoryClaimIds = (story: CustomerStoryDraft): readonly string[] => [
  story.narrativeClaimId,
  ...story.qualifiedResults.map((result) => result.claimId),
];

export const isVerbatimExcerpt = (excerpt: string, fullQuote: string): boolean => {
  let searchStart = 0;
  const chunks = excerpt
    .split('...')
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  if (chunks.length === 0) return false;

  return chunks.every((chunk) => {
    const chunkIndex = fullQuote.indexOf(chunk, searchStart);
    if (chunkIndex === -1) return false;
    searchStart = chunkIndex + chunk.length;
    return true;
  });
};

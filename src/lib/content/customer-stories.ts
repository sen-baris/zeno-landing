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

export interface CustomerStorySection {
  claimId: string;
  label: string;
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
}

export interface CustomerStoryDraft {
  slug: string;
  company: string;
  logoClaimId: string;
  narrativeClaimId: string;
  industryClaimId: string;
  approvalStatus: CustomerProofApprovalStatus;
  sourceBrand: 'TextCortex';
  sourceUrl: string;
  reviewedOn: string;
  title: string;
  summary: string;
  sections: readonly CustomerStorySection[];
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
    industryClaimId: 'customer-industry-atares',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl:
      'https://textcortex.com/case-studies/atares-saves-20-hours-per-week-with-enterprise-ai',
    reviewedOn: '2026-09-08',
    title: 'How atares saves time on research and target discovery.',
    summary:
      'atares uses connected knowledge and task-specific agents for research. Advisers own the final work.',
    sections: [
      {
        claimId: 'customer-story-atares-context',
        label: 'Customer context',
        heading: 'An M&A team built around specialist judgment.',
        paragraphs: [
          'atares advises technology-focused mid-market companies on acquisitions, sales and growth financing. Its advisers need reliable market context and remain responsible for the conclusions.',
          'A mandate can start with broad research and narrow to potential counterparties. The team wanted a faster first pass, not a finished AI-written recommendation.',
        ],
      },
      {
        claimId: 'customer-story-atares-challenge',
        label: 'The challenge',
        heading: 'Research was spread across tools and repeated by hand.',
        paragraphs: [
          'Research pulled advisers across market sources and company records. Relevant knowledge sat across OneDrive Business, SharePoint, Outlook, Teams and Confluence.',
          'Target discovery and early analysis added more manual collection. Formatting that material left less time for clients and judgment.',
        ],
        points: [
          'Market and company research',
          'Building preliminary target and buyer longlists',
          'Preparing indicative analysis for adviser review',
          'Drafting outreach and supporting content around active sectors',
        ],
      },
      {
        claimId: 'customer-story-atares-approach',
        label: 'The approach',
        heading: 'Connected knowledge became the starting point for focused agents.',
        paragraphs: [
          'atares built four active knowledge bases and seven active agents in a shared workspace. Connected systems bring internal deal experience together with current market information.',
          'Each agent has a defined research job. Advisers control its scope, access and final output.',
        ],
      },
      {
        claimId: 'customer-story-atares-workflows',
        label: 'Workflows in practice',
        heading: 'A faster route from an initial question to an adviser-ready draft.',
        paragraphs: [
          'For a buy-side search, an agent screens companies against target criteria. It combines internal material with live research to draft a preliminary longlist and fit notes. Advisers validate and narrow it.',
          'Agents also support early scenarios, indicative valuation drafts based on sector references, teaser copy and outreach. The team decides what is reliable enough to use.',
        ],
      },
      {
        claimId: 'customer-story-atares-impact',
        label: 'Results and operating impact',
        heading: 'More time for the work that requires an adviser.',
        paragraphs: [
          'Across the described research workflows, atares reports approximately 20 hours saved by the team each week. This is a team total, not a per-user figure.',
          'The time comes from less repeated collection and drafting across daily research tasks. Advisers review every output before it leaves the team.',
        ],
      },
    ],
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
    industryClaimId: 'customer-industry-b2venture',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl:
      'https://textcortex.com/case-studies/b2venture-increased-ai-usage-by-7x-across-their-investment-team',
    reviewedOn: '2026-09-08',
    title: 'How b2venture made AI part of the investment workflow.',
    summary:
      'b2venture uses focused agents for research and investment work. The team tracks regular use.',
    sections: [
      {
        claimId: 'customer-story-b2venture-context',
        label: 'Customer context',
        heading: 'Investment work needs speed and analytical depth.',
        paragraphs: [
          'b2venture is a European investment firm focused on early opportunities. Its team reviews companies and markets before turning its analysis into investment documents.',
          'Speed does not replace investor judgment. The team focused agents on repeatable work while keeping decisions with investment professionals.',
        ],
      },
      {
        claimId: 'customer-story-b2venture-challenge',
        label: 'The challenge',
        heading: 'Memos and market research consumed the same scarce hours.',
        paragraphs: [
          'Associates and managers spent substantial time gathering information for investment memos. Drafting and refining a memo typically took 5 to 10 hours per investment opportunity.',
          'The same team researched markets and startups, reviewed pitch decks and prepared communication. It needed connected knowledge instead of isolated documents.',
        ],
      },
      {
        claimId: 'customer-story-b2venture-approach',
        label: 'The approach',
        heading: 'Specialized agents were matched to specialized tasks.',
        paragraphs: [
          'b2venture created more than 10 specialized agents instead of one general assistant. Each agent has a distinct job and relevant knowledge.',
          'They support memos, founder-call notes and document review. Each workflow has a defined starting point.',
        ],
      },
      {
        claimId: 'customer-story-b2venture-workflows',
        label: 'Workflows in practice',
        heading: 'Research and documents work from one connected knowledge layer.',
        paragraphs: [
          'Connected Notion and Google Drive material gives agents access to models, pitch decks and investment documents. Teams use that context for market research, startup analysis and pitch-deck review.',
          'Agents also prepare email drafts in the firm’s voice. Investment professionals review the material and make the decisions.',
        ],
        points: [
          'Investment memo preparation and refinement',
          'Market and startup research',
          'Pitch-deck analysis and improvement',
          'Reporting and communication drafts',
        ],
      },
      {
        claimId: 'customer-story-b2venture-impact',
        label: 'Results and operating impact',
        heading: 'Adoption turned the workflow into a regular part of investment work.',
        paragraphs: [
          'The rollout reached over 70 percent team activation. Usage doubled over four months as agents became part of recurring work.',
          'Memo drafting had previously taken 5 to 10 hours per investment opportunity. Agents now prepare a first pass while investment professionals retain analytical responsibility.',
        ],
      },
    ],
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
    industryClaimId: 'customer-industry-mahle',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl: 'https://textcortex.com/case-studies/ai-driven-knowledge-management-at-mahle',
    reviewedOn: '2026-09-08',
    title: 'How MAHLE made technical knowledge easier to find.',
    summary:
      'MAHLE introduced a knowledge assistant that helps teams reach technical information across existing company sources.',
    sections: [
      {
        claimId: 'customer-story-mahle-context',
        label: 'Customer context',
        heading: 'Decades of technical knowledge need to remain usable.',
        paragraphs: [
          'MAHLE has accumulated technical expertise over many years. That knowledge supports research, engineering and problem solving when employees can find it.',
          'MAHLE wanted connected sources and task-specific agents, not another search box.',
        ],
      },
      {
        claimId: 'customer-story-mahle-challenge',
        label: 'The challenge',
        heading: 'Relevant answers were distributed across repositories and pages.',
        paragraphs: [
          'Employees had to know which repository held an answer. File search located documents but left the synthesis to them.',
          'Technical teams also needed to compare versions, retrieve past solutions and keep source context visible.',
        ],
      },
      {
        claimId: 'customer-story-mahle-approach',
        label: 'The approach',
        heading: 'MARVIN connected technical knowledge to a dedicated agent.',
        paragraphs: [
          'MAHLE introduced MARVIN, short for MAHLE Assisted Research, Verification, Insight and Navigation. The agent sits in a knowledge platform configured for the company.',
          'SharePoint and Teams sources synchronize into that platform. Employees can reach current material through one governed workspace.',
        ],
      },
      {
        claimId: 'customer-story-mahle-workflows',
        label: 'Workflows in practice',
        heading: 'Teams can compare, retrieve, and reason across technical material.',
        paragraphs: [
          'Teams use MARVIN to compare documents and versions. They also use it to find relevant technical information during problem solving.',
          'The connected knowledge supports retrieval, summarization and drafts of reports or plans. Employees can inspect the sources behind a response.',
        ],
        points: [
          'Finding information across connected company sources',
          'Comparing documents and document versions',
          'Investigating technical problems using existing documentation',
          'Summarizing material for reports and planning work',
        ],
      },
      {
        claimId: 'customer-story-mahle-impact',
        label: 'Results and operating impact',
        heading: 'Useful knowledge access encouraged early adoption.',
        paragraphs: [
          'The rollout reached over 71 percent activation in less than one month. MAHLE reports more than five hours saved per user each week on retrieval and summarization in the described workflows.',
          'Connected sources and a familiar internal agent made technical knowledge easier to reuse.',
        ],
      },
    ],
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
    industryClaimId: 'customer-industry-kbc',
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl: 'https://textcortex.com/case-studies/knowledge-collaboration-with-ai',
    reviewedOn: '2026-09-08',
    title: 'How KBC made company knowledge easier to use.',
    summary:
      'KBC gave employees a faster way to find internal expertise and bring relevant knowledge into proposal work.',
    sections: [
      {
        claimId: 'customer-story-kbc-context',
        label: 'Customer context',
        heading: 'Consulting quality depends on knowledge moving between people.',
        paragraphs: [
          'KBC is an international management consultancy working across strategy and operations. Its consultants share experience across projects, proposals and internal problem solving.',
          'As its knowledge grew, KBC needed a faster way to find and reuse that expertise without maintaining another manual repository.',
        ],
      },
      {
        claimId: 'customer-story-kbc-challenge',
        label: 'The challenge',
        heading: 'Informal knowledge exchange was valuable but difficult to scale.',
        paragraphs: [
          'Employees often found expertise through colleagues, email or phone calls. The answers were useful, but finding and preparing them took time.',
          'Manual knowledge databases required steady maintenance and offered limited search. KBC wanted one secure system for existing sources and everyday use.',
        ],
      },
      {
        claimId: 'customer-story-kbc-approach',
        label: 'The approach',
        heading: 'A shared knowledge layer connected sources and employee workflows.',
        paragraphs: [
          'The platform connects company-wide SharePoint, Azure meeting transcripts and selected external research. Employees use that context for search, analysis and drafting.',
          'KBC paired the technology with onboarding support from AICX. Employees learned where it helped and how to use it in daily work.',
        ],
      },
      {
        claimId: 'customer-story-kbc-workflows',
        label: 'Workflows in practice',
        heading: 'Search became one part of a broader knowledge workflow.',
        paragraphs: [
          'Consultants use connected knowledge to prepare proposals and analyze markets. They also assemble presentations, benchmarks, reports and meeting notes from existing material.',
          'KBC built specialized workflows around the platform. Schorsch serves as a company-wide assistant. Other workflows support onboarding and capture document summaries and keywords.',
        ],
        points: [
          'Internal expertise and company knowledge search',
          'Proposal concepts and presentation preparation',
          'Market and data analysis',
          'Onboarding and document metadata workflows',
        ],
      },
      {
        claimId: 'customer-story-kbc-impact',
        label: 'Results and operating impact',
        heading: 'Knowledge moved from a search problem into everyday work.',
        paragraphs: [
          'Internal expertise search fell from minutes to seconds in the reported workflow. Proposal creation became 10 to 12 percent more efficient in the described workflow.',
          'After 18 months, over 75 percent of employees used the platform each week. Connected knowledge and onboarding helped make it part of regular work.',
        ],
      },
    ],
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
  ...story.sections.map((section) => section.claimId),
  ...story.qualifiedResults.map((result) => result.claimId),
];

export const getCustomerStoryPreviewClaimIds = (story: CustomerStoryDraft): readonly string[] => [
  story.narrativeClaimId,
  ...story.qualifiedResults.slice(0, 1).map((result) => result.claimId),
];

export const getCustomerStorySectionStatement = (section: CustomerStorySection): string =>
  [section.label, section.heading, ...section.paragraphs, ...(section.points ?? [])].join(' ');

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

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
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl:
      'https://textcortex.com/case-studies/atares-saves-20-hours-per-week-with-enterprise-ai',
    reviewedOn: '2026-09-08',
    title: 'How atares saves time on research and target discovery.',
    summary:
      'atares uses connected knowledge and task-specific agents to accelerate research while advisers retain responsibility for the final work.',
    sections: [
      {
        claimId: 'customer-story-atares-context',
        label: 'Customer context',
        heading: 'An M&A team built around specialist judgment.',
        paragraphs: [
          'atares advises technology-focused mid-market companies on acquisitions, sales, and growth financing. Its work depends on assembling reliable market context quickly while keeping experienced advisers responsible for every conclusion.',
          'Each mandate can move from a broad market question to a detailed view of companies, comparable businesses, and potential counterparties. The team wanted to make that first research pass faster without treating an AI-generated draft as finished advisory work.',
        ],
      },
      {
        claimId: 'customer-story-atares-challenge',
        label: 'The challenge',
        heading: 'Research was spread across tools and repeated by hand.',
        paragraphs: [
          'Market and company research required advisers to move between internal material and current external information. Relevant institutional knowledge was distributed across Microsoft 365, including OneDrive Business, SharePoint, Outlook, and Teams, as well as Confluence.',
          'The same pressure appeared around target discovery, preliminary analysis, and the content that supports a mandate. Time spent collecting, comparing, and formatting information reduced the time available for client work, negotiation, and judgment.',
        ],
        points: [
          'Researching markets, companies, and competitive landscapes',
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
          'atares organized recurring work in a shared enterprise workspace with four active knowledge bases and seven active agents. The knowledge layer connects the team’s existing systems so agents can work from internal deal experience alongside current market information.',
          'Each agent is configured for a defined research task rather than acting as a general-purpose assistant. The setup gives the team a repeatable way to begin research while retaining control over access, scope, and the final output.',
        ],
      },
      {
        claimId: 'customer-story-atares-workflows',
        label: 'Workflows in practice',
        heading: 'A faster route from an initial question to an adviser-ready draft.',
        paragraphs: [
          'For a buy-side search, the team can begin with specific target criteria. An agent brings together internal knowledge, prior deal material, and live web research to produce a preliminary longlist with company summaries and fit notes. Advisers then validate and narrow the list.',
          'The same pattern supports early scenario analysis, indicative valuation work based on standard sector references, and drafts of teaser copy or outreach messages. The platform accelerates the first pass across these workflows, but the team decides what is reliable and relevant enough to use.',
        ],
      },
      {
        claimId: 'customer-story-atares-impact',
        label: 'Results and operating impact',
        heading: 'More time for the work that requires an adviser.',
        paragraphs: [
          'Across the described research workflows, atares reports approximately 20 hours saved by the team each week. This is a team total, not a per-user figure.',
          'The practical gain comes from reducing repeated collection and drafting work across several daily research tasks. Nothing leaves the team without human signoff. Agents create a stronger starting point, while advisers remain accountable for the final work product.',
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
    approvalStatus: 'approved',
    sourceBrand: 'TextCortex',
    sourceUrl:
      'https://textcortex.com/case-studies/b2venture-increased-ai-usage-by-7x-across-their-investment-team',
    reviewedOn: '2026-09-08',
    title: 'How b2venture made AI part of the investment workflow.',
    summary:
      'b2venture introduced focused agents for research and investment work, then measured how consistently the team used them.',
    sections: [
      {
        claimId: 'customer-story-b2venture-context',
        label: 'Customer context',
        heading: 'Investment work needs speed and analytical depth.',
        paragraphs: [
          'b2venture is a European investment firm focused on early opportunities. Evaluating those opportunities requires the team to absorb market information, review company material, and turn its analysis into clear investment documents.',
          'The work moves quickly, but a faster process is useful only when it preserves the rigor behind an investment decision. The team therefore focused on repeatable tasks where structured AI support could create time without replacing investor judgment.',
        ],
      },
      {
        claimId: 'customer-story-b2venture-challenge',
        label: 'The challenge',
        heading: 'Memos and market research consumed the same scarce hours.',
        paragraphs: [
          'Associates and investment managers were spending substantial time gathering information and preparing comprehensive investment memos. Drafting and refining a memo typically accounted for 5 to 10 hours per investment opportunity.',
          'The team also needed to research emerging markets and startups, compare companies, review pitch decks, and maintain consistent communication. Information across those tasks had to remain connected to a shared knowledge base instead of becoming isolated in individual documents and tools.',
        ],
      },
      {
        claimId: 'customer-story-b2venture-approach',
        label: 'The approach',
        heading: 'Specialized agents were matched to specialized tasks.',
        paragraphs: [
          'Rather than asking one general agent to cover every part of the investment process, b2venture created more than 10 specialized agents. Each one is configured for a distinct job and the knowledge needed to perform it.',
          'The set includes support for investment memo writing, tax reporting, term-sheet preparation, startup advice, and assessments based on founder call transcripts. This gives each workflow a clearer purpose and a more consistent starting point.',
        ],
      },
      {
        claimId: 'customer-story-b2venture-workflows',
        label: 'Workflows in practice',
        heading: 'Research and documents work from one connected knowledge layer.',
        paragraphs: [
          'The team connected material in Notion and Google Drive so agents can work across financial models, pitch decks, and other investment documents. That shared context supports market research, emerging-trend and startup identification, competitive analysis, and pitch-deck review.',
          'For day-to-day communication, the workflow also helps draft and refine email while maintaining the firm’s intended voice. Across each use case, the agent prepares and organizes material so the investment team can concentrate on analysis and decisions.',
        ],
        points: [
          'Investment memo preparation and refinement',
          'Market, trend, startup, and competitive research',
          'Pitch-deck analysis and improvement',
          'Task-specific reporting, document, and communication support',
        ],
      },
      {
        claimId: 'customer-story-b2venture-impact',
        label: 'Results and operating impact',
        heading: 'Adoption turned the workflow into a regular part of investment work.',
        paragraphs: [
          'The described rollout reached over 70 percent team activation, and usage doubled across four months. Those figures show that the system moved beyond occasional experimentation and into recurring work.',
          'The original memo process provides the clearest baseline: associates and managers had been spending 5 to 10 hours per investment opportunity on drafting and refinement. Specialized agents now give the team a faster first pass while analytical responsibility remains with the investment professionals.',
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
          'MAHLE operates across a large industrial organization with technical expertise accumulated over many years. That knowledge supports research, engineering, and problem solving, but only when employees can reach the right information at the moment they need it.',
          'The goal was not simply to add another search interface. MAHLE wanted a knowledge environment that could connect existing sources, interpret context across documents, and support focused agents for specific tasks.',
        ],
      },
      {
        claimId: 'customer-story-mahle-challenge',
        label: 'The challenge',
        heading: 'Relevant answers were distributed across repositories and pages.',
        paragraphs: [
          'Locating precise information across multiple document repositories required employees to know where to look and how different pieces of documentation related to one another. Traditional search could locate files, but it did not always synthesize the relevant parts into a useful response.',
          'That gap was especially visible in technical work. Teams needed to compare documents and versions, retrieve established knowledge, and investigate possible solutions without losing the context contained in the original sources.',
        ],
      },
      {
        claimId: 'customer-story-mahle-approach',
        label: 'The approach',
        heading: 'MARVIN connected technical knowledge to a dedicated agent.',
        paragraphs: [
          'MAHLE introduced MARVIN, short for MAHLE Assisted Research, Verification, Insight and Navigation. The personalized agent sits within a broader knowledge platform configured around the company’s requirements.',
          'Sources including Microsoft SharePoint and Teams synchronize into the knowledge environment so the agent can work from current material. This creates one governed route into information that previously required employees to search across separate locations.',
        ],
      },
      {
        claimId: 'customer-story-mahle-workflows',
        label: 'Workflows in practice',
        heading: 'Teams can compare, retrieve, and reason across technical material.',
        paragraphs: [
          'Some teams use MARVIN to compare different documents or different versions of the same document. Others use it during problem-solving work to identify relevant information in technical documentation.',
          'The connected knowledge layer also supports information retrieval, summarization, and the preparation of new reports or plans from existing material. Employees can begin from a synthesized response while retaining access to the knowledge behind it.',
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
          'The rollout reached over 71 percent activation in less than one month. In the described workflows, MAHLE reports more than five working hours saved per user each week on information retrieval and summarization.',
          'The combination of connected sources and a recognizable internal agent gave teams a practical way to reuse accumulated expertise. The result is faster access to technical context without separating the AI experience from the company knowledge it is meant to support.',
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
          'KBC is an international management consultancy whose work spans strategy and operational delivery. Its consultants rely on active peer collaboration to bring the right experience into client projects, proposals, and internal problem solving.',
          'As the organization’s knowledge grew, the team needed a way to make that collective expertise easier to find and reuse. The aim was to support the existing culture of collaboration without asking employees to maintain another manual repository.',
        ],
      },
      {
        claimId: 'customer-story-kbc-challenge',
        label: 'The challenge',
        heading: 'Informal knowledge exchange was valuable but difficult to scale.',
        paragraphs: [
          'Employees often found expertise through personal networks, email, or phone calls. That approach could produce the right answer, but searching, collecting, and preparing the information took time and risked leaving relevant knowledge out of the result.',
          'Earlier manual knowledge databases did not solve the problem. Maintaining them required sustained effort, and their search limitations reduced regular use. KBC wanted a secure company-wide system that could include existing sources, return comprehensive answers, and remain intuitive for employees.',
        ],
      },
      {
        claimId: 'customer-story-kbc-approach',
        label: 'The approach',
        heading: 'A shared knowledge layer connected sources and employee workflows.',
        paragraphs: [
          'The platform brings together information from sources including company-wide SharePoint, meeting transcripts hosted in Azure, and selected external research. It can contextualize that material before employees use it for search, analysis, or drafting.',
          'KBC combined the technology with structured onboarding support from AICX. The rollout helped employees understand where the system was useful and how to apply it in their daily work instead of leaving adoption to chance.',
        ],
      },
      {
        claimId: 'customer-story-kbc-workflows',
        label: 'Workflows in practice',
        heading: 'Search became one part of a broader knowledge workflow.',
        paragraphs: [
          'Consultants use the connected knowledge to prepare proposal concepts, conduct market and competitive analysis, and support coding and data analysis. Faster access to existing material also helps teams assemble presentation content, benchmarks, comparisons, reports, and meeting notes.',
          'KBC employees created specialized workflows around the shared platform. These include the company-wide assistant Schorsch, an onboarding assistant for consultants joining projects, and automated capture of document summaries and keywords.',
        ],
        points: [
          'Internal expertise and company knowledge search',
          'Proposal concepts and presentation preparation',
          'Market, competitive, coding, and data analysis',
          'Onboarding and document metadata workflows',
        ],
      },
      {
        claimId: 'customer-story-kbc-impact',
        label: 'Results and operating impact',
        heading: 'Knowledge moved from a search problem into everyday work.',
        paragraphs: [
          'For internal expertise search, the reported time fell from minutes to seconds. Proposal creation became 10 to 12 percent more efficient across the described workflow.',
          'After 18 months, over 75 percent of employees were active each week. That continued use shows how connected knowledge, practical workflows, and deliberate onboarding worked together to make the system part of regular consulting work.',
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

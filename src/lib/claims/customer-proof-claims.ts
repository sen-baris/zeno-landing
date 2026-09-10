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

const approvedArticleSection = (
  id: string,
  statement: string,
  evidence: string,
  surface: string,
): ClaimRecord => ({
  id,
  statement,
  category: 'customer',
  evidence,
  verified_on: '2026-09-09',
  approval_status: 'approved',
  approved_by: 'Baris, implementation direction for full customer articles',
  approved_on: '2026-09-09',
  allowed_surfaces: [surface],
  attribution: 'Customer story approved by the workspace owner.',
  reverify_on: '2027-03-09',
  notes:
    'Approved for the named long-form customer story only. Preserve the neutral product wording, evidence boundaries, and material qualifiers.',
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
    allowed_surfaces: ['home.customer-proof', 'solutions.legal'],
    attribution: 'Managing Partner, Frommer Legal',
    notes: 'Publish as a verbatim excerpt beside the approved Frommer Legal logo.',
  }),
  approvedStory({
    id: 'customer-voice-atares',
    statement: 'Real agents that can do things for you ... are my favorite part of TextCortex.',
    category: 'customer',
    evidence: `${storyEvidence.atares}; quotation supplied by the workspace owner on 2026-09-08.`,
    allowed_surfaces: ['home.customer-proof', 'customers.atares', 'solutions.m-and-a'],
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
      'How atares saves time on research and target discovery. atares uses connected knowledge and task-specific agents to accelerate research while advisers retain responsibility for the final work.',
    category: 'customer',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['home.customer-proof', 'customers.atares', 'solutions.m-and-a'],
  }),
  approvedStory({
    id: 'customer-result-atares-weekly-time',
    statement:
      'About 20 hours saved by the team each week. Team total for research workflows, not a per-user figure.',
    category: 'metric',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['home.customer-proof', 'customers.atares', 'solutions.m-and-a'],
  }),
  approvedStory({
    id: 'customer-result-atares-knowledge-bases',
    statement: '4 active knowledge bases in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['customers.atares', 'solutions.m-and-a'],
  }),
  approvedStory({
    id: 'customer-result-atares-agents',
    statement: '7 active agents in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.atares,
    allowed_surfaces: ['customers.atares', 'solutions.m-and-a'],
  }),
  approvedStory({
    id: 'customer-story-b2venture-narrative',
    statement:
      'How b2venture made AI part of the investment workflow. b2venture introduced focused agents for research and investment work, then measured how consistently the team used them.',
    category: 'customer',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['home.customer-proof', 'customers.b2venture', 'solutions.private-equity'],
  }),
  approvedStory({
    id: 'customer-result-b2venture-activation',
    statement: 'Over 70% team activation in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['home.customer-proof', 'customers.b2venture', 'solutions.private-equity'],
  }),
  approvedStory({
    id: 'customer-result-b2venture-usage',
    statement: '2x usage in four months in the described rollout.',
    category: 'metric',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['customers.b2venture', 'solutions.private-equity'],
  }),
  approvedStory({
    id: 'customer-result-b2venture-memo-time',
    statement:
      '5 to 10 hours previously spent on memo work per investment opportunity. This is a baseline time figure.',
    category: 'metric',
    evidence: storyEvidence.b2venture,
    allowed_surfaces: ['customers.b2venture', 'solutions.private-equity'],
  }),
  approvedStory({
    id: 'customer-story-mahle-narrative',
    statement:
      'How MAHLE made technical knowledge easier to find. MAHLE introduced a knowledge assistant that helps teams reach technical information across existing company sources.',
    category: 'customer',
    evidence: storyEvidence.mahle,
    allowed_surfaces: ['home.customer-proof', 'customers.mahle', 'solutions.manufacturing'],
  }),
  approvedStory({
    id: 'customer-result-mahle-activation',
    statement: 'Over 71% activation in less than one month.',
    category: 'metric',
    evidence: storyEvidence.mahle,
    allowed_surfaces: ['home.customer-proof', 'customers.mahle', 'solutions.manufacturing'],
  }),
  approvedStory({
    id: 'customer-result-mahle-time',
    statement: '5+ hours saved per user each week.',
    category: 'metric',
    evidence: storyEvidence.mahle,
    allowed_surfaces: ['customers.mahle', 'solutions.manufacturing'],
  }),
  approvedStory({
    id: 'customer-story-kbc-narrative',
    statement:
      'How KBC made company knowledge easier to use. KBC gave employees a faster way to find internal expertise and bring relevant knowledge into proposal work.',
    category: 'customer',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['home.customer-proof', 'customers.kbc', 'solutions.management-consulting'],
  }),
  approvedStory({
    id: 'customer-result-kbc-search-time',
    statement: 'Minutes to seconds for internal expertise search.',
    category: 'metric',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['home.customer-proof', 'customers.kbc', 'solutions.management-consulting'],
  }),
  approvedStory({
    id: 'customer-result-kbc-proposals',
    statement: '10 to 12% more efficient proposal creation.',
    category: 'metric',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['customers.kbc', 'solutions.management-consulting'],
  }),
  approvedStory({
    id: 'customer-result-kbc-weekly-usage',
    statement: 'Over 75% of employees active weekly after 18 months.',
    category: 'metric',
    evidence: storyEvidence.kbc,
    allowed_surfaces: ['customers.kbc', 'solutions.management-consulting'],
  }),
  approvedArticleSection(
    'customer-story-atares-context',
    'Customer context An M&A team built around specialist judgment. atares advises technology-focused mid-market companies on acquisitions, sales, and growth financing. Its work depends on assembling reliable market context quickly while keeping experienced advisers responsible for every conclusion. Each mandate can move from a broad market question to a detailed view of companies, comparable businesses, and potential counterparties. The team wanted to make that first research pass faster without treating an AI-generated draft as finished advisory work.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-challenge',
    'The challenge Research was spread across tools and repeated by hand. Market and company research required advisers to move between internal material and current external information. Relevant institutional knowledge was distributed across Microsoft 365, including OneDrive Business, SharePoint, Outlook, and Teams, as well as Confluence. The same pressure appeared around target discovery, preliminary analysis, and the content that supports a mandate. Time spent collecting, comparing, and formatting information reduced the time available for client work, negotiation, and judgment. Researching markets, companies, and competitive landscapes Building preliminary target and buyer longlists Preparing indicative analysis for adviser review Drafting outreach and supporting content around active sectors',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-approach',
    'The approach Connected knowledge became the starting point for focused agents. atares organized recurring work in a shared enterprise workspace with four active knowledge bases and seven active agents. The knowledge layer connects the team’s existing systems so agents can work from internal deal experience alongside current market information. Each agent is configured for a defined research task rather than acting as a general-purpose assistant. The setup gives the team a repeatable way to begin research while retaining control over access, scope, and the final output.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-workflows',
    'Workflows in practice A faster route from an initial question to an adviser-ready draft. For a buy-side search, the team can begin with specific target criteria. An agent brings together internal knowledge, prior deal material, and live web research to produce a preliminary longlist with company summaries and fit notes. Advisers then validate and narrow the list. The same pattern supports early scenario analysis, indicative valuation work based on standard sector references, and drafts of teaser copy or outreach messages. The platform accelerates the first pass across these workflows, but the team decides what is reliable and relevant enough to use.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-impact',
    'Results and operating impact More time for the work that requires an adviser. Across the described research workflows, atares reports approximately 20 hours saved by the team each week. This is a team total, not a per-user figure. The practical gain comes from reducing repeated collection and drafting work across several daily research tasks. Nothing leaves the team without human signoff. Agents create a stronger starting point, while advisers remain accountable for the final work product.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-b2venture-context',
    'Customer context Investment work needs speed and analytical depth. b2venture is a European investment firm focused on early opportunities. Evaluating those opportunities requires the team to absorb market information, review company material, and turn its analysis into clear investment documents. The work moves quickly, but a faster process is useful only when it preserves the rigor behind an investment decision. The team therefore focused on repeatable tasks where structured AI support could create time without replacing investor judgment.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-challenge',
    'The challenge Memos and market research consumed the same scarce hours. Associates and investment managers were spending substantial time gathering information and preparing comprehensive investment memos. Drafting and refining a memo typically accounted for 5 to 10 hours per investment opportunity. The team also needed to research emerging markets and startups, compare companies, review pitch decks, and maintain consistent communication. Information across those tasks had to remain connected to a shared knowledge base instead of becoming isolated in individual documents and tools.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-approach',
    'The approach Specialized agents were matched to specialized tasks. Rather than asking one general agent to cover every part of the investment process, b2venture created more than 10 specialized agents. Each one is configured for a distinct job and the knowledge needed to perform it. The set includes support for investment memo writing, tax reporting, term-sheet preparation, startup advice, and assessments based on founder call transcripts. This gives each workflow a clearer purpose and a more consistent starting point.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-workflows',
    'Workflows in practice Research and documents work from one connected knowledge layer. The team connected material in Notion and Google Drive so agents can work across financial models, pitch decks, and other investment documents. That shared context supports market research, emerging-trend and startup identification, competitive analysis, and pitch-deck review. For day-to-day communication, the workflow also helps draft and refine email while maintaining the firm’s intended voice. Across each use case, the agent prepares and organizes material so the investment team can concentrate on analysis and decisions. Investment memo preparation and refinement Market, trend, startup, and competitive research Pitch-deck analysis and improvement Task-specific reporting, document, and communication support',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-impact',
    'Results and operating impact Adoption turned the workflow into a regular part of investment work. The described rollout reached over 70 percent team activation, and usage doubled across four months. Those figures show that the system moved beyond occasional experimentation and into recurring work. The original memo process provides the clearest baseline: associates and managers had been spending 5 to 10 hours per investment opportunity on drafting and refinement. Specialized agents now give the team a faster first pass while analytical responsibility remains with the investment professionals.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-mahle-context',
    'Customer context Decades of technical knowledge need to remain usable. MAHLE operates across a large industrial organization with technical expertise accumulated over many years. That knowledge supports research, engineering, and problem solving, but only when employees can reach the right information at the moment they need it. The goal was not simply to add another search interface. MAHLE wanted a knowledge environment that could connect existing sources, interpret context across documents, and support focused agents for specific tasks.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-challenge',
    'The challenge Relevant answers were distributed across repositories and pages. Locating precise information across multiple document repositories required employees to know where to look and how different pieces of documentation related to one another. Traditional search could locate files, but it did not always synthesize the relevant parts into a useful response. That gap was especially visible in technical work. Teams needed to compare documents and versions, retrieve established knowledge, and investigate possible solutions without losing the context contained in the original sources.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-approach',
    'The approach MARVIN connected technical knowledge to a dedicated agent. MAHLE introduced MARVIN, short for MAHLE Assisted Research, Verification, Insight and Navigation. The personalized agent sits within a broader knowledge platform configured around the company’s requirements. Sources including Microsoft SharePoint and Teams synchronize into the knowledge environment so the agent can work from current material. This creates one governed route into information that previously required employees to search across separate locations.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-workflows',
    'Workflows in practice Teams can compare, retrieve, and reason across technical material. Some teams use MARVIN to compare different documents or different versions of the same document. Others use it during problem-solving work to identify relevant information in technical documentation. The connected knowledge layer also supports information retrieval, summarization, and the preparation of new reports or plans from existing material. Employees can begin from a synthesized response while retaining access to the knowledge behind it. Finding information across connected company sources Comparing documents and document versions Investigating technical problems using existing documentation Summarizing material for reports and planning work',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-impact',
    'Results and operating impact Useful knowledge access encouraged early adoption. The rollout reached over 71 percent activation in less than one month. In the described workflows, MAHLE reports more than five working hours saved per user each week on information retrieval and summarization. The combination of connected sources and a recognizable internal agent gave teams a practical way to reuse accumulated expertise. The result is faster access to technical context without separating the AI experience from the company knowledge it is meant to support.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-kbc-context',
    'Customer context Consulting quality depends on knowledge moving between people. KBC is an international management consultancy whose work spans strategy and operational delivery. Its consultants rely on active peer collaboration to bring the right experience into client projects, proposals, and internal problem solving. As the organization’s knowledge grew, the team needed a way to make that collective expertise easier to find and reuse. The aim was to support the existing culture of collaboration without asking employees to maintain another manual repository.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-challenge',
    'The challenge Informal knowledge exchange was valuable but difficult to scale. Employees often found expertise through personal networks, email, or phone calls. That approach could produce the right answer, but searching, collecting, and preparing the information took time and risked leaving relevant knowledge out of the result. Earlier manual knowledge databases did not solve the problem. Maintaining them required sustained effort, and their search limitations reduced regular use. KBC wanted a secure company-wide system that could include existing sources, return comprehensive answers, and remain intuitive for employees.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-approach',
    'The approach A shared knowledge layer connected sources and employee workflows. The platform brings together information from sources including company-wide SharePoint, meeting transcripts hosted in Azure, and selected external research. It can contextualize that material before employees use it for search, analysis, or drafting. KBC combined the technology with structured onboarding support from AICX. The rollout helped employees understand where the system was useful and how to apply it in their daily work instead of leaving adoption to chance.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-workflows',
    'Workflows in practice Search became one part of a broader knowledge workflow. Consultants use the connected knowledge to prepare proposal concepts, conduct market and competitive analysis, and support coding and data analysis. Faster access to existing material also helps teams assemble presentation content, benchmarks, comparisons, reports, and meeting notes. KBC employees created specialized workflows around the shared platform. These include the company-wide assistant Schorsch, an onboarding assistant for consultants joining projects, and automated capture of document summaries and keywords. Internal expertise and company knowledge search Proposal concepts and presentation preparation Market, competitive, coding, and data analysis Onboarding and document metadata workflows',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-impact',
    'Results and operating impact Knowledge moved from a search problem into everyday work. For internal expertise search, the reported time fell from minutes to seconds. Proposal creation became 10 to 12 percent more efficient across the described workflow. After 18 months, over 75 percent of employees were active each week. That continued use shows how connected knowledge, practical workflows, and deliberate onboarding worked together to make the system part of regular consulting work.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
];

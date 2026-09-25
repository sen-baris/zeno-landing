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
    Partial<
      Pick<ClaimRecord, 'attribution' | 'notes' | 'verified_on' | 'approved_on' | 'approved_by'>
    >,
): ClaimRecord => ({
  ...approval,
  ...record,
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
  verified_on: '2026-09-15',
  approval_status: 'approved',
  approved_by: 'Baris, sitewide copy direction',
  approved_on: '2026-09-15',
  allowed_surfaces: [surface],
  attribution: 'Customer story approved by the workspace owner.',
  reverify_on: '2027-03-09',
  notes:
    'The workflow facts were approved for the named article on 2026-09-09. Shorter wording was approved on 2026-09-15. Preserve the neutral product wording, evidence boundaries and material qualifiers.',
});

export const customerProofClaims: readonly ClaimRecord[] = [
  approvedStory({
    id: 'customer-industry-atares',
    statement: 'M&A',
    category: 'customer',
    evidence: storyEvidence.atares,
    verified_on: '2026-09-25',
    approved_on: '2026-09-25',
    approved_by: 'Baris, customer index industry-label direction',
    allowed_surfaces: ['customers.index'],
    notes: 'Industry label for the atares directory card only. No customer result changes.',
  }),
  approvedStory({
    id: 'customer-industry-b2venture',
    statement: 'Venture capital',
    category: 'customer',
    evidence: storyEvidence.b2venture,
    verified_on: '2026-09-25',
    approved_on: '2026-09-25',
    approved_by: 'Baris, customer index industry-label direction',
    allowed_surfaces: ['customers.index'],
    notes:
      'Industry label for the b2venture directory card only. Do not classify it as private equity.',
  }),
  approvedStory({
    id: 'customer-industry-mahle',
    statement: 'Manufacturing',
    category: 'customer',
    evidence: storyEvidence.mahle,
    verified_on: '2026-09-25',
    approved_on: '2026-09-25',
    approved_by: 'Baris, customer index industry-label direction',
    allowed_surfaces: ['customers.index'],
    notes: 'Industry label for the MAHLE directory card only. No customer result changes.',
  }),
  approvedStory({
    id: 'customer-industry-kbc',
    statement: 'Management consulting',
    category: 'customer',
    evidence: storyEvidence.kbc,
    verified_on: '2026-09-25',
    approved_on: '2026-09-25',
    approved_by: 'Baris, customer index industry-label direction',
    allowed_surfaces: ['customers.index'],
    notes: 'Industry label for the KBC directory card only. No customer result changes.',
  }),
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
      'How atares saves time on research and target discovery. atares uses connected knowledge and task-specific agents for research. Advisers own the final work.',
    category: 'customer',
    evidence: storyEvidence.atares,
    verified_on: '2026-09-15',
    approved_on: '2026-09-15',
    approved_by: 'Baris, sitewide copy direction',
    allowed_surfaces: [
      'home.customer-proof',
      'customers.atares',
      'solutions.m-and-a',
      'customers.index',
    ],
    notes:
      'Existing title and summary approved for the customer-story index by Baris on 2026-09-25. No result, quotation, or logo surface is extended.',
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
      'How b2venture made AI part of the investment workflow. b2venture uses focused agents for research and investment work. The team tracks regular use.',
    category: 'customer',
    evidence: storyEvidence.b2venture,
    verified_on: '2026-09-15',
    approved_on: '2026-09-15',
    approved_by: 'Baris, sitewide copy direction',
    allowed_surfaces: [
      'home.customer-proof',
      'customers.b2venture',
      'solutions.private-equity',
      'customers.index',
    ],
    notes:
      'Existing title and summary approved for the customer-story index by Baris on 2026-09-25. No result, quotation, or logo surface is extended.',
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
    allowed_surfaces: [
      'home.customer-proof',
      'customers.mahle',
      'solutions.manufacturing',
      'customers.index',
    ],
    notes:
      'Existing title and summary approved for the customer-story index by Baris on 2026-09-25. No result, quotation, or logo surface is extended.',
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
    allowed_surfaces: [
      'home.customer-proof',
      'customers.kbc',
      'solutions.management-consulting',
      'customers.index',
    ],
    notes:
      'Existing title and summary approved for the customer-story index by Baris on 2026-09-25. No result, quotation, or logo surface is extended.',
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
    'Customer context An M&A team built around specialist judgment. atares advises technology-focused mid-market companies on acquisitions, sales and growth financing. Its advisers need reliable market context and remain responsible for the conclusions. A mandate can start with broad research and narrow to potential counterparties. The team wanted a faster first pass, not a finished AI-written recommendation.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-challenge',
    'The challenge Research was spread across tools and repeated by hand. Research pulled advisers across market sources and company records. Relevant knowledge sat across OneDrive Business, SharePoint, Outlook, Teams and Confluence. Target discovery and early analysis added more manual collection. Formatting that material left less time for clients and judgment. Market and company research Building preliminary target and buyer longlists Preparing indicative analysis for adviser review Drafting outreach and supporting content around active sectors',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-approach',
    'The approach Connected knowledge became the starting point for focused agents. atares built four active knowledge bases and seven active agents in a shared workspace. Connected systems bring internal deal experience together with current market information. Each agent has a defined research job. Advisers control its scope, access and final output.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-workflows',
    'Workflows in practice A faster route from an initial question to an adviser-ready draft. For a buy-side search, an agent screens companies against target criteria. It combines internal material with live research to draft a preliminary longlist and fit notes. Advisers validate and narrow it. Agents also support early scenarios, indicative valuation drafts based on sector references, teaser copy and outreach. The team decides what is reliable enough to use.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-atares-impact',
    'Results and operating impact More time for the work that requires an adviser. Across the described research workflows, atares reports approximately 20 hours saved by the team each week. This is a team total, not a per-user figure. The time comes from less repeated collection and drafting across daily research tasks. Advisers review every output before it leaves the team.',
    storyEvidence.atares,
    'customers.atares',
  ),
  approvedArticleSection(
    'customer-story-b2venture-context',
    'Customer context Investment work needs speed and analytical depth. b2venture is a European investment firm focused on early opportunities. Its team reviews companies and markets before turning its analysis into investment documents. Speed does not replace investor judgment. The team focused agents on repeatable work while keeping decisions with investment professionals.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-challenge',
    'The challenge Memos and market research consumed the same scarce hours. Associates and managers spent substantial time gathering information for investment memos. Drafting and refining a memo typically took 5 to 10 hours per investment opportunity. The same team researched markets and startups, reviewed pitch decks and prepared communication. It needed connected knowledge instead of isolated documents.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-approach',
    'The approach Specialized agents were matched to specialized tasks. b2venture created more than 10 specialized agents instead of one general assistant. Each agent has a distinct job and relevant knowledge. They support memos, founder-call notes and document review. Each workflow has a defined starting point.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-workflows',
    'Workflows in practice Research and documents work from one connected knowledge layer. Connected Notion and Google Drive material gives agents access to models, pitch decks and investment documents. Teams use that context for market research, startup analysis and pitch-deck review. Agents also prepare email drafts in the firm’s voice. Investment professionals review the material and make the decisions. Investment memo preparation and refinement Market and startup research Pitch-deck analysis and improvement Reporting and communication drafts',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-b2venture-impact',
    'Results and operating impact Adoption turned the workflow into a regular part of investment work. The rollout reached over 70 percent team activation. Usage doubled over four months as agents became part of recurring work. Memo drafting had previously taken 5 to 10 hours per investment opportunity. Agents now prepare a first pass while investment professionals retain analytical responsibility.',
    storyEvidence.b2venture,
    'customers.b2venture',
  ),
  approvedArticleSection(
    'customer-story-mahle-context',
    'Customer context Decades of technical knowledge need to remain usable. MAHLE has accumulated technical expertise over many years. That knowledge supports research, engineering and problem solving when employees can find it. MAHLE wanted connected sources and task-specific agents, not another search box.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-challenge',
    'The challenge Relevant answers were distributed across repositories and pages. Employees had to know which repository held an answer. File search located documents but left the synthesis to them. Technical teams also needed to compare versions, retrieve past solutions and keep source context visible.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-approach',
    'The approach MARVIN connected technical knowledge to a dedicated agent. MAHLE introduced MARVIN, short for MAHLE Assisted Research, Verification, Insight and Navigation. The agent sits in a knowledge platform configured for the company. SharePoint and Teams sources synchronize into that platform. Employees can reach current material through one governed workspace.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-workflows',
    'Workflows in practice Teams can compare, retrieve, and reason across technical material. Teams use MARVIN to compare documents and versions. They also use it to find relevant technical information during problem solving. The connected knowledge supports retrieval, summarization and drafts of reports or plans. Employees can inspect the sources behind a response. Finding information across connected company sources Comparing documents and document versions Investigating technical problems using existing documentation Summarizing material for reports and planning work',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-mahle-impact',
    'Results and operating impact Useful knowledge access encouraged early adoption. The rollout reached over 71 percent activation in less than one month. MAHLE reports more than five hours saved per user each week on retrieval and summarization in the described workflows. Connected sources and a familiar internal agent made technical knowledge easier to reuse.',
    storyEvidence.mahle,
    'customers.mahle',
  ),
  approvedArticleSection(
    'customer-story-kbc-context',
    'Customer context Consulting quality depends on knowledge moving between people. KBC is an international management consultancy working across strategy and operations. Its consultants share experience across projects, proposals and internal problem solving. As its knowledge grew, KBC needed a faster way to find and reuse that expertise without maintaining another manual repository.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-challenge',
    'The challenge Informal knowledge exchange was valuable but difficult to scale. Employees often found expertise through colleagues, email or phone calls. The answers were useful, but finding and preparing them took time. Manual knowledge databases required steady maintenance and offered limited search. KBC wanted one secure system for existing sources and everyday use.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-approach',
    'The approach A shared knowledge layer connected sources and employee workflows. The platform connects company-wide SharePoint, Azure meeting transcripts and selected external research. Employees use that context for search, analysis and drafting. KBC paired the technology with onboarding support from AICX. Employees learned where it helped and how to use it in daily work.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-workflows',
    'Workflows in practice Search became one part of a broader knowledge workflow. Consultants use connected knowledge to prepare proposals and analyze markets. They also assemble presentations, benchmarks, reports and meeting notes from existing material. KBC built specialized workflows around the platform. Schorsch serves as a company-wide assistant. Other workflows support onboarding and capture document summaries and keywords. Internal expertise and company knowledge search Proposal concepts and presentation preparation Market and data analysis Onboarding and document metadata workflows',
    storyEvidence.kbc,
    'customers.kbc',
  ),
  approvedArticleSection(
    'customer-story-kbc-impact',
    'Results and operating impact Knowledge moved from a search problem into everyday work. Internal expertise search fell from minutes to seconds in the reported workflow. Proposal creation became 10 to 12 percent more efficient in the described workflow. After 18 months, over 75 percent of employees used the platform each week. Connected knowledge and onboarding helped make it part of regular work.',
    storyEvidence.kbc,
    'customers.kbc',
  ),
];

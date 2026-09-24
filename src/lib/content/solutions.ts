import type { GlyphName } from '../icons/glyph-names';
import type { SolutionSurface } from './solution-surfaces';

export interface SolutionAgent {
  /** Named the way the team would name it, not after the technique behind it. */
  name: string;
  glyph: GlyphName;
  /** The job it does, in that industry's words. */
  does: string;
  /** What it is allowed to read to do it. */
  from: string;
  /**
   * The product screen this use case is shown on. Exactly two agents per industry carry one: the
   * two that sell hardest to that reader. The rest stay as text, which is what they are.
   */
  surface?: SolutionSurface | undefined;
}

export interface SolutionQuestion {
  question: string;
  answer: string;
  showSecurityReference?: boolean;
}

/** A document reference, not a provider-wide retention or compliance guarantee. */
export const solutionSecurityReference = {
  description: 'Details on Zero Data Retention (ZDR) and model-training policies:',
  label: 'Security and Trust Center →',
  href: '/security',
} as const;

export type SolutionJourneyStepId = 'context' | 'agent' | 'review';

export interface SolutionJourneyStep {
  id: SolutionJourneyStepId;
  title: string;
  description: string;
}

export interface SolutionWorkspace {
  claimId: string;
  caption: string;
  contextSources: readonly string[];
  agent: string;
  task: string;
  resultTitle: string;
  resultItems: readonly string[];
  reviewer: string;
}

export interface SolutionControl {
  label: string;
  value: string;
}

export type SolutionStorySlug = 'atares' | 'b2venture' | 'mahle' | 'kbc';

export type SolutionCustomerProof =
  | {
      kind: 'story';
      storySlug: SolutionStorySlug;
      label: string;
      resultClaimIds: readonly string[];
    }
  | {
      kind: 'quote';
      voiceId: 'customer-voice-frommer-legal';
      logoClaimId: 'customer-logo-frommer-legal';
      label: string;
    };

export interface Solution {
  slug: string;
  /** Short enough for the header dropdown. */
  navLabel: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  /** One line for the index page. */
  summary: string;
  metaDescription: string;
  startingPointClaimId: 'product-agent-starting-point';
  journey: readonly SolutionJourneyStep[];
  workspace: SolutionWorkspace;
  customerProof: SolutionCustomerProof;
  /** Named for what this industry produces. Two pages sharing a heading means neither is targeted. */
  workTitle: string;
  workBody: string;
  agents: readonly SolutionAgent[];
  /** The confidentiality boundary this industry actually works inside. */
  wallsTitle: string;
  wallsBody: string;
  controls: readonly SolutionControl[];
  questionsTitle: string;
  questions: readonly SolutionQuestion[];
  closing: string;
}

const startingPointStatement = 'Choose a prebuilt agent or build one around your workflow.';

/**
 * One page per industry we sell into. The product is the same on all five; the work is not, and
 * neither is the language. Each page names the artefacts that industry actually produces, the
 * agents that draft them, and the confidentiality boundary the team already works inside.
 *
 * No agent name is used on two pages. If one starts fitting two industries it is written too
 * generally.
 */
export const solutions: readonly Solution[] = [
  {
    slug: 'manufacturing',
    navLabel: 'Manufacturing',
    eyebrow: 'Manufacturing',
    headline: 'The paperwork around the part.',
    subhead:
      'Draft quality reports and check specifications against your engineering records. The responsible engineer reviews the result.',
    summary: 'Quality reports and specification checks grounded in engineering records.',
    metaDescription:
      'Zeno for manufacturing. Draft 8D and CAPA reports, compare specifications and answer supplier quality questions in a governed workspace.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the drawings, standards and quality records behind the task.',
      },
      {
        id: 'agent',
        title: 'Agent starting point',
        description: startingPointStatement,
      },
      {
        id: 'review',
        title: 'Reviewable work',
        description: 'The comparison returns to the engineer with every finding attached.',
      },
    ],
    workspace: {
      claimId: 'solution-workspace-manufacturing',
      caption:
        'The Specification Agent compares customer drawings with internal standards. It cites each finding for engineering review.',
      contextSources: ['Customer drawing', 'Internal standards', 'Revision history'],
      agent: 'Specification Agent',
      task: 'Compare the latest customer drawing with our internal standard.',
      resultTitle: 'Requirements comparison',
      resultItems: [
        'Hole position tolerance needs review',
        'Material specification differs',
        'Surface finish matches',
      ],
      reviewer: 'Engineering owner',
    },
    customerProof: {
      kind: 'story',
      storySlug: 'mahle',
      label: 'Manufacturing customer story',
      resultClaimIds: ['customer-result-mahle-activation', 'customer-result-mahle-time'],
    },
    workTitle: 'An agent per document, not one assistant for the plant.',
    workBody: 'Give each agent a document, approved records and a named engineer for review.',
    agents: [
      {
        name: 'Supplier Quality Agent',
        glyph: 'draft',
        does: 'Drafts an 8D report from the complaint and relevant quality records.',
        from: 'Complaint records, past 8D and CAPA files and supplier files',
        surface: {
          kind: 'workflow',
          workflow: 'Draft an 8D from a customer complaint',
          files: ['Complaint_record.pdf', 'Containment_note.pdf', 'CAPA_history.xlsx'],
          field: { label: 'Plant', value: 'Assembly, line 2' },
          prompt:
            'Draft an 8D from the complaint and containment note. Cite relevant past CAPA records for engineer review.',
          reply: 'Reading the complaint and the past CAPA files',
        },
      },
      {
        name: 'Specification Agent',
        glyph: 'number',
        does: 'Compares a customer drawing with your standard and cites each difference.',
        from: 'Customer drawings, specifications and internal standards',
        surface: {
          kind: 'result',
          document: 'Customer drawing vs internal standard',
          status: 'Every difference cites the clause it came from.',
          findings: [
            { label: 'Surface finish', verdict: 'clear' },
            { label: 'Hole position tolerance', verdict: 'check' },
            { label: 'Material specification', verdict: 'blocked' },
            { label: 'Heat treatment', verdict: 'clear' },
          ],
        },
      },
      {
        name: 'Quotation Agent',
        glyph: 'finance',
        does: 'Drafts an RFQ response from cost templates and relevant past quotations.',
        from: 'RFQ packs, cost templates and prior quotations',
      },
      {
        name: 'Shift Report Agent',
        glyph: 'operations',
        does: 'Turns line data and shift notes into a report for the morning meeting.',
        from: 'Line data, downtime records and shift notes',
      },
    ],
    wallsTitle: 'What an agent on a plant floor must never do.',
    wallsBody:
      'Customer drawings, supplier prices and export-controlled parts need different access rules. Keep those boundaries with the work.',
    controls: [
      {
        label: 'Programme access',
        value: 'An agent working one customer programme cannot read another.',
      },
      {
        label: 'Controlled drawings',
        value: 'Export-controlled material stays inside the group cleared to see it.',
      },
      {
        label: 'Commercial access',
        value: 'Supplier pricing remains visible to purchasing, not the whole plant.',
      },
      {
        label: 'Human checkpoint',
        value: 'Every quality document returns to the engineer who signs it.',
      },
    ],
    questionsTitle: 'What quality and plant IT ask first.',
    questions: [
      {
        question: 'Does it work from our drawings, or from a general model?',
        answer:
          'From the records you connect. The agent uses your standards, supplier files and past reports. Its findings point back to those records.',
      },
      {
        question: 'Our customer drawings are under NDA. Where do they go?',
        showSecurityReference: true,
        answer:
          'IT sets access to connected drawings and approves the models used in the workspace. EU hosting is available for the model layer.',
      },
      {
        question: 'Can it sign off a quality document?',
        answer:
          'No. Every 8D and CAPA goes to a named engineer for review. The workspace records the signoff.',
      },
      {
        question: 'How long before one plant is using it?',
        answer:
          'Begin with one document type at one plant. Expand after the engineering team validates the first result.',
      },
    ],
    closing: 'Start with the report your quality team writes most often.',
  },
  {
    slug: 'management-consulting',
    navLabel: 'Management consulting',
    eyebrow: 'Management consulting',
    headline: 'The work between the meetings.',
    subhead:
      'Draft proposals and client packs from your firm’s own work. Keep each engagement separate.',
    summary: 'Proposals and client packs grounded in firm knowledge.',
    metaDescription:
      'Zeno for management consulting. Draft proposals, synthesize interviews and build client packs with engagement-level access.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the brief, firm credentials and relevant past work.',
      },
      {
        id: 'agent',
        title: 'Agent starting point',
        description: startingPointStatement,
      },
      {
        id: 'review',
        title: 'Reviewable work',
        description:
          'The proposal arrives with its supporting context and waits for partner review.',
      },
    ],
    workspace: {
      claimId: 'solution-workspace-management-consulting',
      caption:
        'The Proposal Agent drafts from a client brief and relevant firm experience. A partner reviews the outline.',
      contextSources: ['Client brief', 'Credentials library', 'Past engagements'],
      agent: 'Proposal Agent',
      task: 'Prepare the first proposal outline from the brief and our relevant experience.',
      resultTitle: 'Proposal outline',
      resultItems: [
        'Comparable credentials identified',
        'Scope and staffing drafted',
        'Fees reserved for partner input',
      ],
      reviewer: 'Engagement partner',
    },
    customerProof: {
      kind: 'story',
      storySlug: 'kbc',
      label: 'Management consulting customer story',
      resultClaimIds: [
        'customer-result-kbc-search-time',
        'customer-result-kbc-proposals',
        'customer-result-kbc-weekly-usage',
      ],
    },
    workTitle: 'An agent per deliverable, not one assistant for the firm.',
    workBody: 'Give each agent a deliverable, engagement-level access and a partner for review.',
    agents: [
      {
        name: 'Proposal Agent',
        glyph: 'draft',
        does: 'Drafts a proposal from the brief and relevant firm experience.',
        from: 'Client brief, firm credentials and comparable engagements',
        surface: {
          kind: 'workflow',
          workflow: 'Draft a proposal from the brief',
          files: ['Client_brief.pdf', 'Scoping_notes.docx', 'Rate_card.xlsx'],
          field: { label: 'Engagement', value: 'New client, no prior work' },
          prompt:
            'Draft a proposal outline from the brief and relevant engagements. Leave fees for partner review.',
          reply: 'Pulling comparable scopes from past engagements',
        },
      },
      {
        name: 'Synthesis Agent',
        glyph: 'ask',
        does: 'Summarizes interviews into findings with supporting quotations.',
        from: 'Transcripts and notes from the active engagement',
        surface: {
          kind: 'assistant',
          ask: 'What did the operations interviews say about the handover between planning and delivery?',
          answer:
            'Four interviews describe a planning handover problem. Two say delivery had committed capacity before the plan arrived. One describes a team workaround.',
          cites: [
            'Interview_07_Operations_lead.docx',
            'Interview_09_Planning_manager.docx',
            'Workshop_notes_week_2.docx',
          ],
        },
      },
      {
        name: 'Steering Pack Agent',
        glyph: 'schedule',
        does: 'Builds the weekly pack and marks what changed.',
        from: 'Workstream trackers, prior pack and project plan',
      },
      {
        name: 'Benchmark Agent',
        glyph: 'number',
        does: 'Finds comparable figures in your firm’s own studies.',
        from: 'Your own past studies and benchmark sets',
      },
    ],
    wallsTitle: 'One client never sees another.',
    wallsBody:
      'Client trust depends on separation. An agent working on one engagement must not draw from another client’s material.',
    controls: [
      {
        label: 'Engagement access',
        value: 'The agent reads the active engagement and nothing else.',
      },
      {
        label: 'Firm knowledge',
        value: 'Credentials and methodology can be shared while client material stays separate.',
      },
      {
        label: 'Human checkpoint',
        value: 'Client work is reviewed by the partner whose name is on it.',
      },
      {
        label: 'Activity record',
        value: 'The workspace shows which engagements an agent received and when.',
      },
    ],
    questionsTitle: 'What partners ask first.',
    questions: [
      {
        question: 'How do you keep one client’s material out of another’s deck?',
        showSecurityReference: true,
        answer:
          'Set access per engagement. The agent reads only material available to the person using it. Client files are not pooled.',
      },
      {
        question: 'Will it invent a benchmark?',
        answer:
          'It uses your firm’s studies and cites the source of each figure. If a number is missing, it marks the gap.',
      },
      {
        question: 'What does it connect to?',
        answer:
          'Connect the systems your engagement uses, such as SharePoint and Outlook. IT governs access in the workspace.',
      },
      {
        question: 'Do partners have to change how they work?',
        answer:
          'No. The agent prepares a draft for partner review in the team’s existing document workflow.',
      },
    ],
    closing: 'Start with the proposal your team writes every week.',
  },
  {
    slug: 'm-and-a',
    navLabel: 'M&A advisory',
    eyebrow: 'M&A advisory',
    headline: 'Run the process, not the photocopier.',
    subhead:
      'Prepare longlists, teasers and buyer answers from the deal file. Keep the work inside the deal team.',
    summary: 'Longlists and buyer answers grounded in the deal file.',
    metaDescription:
      'Zeno for M&A advisers. Screen targets against the mandate, draft deal documents and prepare cited buyer answers for review.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the mandate, deal history and licensed market sources.',
      },
      {
        id: 'agent',
        title: 'Agent starting point',
        description: startingPointStatement,
      },
      {
        id: 'review',
        title: 'Reviewable work',
        description:
          'The longlist arrives with a fit rationale and open questions for the deal team.',
      },
    ],
    workspace: {
      claimId: 'solution-workspace-m-and-a',
      caption:
        'The Longlist Agent screens licensed market sources against the mandate. Advisers review the target list and its fit notes.',
      contextSources: ['Mandate criteria', 'Deal history', 'Licensed market sources'],
      agent: 'Longlist Agent',
      task: 'Build a preliminary target list against the mandate criteria.',
      resultTitle: 'Qualified target list',
      resultItems: [
        'Fit rationale beside every target',
        'Open questions clearly marked',
        'List ready for the adviser to narrow',
      ],
      reviewer: 'Deal lead',
    },
    customerProof: {
      kind: 'story',
      storySlug: 'atares',
      label: 'M&A customer story',
      resultClaimIds: [
        'customer-result-atares-weekly-time',
        'customer-result-atares-knowledge-bases',
        'customer-result-atares-agents',
      ],
    },
    workTitle: 'An agent per stage of the process.',
    workBody: 'Give each agent a deal task, scoped data-room access and an adviser for review.',
    agents: [
      {
        name: 'Longlist Agent',
        glyph: 'ask',
        does: 'Builds a target list against the mandate and explains each fit.',
        from: 'Mandate criteria, deal history and licensed market sources',
      },
      {
        name: 'Teaser Agent',
        glyph: 'draft',
        does: 'Drafts deal documents from the data room and management inputs.',
        from: 'Data room, management inputs and firm templates',
        surface: {
          kind: 'workflow',
          workflow: 'Draft a teaser from the management pack',
          files: ['Management_pack.pdf', 'Financial_summary.xlsx', 'Positioning_note.docx'],
          field: { label: 'Disclosure', value: 'Anonymised, pre-NDA' },
          prompt:
            'Draft a one-page teaser from the management pack. Flag details that identify the company.',
          reply: 'Checking the pack for anything that would name the company',
        },
      },
      {
        name: 'Buyer Q&A Agent',
        glyph: 'legal',
        does: 'Drafts cited buyer answers and flags questions the deal team must resolve.',
        from: 'Deal data room and buyer Q&A log',
        surface: {
          kind: 'assistant',
          ask: 'Buyer question: are any customer contracts terminable on a change of control?',
          answer:
            'Two uploaded agreements allow termination on notice after a change of control. One agreement is missing, so the deal team must confirm it before replying.',
          cites: [
            'Customer_agreement_A.pdf',
            'Customer_agreement_C.pdf',
            'Not in the data room: routed to the deal team',
          ],
        },
      },
      {
        name: 'Comparables Agent',
        glyph: 'finance',
        does: 'Assembles precedent transactions from deals your firm actually advised on.',
        from: 'Your closed-deal record and licensed transaction data',
      },
    ],
    wallsTitle: 'Deal team means deal team.',
    wallsBody:
      'A live deal has a defined insider list. Keep agent access inside that same team boundary.',
    controls: [
      {
        label: 'Deal-team access',
        value: 'Off the deal team means no access, not reduced access.',
      },
      {
        label: 'Process separation',
        value: 'Each live mandate keeps its own data room and context.',
      },
      {
        label: 'Human checkpoint',
        value: 'Anything going to a buyer is reviewed by the MD running the process.',
      },
      {
        label: 'Activity record',
        value: 'Who read what, and when, remains on the record for the file.',
      },
    ],
    questionsTitle: 'What deal teams ask first.',
    questions: [
      {
        question: 'Can it answer a buyer directly?',
        answer:
          'It drafts a cited answer for deal-team review. A person releases the final response.',
      },
      {
        question: 'What happens to the data room when the deal closes?',
        answer:
          'The deal team controls access to its data room. Close agent access when the mandate closes.',
      },
      {
        question: 'Where does our material sit?',
        showSecurityReference: true,
        answer:
          'IT chooses approved models with EU hosting. Connected deal material remains subject to its access rules. Certification details are in the trust centre.',
      },
      {
        question: 'Is this only useful on large processes?',
        answer:
          'Start with one document type. The adviser reviews the first draft before the team expands the workflow.',
      },
    ],
    closing: 'Start with the buyer questions on your next live process.',
  },
  {
    slug: 'private-equity',
    navLabel: 'Private equity',
    eyebrow: 'Private equity',
    headline: 'From screen to IC, with the file behind it.',
    subhead:
      'Draft deal screens, committee memos and portfolio updates from your diligence and reporting.',
    summary: 'Investment memos and portfolio updates grounded in your fund records.',
    metaDescription:
      'Zeno for private equity. Screen deals, draft investment memos and prepare portfolio updates with deal-level access and human review.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the fund mandate, pitch deck and diligence on file.',
      },
      {
        id: 'agent',
        title: 'Agent starting point',
        description: startingPointStatement,
      },
      {
        id: 'review',
        title: 'Reviewable work',
        description: 'The memo arrives with supporting diligence and unresolved questions marked.',
      },
    ],
    workspace: {
      claimId: 'solution-workspace-private-equity',
      caption:
        'The IC Memo Agent drafts from the pitch deck, fund mandate and diligence. A deal partner reviews open questions.',
      contextSources: ['Pitch deck', 'Diligence files', 'Fund mandate'],
      agent: 'IC Memo Agent',
      task: 'Prepare the first committee memo and mark every unresolved diligence question.',
      resultTitle: 'Investment committee memo',
      resultItems: [
        'Market section supported by diligence',
        'Revenue quality needs review',
        'Customer concentration remains open',
      ],
      reviewer: 'Deal partner',
    },
    customerProof: {
      kind: 'story',
      storySlug: 'b2venture',
      label: 'Venture capital investment-team example',
      resultClaimIds: [
        'customer-result-b2venture-activation',
        'customer-result-b2venture-usage',
        'customer-result-b2venture-memo-time',
      ],
    },
    workTitle: 'An agent per stage, from first screen to LP update.',
    workBody: 'Give each agent a fund task, scoped diligence access and a partner for review.',
    agents: [
      {
        name: 'Deal Screen Agent',
        glyph: 'ask',
        does: 'Screens opportunities against the fund mandate and explains mismatches.',
        from: 'Fund mandate, deal teaser and screening history',
      },
      {
        name: 'IC Memo Agent',
        glyph: 'draft',
        does: 'Drafts a committee memo from completed diligence and marks open questions.',
        from: 'Diligence reports, financial model, data room and prior memos',
        surface: {
          kind: 'result',
          document: 'Investment committee memo, first draft',
          status: 'Every section points back to the diligence it came from.',
          findings: [
            { label: 'Market and competition', verdict: 'clear' },
            { label: 'Revenue quality', verdict: 'check' },
            { label: 'Customer concentration', verdict: 'blocked' },
            { label: 'Management assessment', verdict: 'clear' },
          ],
        },
      },
      {
        name: 'Portfolio Agent',
        glyph: 'number',
        does: 'Builds a quarterly pack and flags missing company reports.',
        from: 'Portfolio submissions and reporting template',
        surface: {
          kind: 'automation',
          run: 'Quarterly portfolio pack',
          trigger: 'On the first working day after quarter end',
          steps: [
            { title: 'Collect company reporting', state: 'done' },
            { title: 'Check figures against last quarter', state: 'done' },
            { title: 'Draft the commentary', state: 'running' },
            { title: 'Deal partner review', state: 'waiting' },
          ],
        },
      },
      {
        name: 'LP Update Agent',
        glyph: 'schedule',
        does: 'Drafts an investor letter from portfolio records and prior updates.',
        from: 'Portfolio reporting, prior LP letters and fund data',
      },
    ],
    wallsTitle: 'Material non-public information, handled as such.',
    wallsBody:
      'Funds handle material non-public information across separate deals. Keep each deal and fund in its own knowledge boundary.',
    controls: [
      {
        label: 'Deal and fund access',
        value: 'Each deal and fund keeps a separate knowledge boundary.',
      },
      {
        label: 'MNPI access',
        value: 'Material non-public information is available only to people cleared to hold it.',
      },
      {
        label: 'Human checkpoint',
        value: 'Nothing reaches an LP or committee without a partner releasing it.',
      },
      {
        label: 'Control record',
        value: 'Access, model choice, and sign-off remain visible together.',
      },
    ],
    questionsTitle: 'What investment teams ask first.',
    questions: [
      {
        question: 'How is MNPI kept where it belongs?',
        answer:
          'Set access per deal and fund. The agent reads only material available to the person using it.',
      },
      {
        question: 'Can it write the IC memo on its own?',
        answer:
          'It drafts from diligence and marks gaps. The deal partner owns the recommendation and signoff.',
      },
      {
        question: 'What about portfolio companies on different systems?',
        answer:
          'Build the pack from submitted reports. Flag missing information instead of filling it in.',
      },
      {
        question: 'Which models does it run on?',
        showSecurityReference: true,
        answer:
          'IT selects approved models with EU hosting. Model choice remains separate from the agent workflow.',
      },
    ],
    closing: 'Start with the quarterly pack nobody enjoys assembling.',
  },
  {
    slug: 'legal',
    navLabel: 'Legal',
    eyebrow: 'Law firms and in-house teams',
    headline: 'The first draft, against your own playbook.',
    subhead:
      'Review contracts and find precedents from your firm’s own knowledge. Keep the work inside its matter.',
    summary: 'Contract review and precedent search within the right matter.',
    metaDescription:
      'Zeno for legal teams. Review contracts against your playbook, find firm precedents and summarize matters with scoped access.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the agreement, playbook and matter-specific precedents.',
      },
      {
        id: 'agent',
        title: 'Agent starting point',
        description: startingPointStatement,
      },
      {
        id: 'review',
        title: 'Reviewable work',
        description: 'The review returns with each departure and supporting clause attached.',
      },
    ],
    workspace: {
      claimId: 'solution-workspace-legal',
      caption:
        'The Review Agent compares a supplier agreement with the firm playbook. A lawyer reviews each cited departure.',
      contextSources: ['Firm playbook', 'Supplier agreement', 'Precedent bank'],
      agent: 'Review Agent',
      task: 'Review the supplier agreement against our approved positions.',
      resultTitle: 'Playbook comparison',
      resultItems: [
        'Liability position is off playbook',
        'Termination clause needs review',
        'Governing law matches',
      ],
      reviewer: 'Responsible lawyer',
    },
    customerProof: {
      kind: 'quote',
      voiceId: 'customer-voice-frommer-legal',
      logoClaimId: 'customer-logo-frommer-legal',
      label: 'Legal customer story',
    },
    workTitle: 'An agent per task on the matter, not one assistant for the firm.',
    workBody: 'Give each agent a matter task, scoped access and a responsible lawyer for review.',
    agents: [
      {
        name: 'Review Agent',
        glyph: 'legal',
        does: 'Finds departures from your playbook and cites the clauses.',
        from: 'Firm playbook, contract and approved precedents',
        surface: {
          kind: 'result',
          document: 'Supplier agreement against the firm playbook',
          status: 'Each position cites the playbook rule behind it.',
          findings: [
            { label: 'Limitation of liability', verdict: 'blocked' },
            { label: 'Governing law', verdict: 'clear' },
            { label: 'Termination for convenience', verdict: 'check' },
            { label: 'Confidentiality', verdict: 'clear' },
          ],
        },
      },
      {
        name: 'Precedent Agent',
        glyph: 'ask',
        does: 'Finds relevant firm drafting and identifies its source matter.',
        from: 'Your know-how and precedent bank',
      },
      {
        name: 'Matter Agent',
        glyph: 'draft',
        does: 'Summarizes a matter’s history, current status and next steps.',
        from: 'Matter file and correspondence for that matter',
      },
      {
        name: 'Client Update Agent',
        glyph: 'schedule',
        does: 'Drafts a client update from the matter record.',
        from: 'Matter record and prior client updates',
        surface: {
          kind: 'automation',
          run: 'Matter update to the client',
          trigger: 'Every Friday, on matters marked active',
          steps: [
            { title: 'Gather this week on the matter', state: 'done' },
            { title: 'Draft the update', state: 'running' },
            { title: 'Responsible partner review', state: 'waiting' },
            { title: 'Send to the client', state: 'waiting' },
          ],
        },
      },
    ],
    wallsTitle: 'Privilege is not a setting you add later.',
    wallsBody:
      'Matters have defined teams and information barriers. Agent access follows those boundaries.',
    controls: [
      {
        label: 'Matter access',
        value: 'Access follows the matter, not the person’s seniority.',
      },
      {
        label: 'Information barriers',
        value: 'Agents respect the same barriers as the people working either side.',
      },
      {
        label: 'Human checkpoint',
        value: 'Nothing reaches a client without the responsible lawyer releasing it.',
      },
      {
        label: 'Regional control',
        value: 'Privileged material remains in the region where the firm holds it.',
      },
    ],
    questionsTitle: 'What partners and risk ask first.',
    questions: [
      {
        question: 'How is firm material controlled?',
        showSecurityReference: true,
        answer:
          'IT controls connected access and selects approved models with EU hosting. The agent reads only material available within the matter.',
      },
      {
        question: 'Can it replace a lawyer’s review?',
        answer:
          'No. It marks playbook departures and cites each clause. The lawyer decides and signs.',
      },
      {
        question: 'How does it respect an information barrier?',
        answer:
          'Set access per matter. The agent cannot read across a barrier that blocks its user.',
      },
      {
        question: 'We already have a legal AI tool. Why this?',
        answer:
          'The same governed workspace also supports work beyond legal. IT can manage access, model choice and usage in one place.',
      },
    ],
    closing: 'Start with the contract type that comes through most often.',
  },
];

/**
 * The work section pairs each featured agent with a product screen and leaves the rest as text.
 * Two is the shape it is built and tested for, so a third surface added to a page, or one dropped,
 * fails the build rather than quietly rendering a lopsided row.
 */
for (const solution of solutions) {
  const featured = solution.agents.filter((agent) => agent.surface);
  if (featured.length !== 2) {
    throw new Error(
      `/solutions/${solution.slug} features ${featured.length} agents with a product surface. ` +
        `Exactly two carry one.`,
    );
  }
  if (
    solution.journey.length !== 3 ||
    solution.journey.map((step) => step.id).join(',') !== 'context,agent,review'
  ) {
    throw new Error(
      `/solutions/${solution.slug} must follow context, agent, and review in that order.`,
    );
  }
  if (solution.controls.length !== 4) {
    throw new Error(`/solutions/${solution.slug} must show exactly four workspace controls.`);
  }
}

/** The agents shown beside a product screen, in the order they are declared. */
export function featuredAgents(solution: Solution): readonly SolutionAgent[] {
  return solution.agents.filter((agent) => agent.surface);
}

/** The rest, which stay as text under the rows. */
export function remainingAgents(solution: Solution): readonly SolutionAgent[] {
  return solution.agents.filter((agent) => !agent.surface);
}

export function solutionBySlug(slug: string): Solution {
  const solution = solutions.find((candidate) => candidate.slug === slug);
  if (!solution) throw new Error(`Unknown solution slug "${slug}".`);
  return solution;
}

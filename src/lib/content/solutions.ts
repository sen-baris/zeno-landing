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
}

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

const startingPointStatement =
  'Start from a prebuilt agent or build one from scratch around your workflow.';

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
      'Quality reports, supplier answers and spec checks drafted from your own engineering record, then signed by the engineer who owns them.',
    summary: 'Quality reporting, supplier answers and spec checks, drafted from your own records.',
    metaDescription:
      'Zeno for manufacturing: agents that draft 8D and CAPA reports, compare customer specifications against your standard, and answer supplier quality questions, on a workspace IT governs.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the drawings, standards, and quality records the work depends on.',
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
        'Customer drawings and internal standards provide context for a Specification Agent that prepares a cited comparison for engineering review.',
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
    workBody:
      'Each one is given the document it drafts, the records it may read, and the engineer who signs it off.',
    agents: [
      {
        name: 'Supplier Quality Agent',
        glyph: 'draft',
        does: 'Drafts the 8D from the complaint, the containment already taken and how the same failure was closed out before.',
        from: 'Complaint records, past 8D and CAPA files, the supplier file',
        surface: {
          kind: 'workflow',
          workflow: 'Draft an 8D from a customer complaint',
          files: ['Complaint_record.pdf', 'Containment_note.pdf', 'CAPA_history.xlsx'],
          field: { label: 'Plant', value: 'Assembly, line 2' },
          prompt:
            'Draft the 8D against our template. Use the containment already recorded, and cite the past CAPA where this failure mode was closed out before.',
          reply: 'Reading the complaint and the past CAPA files',
        },
      },
      {
        name: 'Specification Agent',
        glyph: 'number',
        does: 'Reads a customer drawing against your standard and lists only where the two differ, with the clause beside each one.',
        from: 'Customer drawings and specs, your internal standards library',
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
        does: 'Assembles the RFQ response from your cost template and what you quoted the last time the part looked like this.',
        from: 'RFQ pack, cost templates, prior quotations',
      },
      {
        name: 'Shift Report Agent',
        glyph: 'operations',
        does: 'Turns the line data and the shift notes into the report the morning meeting actually reads.',
        from: 'Line and downtime data, shift handover notes',
      },
    ],
    wallsTitle: 'What an agent on a plant floor must never do.',
    wallsBody:
      'Manufacturing runs on documents that belong to somebody else. A customer drawing under NDA, a supplier price, a part under export control. The workspace treats those as the boundary they are.',
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
          'From yours. The agent reads the standards library, the supplier file and the past reports you connect, and every figure it uses points back to the document it came from.',
      },
      {
        question: 'Our customer drawings are under NDA. Where do they go?',
        answer:
          'They stay in the systems they already live in, and the agent reaches them under the permissions those systems already enforce. Zeno runs in the EU and IT sets which models are allowed.',
      },
      {
        question: 'Can it sign off a quality document?',
        answer:
          'No, and it should not. Every 8D and CAPA comes back to a named engineer for review. The workspace records who signed and when.',
      },
      {
        question: 'How long before one plant is using it?',
        answer:
          'One agent on one document type, in weeks rather than quarters. The next plant picks up the agent the first one built.',
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
      'Proposals, interview synthesis and steering packs drafted from your own engagements, with a wall between every client.',
    summary: 'Proposals, synthesis and client packs, with a wall between every engagement.',
    metaDescription:
      'Zeno for management consultancies: agents that draft proposals from your credentials, synthesise interviews with sources, and build the weekly client pack, with client separation enforced.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the brief, credentials, and relevant past engagement knowledge.',
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
        'A client brief, firm credentials, and comparable engagements provide context for a Proposal Agent that prepares a partner-ready outline.',
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
    workBody:
      'Each one is given the deliverable it drafts, the engagement files it may read, and the partner who signs it off.',
    agents: [
      {
        name: 'Proposal Agent',
        glyph: 'draft',
        does: 'Drafts against the brief using your credentials, your methodology and the engagements that actually resemble this one.',
        from: 'The brief, credentials library, comparable past engagements',
        surface: {
          kind: 'workflow',
          workflow: 'Draft a proposal from the brief',
          files: ['Client_brief.pdf', 'Scoping_notes.docx', 'Rate_card.xlsx'],
          field: { label: 'Engagement', value: 'New client, no prior work' },
          prompt:
            'Draft the proposal on our template. Pull comparable scopes and staffing from past engagements, and leave the fee section for the partner.',
          reply: 'Pulling comparable scopes from past engagements',
        },
      },
      {
        name: 'Synthesis Agent',
        glyph: 'ask',
        does: 'Turns a fortnight of interviews into findings, each one carrying the quote it rests on.',
        from: 'Interview transcripts and notes from this engagement only',
        surface: {
          kind: 'assistant',
          ask: 'What did the operations interviews say about the handover between planning and delivery?',
          answer:
            'Four of the eleven interviews raised the handover directly. Two describe the plan arriving after the delivery team has already committed capacity, and one names a workaround the team built themselves.',
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
        does: 'Builds the weekly pack from the workstream trackers, and marks what changed since the last one.',
        from: 'Workstream trackers, last week’s pack, the plan on file',
      },
      {
        name: 'Benchmark Agent',
        glyph: 'number',
        does: 'Pulls the comparable figures out of studies your firm has already run, rather than off the open web.',
        from: 'Your own past studies and benchmark sets',
      },
    ],
    wallsTitle: 'One client never sees another.',
    wallsBody:
      'A consultancy sells judgement and confidentiality in the same breath. An assistant that quietly carried one client’s numbers into another client’s deck would end the relationship, and possibly the firm.',
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
        answer:
          'Access is set per engagement, and the agent only ever reads what the person using it may read. There is no shared pool of client material behind it.',
      },
      {
        question: 'Will it invent a benchmark?',
        answer:
          'It works from studies your firm has already run, and every figure carries the study it came from. If the number is not in your own work, it says so.',
      },
      {
        question: 'What does it connect to?',
        answer:
          'The systems the engagement already runs in: SharePoint, Outlook, Teams, Slack and the trackers your team keeps. Connected once, then governed centrally.',
      },
      {
        question: 'Do partners have to change how they work?',
        answer:
          'No. The draft arrives in the document and the deck they already use, and it waits for their review before it goes anywhere.',
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
      'Longlists, teasers, information memoranda and buyer questions, drafted from the data room and kept inside the deal team.',
    summary: 'Longlists, IMs and buyer Q&A, drafted from the data room and kept to the deal team.',
    metaDescription:
      'Zeno for M&A advisers: agents that screen targets against the mandate, draft the teaser and information memorandum from the data room, and answer buyer questions with citations.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the mandate, your deal history, and the market sources you license.',
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
        'Mandate criteria, deal history, and licensed market sources provide context for a Longlist Agent that prepares a qualified target list for adviser review.',
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
    workBody:
      'Each one is given the document it drafts, the data room it may read, and the banker who signs it off.',
    agents: [
      {
        name: 'Longlist Agent',
        glyph: 'ask',
        does: 'Builds the longlist against the mandate criteria and says why each name is on it, so the cut is a conversation rather than a guess.',
        from: 'Mandate criteria, your own deal history, market sources you licence',
      },
      {
        name: 'Teaser Agent',
        glyph: 'draft',
        does: 'Drafts the teaser and the information memorandum from the data room and what management told you.',
        from: 'The data room, management inputs, your house IM format',
        surface: {
          kind: 'workflow',
          workflow: 'Draft a teaser from the management pack',
          files: ['Management_pack.pdf', 'Financial_summary.xlsx', 'Positioning_note.docx'],
          field: { label: 'Disclosure', value: 'Anonymised, pre-NDA' },
          prompt:
            'Draft the one-page teaser on our template. Keep the company unidentifiable, and flag anything that would name it.',
          reply: 'Checking the pack for anything that would name the company',
        },
      },
      {
        name: 'Buyer Q&A Agent',
        glyph: 'legal',
        does: 'Answers buyer questions from the data room with the document cited, and routes anything it cannot answer to the person who can.',
        from: 'The data room for that process, the Q&A log so far',
        surface: {
          kind: 'assistant',
          ask: 'Buyer question: are any customer contracts terminable on a change of control?',
          answer:
            'Three of the uploaded customer agreements contain a change of control clause. Two are terminable on notice. The third is not in the data room, so this one goes to the deal team rather than back to the buyer.',
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
      'A live process has an insider list, and the list is the point. The workspace enforces it the way the compliance team already does on paper.',
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
          'It drafts the answer with the document cited and hands it to the deal team. Nothing reaches a buyer without a person releasing it.',
      },
      {
        question: 'What happens to the data room when the deal closes?',
        answer:
          'Access ends with the process. The agent’s reach is set from the same list compliance already maintains, so it closes when the list does.',
      },
      {
        question: 'Where does our material sit?',
        answer:
          'In the EU, on approved models chosen by IT, in the systems the process already runs in. The trust centre carries the certifications.',
      },
      {
        question: 'Is this only useful on large processes?',
        answer:
          'The mid-market benefits more. The same document set has to be produced with a smaller team, which is exactly where a first draft is worth the most.',
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
      'Deal screens, investment committee memos, portfolio packs and LP updates, drafted from your own diligence and reporting.',
    summary: 'Screens, IC memos, portfolio packs and LP updates, drafted from your own file.',
    metaDescription:
      'Zeno for private equity: agents that screen deals against the fund mandate, draft the IC memo from diligence, build the quarterly portfolio pack and prepare the LP update, with MNPI handling.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the fund mandate, pitch deck, model, and diligence already on file.',
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
        'A pitch deck, diligence files, and the fund mandate provide context for an IC Memo Agent that prepares a reviewable draft with open questions marked.',
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
    workBody:
      'Each one is given the document it drafts, the diligence and reporting it may read, and the partner who signs it off.',
    agents: [
      {
        name: 'Deal Screen Agent',
        glyph: 'ask',
        does: 'Takes the first pass against the fund mandate and says plainly why something fails it.',
        from: 'Fund mandate, the teaser or IM, your own screening history',
      },
      {
        name: 'IC Memo Agent',
        glyph: 'draft',
        does: 'Drafts the committee memo from the diligence actually done, and marks the questions still open.',
        from: 'Diligence reports, the model, the data room, prior memos',
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
        does: 'Builds the quarterly pack from what the portfolio companies submitted, and flags what did not arrive.',
        from: 'Portfolio company submissions, the reporting template',
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
        does: 'Drafts the investor letter from the portfolio record, in the language the last four letters used.',
        from: 'Portfolio reporting, prior LP letters, fund performance data',
      },
    ],
    wallsTitle: 'Material non-public information, handled as such.',
    wallsBody:
      'A fund holds information it is not free to act on, and holds it across deals that must not touch. The workspace treats a deal and a fund as separate rooms, because the regulator does.',
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
          'Access is set per deal and per fund, and an agent only ever reads what the person running it may read. Nothing is pooled across the firm.',
      },
      {
        question: 'Can it write the IC memo on its own?',
        answer:
          'It drafts from the diligence on file and marks what is still open. The deal partner writes the recommendation and signs it.',
      },
      {
        question: 'What about portfolio companies on different systems?',
        answer:
          'The pack is built from what they submit, in the formats they submit it. What is missing is flagged rather than filled in.',
      },
      {
        question: 'Which models does it run on?',
        answer:
          'The ones IT approved, hosted in the EU, and switchable later without rebuilding the agents above them.',
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
      'Contract review, precedent search and matter summaries drawn from your firm’s own know-how, inside the matter that owns them.',
    summary: 'Contract review, precedent search and matter summaries, inside the matter.',
    metaDescription:
      'Zeno for law firms and in-house legal teams: agents that review contracts against your playbook, find the closest precedent in your own know-how, and summarise a matter, with privilege respected.',
    startingPointClaimId: 'product-agent-starting-point',
    journey: [
      {
        id: 'context',
        title: 'Company context',
        description: 'Connect the agreement, firm playbook, and precedent bank for the matter.',
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
        'A firm playbook, supplier agreement, and precedent bank provide context for a Review Agent that prepares a clause-level comparison for lawyer review.',
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
    workBody:
      'Each one is given the task it does, the matter it may read, and the lawyer who signs off what it produces.',
    agents: [
      {
        name: 'Review Agent',
        glyph: 'legal',
        does: 'Reviews against your playbook and reports only the departures from it, with the clause beside each one.',
        from: 'The playbook, the contract, positions taken on past matters',
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
        does: 'Finds the closest drafting your firm has already done, and says which matter it came from.',
        from: 'Your know-how and precedent bank',
      },
      {
        name: 'Matter Agent',
        glyph: 'draft',
        does: 'Brings a fee earner up to speed on a matter in one page: what happened, where it stands, what is next.',
        from: 'The matter file and correspondence, for that matter only',
      },
      {
        name: 'Client Update Agent',
        glyph: 'schedule',
        does: 'Drafts the update from the matter record, in the form the client already receives it.',
        from: 'Matter record, prior updates to that client',
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
      'A matter is confidential to the people on it, and an information barrier is a professional obligation rather than a preference. The workspace starts there instead of arriving at it.',
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
        question: 'Does anything we put in leave the firm?',
        answer:
          'No. It stays in the systems it already lives in, reached under the permissions those systems enforce, on models IT approved and hosted in the EU.',
      },
      {
        question: 'Can it replace a lawyer’s review?',
        answer:
          'No. It narrows the contract to the points that need judgement and cites the clause for each. The lawyer decides and signs.',
      },
      {
        question: 'How does it respect an information barrier?',
        answer:
          'The same way your document system does. Access is set per matter, and an agent cannot read across a barrier its user cannot read across.',
      },
      {
        question: 'We already have a legal AI tool. Why this?',
        answer:
          'Because the rest of the firm has work too. The same governed workspace covers finance, marketing and operations, on one set of rules and one set of usage figures.',
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

import type { GlyphName } from '../icons/glyph-names';

export interface SolutionAgent {
  /** Named the way the team would name it, not after the technique behind it. */
  name: string;
  glyph: GlyphName;
  /** The job it does, in that industry's words. */
  does: string;
  /** What it is allowed to read to do it. */
  from: string;
}

export interface SolutionQuestion {
  question: string;
  answer: string;
}

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
  agentsLabel: string;
  /** Named for what this industry produces. Two pages sharing a heading means neither is targeted. */
  workTitle: string;
  workBody: string;
  agents: readonly SolutionAgent[];
  /** The confidentiality boundary this industry actually works inside. */
  wallsTitle: string;
  wallsBody: string;
  walls: readonly string[];
  figureClaimIds: readonly string[];
  questionsTitle: string;
  questions: readonly SolutionQuestion[];
  /**
   * The same approved logos as everywhere else, ordered so the ones this reader recognises lead,
   * and a line naming who the rail is being shown to.
   */
  logoIntro: string;
  logoLead: readonly string[];
  closing: string;
}

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
    agentsLabel: 'Agents on the plant floor',
    workTitle: 'An agent per document, not one assistant for the plant.',
    workBody:
      'Each one is given the document it drafts, the records it may read, and the engineer who signs it off.',
    agents: [
      {
        name: 'Supplier Quality Agent',
        glyph: 'draft',
        does: 'Drafts the 8D from the complaint, the containment already taken and how the same failure was closed out before.',
        from: 'Complaint records, past 8D and CAPA files, the supplier file',
      },
      {
        name: 'Specification Agent',
        glyph: 'number',
        does: 'Reads a customer drawing against your standard and lists only where the two differ, with the clause beside each one.',
        from: 'Customer drawings and specs, your internal standards library',
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
    walls: [
      'A customer programme is a wall. An agent working one programme cannot read another.',
      'Export-controlled drawings stay inside the group cleared to see them.',
      'Supplier pricing is visible to purchasing, not to the whole plant.',
      'Every quality document goes back to the engineer who signs it.',
    ],
    figureClaimIds: [
      'solution-manufacturing-first-draft',
      'solution-manufacturing-first-agent',
      'solution-manufacturing-teams',
    ],
    questionsTitle: 'What quality and plant IT ask first.',
    logoIntro: 'Built for quality, operations and plant IT leaders bringing AI into everyday work.',
    logoLead: ['customer-logo-mahle', 'customer-logo-bovensiepen', 'customer-logo-tmg-consultants'],
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
    agentsLabel: 'Agents on the engagement',
    workTitle: 'An agent per deliverable, not one assistant for the firm.',
    workBody:
      'Each one is given the deliverable it drafts, the engagement files it may read, and the partner who signs it off.',
    agents: [
      {
        name: 'Proposal Agent',
        glyph: 'draft',
        does: 'Drafts against the brief using your credentials, your methodology and the engagements that actually resemble this one.',
        from: 'The brief, credentials library, comparable past engagements',
      },
      {
        name: 'Synthesis Agent',
        glyph: 'ask',
        does: 'Turns a fortnight of interviews into findings, each one carrying the quote it rests on.',
        from: 'Interview transcripts and notes from this engagement only',
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
    walls: [
      'An engagement is a wall. The agent on it reads that engagement and nothing else.',
      'Credentials and methodology are firm-wide. Client material never is.',
      'What leaves for a client is reviewed by the partner whose name is on it.',
      'Anyone can see which engagements an agent was given, and when.',
    ],
    figureClaimIds: [
      'solution-consulting-first-draft',
      'solution-consulting-first-agent',
      'solution-consulting-teams',
    ],
    questionsTitle: 'What partners ask first.',
    logoIntro: 'Built for partners, knowledge and IT leaders bringing AI into everyday work.',
    logoLead: ['customer-logo-kbc', 'customer-logo-tmg-consultants', 'customer-logo-atares'],
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
    agentsLabel: 'Agents on the deal',
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
      },
      {
        name: 'Buyer Q&A Agent',
        glyph: 'legal',
        does: 'Answers buyer questions from the data room with the document cited, and routes anything it cannot answer to the person who can.',
        from: 'The data room for that process, the Q&A log so far',
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
    walls: [
      'A process is a wall. Off the deal team means no access, not reduced access.',
      'One data room per process. Nothing crosses between live mandates.',
      'Anything going to a buyer is reviewed by the MD running the process.',
      'Who read what, and when, is on the record for the file.',
    ],
    figureClaimIds: [
      'solution-manda-first-draft',
      'solution-manda-first-agent',
      'solution-manda-teams',
    ],
    questionsTitle: 'What deal teams ask first.',
    logoIntro: 'Built for deal teams and the IT and compliance leaders who support them.',
    logoLead: ['customer-logo-atares', 'customer-logo-b2venture', 'customer-logo-kbc'],
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
    agentsLabel: 'Agents across the fund',
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
      },
      {
        name: 'Portfolio Agent',
        glyph: 'number',
        does: 'Builds the quarterly pack from what the portfolio companies submitted, and flags what did not arrive.',
        from: 'Portfolio company submissions, the reporting template',
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
    walls: [
      'A deal is a wall. So is a fund. Neither leaks into the other.',
      'MNPI is reachable only by the people already cleared to hold it.',
      'Nothing goes to an LP or a committee without a partner releasing it.',
      'Access, model and sign-off are on one screen for compliance to read.',
    ],
    figureClaimIds: ['solution-pe-first-draft', 'solution-pe-first-agent', 'solution-pe-teams'],
    questionsTitle: 'What investment teams ask first.',
    logoIntro: 'Built for investment teams and the operations and IT leaders behind them.',
    logoLead: ['customer-logo-b2venture', 'customer-logo-atares', 'customer-logo-kbc'],
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
    agentsLabel: 'Agents on the matter',
    workTitle: 'An agent per task on the matter, not one assistant for the firm.',
    workBody:
      'Each one is given the task it does, the matter it may read, and the lawyer who signs off what it produces.',
    agents: [
      {
        name: 'Review Agent',
        glyph: 'legal',
        does: 'Reviews against your playbook and reports only the departures from it, with the clause beside each one.',
        from: 'The playbook, the contract, positions taken on past matters',
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
      },
    ],
    wallsTitle: 'Privilege is not a setting you add later.',
    wallsBody:
      'A matter is confidential to the people on it, and an information barrier is a professional obligation rather than a preference. The workspace starts there instead of arriving at it.',
    walls: [
      'A matter is a wall. Access follows the matter, not the person’s seniority.',
      'Information barriers hold, including for the agents working either side.',
      'Nothing reaches a client without the responsible lawyer releasing it.',
      'Privileged material never leaves the region you hold it in.',
    ],
    figureClaimIds: [
      'solution-legal-first-draft',
      'solution-legal-first-agent',
      'solution-legal-teams',
    ],
    questionsTitle: 'What partners and risk ask first.',
    logoIntro: 'Built for partners, innovation and risk leaders bringing AI into everyday work.',
    logoLead: ['customer-logo-frommer-legal', 'customer-logo-beeradvocaten', 'customer-logo-kbc'],
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

export function solutionBySlug(slug: string): Solution {
  const solution = solutions.find((candidate) => candidate.slug === slug);
  if (!solution) throw new Error(`Unknown solution slug "${slug}".`);
  return solution;
}

import type { ClaimRecord } from './types';
import { customerProofClaims } from './customer-proof-claims';

// Every entry requires explicit Zeno approval. Public TextCortex evidence remains research
// context and must never be inserted here by default. The customer-logo records below reflect
// the workspace owner's direct instruction on 2026-08-27 to use the supplied SVG assets.
export const claimRegistry: readonly ClaimRecord[] = [
  {
    id: 'customer-logo-frommer-legal',
    statement: 'Frommer Legal may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/frommer-legal.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos', 'solutions.legal'],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-kbc',
    statement: 'KBC may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/kbc.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: [
      'home.customer-logos',
      'solutions.customer-logos',
      'solutions.management-consulting',
    ],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-mahle',
    statement: 'MAHLE may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/mahle.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: [
      'home.customer-logos',
      'solutions.customer-logos',
      'solutions.manufacturing',
    ],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-b2venture',
    statement: 'b2venture may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/b2venture.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: [
      'home.customer-logos',
      'solutions.customer-logos',
      'solutions.private-equity',
    ],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-atares',
    statement: 'atares may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/atares.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos', 'solutions.m-and-a'],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-beeradvocaten',
    statement: 'beeradvocaten may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/beeradvocaten.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-bovensiepen',
    statement: 'Bovensiepen may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/bovensiepen.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  {
    id: 'customer-logo-tmg-consultants',
    statement: 'TMG Consultants may appear in the Zeno customer logo rail.',
    category: 'customer',
    evidence: 'Team-supplied SVG: public/customer-logos/tmg-consultants.svg',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
  },
  ...customerProofClaims,
  {
    id: 'product-agent-starting-point',
    statement: 'Start from a prebuilt agent or build one from scratch around your workflow.',
    category: 'product',
    evidence:
      'Capability and public wording approved by the workspace owner in the 2026-09-08 working session.',
    verified_on: '2026-09-08',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-08',
    allowed_surfaces: [
      'product.agents',
      'product.hero',
      'solutions.manufacturing',
      'solutions.management-consulting',
      'solutions.m-and-a',
      'solutions.private-equity',
      'solutions.legal',
    ],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-08',
    notes:
      'Approval covers the compact product-page and solution-page starting-point treatments. Do not imply instant deployment or no configuration.',
  },
  {
    id: 'home-agent-starting-point',
    statement: 'Start with a prebuilt agent or build your own.',
    category: 'product',
    evidence:
      'Capability and concise homepage wording approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['home.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'The prebuilt path is a starting point, not an instant or configuration-free deployment.',
  },
  {
    id: 'home-supported-agent-starting-path',
    statement:
      'Start with a prebuilt agent or shape your own. We ground it in your company context and stay through adoption.',
    category: 'product',
    evidence:
      'Starting-path capability and public wording approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['home.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'The starting point can vary, but Zeno remains involved in grounding the agent and supporting adoption. Do not describe Zeno as optional or imply configuration-free deployment.',
  },
  {
    id: 'product-page-metadata',
    statement:
      'Explore an enterprise AI platform for company context, major AI models with EU hosting, prebuilt and custom agents, chat, connected knowledge, and visual workflows.',
    category: 'product',
    evidence:
      'Capability scope and public wording approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.metadata'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Metadata may name only the approved core product surfaces. Do not add detailed flow nodes or connector operations without another review.',
  },
  {
    id: 'product-enterprise-hero-title',
    statement: 'Enterprise AI, grounded in your company.',
    category: 'product',
    evidence:
      'Positioning and public wording approved by the workspace owner in the 2026-09-09 product hero direction.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Keep the title grounded in the company context. Do not broaden it into a performance or outcome promise.',
  },
  {
    id: 'product-enterprise-platform-summary',
    statement:
      'Connect your company context to agents that get work done in one governed workspace.',
    category: 'product',
    evidence:
      'Platform narrative and public wording approved by the workspace owner in the 2026-09-09 product hero direction.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'The overview may connect company context, agents, and work in one composition. It must not promise autonomous completion without human controls.',
  },
  {
    id: 'product-major-models-eu-hosting',
    statement: 'Access major AI models with EU hosting in one place.',
    category: 'product',
    evidence:
      'Model access and hosting wording approved by the workspace owner in the 2026-09-09 product hero and governance directions.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: [
      'product.hero',
      'product.governance',
      'solutions.manufacturing',
      'solutions.management-consulting',
      'solutions.m-and-a',
      'solutions.private-equity',
      'solutions.legal',
    ],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Keep this as a concise access and hosting statement in the product hero or governed-workspace analytics visual. Do not name providers, make residency guarantees, or imply every model has identical hosting behavior.',
  },
  {
    id: 'product-governed-workspace-scale',
    statement:
      'Keep knowledge access, model choice, human checkpoints, and adoption visibility together as usage scales.',
    category: 'product',
    evidence:
      'Governed workspace and enterprise-scale control wording approved by the workspace owner in the 2026-09-09 product hero direction.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'This is an administration and visibility statement, not a certification, compliance guarantee, or automatic governance claim.',
  },
  {
    id: 'product-platform-journey',
    statement:
      'Start in chat. Ground the work in connected company knowledge. When the task becomes repeatable, move it into a visual workflow.',
    category: 'product',
    evidence:
      'Capability scope and public wording approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'This is a product narrative, not a requirement that every task must move through all three surfaces.',
  },
  {
    id: 'product-chat-workspace',
    statement:
      'Use chat for everyday questions, drafting, and agent-led tasks with the relevant company knowledge attached.',
    category: 'product',
    evidence:
      'Capability approved by the workspace owner in the 2026-09-09 working session. The TextCortex enterprise agent handbook was reviewed as non-transferable research context.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.chat'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Keep the public treatment at the approved core capability level. The mockup is illustrative and must not imply unsupported autonomous actions.',
  },
  {
    id: 'product-chat-workspace-caption',
    statement:
      'A finance agent prepares a monthly review in chat from the company context selected for the task.',
    category: 'product',
    evidence:
      'Illustrative product narrative approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.chat'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'This sentence describes the illustrative finance example. It is not a customer result or a promise that work completes without review.',
  },
  {
    id: 'product-connected-knowledge',
    statement:
      'Create knowledge bases for the work that matters, then connect them to existing systems through MCP connectors.',
    category: 'product',
    evidence:
      'Capability approved by the workspace owner in the 2026-09-09 working session. https://help.textcortex.com/hc/en-us/articles/45958548687633-MCP-Connectors was reviewed as non-transferable research context.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.knowledge'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Do not add scheduling, connector write actions, permission behavior, or provider-specific guarantees in this treatment.',
  },
  {
    id: 'product-connected-knowledge-caption',
    statement:
      'Existing systems connect to a finance knowledge base that can support chat, agents, and workflows.',
    category: 'product',
    evidence:
      'Illustrative product narrative approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.knowledge'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'This sentence links the approved core surfaces only. It does not authorize additional connector operations or provider guarantees.',
  },
  {
    id: 'product-node-workflows',
    statement: 'Build more complex flows with a node-based workflow builder.',
    category: 'product',
    evidence:
      'Capability approved by the workspace owner in the 2026-09-09 working session. https://help.textcortex.com/hc/en-us/articles/44626483776529-Introduction-to-TextCortex-Flows was reviewed as non-transferable research context.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.workflows'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'The visual may show a simple linear example. Do not publish conditions, loops, API steps, or scheduling in this pass.',
  },
  {
    id: 'product-node-workflows-caption',
    statement:
      'A monthly reporting workflow connects an input, company knowledge, an agent, a review point, and an output.',
    category: 'product',
    evidence:
      'Illustrative product narrative approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.workflows'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'The approved example is a linear workflow with one human review point. Do not infer branching, scheduling, or unsupported node types.',
  },
  {
    id: 'product-prebuilt-agent-examples',
    statement:
      'Prebuilt starting points include Presentation Agent, Finance Agent, and Legal Agent.',
    category: 'product',
    evidence:
      'Capability examples approved by the workspace owner across the 2026-09-08 and 2026-09-09 working sessions.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.agents', 'product.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Present these as starting points, not as instant or configuration-free deployments. Keep Custom build visually available beside them.',
  },
  {
    id: 'product-governance-controls',
    statement:
      'Keep knowledge access, model choice, human checkpoints, and adoption visibility in one place.',
    category: 'product',
    evidence:
      'Existing product-page governance scope retained and wording approved by the workspace owner in the 2026-09-09 working session.',
    verified_on: '2026-09-09',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-09',
    allowed_surfaces: ['product.governance'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Keep this as one concise cross-platform control layer. Do not expand it into certification, compliance, or security guarantees.',
  },
  {
    id: 'solution-workspace-manufacturing',
    statement:
      'Customer drawings and internal standards provide context for a Specification Agent that prepares a cited comparison for engineering review.',
    category: 'product',
    evidence:
      'Industry workspace narrative approved by the workspace owner in the 2026-09-10 solution-page direction.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['solutions.manufacturing'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain engineering review.',
  },
  {
    id: 'solution-workspace-management-consulting',
    statement:
      'A client brief, firm credentials, and comparable engagements provide context for a Proposal Agent that prepares a partner-ready outline.',
    category: 'product',
    evidence:
      'Industry workspace narrative approved by the workspace owner in the 2026-09-10 solution-page direction.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['solutions.management-consulting'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain partner review.',
  },
  {
    id: 'solution-workspace-m-and-a',
    statement:
      'Mandate criteria, deal history, and licensed market sources provide context for a Longlist Agent that prepares a qualified target list for adviser review.',
    category: 'product',
    evidence:
      'Industry workspace narrative approved by the workspace owner in the 2026-09-10 solution-page direction.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['solutions.m-and-a'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain adviser review.',
  },
  {
    id: 'solution-workspace-private-equity',
    statement:
      'A pitch deck, diligence files, and the fund mandate provide context for an IC Memo Agent that prepares a reviewable draft with open questions marked.',
    category: 'product',
    evidence:
      'Industry workspace narrative approved by the workspace owner in the 2026-09-10 solution-page direction.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['solutions.private-equity'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain deal-partner review.',
  },
  {
    id: 'solution-workspace-legal',
    statement:
      'A firm playbook, supplier agreement, and precedent bank provide context for a Review Agent that prepares a clause-level comparison for lawyer review.',
    category: 'product',
    evidence:
      'Industry workspace narrative approved by the workspace owner in the 2026-09-10 solution-page direction.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['solutions.legal'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain lawyer review.',
  },
  {
    id: 'certification-iso-27001',
    statement: 'Information security management certified against ISO 27001.',
    category: 'certification',
    evidence:
      'Certification listed in the live TrustCloud compliance feed at https://trust.textcortex.com/home; reviewed 2026-08-27.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.trust'],
    attribution: 'Held by Text Cortex AI, the operating company behind Zeno.',
    reverify_on: '2027-02-27',
    public_url: 'https://trust.textcortex.com/home',
    notes:
      'Certificate scope and report access are granted through the trust center, not this page. Counsel must confirm the operating-entity attribution before the production release.',
  },
  {
    id: 'certification-soc-2-type-1',
    statement: 'Independently audited SOC 2 Type I report on control design.',
    category: 'certification',
    evidence:
      'Certification listed in the live TrustCloud compliance feed at https://trust.textcortex.com/home; reviewed 2026-08-27.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.trust'],
    attribution: 'Held by Text Cortex AI, the operating company behind Zeno.',
    reverify_on: '2027-02-27',
    public_url: 'https://trust.textcortex.com/home',
    notes:
      'Report access is granted through the trust center, not this page. Counsel must confirm the operating-entity attribution before the production release.',
  },
  {
    id: 'certification-soc-2-type-2',
    statement: 'Independently audited SOC 2 Type II report on operating effectiveness.',
    category: 'certification',
    evidence:
      'Certification listed in the live TrustCloud compliance feed at https://trust.textcortex.com/home; reviewed 2026-08-27.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.trust'],
    attribution: 'Held by Text Cortex AI, the operating company behind Zeno.',
    reverify_on: '2027-02-27',
    public_url: 'https://trust.textcortex.com/home',
    notes:
      'Report access is granted through the trust center, not this page. Counsel must confirm the operating-entity attribution before the production release.',
  },
  {
    id: 'deployment-single-tenant',
    statement: 'Available on dedicated single-tenant infrastructure.',
    category: 'security',
    evidence:
      'Confirmed by the workspace owner on 2026-09-06 as a deployment model available today. The other models a European buyer commonly asks for, running in the customer\u2019s own cloud and on-premise, were explicitly not confirmed and must not be implied.',
    verified_on: '2026-09-06',
    approval_status: 'approved',
    approved_by: 'Baris \u2014 working-session direction',
    approved_on: '2026-09-06',
    allowed_surfaces: ['home.trust'],
    attribution: 'offered alongside the shared deployment, not in place of it',
    reverify_on: '2027-03-06',
    notes:
      'States availability, not the default, and the attribution carries that. Do not extend to bring-your-own-cloud or on-premise, and do not turn it into a guarantee of isolation without the architecture evidence behind it.',
  },
  {
    id: 'metric-efficiency-time-savings',
    statement: '3–10% efficiency / time savings after a year.',
    category: 'metric',
    evidence:
      'Figures supplied by the workspace owner on 2026-08-27 as measured results from enterprise consultancy accounts. The account list, measurement method, observation window, and sample are held outside this repository.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.business-case'],
    attribution: 'across enterprise consultancy accounts',
    reverify_on: '2027-02-27',
    notes:
      'The range and the "after a year" period are material qualifiers and must not be narrowed to a single figure or a shorter period. Per-account source data, measurement method, and customer permission to publish must be attached before the production release.',
  },
  {
    id: 'metric-monthly-interactions',
    statement: '~200 monthly interactions per user.',
    category: 'metric',
    evidence:
      'Figure supplied by the workspace owner on 2026-08-27 as an observed average across full enterprise rollouts. The underlying usage export and the population it covers are held outside this repository.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.business-case'],
    attribution: 'on full enterprise rollouts',
    reverify_on: '2027-02-27',
    notes:
      'The approximation marker and the "full enterprise rollouts" population are material qualifiers. Do not present as an exact figure or extend to pilots or partial rollouts. The usage export and its date range must be attached before the production release.',
  },
  {
    id: 'metric-weekly-active-usage',
    statement: '+65% weekly active usage.',
    category: 'metric',
    evidence:
      'Figure supplied by the workspace owner on 2026-08-27 as observed growth in weekly active usage after launch. The baseline, comparison period, and population are held outside this repository.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.business-case'],
    attribution: 'usage growing after launch, not fading',
    reverify_on: '2027-02-27',
    notes:
      'This is a relative change and requires its baseline and comparison period before the production release. Do not restate as an absolute activation or adoption rate.',
  },
  {
    id: 'metric-projected-annual-savings',
    statement: '~€7–8M projected annual savings.',
    category: 'metric',
    evidence:
      'Output of an internal enterprise savings model for approximately 2,200 users, supplied by the workspace owner on 2026-08-27. The model inputs and assumptions are held outside this repository.',
    verified_on: '2026-08-27',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-08-27',
    allowed_surfaces: ['home.business-case'],
    attribution: 'internal enterprise savings model, ~2,200 users',
    reverify_on: '2027-02-27',
    notes:
      'This is a projection from an internal model, not a realised or audited customer result. The words "projected", "internal enterprise savings model", the ~2,200-user population, and the range are all material qualifiers and must stay attached wherever the figure appears. The model and its assumptions must be reviewed before the production release.',
  },
  {
    id: 'customer-quote-strategy-consultancy',
    statement: "Today it's already one of our core operational tools that runs our business.",
    category: 'customer',
    evidence:
      'Verbatim excerpt from a customer statement supplied by the workspace owner on 2026-09-02. Full original: "We underestimated what big operational impact, but also dependency, TextCortex would create after just six months. Today it\'s already one of our core operational tools that runs our business." The published sentence is unedited; only the preceding sentence was dropped.',
    verified_on: '2026-09-02',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-02',
    allowed_surfaces: ['home.testimonials'],
    attribution: 'Partner, strategy consultancy',
    reverify_on: '2027-03-02',
    notes:
      'Published as an excerpt, never a paraphrase: the sentence is verbatim and the brand name was not substituted. The speaker is unnamed by choice; naming them, or quoting the dropped sentence, needs their own written permission. The original names Text Cortex rather than Zeno, the same operating-entity question the certification records carry.',
  },
];

export const homepageProofClaimIds: readonly string[] = [];

export const homepageHeroCapabilityClaimIds: readonly string[] = [
  'home-agent-starting-point',
  'home-supported-agent-starting-path',
];

export const homepageTestimonialClaimIds: readonly string[] = [
  'customer-voice-global-energy-enterprise',
  'customer-quote-strategy-consultancy',
];

export const homepageCustomerProofVoiceClaimIds: readonly string[] = [
  'customer-voice-atares',
  'customer-voice-mahle',
  'customer-voice-frommer-legal',
];

export const homepageBusinessCaseClaimIds: readonly string[] = [
  'metric-efficiency-time-savings',
  'metric-monthly-interactions',
  'metric-weekly-active-usage',
  'metric-projected-annual-savings',
];

/** The one deployment fact confirmed for publication. Resolved on its own surface, like the rest. */
export const homepageDeploymentClaimIds: readonly string[] = ['deployment-single-tenant'];

export const homepageCertificationClaimIds: readonly string[] = [
  'certification-iso-27001',
  'certification-soc-2-type-1',
  'certification-soc-2-type-2',
];

/**
 * Public destination for anyone who wants to verify the certifications themselves. Kept beside
 * the records it belongs to so a link change and a claim change stay in one review.
 */
export const trustCenterUrl = 'https://trust.textcortex.com/home';

export const homepageCustomerLogoClaimIds: readonly string[] = [
  'customer-logo-frommer-legal',
  'customer-logo-kbc',
  'customer-logo-mahle',
  'customer-logo-b2venture',
  'customer-logo-atares',
  'customer-logo-beeradvocaten',
  'customer-logo-bovensiepen',
  'customer-logo-tmg-consultants',
];

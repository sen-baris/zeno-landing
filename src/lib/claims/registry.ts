import type { ClaimRecord } from './types';
import { customerProofClaims } from './customer-proof-claims';

export const appLoginClaimId = 'navigation-app-sign-in';

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
    id: appLoginClaimId,
    statement: 'Sign in',
    category: 'product',
    evidence:
      'Current TextCortex application destination approved by the workspace owner in the 2026-09-14 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['navigation.sign-in'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      'Open the current application login in the same browser tab. Do not describe this destination as a Zeno-owned application until the brand transition is complete.',
    public_url: 'https://app.textcortex.com/user/login',
  },
  {
    id: 'pricing-page-metadata',
    statement:
      'Estimate the yearly value of recovered time for one workflow. Then scope a custom enterprise rollout with Zeno.',
    category: 'product',
    evidence:
      'Business-case scope approved on 2026-09-14. Shorter metadata wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['pricing.metadata'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      'The page is enterprise-first. Do not publish a price or imply a self-serve checkout exists.',
  },
  {
    id: 'pricing-enterprise-title',
    statement: 'What could one workflow give back?',
    category: 'product',
    evidence:
      'ROI-led business-case framing approved by the workspace owner in the 2026-09-14 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['pricing.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes: 'Do not add a public enterprise price without a separate commercial approval.',
  },
  {
    id: 'pricing-enterprise-summary',
    statement:
      'Enter your own time assumptions. See the estimated yearly value and use it to scope an enterprise rollout.',
    category: 'product',
    evidence:
      'Business-case framing approved on 2026-09-14. Shorter public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['pricing.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      'This describes the scoping conversation. It is not a fixed pricing formula or a service-level commitment.',
  },
  {
    id: 'pricing-enterprise-offer',
    statement: 'Custom enterprise pricing',
    category: 'product',
    evidence:
      'Custom enterprise pricing treatment approved by the workspace owner in the 2026-09-10 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['pricing.enterprise'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes: 'Do not attach a public amount or billing cadence to this label.',
  },
  {
    id: 'pricing-enterprise-close-title',
    statement: 'Pricing follows the rollout.',
    category: 'product',
    evidence:
      'Compact enterprise scoping close approved by the workspace owner in the 2026-09-14 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['pricing.enterprise'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes: 'Do not imply a fixed formula, published price, or self-serve checkout.',
  },
  {
    id: 'pricing-enterprise-close-summary',
    statement:
      'Scope the platform around your teams and workflows. Add connected systems and controls as needed.',
    category: 'product',
    evidence:
      'Enterprise scoping approved on 2026-09-14. Shorter public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['pricing.enterprise'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes: 'This describes proposal scoping, not a fixed pricing formula.',
  },
  {
    id: 'demo-meeting-preparation',
    statement:
      'Tell us what you want to improve. We will prepare a conversation about your team, systems and controls.',
    category: 'product',
    evidence:
      'Demo preparation scope approved on 2026-09-14. Shorter public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['demo.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      'This promises preparation for a conversation, not acceptance or a specific response time.',
  },
  {
    id: 'demo-response-data-use',
    statement: 'I agree that Zeno may use these details to respond to my request.',
    category: 'privacy',
    evidence:
      'Demo data-use acknowledgement approved by the workspace owner in the 2026-09-14 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['demo.form'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      'Keep required and adjacent to the submission control. Do not reuse as marketing consent.',
  },
  {
    id: 'pricing-calculator-title',
    statement: 'Build the estimate in three steps.',
    category: 'product',
    evidence:
      'Visitor-driven business-case calculator approved by the workspace owner in the 2026-09-10 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['pricing.calculator'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes: 'The calculator must use only visitor-supplied performance assumptions.',
  },
  {
    id: 'pricing-calculator-method',
    statement:
      'Choose a team range or exact number. Enter weekly hours returned and the value of one hour. Ranges use the rounded midpoint shown. Add an annual budget only if you want to compare it with the estimated yearly value of recovered time.',
    category: 'product',
    evidence:
      'Calculation method approved on 2026-09-10. Plain-language wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['pricing.calculator'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      'Do not preselect a team-size range, weekly hours, hourly value, annual budget, or other performance assumptions. ROI is annual capacity value minus annual budget, divided by annual budget.',
  },
  {
    id: 'pricing-calculator-pilot',
    statement: 'A focused pilot gives you a value to validate before a wider rollout.',
    category: 'product',
    evidence:
      'Pilot-led business-case direction approved by the workspace owner in the 2026-09-14 working session.',
    verified_on: '2026-09-14',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-14',
    allowed_surfaces: ['pricing.calculator'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-14',
    notes:
      "Recommend 20 percent of the entered team, rounded to the nearest person, with a five-person floor, 20-person cap, and no cohort larger than the entered team. Calculate annual pilot hours and capacity value only from the visitor's entered weekly hours, hourly value, and working weeks. Present the result as an estimate to validate, never as guaranteed return or savings.",
  },
  {
    id: 'pricing-calculator-disclaimer',
    statement:
      'Estimates are for planning only and are based entirely on the values you enter. They do not guarantee time savings, financial benefit, or final Zeno pricing.',
    category: 'legal',
    evidence:
      'Estimate boundaries and public wording approved by the workspace owner in the 2026-09-10 working session.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['pricing.calculator'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'Keep this adjacent to calculator results. Do not shorten it into a performance guarantee.',
  },
  {
    id: 'pricing-calculator-local-data',
    statement: 'Nothing entered here is sent or saved.',
    category: 'privacy',
    evidence:
      'Local-only calculator behavior approved by the workspace owner in the 2026-09-10 working session and enforced by the component implementation.',
    verified_on: '2026-09-10',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-10',
    allowed_surfaces: ['pricing.calculator'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'Do not add storage, analytics, network submission, or URL serialization for calculator values without reapproval.',
  },
  {
    id: 'product-agent-starting-point',
    statement: 'Choose a prebuilt agent or build one around your workflow.',
    category: 'product',
    evidence:
      'Capability approved by the workspace owner on 2026-09-08. Shorter public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
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
      'Choose a prebuilt agent or shape your own. We ground it in your company context and stay through adoption.',
    category: 'product',
    evidence:
      'Starting-path capability approved on 2026-09-09. Exact revised public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['home.hero'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'The starting point can vary, but Zeno remains involved in grounding the agent and supporting adoption. Do not describe Zeno as optional or imply configuration-free deployment.',
  },
  {
    id: 'product-page-metadata',
    statement:
      'Explore Chat, connected knowledge and visual workflows in a governed enterprise AI platform. Use prebuilt or custom agents and access major AI models with EU hosting.',
    category: 'product',
    evidence:
      'Capability scope approved on 2026-09-09. Revised metadata wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
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
      'Manage knowledge access and model choice as usage scales. Keep human checkpoints and adoption visible.',
    category: 'product',
    evidence:
      'Governance scope approved on 2026-09-09. Shorter public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
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
      'Use chat for questions and drafting. Bring in agents with relevant company knowledge.',
    category: 'product',
    evidence:
      'Capability approved on 2026-09-09. Shorter public wording approved in the 2026-09-15 sitewide copy direction. The TextCortex enterprise agent handbook was non-transferable research context.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
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
    statement: 'Connect existing systems to knowledge bases through MCP connectors.',
    category: 'product',
    evidence:
      'Capability approved on 2026-09-09. Shorter public wording approved in the 2026-09-15 sitewide copy direction. https://help.textcortex.com/hc/en-us/articles/45958548687633-MCP-Connectors was non-transferable research context.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
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
      'Manage knowledge access and model choice in one place. Keep human checkpoints and adoption visible.',
    category: 'product',
    evidence:
      'Governance scope approved on 2026-09-09. Shorter public wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, working-session direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['product.governance'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-09',
    notes:
      'Keep this as one concise cross-platform control layer. Do not expand it into certification, compliance, or security guarantees.',
  },
  {
    id: 'solution-workspace-manufacturing',
    statement:
      'The Specification Agent compares customer drawings with internal standards. It cites each finding for engineering review.',
    category: 'product',
    evidence:
      'Industry workspace approved on 2026-09-10. Revised wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['solutions.manufacturing'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain engineering review.',
  },
  {
    id: 'solution-workspace-management-consulting',
    statement:
      'The Proposal Agent drafts from a client brief and relevant firm experience. A partner reviews the outline.',
    category: 'product',
    evidence:
      'Industry workspace approved on 2026-09-10. Revised wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['solutions.management-consulting'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain partner review.',
  },
  {
    id: 'solution-workspace-m-and-a',
    statement:
      'The Longlist Agent screens licensed market sources against the mandate. Advisers review the target list and its fit notes.',
    category: 'product',
    evidence:
      'Industry workspace approved on 2026-09-10. Revised wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['solutions.m-and-a'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain adviser review.',
  },
  {
    id: 'solution-workspace-private-equity',
    statement:
      'The IC Memo Agent drafts from the pitch deck, fund mandate and diligence. A deal partner reviews open questions.',
    category: 'product',
    evidence:
      'Industry workspace approved on 2026-09-10. Revised wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-15',
    allowed_surfaces: ['solutions.private-equity'],
    attribution: 'No public attribution required.',
    reverify_on: '2027-03-10',
    notes:
      'This is a synthetic product example. It is not a customer result and must retain deal-partner review.',
  },
  {
    id: 'solution-workspace-legal',
    statement:
      'The Review Agent compares a supplier agreement with the firm playbook. A lawyer reviews each cited departure.',
    category: 'product',
    evidence:
      'Industry workspace approved on 2026-09-10. Revised wording approved in the 2026-09-15 sitewide copy direction.',
    verified_on: '2026-09-15',
    approval_status: 'approved',
    approved_by: 'Baris, solution-page direction',
    approved_on: '2026-09-15',
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

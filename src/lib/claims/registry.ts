import type { ClaimRecord } from './types';

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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos'],
    attribution: 'Logo supplied by the Zeno team.',
    reverify_on: '2027-02-27',
    notes: 'Logo placement only; no outcome, testimonial, or metric is implied.',
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
];

export const homepageProofClaimIds: readonly string[] = [];

export const homepageBusinessCaseClaimIds: readonly string[] = [
  'metric-efficiency-time-savings',
  'metric-monthly-interactions',
  'metric-weekly-active-usage',
  'metric-projected-annual-savings',
];

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

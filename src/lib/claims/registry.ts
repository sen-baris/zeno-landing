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
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
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
    allowed_surfaces: ['home.customer-logos', 'solutions.customer-logos'],
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
  {
    id: 'solution-manufacturing-first-draft',
    statement: '40–60% less time on a first-draft 8D report.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the manufacturing solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.manufacturing'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once manufacturing results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-manufacturing-first-agent',
    statement: '4–8 weeks from first workshop to one agent in daily use.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the manufacturing solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.manufacturing'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once manufacturing results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-manufacturing-teams',
    statement: '2–4 document types worth automating in the first year.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the manufacturing solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.manufacturing'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once manufacturing results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-consulting-first-draft',
    statement: '40–60% less time on a first-draft proposal.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the management consulting solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.management-consulting'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once management consulting results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-consulting-first-agent',
    statement: '4–8 weeks from first workshop to one agent in daily use.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the management consulting solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.management-consulting'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once management consulting results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-consulting-teams',
    statement: '2–4 deliverable types worth automating in the first year.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the management consulting solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.management-consulting'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once management consulting results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-manda-first-draft',
    statement: '40–60% less time on a first-draft information memorandum.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the m&a advisory solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.m-and-a'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once m&a advisory results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-manda-first-agent',
    statement: '4–8 weeks from first workshop to one agent on a live process.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the m&a advisory solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.m-and-a'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once m&a advisory results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-manda-teams',
    statement: '2–4 process documents worth automating in the first year.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the m&a advisory solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.m-and-a'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once m&a advisory results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-pe-first-draft',
    statement: '40–60% less time on a first-draft investment committee memo.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the private equity solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.private-equity'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once private equity results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-pe-first-agent',
    statement: '4–8 weeks from first workshop to one agent in daily use.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the private equity solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.private-equity'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once private equity results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-pe-teams',
    statement: '2–4 reporting cycles worth automating in the first year.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the private equity solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.private-equity'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once private equity results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-legal-first-draft',
    statement: '40–60% less time on a first-pass contract review.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the legal solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.legal'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once legal results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-legal-first-agent',
    statement: '4–8 weeks from first workshop to one agent in daily use.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the legal solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.legal'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once legal results exist and the customer has agreed to publication.',
  },
  {
    id: 'solution-legal-teams',
    statement: '2–4 matter types worth automating in the first year.',
    category: 'metric',
    evidence:
      'Planning range set by the workspace owner on 2026-09-03 for the legal solutions page. It is what a team should budget for, not a measured Zeno result, and no customer produced it.',
    verified_on: '2026-09-03',
    approval_status: 'approved',
    approved_by: 'Baris — working-session direction',
    approved_on: '2026-09-03',
    allowed_surfaces: ['solutions.legal'],
    attribution: 'a range to plan for, not a measured result',
    reverify_on: '2027-03-03',
    notes:
      'The qualifier must stay visible beneath the figure, and the range must not be narrowed to a single number. Replace with measured figures once legal results exist and the customer has agreed to publication.',
  },
];

export const homepageProofClaimIds: readonly string[] = [];

export const homepageTestimonialClaimIds: readonly string[] = [
  'customer-quote-strategy-consultancy',
];

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

export const manufacturingFigureClaimIds: readonly string[] = [
  'solution-manufacturing-first-draft',
  'solution-manufacturing-first-agent',
  'solution-manufacturing-teams',
];

export const consultingFigureClaimIds: readonly string[] = [
  'solution-consulting-first-draft',
  'solution-consulting-first-agent',
  'solution-consulting-teams',
];

export const mandaFigureClaimIds: readonly string[] = [
  'solution-manda-first-draft',
  'solution-manda-first-agent',
  'solution-manda-teams',
];

export const peFigureClaimIds: readonly string[] = [
  'solution-pe-first-draft',
  'solution-pe-first-agent',
  'solution-pe-teams',
];

export const legalFigureClaimIds: readonly string[] = [
  'solution-legal-first-draft',
  'solution-legal-first-agent',
  'solution-legal-teams',
];

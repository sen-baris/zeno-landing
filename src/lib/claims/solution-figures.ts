import type { BusinessCaseAsset } from './business-case-assets';

/**
 * Display values for the solutions-page figures, in the same shape the business case uses, so
 * BusinessCase.astro renders them and enforces the same contract: the value and label below must
 * appear verbatim in the approved claim statement, and the claim's attribution is published
 * beneath the number as its qualifier.
 */
export const solutionFigureAssets: readonly BusinessCaseAsset[] = [
  {
    claimId: 'solution-manufacturing-first-draft',
    value: '40–60%',
    label: 'less time on a first-draft 8D report',
  },
  {
    claimId: 'solution-manufacturing-first-agent',
    value: '4–8 weeks',
    label: 'from first workshop to one agent in daily use',
  },
  {
    claimId: 'solution-manufacturing-teams',
    value: '2–4',
    label: 'document types worth automating in the first year',
  },
  {
    claimId: 'solution-consulting-first-draft',
    value: '40–60%',
    label: 'less time on a first-draft proposal',
  },
  {
    claimId: 'solution-consulting-first-agent',
    value: '4–8 weeks',
    label: 'from first workshop to one agent in daily use',
  },
  {
    claimId: 'solution-consulting-teams',
    value: '2–4',
    label: 'deliverable types worth automating in the first year',
  },
  {
    claimId: 'solution-manda-first-draft',
    value: '40–60%',
    label: 'less time on a first-draft information memorandum',
  },
  {
    claimId: 'solution-manda-first-agent',
    value: '4–8 weeks',
    label: 'from first workshop to one agent on a live process',
  },
  {
    claimId: 'solution-manda-teams',
    value: '2–4',
    label: 'process documents worth automating in the first year',
  },
  {
    claimId: 'solution-pe-first-draft',
    value: '40–60%',
    label: 'less time on a first-draft investment committee memo',
  },
  {
    claimId: 'solution-pe-first-agent',
    value: '4–8 weeks',
    label: 'from first workshop to one agent in daily use',
  },
  {
    claimId: 'solution-pe-teams',
    value: '2–4',
    label: 'reporting cycles worth automating in the first year',
  },
  {
    claimId: 'solution-legal-first-draft',
    value: '40–60%',
    label: 'less time on a first-pass contract review',
  },
  {
    claimId: 'solution-legal-first-agent',
    value: '4–8 weeks',
    label: 'from first workshop to one agent in daily use',
  },
  {
    claimId: 'solution-legal-teams',
    value: '2–4',
    label: 'matter types worth automating in the first year',
  },
];

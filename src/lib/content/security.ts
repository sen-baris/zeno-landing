export type SecurityAssuranceKind = 'certification' | 'attestation' | 'privacy';

export interface SecurityAssurance {
  claimId: string;
  kind: SecurityAssuranceKind;
  label: string;
}

export interface SecurityControl {
  claimId: string;
  id: 'knowledge-access' | 'model-choice' | 'human-review' | 'eu-hosting';
  label: string;
}

export interface SecurityEvidenceItem {
  label: string;
  url: string;
}

export interface SecurityFaq {
  claimIds: readonly string[];
  question: string;
}

export interface SecurityPageContent {
  assurances: readonly SecurityAssurance[];
  controls: readonly SecurityControl[];
  controlsSummaryClaimId: string;
  conversion: {
    description: string;
    eyebrow: string;
    title: string;
  };
  deploymentClaimId: string;
  evidence: {
    claimId: string;
    items: readonly SecurityEvidenceItem[];
    url: string;
  };
  faqs: readonly SecurityFaq[];
  hero: {
    claimId: string;
    eyebrow: string;
    title: string;
  };
  metadata: {
    claimId: string;
    title: string;
  };
}

export const securityPageContent: SecurityPageContent = {
  metadata: {
    title: 'Security and compliance | Zeno',
    claimId: 'security-page-metadata',
  },
  hero: {
    eyebrow: 'Security',
    title: 'Scale AI without giving up control.',
    claimId: 'security-page-hero',
  },
  assurances: [
    {
      label: 'ISO 27001',
      kind: 'certification',
      claimId: 'certification-iso-27001',
    },
    {
      label: 'SOC 2 Type I',
      kind: 'attestation',
      claimId: 'certification-soc-2-type-1',
    },
    {
      label: 'SOC 2 Type II',
      kind: 'attestation',
      claimId: 'certification-soc-2-type-2',
    },
    {
      label: 'GDPR',
      kind: 'privacy',
      claimId: 'security-gdpr-data-protection',
    },
  ],
  controlsSummaryClaimId: 'product-governance-controls',
  controls: [
    {
      id: 'knowledge-access',
      label: 'Knowledge access',
      claimId: 'security-control-knowledge-access',
    },
    {
      id: 'model-choice',
      label: 'Model choice',
      claimId: 'security-control-model-choice',
    },
    {
      id: 'human-review',
      label: 'Human checkpoints',
      claimId: 'security-control-human-review',
    },
    {
      id: 'eu-hosting',
      label: 'EU hosting',
      claimId: 'product-major-models-eu-hosting',
    },
  ],
  deploymentClaimId: 'deployment-single-tenant',
  evidence: {
    claimId: 'security-trust-center-directory',
    url: 'https://trust.textcortex.com/home',
    items: [
      { label: 'Certifications', url: 'https://trust.textcortex.com/home' },
      { label: 'Security and privacy policies', url: 'https://trust.textcortex.com/policies' },
      { label: 'Monitored controls', url: 'https://trust.textcortex.com/controls' },
      { label: 'Documents and reports', url: 'https://trust.textcortex.com/documents' },
      { label: 'Subprocessors', url: 'https://trust.textcortex.com/subprocessors' },
    ],
  },
  faqs: [
    {
      question: 'Which independent assurance is available?',
      claimIds: [
        'certification-iso-27001',
        'certification-soc-2-type-1',
        'certification-soc-2-type-2',
      ],
    },
    {
      question: 'How is GDPR addressed?',
      claimIds: ['security-gdpr-data-protection'],
    },
    {
      question: 'What can IT control inside the workspace?',
      claimIds: ['product-governance-controls', 'product-major-models-eu-hosting'],
    },
    {
      question: 'Is dedicated infrastructure available?',
      claimIds: ['deployment-single-tenant'],
    },
    {
      question: 'Where can security reports be reviewed?',
      claimIds: ['security-trust-center-directory'],
    },
  ],
  conversion: {
    eyebrow: 'Review your requirements',
    title: 'Bring your security questions.',
    description: 'We will map your access, hosting and review requirements to the workspace.',
  },
};

export const securityPageClaimIds = [
  securityPageContent.metadata.claimId,
  securityPageContent.hero.claimId,
  ...securityPageContent.assurances.map((assurance) => assurance.claimId),
  securityPageContent.controlsSummaryClaimId,
  ...securityPageContent.controls.map((control) => control.claimId),
  securityPageContent.deploymentClaimId,
  securityPageContent.evidence.claimId,
] as const;

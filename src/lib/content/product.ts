export type ProductSurfaceId = 'chat' | 'knowledge';

export interface ProductSurface {
  id: ProductSurfaceId;
  eyebrow: string;
  title: string;
  description: string;
  figureCaption: string;
  claimId: string;
  figureClaimId: string;
}

export const productPageContent = {
  metadata: {
    description:
      'Explore Chat, connected knowledge and visual workflows in a governed enterprise AI platform. Use prebuilt or custom agents and access major AI models with EU hosting.',
    claimId: 'product-page-metadata',
  },
  intro: {
    eyebrow: 'Product',
    title: 'Enterprise AI, grounded in your company.',
    titleClaimId: 'product-enterprise-hero-title',
    description:
      'Connect your company context to agents that get work done in one governed workspace.',
    claimId: 'product-enterprise-platform-summary',
    modelHostingClaimId: 'product-major-models-eu-hosting',
    governanceClaimId: 'product-governed-workspace-scale',
  },
  agentStartingPoint: {
    description: 'Choose a prebuilt agent or build one around your workflow.',
    claimId: 'product-agent-starting-point',
    examplesClaimId: 'product-prebuilt-agent-examples',
    examples: [
      { label: 'Presentation Agent', kind: 'Prebuilt' },
      { label: 'Finance Agent', kind: 'Prebuilt' },
      { label: 'Legal Agent', kind: 'Prebuilt' },
      { label: 'Custom build', kind: 'Your workflow' },
    ],
  },
  governance: {
    eyebrow: 'One control layer',
    title: 'Keep the rules with the work.',
    description:
      'Manage knowledge access and model choice in one place. Keep human checkpoints and adoption visible.',
    claimId: 'product-governance-controls',
    hostingClaimId: 'product-major-models-eu-hosting',
  },
  conversion: {
    eyebrow: 'Start with one workflow',
    title: 'See the product around your workflow.',
    description:
      'Bring one recurring process. We will show how it fits across chat, connected knowledge, agents and workflows.',
  },
} as const;

export const productSurfaces: readonly ProductSurface[] = [
  {
    id: 'chat',
    eyebrow: '01 / Chat',
    title: 'Start with the work in front of you.',
    description:
      'Use chat for questions and drafting. Bring in agents with relevant company knowledge.',
    figureCaption:
      'A finance agent prepares a monthly review in chat from the company context selected for the task.',
    claimId: 'product-chat-workspace',
    figureClaimId: 'product-chat-workspace-caption',
  },
  {
    id: 'knowledge',
    eyebrow: '02 / Knowledge',
    title: 'Connect the context your teams already use.',
    description: 'Connect existing systems to knowledge bases through MCP connectors.',
    figureCaption:
      'Existing systems connect to a finance knowledge base that can support chat, agents, and workflows.',
    claimId: 'product-connected-knowledge',
    figureClaimId: 'product-connected-knowledge-caption',
  },
];

export const productPageClaimIds = [
  productPageContent.metadata.claimId,
  productPageContent.intro.titleClaimId,
  productPageContent.intro.claimId,
  productPageContent.intro.modelHostingClaimId,
  productPageContent.intro.governanceClaimId,
  ...productSurfaces.map((surface) => surface.claimId),
  ...productSurfaces.map((surface) => surface.figureClaimId),
  productPageContent.agentStartingPoint.claimId,
  productPageContent.agentStartingPoint.examplesClaimId,
  productPageContent.governance.claimId,
] as const;

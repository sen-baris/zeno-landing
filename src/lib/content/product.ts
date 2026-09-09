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
      'Explore an enterprise AI platform for company context, major AI models with EU hosting, prebuilt and custom agents, chat, connected knowledge, and visual workflows.',
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
    description: 'Start from a prebuilt agent or build one from scratch around your workflow.',
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
      'Keep knowledge access, model choice, human checkpoints, and adoption visibility in one place.',
    claimId: 'product-governance-controls',
    hostingClaimId: 'product-major-models-eu-hosting',
  },
  conversion: {
    eyebrow: 'Start with one workflow',
    title: 'See the product around your workflow.',
    description:
      'Bring one task or recurring process. We will show how chat, connected knowledge, agents, and workflows would fit it.',
  },
} as const;

export const productSurfaces: readonly ProductSurface[] = [
  {
    id: 'chat',
    eyebrow: '01 / Chat',
    title: 'Start with the work in front of you.',
    description:
      'Use chat for everyday questions, drafting, and agent-led tasks with the relevant company knowledge attached.',
    figureCaption:
      'A finance agent prepares a monthly review in chat from the company context selected for the task.',
    claimId: 'product-chat-workspace',
    figureClaimId: 'product-chat-workspace-caption',
  },
  {
    id: 'knowledge',
    eyebrow: '02 / Knowledge',
    title: 'Connect the context your teams already use.',
    description:
      'Create knowledge bases for the work that matters, then connect them to existing systems through MCP connectors.',
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

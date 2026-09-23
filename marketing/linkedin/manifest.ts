export type BannerConcept = 'paper-editorial' | 'dark-statement' | 'product-narrative';
export type BannerPlacement = 'profile' | 'company';

export const bannerHeadline = 'AI agents your teams actually use.';
export const narrativeLabels = ['Company context', 'Agent', 'Reviewed work'] as const;
export const bannerClaimIds = ['linkedin-banner-headline', 'linkedin-banner-narrative'] as const;

export const concepts: readonly { id: BannerConcept; label: string }[] = [
  { id: 'paper-editorial', label: '01 / Paper editorial' },
  { id: 'dark-statement', label: '02 / Dark statement' },
  { id: 'product-narrative', label: '03 / Product narrative' },
];

export const placements = {
  profile: { width: 1584, height: 396, maxBytes: 8_000_000 },
  company: { width: 4200, height: 700, maxBytes: 3_000_000 },
} as const satisfies Record<BannerPlacement, { width: number; height: number; maxBytes: number }>;

// Conservative review guides, not official platform safe-zone guarantees.
export const cropGuides = {
  profile: { edge: 100, photoRight: 330, photoTop: 190, criticalRight: 1484 },
  company: { edge: 252, photoRight: 900, photoTop: 380, criticalRight: 3948 },
} as const;

export const banners = concepts.flatMap((concept) =>
  (['profile', 'company'] as const).map((placement) => ({
    ...concept,
    placement,
    ...placements[placement],
    filename: `zeno-linkedin-${concept.id}-${placement}.png`,
  })),
);

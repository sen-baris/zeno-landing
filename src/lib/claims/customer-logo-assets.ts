export interface CustomerLogoAsset {
  claimId: string;
  name: string;
  src: string;
}

export const customerLogoAssets: readonly CustomerLogoAsset[] = [
  {
    claimId: 'customer-logo-frommer-legal',
    name: 'Frommer Legal',
    src: '/customer-logos/frommer-legal.svg',
  },
  { claimId: 'customer-logo-kbc', name: 'KBC', src: '/customer-logos/kbc.svg' },
  { claimId: 'customer-logo-mahle', name: 'MAHLE', src: '/customer-logos/mahle.svg' },
  {
    claimId: 'customer-logo-b2venture',
    name: 'b2venture',
    src: '/customer-logos/b2venture.svg',
  },
  { claimId: 'customer-logo-atares', name: 'atares', src: '/customer-logos/atares.svg' },
  {
    claimId: 'customer-logo-beeradvocaten',
    name: 'beeradvocaten',
    src: '/customer-logos/beeradvocaten.svg',
  },
  {
    claimId: 'customer-logo-bovensiepen',
    name: 'Bovensiepen',
    src: '/customer-logos/bovensiepen.svg',
  },
  {
    claimId: 'customer-logo-tmg-consultants',
    name: 'TMG Consultants',
    src: '/customer-logos/tmg-consultants.svg',
  },
];

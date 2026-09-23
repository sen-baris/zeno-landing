import type { Locale } from '../i18n/locales';
import { resolveApprovedClaims } from '../claims/public-claims';
import type { ClaimRecord } from '../claims/types';

export interface ResourceLink {
  id: string;
  labels: Record<Locale, string>;
  destination: string;
  claimId: string;
}

export const resourceLinks: readonly ResourceLink[] = [
  {
    id: 'help-center',
    labels: { en: 'Help Center', de: 'Hilfe-Center' },
    destination: 'https://help.textcortex.com/hc/en-us',
    claimId: 'resource-help-center',
  },
  {
    id: 'youtube',
    labels: { en: 'YouTube', de: 'YouTube' },
    destination: 'https://www.youtube.com/@textcortex/videos',
    claimId: 'resource-youtube',
  },
  {
    id: 'linkedin',
    labels: { en: 'LinkedIn', de: 'LinkedIn' },
    destination: 'https://www.linkedin.com/company/textcortex-ai',
    claimId: 'resource-linkedin',
  },
];

export function approvedResources(
  registry: readonly ClaimRecord[],
  surface: 'navigation.resources' | 'footer.resources',
  now = new Date(),
): readonly ResourceLink[] {
  const claims = resolveApprovedClaims(
    registry,
    resourceLinks.map((link) => link.claimId),
    surface,
    now,
  );
  resourceLinks.forEach((link, index) => {
    const claim = claims[index]!;
    if (
      claim.public_url !== link.destination ||
      claim.statement !== `${link.labels.en} / ${link.labels.de}`
    ) {
      throw new Error(`Resource approval does not match ${link.id}.`);
    }
  });
  return resourceLinks;
}

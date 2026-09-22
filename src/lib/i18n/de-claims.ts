import { claimRegistry } from '../claims/registry';
import { isClaimCurrent, resolveApprovedClaims } from '../claims/public-claims';
import type { ClaimRecord } from '../claims/types';
import type { Locale } from './locales';
import approvedRecords from './de-approved-claims.json';
import { germanClaimStatement } from './claim-copy';

export interface GermanLocalizedClaimRecord {
  id: string;
  locale: string;
  sourceClaimId: string;
  sourceStatement: string;
  statement: string;
  approvalStatus: string;
  allowedSurfaces: readonly string[];
  evidence: string;
  approvedBy: string;
  approvedAt: string;
}

/** A reviewed snapshot, not approval derived from mutable translation content. */
export const germanLocalizedClaims: readonly GermanLocalizedClaimRecord[] = approvedRecords;

export function validateGermanClaim(
  source: ClaimRecord,
  translated: GermanLocalizedClaimRecord | undefined,
  surface: string,
  now = new Date(),
): void {
  if (
    !translated ||
    translated.locale !== 'de' ||
    translated.sourceClaimId !== source.id ||
    translated.approvalStatus !== 'approved' ||
    !translated.approvedBy.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(translated.approvedAt) ||
    !translated.evidence.trim() ||
    !isClaimCurrent(source, now)
  ) {
    throw new Error(`German claim "${source.id}" is not approved and current.`);
  }
  if (
    translated.sourceStatement !== source.statement ||
    translated.statement !== germanClaimStatement(source)
  ) {
    throw new Error(`German claim "${source.id}" differs from its exact approved wording.`);
  }
  if (
    !translated.allowedSurfaces.includes(surface) ||
    !source.allowed_surfaces.includes(surface) ||
    translated.allowedSurfaces.some((allowed) => !source.allowed_surfaces.includes(allowed))
  ) {
    throw new Error(`German claim "${source.id}" is not approved for ${surface}.`);
  }
}

export function assertGermanClaimsApprovedForPublication(): void {
  for (const translated of germanLocalizedClaims) {
    const source = claimRegistry.find(({ id }) => id === translated.sourceClaimId);
    if (!source) throw new Error(`Missing English source claim "${translated.sourceClaimId}".`);
    for (const surface of translated.allowedSurfaces)
      validateGermanClaim(source, translated, surface);
  }
}

/** Retain the English record for exact-match guards; check German approval before rendering. */
export function createPageClaimResolver(locale: Locale): typeof resolveApprovedClaims {
  return (registry, ids, surface, now) => {
    const resolved = resolveApprovedClaims(registry, ids, surface, now);
    if (locale === 'de')
      for (const source of resolved) {
        validateGermanClaim(
          source,
          germanLocalizedClaims.find((claim) => claim.sourceClaimId === source.id),
          surface,
          now,
        );
      }
    return resolved;
  };
}

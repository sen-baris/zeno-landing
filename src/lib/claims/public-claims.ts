import type { ClaimRecord } from './types';

export class ClaimRegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimRegistryError';
  }
}

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isPublishablePublicUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function hasCompleteApprovalRecord(claim: ClaimRecord): boolean {
  return (
    [
      claim.id,
      claim.statement,
      claim.evidence,
      claim.approved_by,
      claim.attribution,
      claim.notes,
    ].every((value) => value.trim().length > 0) &&
    isDate(claim.verified_on) &&
    isDate(claim.approved_on) &&
    claim.allowed_surfaces.length > 0 &&
    (claim.public_url === undefined || isPublishablePublicUrl(claim.public_url))
  );
}

export function isClaimCurrent(claim: ClaimRecord, now = new Date()): boolean {
  if (
    claim.approval_status !== 'approved' ||
    !hasCompleteApprovalRecord(claim) ||
    !isDate(claim.reverify_on)
  ) {
    return false;
  }

  const reverifyAt = new Date(`${claim.reverify_on}T23:59:59.999Z`);
  return now <= reverifyAt;
}

export function isClaimAllowedOnSurface(claim: ClaimRecord, surface: string): boolean {
  return claim.allowed_surfaces.includes('*') || claim.allowed_surfaces.includes(surface);
}

export function resolveApprovedClaims(
  registry: readonly ClaimRecord[],
  ids: readonly string[],
  surface: string,
  now = new Date(),
): ClaimRecord[] {
  const seen = new Set<string>();

  return ids.map((id) => {
    if (seen.has(id)) {
      throw new ClaimRegistryError(`Claim reference "${id}" is duplicated.`);
    }
    seen.add(id);

    const claim = registry.find((candidate) => candidate.id === id);
    if (!claim) {
      throw new ClaimRegistryError(`Claim reference "${id}" is missing.`);
    }
    if (!isClaimCurrent(claim, now)) {
      throw new ClaimRegistryError(`Claim reference "${id}" is not approved and current.`);
    }
    if (!isClaimAllowedOnSurface(claim, surface)) {
      throw new ClaimRegistryError(`Claim reference "${id}" is not approved for ${surface}.`);
    }
    return claim;
  });
}

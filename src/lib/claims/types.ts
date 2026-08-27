export type ClaimCategory =
  | 'product'
  | 'customer'
  | 'metric'
  | 'security'
  | 'privacy'
  | 'compliance'
  | 'certification'
  | 'legal'
  | 'competitive';

export type ClaimApprovalStatus = 'draft' | 'approved' | 'rejected' | 'superseded' | 'expired';

export interface ClaimRecord {
  id: string;
  statement: string;
  category: ClaimCategory;
  evidence: string;
  verified_on: string;
  approval_status: ClaimApprovalStatus;
  approved_by: string;
  approved_on: string;
  allowed_surfaces: readonly string[];
  attribution: string;
  reverify_on: string;
  notes: string;
  /**
   * Publicly linkable evidence a visitor may verify for themselves. Omitted when the only
   * evidence is internal. A published record must never point at a non-HTTPS destination.
   */
  public_url?: string;
}

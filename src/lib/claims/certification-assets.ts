export interface CertificationAsset {
  claimId: string;
  /** Short public label for the framework, kept separate from the approved claim statement. */
  label: string;
}

export const certificationAssets: readonly CertificationAsset[] = [
  { claimId: 'certification-iso-27001', label: 'ISO 27001' },
  { claimId: 'certification-soc-2-type-1', label: 'SOC 2 Type I' },
  { claimId: 'certification-soc-2-type-2', label: 'SOC 2 Type II' },
];

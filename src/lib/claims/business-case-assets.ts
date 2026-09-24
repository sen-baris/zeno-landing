export interface BusinessCaseAsset {
  claimId: string;
  /** The figure, shown at display size. */
  value: string;
  /** What the figure measures. Together with the value it must read as the approved statement. */
  label: string;
}

export const businessCaseAssets: readonly BusinessCaseAsset[] = [
  {
    claimId: 'metric-annualized-time-per-person',
    value: '~92 hrs',
    label: 'saved per person each year',
  },
  {
    claimId: 'metric-agents-created',
    value: '2,000+',
    label: 'agents created',
  },
  {
    claimId: 'metric-weekly-active-usage',
    value: '+65%',
    label: 'weekly active usage',
  },
  {
    claimId: 'metric-projected-annual-savings',
    value: '~€7–8M',
    label: 'projected annual savings',
  },
];

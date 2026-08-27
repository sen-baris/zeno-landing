export interface BusinessCaseAsset {
  claimId: string;
  /** The figure, shown at display size. */
  value: string;
  /** What the figure measures. Together with the value it must read as the approved statement. */
  label: string;
}

export const businessCaseAssets: readonly BusinessCaseAsset[] = [
  {
    claimId: 'metric-efficiency-time-savings',
    value: '3–10%',
    label: 'efficiency / time savings after a year',
  },
  {
    claimId: 'metric-monthly-interactions',
    value: '~200',
    label: 'monthly interactions per user',
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

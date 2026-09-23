import type { ClaimRecord } from './types';

const approval = {
  category: 'product',
  evidence:
    'Baris approved the LinkedIn Banner Kit and Resources Navigation implementation plan on 2026-09-23.',
  verified_on: '2026-09-23',
  approval_status: 'approved',
  approved_by: 'Baris, workspace owner',
  approved_on: '2026-09-23',
  attribution: 'No public attribution required.',
  reverify_on: '2027-03-23',
} as const;

export const marketingClaims: readonly ClaimRecord[] = [
  {
    ...approval,
    id: 'linkedin-banner-headline',
    statement: 'AI agents your teams actually use.',
    allowed_surfaces: ['marketing.linkedin.profile', 'marketing.linkedin.company'],
    notes:
      'English banner headline only. No extra metrics or guarantees. Does not change website release gates or authorize account publication.',
  },
  {
    ...approval,
    id: 'linkedin-banner-narrative',
    statement: 'Company context → Agent → Reviewed work',
    allowed_surfaces: ['marketing.linkedin.profile', 'marketing.linkedin.company'],
    notes:
      'Three labels for the approved minimal product motif only. No new capability or performance claim.',
  },
  {
    ...approval,
    id: 'resource-help-center',
    statement: 'Help Center / Hilfe-Center',
    public_url: 'https://help.textcortex.com/hc/en-us',
    allowed_surfaces: ['navigation.resources', 'footer.resources'],
    notes:
      'Baris approved removing the German parenthetical language suffix on 2026-09-23. Existing TextCortex help destination remains unchanged, not a Zeno-hosted service.',
  },
  {
    ...approval,
    id: 'resource-youtube',
    statement: 'YouTube / YouTube',
    public_url: 'https://www.youtube.com/@textcortex/videos',
    allowed_surfaces: ['navigation.resources', 'footer.resources'],
    notes: 'Existing TextCortex video channel. Link only, without an embed or tracking parameters.',
  },
  {
    ...approval,
    id: 'resource-linkedin',
    statement: 'LinkedIn / LinkedIn',
    public_url: 'https://www.linkedin.com/company/textcortex-ai',
    allowed_surfaces: ['navigation.resources', 'footer.resources'],
    notes:
      'Temporary TextCortex company destination approved for both languages. Replace only with a supplied approved destination.',
  },
];

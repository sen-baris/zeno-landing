import { customerStoryDrafts } from '../content/customer-stories';
import type { ClaimRecord } from '../claims/types';
import { germanPageCopy, translatePageText } from './page-copy';

const t = (value: string) => translatePageText('de', value);

/** Reconstruct the exact rendered claim from the same typed content used by the page. */
export function germanClaimStatement(claim: ClaimRecord): string | undefined {
  for (const story of customerStoryDrafts) {
    if (claim.id === story.narrativeClaimId) return [t(story.title), t(story.summary)].join(' ');
    const result = story.qualifiedResults.find((result) => result.claimId === claim.id);
    if (result) return [t(result.value), `${t(result.label)}.`, t(result.qualifier)].join(' ');
    const section = story.sections.find((section) => section.claimId === claim.id);
    if (section)
      return [section.label, section.heading, ...section.paragraphs, ...(section.points ?? [])]
        .map(t)
        .join(' ');
  }
  // These claims authorize unchanged brand assets and original-language quotations.
  if (
    claim.id.startsWith('customer-logo-') ||
    claim.id.startsWith('customer-voice-') ||
    claim.id === 'customer-quote-strategy-consultancy'
  )
    return claim.statement;
  return germanPageCopy[claim.statement.replace(/\s+/g, ' ').trim()];
}

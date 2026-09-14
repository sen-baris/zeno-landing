import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';

const now = new Date('2026-09-14T12:00:00Z');

describe('demo page content', () => {
  it('resolves the approved meeting and data-use statements on their exact surfaces', () => {
    const [preparation] = resolveApprovedClaims(
      claimRegistry,
      ['demo-meeting-preparation'],
      'demo.hero',
      now,
    );
    const [acknowledgement] = resolveApprovedClaims(
      claimRegistry,
      ['demo-response-data-use'],
      'demo.form',
      now,
    );

    expect(preparation?.statement).toBe(
      'Tell us what you want to improve. We will prepare the conversation around your team, systems, and controls.',
    );
    expect(acknowledgement?.statement).toBe(
      'I agree that Zeno may use these details to respond to my request.',
    );
    expect(preparation?.approval_status).toBe('approved');
    expect(acknowledgement?.approval_status).toBe('approved');
    expect(`${preparation?.statement}\n${acknowledgement?.statement}`).not.toContain('—');
  });
});

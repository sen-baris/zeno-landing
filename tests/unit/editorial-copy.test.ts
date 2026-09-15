import { describe, expect, it } from 'vitest';
import { claimRegistry } from '../../src/lib/claims/registry';
import {
  adoptionPartnership,
  companyVision,
  draftHomeCopy,
  operatingShift,
} from '../../src/lib/content/site-content';
import { solutions } from '../../src/lib/content/solutions';

describe('sitewide editorial copy', () => {
  it('keeps the approved homepage starting path and rollout copy direct', () => {
    expect(draftHomeCopy.startingPathLabel).toBe('Start your way');
    expect(
      claimRegistry.find((claim) => claim.id === draftHomeCopy.startingPathClaimId)?.statement,
    ).toBe(
      'Choose a prebuilt agent or shape your own. We ground it in your company context and stay through adoption.',
    );
    expect(adoptionPartnership.intro).toBe(
      'We stay with you after launch. We improve what teams use and turn it into the next workflow.',
    );
  });

  it('keeps the manufacturing 8D example readable without losing the engineering review', () => {
    const manufacturing = solutions.find((solution) => solution.slug === 'manufacturing');
    const qualityAgent = manufacturing?.agents.find(
      (agent) => agent.name === 'Supplier Quality Agent',
    );
    expect(qualityAgent?.does).toBe(
      'Drafts an 8D report from the complaint and relevant quality records.',
    );
    expect(qualityAgent?.surface?.kind).toBe('workflow');
    expect(manufacturing?.subhead).toContain('The responsible engineer reviews the result.');
  });

  it('uses no em dash in the homepage and solution public strings', () => {
    const publicHome = [draftHomeCopy, adoptionPartnership, companyVision, operatingShift];
    expect(JSON.stringify([...publicHome, solutions])).not.toContain('—');
  });
});

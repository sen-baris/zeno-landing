import { describe, expect, it } from 'vitest';
import {
  claimRegistry,
  homepageCustomerProofVoiceClaimIds,
  homepageTestimonialClaimIds,
} from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import {
  customerStoryDrafts,
  customerVoiceDrafts,
  getCustomerStoryClaimIds,
  getCustomerStoryPreviewClaimIds,
  getCustomerStorySectionStatement,
  homepageCustomerProofLogoOrder,
  isVerbatimExcerpt,
  resolveCustomerProofMode,
  selectCustomerStoriesForMode,
  selectCustomerVoicesForMode,
} from '../../src/lib/content/customer-stories';

describe('approved customer proof', () => {
  it('uses unique safe slugs and one approved logo placement per story', () => {
    const slugs = customerStoryDrafts.map((story) => story.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(['atares', 'b2venture', 'mahle', 'kbc']);

    for (const story of customerStoryDrafts) {
      expect(story.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(homepageCustomerProofLogoOrder).toContain(story.logoClaimId);
    }
  });

  it('keeps every story tied to dated HTTPS TextCortex evidence', () => {
    for (const story of customerStoryDrafts) {
      expect(story.sourceBrand).toBe('TextCortex');
      expect(new URL(story.sourceUrl).protocol).toBe('https:');
      expect(story.reviewedOn).toBe('2026-09-08');
      expect(story.qualifiedResults.length).toBeGreaterThanOrEqual(2);
      expect(story.sections.map((section) => section.label)).toEqual([
        'Customer context',
        'The challenge',
        'The approach',
        'Workflows in practice',
        'Results and operating impact',
      ]);
      expect(story.sections.every((section) => section.paragraphs.length >= 2)).toBe(true);
    }
  });

  it('publishes exact excerpts in the same order as the supplied evidence', () => {
    for (const voice of customerVoiceDrafts) {
      expect(isVerbatimExcerpt(voice.verbatimExcerpt, voice.fullQuote), voice.id).toBe(true);
      if (voice.sourceUrl) expect(new URL(voice.sourceUrl).protocol).toBe('https:');
      if (voice.logoClaimId) expect(homepageCustomerProofLogoOrder).toContain(voice.logoClaimId);
    }
    expect(isVerbatimExcerpt('', customerVoiceDrafts[0]?.fullQuote ?? '')).toBe(false);
    expect(isVerbatimExcerpt('...', customerVoiceDrafts[0]?.fullQuote ?? '')).toBe(false);
    expect(
      isVerbatimExcerpt('adoption ... education', customerVoiceDrafts[0]?.fullQuote ?? ''),
    ).toBe(false);

    for (const story of customerStoryDrafts) {
      if (!story.quoteId) continue;
      const voice = customerVoiceDrafts.find((candidate) => candidate.id === story.quoteId);
      expect(voice?.logoClaimId, story.quoteId).toBe(story.logoClaimId);
    }
  });

  it('publishes the approved stories and voices in production', () => {
    expect(resolveCustomerProofMode()).toBe('preview');
    expect(resolveCustomerProofMode('preview')).toBe('preview');
    expect(resolveCustomerProofMode('production')).toBe('production');
    expect(selectCustomerStoriesForMode(customerStoryDrafts, 'preview')).toHaveLength(4);
    expect(selectCustomerVoicesForMode(customerVoiceDrafts, 'preview')).toHaveLength(4);
    expect(selectCustomerStoriesForMode(customerStoryDrafts, 'production')).toHaveLength(4);
    expect(selectCustomerVoicesForMode(customerVoiceDrafts, 'production')).toHaveLength(4);
  });

  it('uses separate approved records for narratives, results, and quotations', () => {
    const now = new Date('2026-09-09T12:00:00Z');
    const anonymousVoiceIds = customerVoiceDrafts
      .filter((voice) => !voice.logoClaimId)
      .map((voice) => voice.id);
    const linkedVoiceIds = customerVoiceDrafts
      .filter((voice) => voice.logoClaimId)
      .map((voice) => voice.id);

    expect(homepageTestimonialClaimIds).toEqual([
      ...anonymousVoiceIds,
      'customer-quote-strategy-consultancy',
    ]);
    expect(new Set(homepageCustomerProofVoiceClaimIds)).toEqual(new Set(linkedVoiceIds));
    resolveApprovedClaims(claimRegistry, anonymousVoiceIds, 'home.testimonials', now);
    resolveApprovedClaims(
      claimRegistry,
      homepageCustomerProofVoiceClaimIds,
      'home.customer-proof',
      now,
    );

    for (const voice of customerVoiceDrafts) {
      const claim = claimRegistry.find((candidate) => candidate.id === voice.id);
      expect(claim?.statement, voice.id).toBe(voice.verbatimExcerpt);
      expect(claim?.attribution, voice.id).toBe(voice.attribution);
    }

    for (const story of customerStoryDrafts) {
      const claimIds = getCustomerStoryClaimIds(story);
      expect(new Set(claimIds).size).toBe(claimIds.length);
      resolveApprovedClaims(claimRegistry, claimIds, `customers.${story.slug}`, now);
      resolveApprovedClaims(
        claimRegistry,
        getCustomerStoryPreviewClaimIds(story),
        'home.customer-proof',
        now,
      );

      const logoClaim = claimRegistry.find((claim) => claim.id === story.logoClaimId);
      expect(logoClaim?.allowed_surfaces).toEqual(
        expect.arrayContaining(['home.customer-logos', 'solutions.customer-logos']),
      );
      expect(logoClaim?.notes).toContain('Logo placement only');

      for (const section of story.sections) {
        const sectionClaim = claimRegistry.find((claim) => claim.id === section.claimId);
        expect(sectionClaim?.statement, section.claimId).toBe(
          getCustomerStorySectionStatement(section),
        );
        expect(sectionClaim?.evidence, section.claimId).toBe(story.sourceUrl);
        expect(sectionClaim?.allowed_surfaces, section.claimId).toEqual([
          `customers.${story.slug}`,
        ]);
      }
    }
  });

  it('keeps article prose neutral while preserving TextCortex in approved quotations', () => {
    for (const story of customerStoryDrafts) {
      const articleCopy = story.sections
        .flatMap((section) => [
          section.label,
          section.heading,
          ...section.paragraphs,
          ...(section.points ?? []),
        ])
        .join(' ');
      expect(articleCopy, story.slug).not.toMatch(/TextCortex/i);
    }

    expect(customerVoiceDrafts.some((voice) => voice.verbatimExcerpt.includes('TextCortex'))).toBe(
      true,
    );
  });

  it('uses the conservative source-body figures and their material qualifiers', () => {
    const atares = customerStoryDrafts.find((story) => story.slug === 'atares');
    const b2venture = customerStoryDrafts.find((story) => story.slug === 'b2venture');
    const mahle = customerStoryDrafts.find((story) => story.slug === 'mahle');
    const kbc = customerStoryDrafts.find((story) => story.slug === 'kbc');

    expect(atares?.qualifiedResults.map((result) => result.value)).toEqual([
      'About 20 hours',
      '4',
      '7',
    ]);
    expect(atares?.qualifiedResults[0]?.qualifier).toContain('not a per-user figure');
    expect(b2venture?.qualifiedResults.map((result) => result.value)).toEqual([
      'Over 70%',
      '2x',
      '5 to 10 hours',
    ]);
    expect(
      [
        b2venture?.title,
        b2venture?.summary,
        ...(b2venture?.sections ?? []).flatMap((section) => [
          section.heading,
          ...section.paragraphs,
          ...(section.points ?? []),
        ]),
        ...(b2venture?.qualifiedResults ?? []).flatMap((result) => [
          result.value,
          result.label,
          result.qualifier,
        ]),
      ].join(' '),
    ).not.toContain('7x');
    expect(mahle?.qualifiedResults.map((result) => result.value)).toEqual(['Over 71%', '5+ hours']);
    expect(kbc?.qualifiedResults.map((result) => result.value)).toEqual([
      'Minutes to seconds',
      '10 to 12%',
      'Over 75%',
    ]);
    const mahleVoice = customerVoiceDrafts.find((voice) => voice.id === 'customer-voice-mahle');
    expect(mahleVoice?.verbatimExcerpt).toContain("TextCortex's Agent platform");
    expect(mahleVoice?.attribution).toBe('MAHLE');
  });

  it('contains no em dash in any public draft string', () => {
    const publicStrings = [
      ...customerStoryDrafts.flatMap((story) => [
        story.company,
        story.title,
        story.summary,
        ...story.sections.flatMap((section) => [
          section.label,
          section.heading,
          ...section.paragraphs,
          ...(section.points ?? []),
        ]),
        ...story.qualifiedResults.flatMap((result) => [
          result.value,
          result.label,
          result.qualifier,
        ]),
      ]),
      ...customerVoiceDrafts.flatMap((voice) => [
        voice.company,
        voice.attribution,
        voice.verbatimExcerpt,
      ]),
    ];

    for (const value of publicStrings) expect(value).not.toContain('—');
  });
});

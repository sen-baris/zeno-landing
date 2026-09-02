import { describe, expect, it } from 'vitest';
import { claimRegistry, homepageTestimonialClaimIds } from '../../src/lib/claims/registry';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';

const now = new Date('2026-09-02T12:00:00Z');

describe('homepage customer quotes', () => {
  const quotes = resolveApprovedClaims(
    claimRegistry,
    homepageTestimonialClaimIds,
    'home.testimonials',
    now,
  );

  it('publishes every referenced quote in order', () => {
    expect(quotes.map((quote) => quote.id)).toEqual(homepageTestimonialClaimIds);
  });

  it('carries a speaker attribution and its source with every quote', () => {
    for (const quote of quotes) {
      expect(quote.category, quote.id).toBe('customer');
      expect(quote.statement.trim().length, quote.id).toBeGreaterThan(0);
      // A quote with no attribution is an anonymous assertion, not a testimonial.
      expect(quote.attribution.trim().length, `${quote.id} attribution`).toBeGreaterThan(0);
      // The record has to hold the original wording so any trim stays auditable.
      expect(quote.evidence, `${quote.id} evidence`).toContain(quote.statement);
    }
  });

  it('keeps quotes off surfaces that have not approved them', () => {
    for (const id of homepageTestimonialClaimIds) {
      expect(() => resolveApprovedClaims(claimRegistry, [id], 'home.customer-logos', now)).toThrow(
        /not approved for home\.customer-logos/,
      );
    }
  });

  it('does not reuse a logo record as a quote', () => {
    // Permission to show a company mark is not permission to quote one of its employees, and every
    // logo record says so in its notes.
    const logoRecords = claimRegistry.filter((claim) =>
      claim.allowed_surfaces.includes('home.customer-logos'),
    );
    for (const id of homepageTestimonialClaimIds) {
      expect(logoRecords.map((record) => record.id)).not.toContain(id);
    }
  });
});

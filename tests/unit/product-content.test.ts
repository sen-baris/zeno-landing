import { describe, expect, it } from 'vitest';
import { resolveApprovedClaims } from '../../src/lib/claims/public-claims';
import { claimRegistry } from '../../src/lib/claims/registry';
import {
  productPageClaimIds,
  productPageContent,
  productSurfaces,
} from '../../src/lib/content/product';

const now = new Date('2026-09-09T12:00:00Z');

describe('product page content', () => {
  it('keeps the two detailed product surfaces in narrative order with unique identifiers', () => {
    expect(productSurfaces.map((surface) => surface.id)).toEqual(['chat', 'knowledge']);
    expect(new Set(productSurfaces.map((surface) => surface.id)).size).toBe(productSurfaces.length);
    expect(new Set(productPageClaimIds).size).toBe(productPageClaimIds.length);
  });

  it('resolves every capability on its approved product surface', () => {
    const [metadata] = resolveApprovedClaims(
      claimRegistry,
      [productPageContent.metadata.claimId],
      'product.metadata',
      now,
    );
    const [title, intro, hosting, heroGovernance] = resolveApprovedClaims(
      claimRegistry,
      [
        productPageContent.intro.titleClaimId,
        productPageContent.intro.claimId,
        productPageContent.intro.modelHostingClaimId,
        productPageContent.intro.governanceClaimId,
      ],
      'product.hero',
      now,
    );

    expect(metadata?.statement).toBe(productPageContent.metadata.description);
    expect(title?.statement).toBe(productPageContent.intro.title);
    expect(intro?.statement).toBe(productPageContent.intro.description);
    expect(hosting?.statement).toBe('Access major AI models with EU hosting in one place.');
    expect(hosting?.allowed_surfaces).toEqual(
      expect.arrayContaining(['product.hero', 'product.governance']),
    );
    expect(heroGovernance?.statement).toBe(
      'Keep knowledge access, model choice, human checkpoints, and adoption visibility together as usage scales.',
    );

    for (const surface of productSurfaces) {
      const [claim, figureClaim] = resolveApprovedClaims(
        claimRegistry,
        [surface.claimId, surface.figureClaimId],
        `product.${surface.id}`,
        now,
      );
      expect(claim?.statement).toBe(surface.description);
      expect(claim?.category).toBe('product');
      expect(figureClaim?.statement).toBe(surface.figureCaption);
      expect(figureClaim?.category).toBe('product');
    }

    const [startingPoint, examples] = resolveApprovedClaims(
      claimRegistry,
      [
        productPageContent.agentStartingPoint.claimId,
        productPageContent.agentStartingPoint.examplesClaimId,
      ],
      'product.hero',
      now,
    );
    const [governance] = resolveApprovedClaims(
      claimRegistry,
      [productPageContent.governance.claimId],
      'product.governance',
      now,
    );
    const [governanceHosting] = resolveApprovedClaims(
      claimRegistry,
      [productPageContent.governance.hostingClaimId],
      'product.governance',
      now,
    );

    expect(startingPoint?.statement).toBe(productPageContent.agentStartingPoint.description);
    expect(examples?.statement).toContain('Presentation Agent, Finance Agent, and Legal Agent');
    expect(governance?.statement).toBe(productPageContent.governance.description);
    expect(governanceHosting?.statement).toBe(
      'Access major AI models with EU hosting in one place.',
    );
  });

  it('keeps new public product strings free of em dashes', () => {
    const collectStrings = (value: unknown): string[] => {
      if (typeof value === 'string') return [value];
      if (Array.isArray(value)) return value.flatMap(collectStrings);
      if (value && typeof value === 'object') {
        return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
      }
      return [];
    };

    expect(collectStrings({ productPageContent, productSurfaces }).join('\n')).not.toContain('—');
  });
});

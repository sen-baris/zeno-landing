import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  legalDocuments,
  resolveApprovedLegalDocument,
} from '../../src/lib/content/legal-documents';

const readApprovedBody = (id: string) => {
  const raw = readFileSync(resolve(process.cwd(), `src/pages/${id}.md`), 'utf8');
  return raw
    .replace(/^---\n[\s\S]*?\n---\n\n/, '')
    .replace(/\r\n/g, '\n')
    .trimEnd();
};

describe('verbatim legal documents', () => {
  it('keeps one approved, route-limited record for every legal page', () => {
    expect(legalDocuments.map((document) => document.id)).toEqual([
      'privacy-policy',
      'terms-of-service',
      'imprint',
    ]);
    expect(new Set(legalDocuments.map((document) => document.allowedRoute)).size).toBe(3);

    for (const document of legalDocuments) {
      expect(document.approvalStatus).toBe('approved');
      expect(document.allowedRoute).toBe(`/${document.id}`);
      expect(new URL(document.sourceUrl).protocol).toBe('https:');
      expect(document.approvedBy).toContain('verbatim legal pages direction');
    }
  });

  it('locks every approved body to its captured checksum', () => {
    for (const document of legalDocuments) {
      const checksum = createHash('sha256').update(readApprovedBody(document.id)).digest('hex');
      expect(checksum, document.id).toBe(document.contentSha256);
    }
  });

  it('preserves source revisions, legal identity, and final sections', () => {
    const privacy = resolveApprovedLegalDocument('privacy-policy');
    const terms = resolveApprovedLegalDocument('terms-of-service');
    const imprint = resolveApprovedLegalDocument('imprint');

    expect(privacy.lastRevised).toBe('Last Revised : September 2, 2026');
    expect(privacy.sourceRevision).toBe('2026-09-02');
    expect(terms.lastRevised).toBe('Last Revised : April 2, 2025');
    expect(terms.sourceRevision).toBe('2025-04-02');
    expect(imprint.lastRevised).toBeUndefined();

    const privacyBody = readApprovedBody(privacy.id);
    expect(privacyBody).toContain('Text Cortex AI UG (haftungsbeschränkt)');
    expect(privacyBody).toContain('**30. Google Workspace APIs**');
    expect(privacyBody).toContain(
      '**10. Technical and Organizational Measures for Security (TOMS)**',
    );
    expect(privacyBody).toContain('IP address—assigned by the Internet service provider');

    const termsBody = readApprovedBody(terms.id);
    expect(termsBody).toContain('## Introduction');
    expect(termsBody).toContain('**Governing Law.**');
    expect(termsBody).toMatch(
      /TextCortex AI UG\n\nc\/o WeWork\n\nKemperplatz 1 10785 Berlin\n\nGermany$/,
    );

    const imprintBody = readApprovedBody(imprint.id);
    expect(imprintBody).toContain('Commercial Register No. HRB 233350 B');
    expect(imprintBody).toContain('### Opposition to promotional emails');
    expect(imprintBody).toMatch(
      /specific legal action if unsolicited advertising material, such as email spam, is received\.$/,
    );
  });

  it('keeps old marketing chrome and executable markup outside the legal bodies', () => {
    for (const document of legalDocuments) {
      const body = readApprovedBody(document.id);
      expect(body).not.toContain('The AI Adoption Secret');
      expect(body).not.toContain('Developed with ❤️ in Berlin');
      expect(body).not.toMatch(/<(script|iframe|form)\b/i);
    }
  });

  it('fails closed for missing legal records', () => {
    expect(() => resolveApprovedLegalDocument(undefined)).toThrow(/id is required/i);
    expect(() => resolveApprovedLegalDocument('unknown')).toThrow(/unknown legal document/i);
  });
});

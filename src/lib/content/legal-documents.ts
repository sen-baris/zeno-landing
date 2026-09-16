export type LegalDocumentId = 'privacy-policy' | 'terms-of-service' | 'imprint';

export interface LegalDocumentRecord {
  approvalStatus: 'approved';
  approvedBy: string;
  approvedOn: string;
  allowedRoute: `/${LegalDocumentId}`;
  capturedOn: string;
  contentSha256: string;
  description: string;
  heading: string;
  id: LegalDocumentId;
  lastRevised?: string;
  pageTitle: string;
  sourceRevision?: string;
  sourceUrl: `https://${string}`;
}

export const legalDocuments = [
  {
    id: 'privacy-policy',
    heading: 'TextCortex Privacy Policy',
    pageTitle: 'TextCortex AI | Privacy Policy',
    description:
      'We are very delighted that you have shown interest in our enterprise. Data protection is of a particularly high priority for the management of the Text Cortex AI UG (haftungsbeschränkt).',
    lastRevised: 'Last Revised : September 2, 2026',
    sourceUrl: 'https://textcortex.com/privacy-policy',
    sourceRevision: '2026-09-02',
    capturedOn: '2026-09-16',
    approvalStatus: 'approved',
    approvedBy: 'Baris, verbatim legal pages direction',
    approvedOn: '2026-09-16',
    allowedRoute: '/privacy-policy',
    contentSha256: 'f457b007b34cbc4096c5c657f00215234b85e441682c021d261ef668ac7c23c2',
  },
  {
    id: 'terms-of-service',
    heading: 'TextCortex Terms of Service',
    pageTitle: 'TextCortex AI | Terms of Services',
    description:
      'The following terms and conditions govern all use of the TextCortex website and all content, services and products available at, or through TextCortex, including TextCortex user management service.',
    lastRevised: 'Last Revised : April 2, 2025',
    sourceUrl: 'https://textcortex.com/terms-of-service',
    sourceRevision: '2025-04-02',
    capturedOn: '2026-09-16',
    approvalStatus: 'approved',
    approvedBy: 'Baris, verbatim legal pages direction',
    approvedOn: '2026-09-16',
    allowedRoute: '/terms-of-service',
    contentSha256: 'ce83ed94a2075459321d99c9c434f880ffedf4dae8d3bebb1a2d9f3da1e025df',
  },
  {
    id: 'imprint',
    heading: 'TextCortex AI Imprint',
    pageTitle: 'TextCortex AI | Imprint',
    description: 'Information in accordance with § 5 Telemedia Act (TMG)',
    sourceUrl: 'https://textcortex.com/imprint',
    capturedOn: '2026-09-16',
    approvalStatus: 'approved',
    approvedBy: 'Baris, verbatim legal pages direction',
    approvedOn: '2026-09-16',
    allowedRoute: '/imprint',
    contentSha256: '4723e46bb9503746895b051da02a325e8cb341e9d6b46cb14fcae373ad1618f7',
  },
] as const satisfies readonly LegalDocumentRecord[];

export const legalDocumentPaths = legalDocuments.map((document) => document.allowedRoute);

export function resolveApprovedLegalDocument(id: unknown): LegalDocumentRecord {
  if (typeof id !== 'string') throw new Error('A legal document id is required.');

  const document = legalDocuments.find((candidate) => candidate.id === id);
  if (!document) throw new Error(`Unknown legal document: ${id}`);
  if (document.approvalStatus !== 'approved') {
    throw new Error(`Legal document is not approved: ${id}`);
  }

  return document;
}

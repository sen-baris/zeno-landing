import { describe, expect, it, vi } from 'vitest';
import { createLeadSubmissionAdapter, LeadSubmissionError } from '../../src/lib/leads/adapter';
import type { LeadSubmission } from '../../src/lib/leads/types';

const submission: LeadSubmission = {
  source: 'demo',
  contact: { workEmail: 'alex@example.test' },
  company: { name: 'Example Test Company' },
  intent: {},
  consent: { privacyAcknowledged: true, marketing: false },
  attribution: { landingPath: '/demo' },
};

describe('lead submission adapter', () => {
  it('returns a synthetic receipt without a network call', async () => {
    const adapter = createLeadSubmissionAdapter({
      mode: 'synthetic',
      syntheticDelayMs: 0,
      createId: () => 'synthetic-id',
    });
    await expect(adapter.submit(submission)).resolves.toEqual({
      submissionId: 'preview-synthetic-id',
    });
  });

  it('stops a synthetic request when aborted', async () => {
    const adapter = createLeadSubmissionAdapter({ mode: 'synthetic', syntheticDelayMs: 50 });
    const controller = new AbortController();
    const promise = adapter.submit(submission, controller.signal);
    controller.abort(new DOMException('Stopped', 'AbortError'));
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('fails clearly when a same-origin gateway is not configured', async () => {
    const adapter = createLeadSubmissionAdapter({ mode: 'gateway', endpoint: 'https://crm.test' });
    await expect(adapter.submit(submission)).rejects.toMatchObject({
      code: 'adapter-unconfigured',
    });
  });

  it('submits to a same-origin gateway and validates its receipt', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ submissionId: 'lead-123', nextStepUrl: '/thank-you' }), {
        status: 200,
      }),
    );
    const adapter = createLeadSubmissionAdapter({
      mode: 'gateway',
      endpoint: '/api/leads',
      fetcher,
    });
    await expect(adapter.submit(submission)).resolves.toEqual({
      submissionId: 'lead-123',
      nextStepUrl: '/thank-you',
    });
    expect(fetcher).toHaveBeenCalledWith(
      '/api/leads',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(submission) }),
    );
  });

  it('reports rejected, malformed, and network responses without internal details', async () => {
    const rejected = createLeadSubmissionAdapter({
      mode: 'gateway',
      endpoint: '/api/leads',
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 503 })),
    });
    await expect(rejected.submit(submission)).rejects.toMatchObject({
      code: 'submission-rejected',
    });

    const malformed = createLeadSubmissionAdapter({
      mode: 'gateway',
      endpoint: '/api/leads',
      fetcher: vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(JSON.stringify({ submissionId: '' }), { status: 200 })),
    });
    await expect(malformed.submit(submission)).rejects.toBeInstanceOf(LeadSubmissionError);

    const invalidJson = createLeadSubmissionAdapter({
      mode: 'gateway',
      endpoint: '/api/leads',
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(new Response('not-json', { status: 200 })),
    });
    await expect(invalidJson.submit(submission)).rejects.toMatchObject({
      code: 'submission-rejected',
    });

    const network = createLeadSubmissionAdapter({
      mode: 'gateway',
      endpoint: '/api/leads',
      fetcher: vi.fn<typeof fetch>().mockRejectedValue(new Error('private transport detail')),
    });
    await expect(network.submit(submission)).rejects.toMatchObject({
      code: 'network-failure',
      message: 'The request could not be sent. Check your connection and try again.',
    });
  });
});

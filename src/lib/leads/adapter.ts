import type { LeadSubmission, LeadSubmissionAdapter, LeadSubmissionReceipt } from './types';

export type LeadSubmissionErrorCode =
  'adapter-unconfigured' | 'submission-rejected' | 'network-failure';

export class LeadSubmissionError extends Error {
  constructor(
    public readonly code: LeadSubmissionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'LeadSubmissionError';
  }
}

interface AdapterConfiguration {
  mode?: 'synthetic' | 'gateway';
  endpoint?: string;
  fetcher?: typeof fetch;
  syntheticDelayMs?: number;
  createId?: () => string;
}

function waitForDelay(delayMs: number, signal?: AbortSignal): Promise<void> {
  const abortError = () =>
    signal?.reason instanceof Error
      ? signal.reason
      : new DOMException('The request was aborted.', 'AbortError');
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(abortError());
    };
    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export function createLeadSubmissionAdapter(
  configuration: AdapterConfiguration = {},
): LeadSubmissionAdapter {
  const mode =
    configuration.mode ??
    import.meta.env.PUBLIC_LEAD_ADAPTER ??
    (import.meta.env.DEV ? 'synthetic' : 'gateway');

  if (mode === 'synthetic') {
    return {
      async submit(_submission, signal) {
        await waitForDelay(configuration.syntheticDelayMs ?? 240, signal);
        return {
          submissionId: `preview-${(configuration.createId ?? crypto.randomUUID)()}`,
        };
      },
    };
  }

  const endpoint = configuration.endpoint ?? import.meta.env.PUBLIC_LEAD_ENDPOINT;
  if (!endpoint || !endpoint.startsWith('/')) {
    return {
      submit() {
        return Promise.reject(
          new LeadSubmissionError(
            'adapter-unconfigured',
            'Demo requests are not connected yet. Please try again later.',
          ),
        );
      },
    };
  }

  const fetcher = configuration.fetcher ?? fetch;
  return {
    async submit(submission: LeadSubmission, signal?: AbortSignal): Promise<LeadSubmissionReceipt> {
      let response: Response;
      try {
        response = await fetcher(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(submission),
          ...(signal ? { signal } : {}),
        });
      } catch (error) {
        if (signal?.aborted) throw error;
        throw new LeadSubmissionError(
          'network-failure',
          'The request could not be sent. Check your connection and try again.',
        );
      }

      if (!response.ok) {
        throw new LeadSubmissionError(
          'submission-rejected',
          'The request was not accepted. Nothing was lost—please try again.',
        );
      }

      let receipt: Partial<LeadSubmissionReceipt>;
      try {
        receipt = (await response.json()) as Partial<LeadSubmissionReceipt>;
      } catch {
        throw new LeadSubmissionError(
          'submission-rejected',
          'The request did not return a valid confirmation. Please try again.',
        );
      }
      if (typeof receipt.submissionId !== 'string' || receipt.submissionId.length === 0) {
        throw new LeadSubmissionError(
          'submission-rejected',
          'The request did not return a valid confirmation. Please try again.',
        );
      }
      return receipt as LeadSubmissionReceipt;
    },
  };
}

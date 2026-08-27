import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DemoForm from '../../src/components/islands/DemoForm';
import { saveAssessmentContext } from '../../src/lib/assessment/storage';
import { LeadSubmissionError } from '../../src/lib/leads/adapter';
import type { LeadSubmission, LeadSubmissionAdapter } from '../../src/lib/leads/types';

function mockAdapter() {
  const submit = vi
    .fn<LeadSubmissionAdapter['submit']>()
    .mockResolvedValue({ submissionId: 'demo-test' });
  const adapter: LeadSubmissionAdapter = {
    submit: (submission: LeadSubmission, signal?: AbortSignal) => submit(submission, signal),
  };
  return { adapter, submit };
}

async function fillStepOne(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Work email'), 'alex@example.test');
  await user.type(screen.getByLabelText('Company'), 'Example Test Company');
  await user.type(screen.getByLabelText('Role'), 'Innovation lead');
  await user.selectOptions(screen.getByLabelText('Organization size'), '1000-4999');
  await user.click(screen.getByRole('button', { name: 'Continue' }));
}

async function fillStepTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText('Priority workflow'), 'research-synthesis');
  await user.selectOptions(screen.getByLabelText('Desired start window'), '0-3-months');
  await user.type(screen.getByLabelText(/Systems or context/i), 'Synthetic approved sources');
  await user.click(screen.getByRole('checkbox', { name: /Final privacy wording/i }));
}

describe('progressive demo form', () => {
  it('validates step one, associates errors, and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(<DemoForm adapter={mockAdapter().adapter} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    const email = screen.getByLabelText('Work email');
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid work email.')).toHaveAttribute(
      'id',
      'demo-workEmail-error',
    );
  });

  it('keeps marketing optional and submits a complete direct request once', async () => {
    const user = userEvent.setup();
    const { adapter, submit } = mockAdapter();
    render(<DemoForm adapter={adapter} />);
    await fillStepOne(user);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByRole('heading', { name: 'What should move forward?' })).toHaveFocus();
    expect(screen.getByRole('checkbox', { name: /occasional Zeno updates/i })).not.toBeChecked();
    await fillStepTwo(user);
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Request confirmed');
    expect(submit).toHaveBeenCalledOnce();
    expect(submit.mock.calls[0]?.[0]).toMatchObject({
      source: 'demo',
      intent: {
        priorityWorkflow: 'research-synthesis',
        desiredStart: '0-3-months',
        systemsContext: 'Synthetic approved sources',
      },
      consent: { privacyAcknowledged: true, marketing: false },
    });
  });

  it('prefills only non-PII assessment context without changing the URL', async () => {
    saveAssessmentContext({
      impactScore: 75,
      readinessScore: 50,
      quadrant: 'prepare-foundation',
      workflow: 'data-preparation',
    });
    const user = userEvent.setup();
    const { adapter, submit } = mockAdapter();
    render(<DemoForm adapter={adapter} />);
    expect(await screen.findByRole('status')).toHaveTextContent('Assessment context added');
    await fillStepOne(user);
    expect(screen.getByLabelText('Priority workflow')).toHaveValue('data-preparation');
    expect(window.location.search).toBe('');
    await user.selectOptions(screen.getByLabelText('Desired start window'), 'exploring');
    await user.click(screen.getByRole('checkbox', { name: /Final privacy wording/i }));
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));
    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0]?.[0]).toMatchObject({
      source: 'assessment-discussion',
      assessment: {
        impactScore: 75,
        readinessScore: 50,
        quadrant: 'prepare-foundation',
      },
    });
  });

  it('validates step two and allows back navigation without losing step one', async () => {
    const user = userEvent.setup();
    render(<DemoForm adapter={mockAdapter().adapter} />);
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));
    expect(screen.getByText('Choose a priority workflow.')).toBeInTheDocument();
    expect(screen.getByText('Choose a desired start window.')).toBeInTheDocument();
    expect(screen.getByText(/Acknowledge how these details/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByLabelText('Work email')).toHaveValue('alex@example.test');
  });

  it('reports a server failure and successfully retries', async () => {
    const user = userEvent.setup();
    const submit = vi
      .fn()
      .mockRejectedValueOnce(
        new LeadSubmissionError('submission-rejected', 'Server unavailable. Try again.'),
      )
      .mockResolvedValueOnce({ submissionId: 'retry-success' });
    render(<DemoForm adapter={{ submit }} />);
    await fillStepOne(user);
    await fillStepTwo(user);
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Server unavailable');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Request confirmed');
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it('blocks duplicate submission while the first request is pending', async () => {
    const user = userEvent.setup();
    let resolveSubmission: ((value: { submissionId: string }) => void) | undefined;
    const submit = vi.fn(
      () =>
        new Promise<{ submissionId: string }>((resolve) => {
          resolveSubmission = resolve;
        }),
    );
    render(<DemoForm adapter={{ submit }} />);
    await fillStepOne(user);
    await fillStepTwo(user);
    const button = screen.getByRole('button', { name: 'Request a demo' });
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
    expect(submit).toHaveBeenCalledOnce();
    resolveSubmission?.({ submissionId: 'complete' });
    expect(await screen.findByRole('status')).toHaveTextContent('Request confirmed');
  });
});

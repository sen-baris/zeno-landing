import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import DemoForm from '../../src/components/islands/DemoForm';
import { saveAssessmentContext } from '../../src/lib/assessment/storage';
import { LeadSubmissionError } from '../../src/lib/leads/adapter';
import type { LeadSubmission, LeadSubmissionAdapter } from '../../src/lib/leads/types';

const privacyAcknowledgement = 'I agree that Zeno may use these details to respond to my request.';

function mockAdapter() {
  const submit = vi
    .fn<LeadSubmissionAdapter['submit']>()
    .mockResolvedValue({ submissionId: 'demo-test' });
  const adapter: LeadSubmissionAdapter = {
    submit: (submission: LeadSubmission, signal?: AbortSignal) => submit(submission, signal),
  };
  return { adapter, submit };
}

async function fillRequiredForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Alex Example');
  await user.type(screen.getByLabelText('Work email'), 'alex@example.test');
  await user.type(screen.getByLabelText('Company'), 'Example Test Company');
  await user.type(screen.getByLabelText('Phone number (optional)'), '+49 30 1234567');
  await user.click(screen.getByRole('checkbox', { name: privacyAcknowledgement }));
}

describe('compact demo form', () => {
  it('server-renders the complete form disabled before hydration', () => {
    const markup = renderToStaticMarkup(
      <DemoForm adapter={mockAdapter().adapter} privacyAcknowledgement={privacyAcknowledgement} />,
    );
    const document = new DOMParser().parseFromString(markup, 'text/html');
    const fieldset = document.querySelector('fieldset');

    expect(document.querySelector('.demo-form')?.getAttribute('data-hydrated')).toBe('false');
    expect(fieldset?.hasAttribute('disabled')).toBe(true);
    expect(document.querySelector('#demo-fullName')).not.toBeNull();
    expect(document.querySelector('#demo-phoneNumber')).not.toBeNull();
    expect(document.querySelector('#demo-priorityWorkflow')).toBeNull();
    expect(document.querySelector('button[type="submit"]')?.hasAttribute('disabled')).toBe(true);
    expect(document.body.textContent).toContain('If it does not, enable JavaScript and reload.');
  });

  it('validates the request requirements and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(
      <DemoForm adapter={mockAdapter().adapter} privacyAcknowledgement={privacyAcknowledgement} />,
    );
    const button = screen.getByRole('button', { name: 'Request a demo' });
    await waitFor(() => expect(button).toBeEnabled());
    await user.click(button);

    const fullName = screen.getByLabelText('Full name');
    expect(fullName).toHaveFocus();
    expect(fullName).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter your full name.')).toHaveAttribute('id', 'demo-fullName-error');
    expect(screen.getByText('Enter a valid work email.')).toHaveAttribute(
      'id',
      'demo-workEmail-error',
    );
    expect(screen.getByText(/Acknowledge how these details/i)).toBeInTheDocument();
  });

  it('submits a minimal meeting request and leaves marketing false', async () => {
    const user = userEvent.setup();
    const { adapter, submit } = mockAdapter();
    render(<DemoForm adapter={adapter} privacyAcknowledgement={privacyAcknowledgement} />);
    await waitFor(() => expect(screen.getByLabelText('Work email')).toBeEnabled());
    await fillRequiredForm(user);
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Request confirmed');
    expect(submit).toHaveBeenCalledOnce();
    expect(submit.mock.calls[0]?.[0]).toEqual({
      source: 'demo',
      contact: {
        fullName: 'Alex Example',
        workEmail: 'alex@example.test',
        phoneNumber: '+49 30 1234567',
      },
      company: { name: 'Example Test Company' },
      intent: {},
      consent: { privacyAcknowledged: true, marketing: false },
      attribution: { landingPath: '/demo' },
    });
  });

  it('reveals optional planning context and includes only completed values', async () => {
    const user = userEvent.setup();
    const { adapter, submit } = mockAdapter();
    render(<DemoForm adapter={adapter} privacyAcknowledgement={privacyAcknowledgement} />);
    await waitFor(() => expect(screen.getByLabelText('Work email')).toBeEnabled());
    await fillRequiredForm(user);
    await user.click(screen.getByText('Add planning context (optional)'));
    await user.type(screen.getByLabelText('Role'), 'Innovation lead');
    await user.selectOptions(screen.getByLabelText('Organization size'), '1000-4999');
    await user.type(screen.getByLabelText(/Systems or context/i), 'Synthetic approved sources');
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));

    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0]?.[0]).toMatchObject({
      company: {
        name: 'Example Test Company',
        role: 'Innovation lead',
        sizeBand: '1000-4999',
      },
      intent: {
        systemsContext: 'Synthetic approved sources',
      },
    });
    expect(submit.mock.calls[0]?.[0].intent).not.toHaveProperty('desiredStart');
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
    render(<DemoForm adapter={adapter} privacyAcknowledgement={privacyAcknowledgement} />);
    expect(await screen.findByRole('status')).toHaveTextContent('Assessment context added');
    expect(screen.queryByLabelText('Priority workflow')).not.toBeInTheDocument();
    expect(window.location.search).toBe('');
    await user.type(screen.getByLabelText('Full name'), 'Alex Example');
    await user.type(screen.getByLabelText('Work email'), 'alex@example.test');
    await user.type(screen.getByLabelText('Company'), 'Example Test Company');
    await user.click(screen.getByRole('checkbox', { name: privacyAcknowledgement }));
    await user.click(screen.getByRole('button', { name: 'Request a demo' }));
    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0]?.[0]).toMatchObject({
      source: 'assessment-discussion',
      intent: { priorityWorkflow: 'data-preparation' },
      assessment: {
        impactScore: 75,
        readinessScore: 50,
        quadrant: 'prepare-foundation',
      },
    });
    expect(submit.mock.calls[0]?.[0].contact).not.toHaveProperty('phoneNumber');
  });

  it('reports a server failure and successfully retries', async () => {
    const user = userEvent.setup();
    const submit = vi
      .fn()
      .mockRejectedValueOnce(
        new LeadSubmissionError('submission-rejected', 'Server unavailable. Try again.'),
      )
      .mockResolvedValueOnce({ submissionId: 'retry-success' });
    render(<DemoForm adapter={{ submit }} privacyAcknowledgement={privacyAcknowledgement} />);
    await waitFor(() => expect(screen.getByLabelText('Work email')).toBeEnabled());
    await fillRequiredForm(user);
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
    render(<DemoForm adapter={{ submit }} privacyAcknowledgement={privacyAcknowledgement} />);
    await waitFor(() => expect(screen.getByLabelText('Work email')).toBeEnabled());
    await fillRequiredForm(user);
    const button = screen.getByRole('button', { name: 'Request a demo' });
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
    expect(submit).toHaveBeenCalledOnce();
    resolveSubmission?.({ submissionId: 'complete' });
    expect(await screen.findByRole('status')).toHaveTextContent('Request confirmed');
  });
});

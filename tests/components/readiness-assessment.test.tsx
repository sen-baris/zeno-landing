import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReadinessAssessment from '../../src/components/islands/ReadinessAssessment';
import { assessmentQuestions } from '../../src/lib/assessment/questions';
import { LeadSubmissionError } from '../../src/lib/leads/adapter';
import type { LeadSubmission, LeadSubmissionAdapter } from '../../src/lib/leads/types';

function mockAdapter() {
  const submit = vi
    .fn<LeadSubmissionAdapter['submit']>()
    .mockResolvedValue({ submissionId: 'test-lead' });
  const adapter: LeadSubmissionAdapter = {
    submit: (submission: LeadSubmission, signal?: AbortSignal) => submit(submission, signal),
  };
  return { adapter, submit };
}

async function beginAssessment(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: /Research and synthesis/i }));
  await user.click(screen.getByRole('button', { name: 'Begin assessment' }));
}

async function completeAssessment(user: ReturnType<typeof userEvent.setup>, optionIndex = 4) {
  await beginAssessment(user);
  for (const [index, question] of assessmentQuestions.entries()) {
    await user.click(
      screen.getByRole('radio', { name: question.options[optionIndex]?.label ?? '' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: index === assessmentQuestions.length - 1 ? 'See my result' : 'Next question',
      }),
    );
  }
}

describe('AI Readiness Assessment', () => {
  it('delivers setup and score questions before asking for contact data', async () => {
    const user = userEvent.setup();
    render(<ReadinessAssessment adapter={mockAdapter().adapter} />);

    expect(screen.queryByLabelText(/Work email/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Begin assessment' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose the workflow');

    await beginAssessment(user);
    expect(screen.getByRole('progressbar', { name: 'Assessment progress' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
    expect(screen.getByText('Question 1 of 9')).toBeInTheDocument();
  });

  it('supports keyboard selection, validation feedback, progress, and back navigation', async () => {
    const user = userEvent.setup();
    render(<ReadinessAssessment adapter={mockAdapter().adapter} />);
    await beginAssessment(user);

    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose the answer');

    const firstAnswer = screen.getByRole('radio', { name: 'Quarterly or less' });
    firstAnswer.focus();
    await user.keyboard(' ');
    expect(firstAnswer).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByText('Question 2 of 9')).toBeInTheDocument();
    expect(screen.getByText('How much team capacity does it absorb?')).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Question 1 of 9')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Quarterly or less' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Choose one workflow')).toBeInTheDocument();
  });

  it('shows both scores, quadrant, recommendation, actions, and methodology note', async () => {
    const user = userEvent.setup();
    render(<ReadinessAssessment adapter={mockAdapter().adapter} />);
    await completeAssessment(user);

    expect(screen.getByRole('heading', { name: 'Launch candidate' })).toBeInTheDocument();
    expect(screen.getAllByText('100')).toHaveLength(2);
    expect(screen.getByText('Launch research and synthesis.')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText(/not an ROI or savings estimate/i)).toBeInTheDocument();
    expect(window.sessionStorage.getItem('zeno-assessment-context')).toContain(
      'research-synthesis',
    );
  });

  it('validates and submits the optional email action plan', async () => {
    const user = userEvent.setup();
    const { adapter, submit } = mockAdapter();
    render(<ReadinessAssessment adapter={adapter} />);
    await completeAssessment(user, 2);
    await user.click(screen.getByRole('button', { name: 'Email my action plan' }));
    await user.click(screen.getByRole('button', { name: 'Send my action plan' }));
    expect(screen.getByText('Enter a valid work email.')).toBeInTheDocument();
    expect(screen.getByText('Enter your company name.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Work email'), 'alex@example.test');
    await user.type(screen.getByLabelText('Company'), 'Example Test Company');
    await user.click(
      screen.getByRole('checkbox', {
        name: /acknowledge that these details will be used/i,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Send my action plan' }));

    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0]?.[0]).toMatchObject({
      source: 'assessment-email',
      contact: { workEmail: 'alex@example.test' },
      assessment: { impactScore: 50, readinessScore: 50 },
      consent: { privacyAcknowledged: true, marketing: false },
    });
    expect(await screen.findByRole('status')).toHaveTextContent('confirmed');
  });

  it('reports submission failure and permits a verified retry', async () => {
    const user = userEvent.setup();
    const submit = vi
      .fn()
      .mockRejectedValueOnce(
        new LeadSubmissionError('network-failure', 'Connection unavailable. Try again.'),
      )
      .mockResolvedValueOnce({ submissionId: 'retry-ok' });
    render(<ReadinessAssessment adapter={{ submit }} />);
    await completeAssessment(user);
    await user.click(screen.getByRole('button', { name: 'Email my action plan' }));
    await user.type(screen.getByLabelText('Work email'), 'alex@example.test');
    await user.type(screen.getByLabelText('Company'), 'Example Test Company');
    await user.click(screen.getByRole('checkbox', { name: /acknowledge/i }));
    await user.click(screen.getByRole('button', { name: 'Send my action plan' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Connection unavailable');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('status')).toHaveTextContent('confirmed');
    expect(submit).toHaveBeenCalledTimes(2);
  });
});

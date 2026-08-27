import { useEffect, useMemo, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { trackConsentedEvent } from '../../lib/analytics/consented-events';
import { assessmentQuestions, workflowOptions } from '../../lib/assessment/questions';
import { calculateAssessment } from '../../lib/assessment/scoring';
import { saveAssessmentContext } from '../../lib/assessment/storage';
import type { AssessmentResult, WorkflowCategory } from '../../lib/assessment/types';
import { createLeadSubmissionAdapter, LeadSubmissionError } from '../../lib/leads/adapter';
import { withBase } from '../../lib/routing/base-path';
import type { LeadSubmissionAdapter } from '../../lib/leads/types';
import { isValidEmail } from '../../lib/leads/validation';

interface Props {
  adapter?: LeadSubmissionAdapter;
}

type AssessmentStage = 'select-workflow' | 'questions' | 'result';

export default function ReadinessAssessment({ adapter: suppliedAdapter }: Props) {
  const adapter = useMemo(
    () => suppliedAdapter ?? createLeadSubmissionAdapter(),
    [suppliedAdapter],
  );
  const [stage, setStage] = useState<AssessmentStage>('select-workflow');
  const [workflow, setWorkflow] = useState<WorkflowCategory | ''>('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionError, setQuestionError] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const questionLegendRef = useRef<HTMLLegendElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (stage === 'questions') questionLegendRef.current?.focus();
    if (stage === 'result') resultHeadingRef.current?.focus();
  }, [questionIndex, stage]);
  useEffect(() => {
    if (showEmailForm) emailInputRef.current?.focus();
  }, [showEmailForm]);

  const currentQuestion = assessmentQuestions[questionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  function startAssessment() {
    if (!workflow) {
      setQuestionError('Choose the workflow you want to assess.');
      return;
    }
    setQuestionError('');
    setStage('questions');
    trackConsentedEvent({ name: 'assessment_started' });
  }

  function selectAnswer(questionId: string, value: number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setQuestionError('');
  }

  function goForward() {
    if (!currentQuestion || currentAnswer === undefined) {
      setQuestionError('Choose the answer that best matches this workflow.');
      return;
    }

    if (questionIndex < assessmentQuestions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setQuestionError('');
      return;
    }

    if (!workflow) return;
    const completed = calculateAssessment(answers, workflow);
    setResult(completed);
    saveAssessmentContext({
      impactScore: completed.impactScore,
      readinessScore: completed.readinessScore,
      quadrant: completed.quadrant,
      workflow,
    });
    setStage('result');
    trackConsentedEvent({
      name: 'assessment_completed',
      impactScore: completed.impactScore,
      readinessScore: completed.readinessScore,
      quadrant: completed.quadrant,
    });
  }

  function goBack() {
    if (questionIndex === 0) {
      setStage('select-workflow');
      return;
    }
    setQuestionIndex((index) => index - 1);
    setQuestionError('');
  }

  function revealEmailForm() {
    setShowEmailForm(true);
    trackConsentedEvent({ name: 'result_cta_selected', action: 'email-plan' });
  }

  async function submitEmailPlan(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result || !workflow || submissionState === 'submitting') return;

    const errors: Record<string, string> = {};
    if (!isValidEmail(email)) errors.email = 'Enter a valid work email.';
    if (!company.trim()) errors.company = 'Enter your company name.';
    if (!privacyAcknowledged) {
      errors.privacy = 'Acknowledge how these details will be used.';
    }
    setEmailErrors(errors);
    if (Object.keys(errors).length > 0) {
      window.setTimeout(() => {
        const first = ['email', 'company', 'privacy'].find((field) => errors[field]);
        document.getElementById(`assessment-${first ?? 'email'}`)?.focus();
      }, 0);
      return;
    }

    if (submissionState === 'error') {
      trackConsentedEvent({ name: 'submission_retried', surface: 'assessment' });
    }
    setSubmissionState('submitting');
    setSubmissionMessage('');
    abortRef.current = new AbortController();

    try {
      const receipt = await adapter.submit(
        {
          source: 'assessment-email',
          contact: { workEmail: email.trim() },
          company: { name: company.trim() },
          intent: { priorityWorkflow: workflow },
          assessment: {
            impactScore: result.impactScore,
            readinessScore: result.readinessScore,
            quadrant: result.quadrant,
          },
          consent: { privacyAcknowledged, marketing: false },
          attribution: { landingPath: '/ai-readiness' },
        },
        abortRef.current.signal,
      );
      setSubmissionState('success');
      setSubmissionMessage(
        receipt.submissionId.startsWith('preview-')
          ? 'Preview action plan generated. No email was sent.'
          : 'Your action-plan request is confirmed.',
      );
    } catch (error) {
      if (abortRef.current.signal.aborted) return;
      const message =
        error instanceof LeadSubmissionError
          ? error.message
          : 'The request could not be sent. Please try again.';
      const code = error instanceof LeadSubmissionError ? error.code : 'unexpected';
      setSubmissionState('error');
      setSubmissionMessage(message);
      trackConsentedEvent({ name: 'submission_failed', surface: 'assessment', code });
    }
  }

  if (stage === 'select-workflow') {
    return (
      <div className="assessment-card">
        <div className="assessment-card-head">
          <span>Setup / Not scored</span>
          <strong>Choose one workflow</strong>
        </div>
        <fieldset className="option-fieldset">
          <legend>Which type of work do you want to assess?</legend>
          <div className="workflow-options">
            {workflowOptions.map((option) => (
              <label className="workflow-option" key={option.id}>
                <input
                  type="radio"
                  name="workflow"
                  value={option.id}
                  checked={workflow === option.id}
                  onChange={() => {
                    setWorkflow(option.id);
                    setQuestionError('');
                  }}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {questionError && (
          <p className="form-error" role="alert">
            {questionError}
          </p>
        )}
        <div className="assessment-actions">
          <span>No contact information required</span>
          <button className="button button-primary" type="button" onClick={startAssessment}>
            Begin assessment
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'questions' && currentQuestion) {
    const progress = ((questionIndex + 1) / assessmentQuestions.length) * 100;
    return (
      <div className="assessment-card">
        <div className="assessment-progress-copy">
          <span>
            {currentQuestion.axis} / {currentQuestion.category}
          </span>
          <strong>
            Question {questionIndex + 1} of {assessmentQuestions.length}
          </strong>
        </div>
        <div
          className="assessment-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={assessmentQuestions.length}
          aria-valuenow={questionIndex + 1}
          aria-label="Assessment progress"
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <fieldset className="option-fieldset question-fieldset">
          <legend ref={questionLegendRef} tabIndex={-1}>
            {currentQuestion.prompt}
          </legend>
          <div className="answer-options">
            {currentQuestion.options.map((option) => (
              <label className="answer-option" key={option.id}>
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={currentAnswer === option.value}
                  onChange={() => selectAnswer(currentQuestion.id, option.value)}
                />
                <span className="answer-value" aria-hidden="true">
                  {option.value}
                </span>
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {questionError && (
          <p className="form-error" role="alert">
            {questionError}
          </p>
        )}
        <div className="assessment-actions">
          <button className="button button-ghost" type="button" onClick={goBack}>
            Back
          </button>
          <button className="button button-primary" type="button" onClick={goForward}>
            {questionIndex === assessmentQuestions.length - 1 ? 'See my result' : 'Next question'}
          </button>
        </div>
      </div>
    );
  }

  if (!result || !workflow) return null;

  return (
    <div className="assessment-result">
      <div className="result-heading">
        <div>
          <p className="eyebrow">Your starting point</p>
          <h2 ref={resultHeadingRef} tabIndex={-1}>
            {result.quadrantLabel}
          </h2>
        </div>
        <span className="evidence-badge">Assessment complete</span>
      </div>
      <div className="score-grid" aria-label="Assessment scores">
        <div>
          <div className="score-label">
            <span>Impact</span>
            <strong>{result.impactScore}</strong>
          </div>
          <div className="score-track" aria-hidden="true">
            <span style={{ width: `${result.impactScore}%` }} />
            <i />
          </div>
        </div>
        <div>
          <div className="score-label">
            <span>Readiness</span>
            <strong>{result.readinessScore}</strong>
          </div>
          <div className="score-track" aria-hidden="true">
            <span style={{ width: `${result.readinessScore}%` }} />
            <i />
          </div>
        </div>
      </div>
      <div className="result-recommendation">
        <span>Recommended first move</span>
        <h3>{result.workflowRecommendation}</h3>
      </div>
      <ol className="action-plan">
        {result.actions.map((action, index) => (
          <li key={action}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {action}
          </li>
        ))}
      </ol>
      <p className="result-method-note">
        Scores reflect only your answers to this assessment. They are not an ROI or savings
        estimate.
      </p>
      <div className="result-actions">
        <button className="button button-primary" type="button" onClick={revealEmailForm}>
          Email my action plan
        </button>
        <a
          className="button button-ghost"
          href={withBase('/demo')}
          onClick={() =>
            trackConsentedEvent({ name: 'result_cta_selected', action: 'discuss-workflow' })
          }
        >
          Discuss this workflow
        </a>
      </div>

      {showEmailForm && submissionState !== 'success' && (
        <form
          className="action-email-form"
          noValidate
          onSubmit={(event) => void submitEmailPlan(event)}
        >
          <div className="form-section-heading">
            <span>Optional follow-up</span>
            <h3>Where should we send the plan?</h3>
          </div>
          <div className="field-grid two-columns">
            <label className="field">
              <span>Work email</span>
              <input
                id="assessment-email"
                ref={emailInputRef}
                type="email"
                aria-label="Work email"
                autoComplete="email"
                value={email}
                aria-invalid={Boolean(emailErrors.email)}
                aria-describedby={emailErrors.email ? 'assessment-email-error' : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {emailErrors.email && <small id="assessment-email-error">{emailErrors.email}</small>}
            </label>
            <label className="field">
              <span>Company</span>
              <input
                id="assessment-company"
                type="text"
                aria-label="Company"
                autoComplete="organization"
                value={company}
                aria-invalid={Boolean(emailErrors.company)}
                aria-describedby={emailErrors.company ? 'assessment-company-error' : undefined}
                onChange={(event) => setCompany(event.target.value)}
              />
              {emailErrors.company && (
                <small id="assessment-company-error">{emailErrors.company}</small>
              )}
            </label>
          </div>
          <label className="check-field">
            <input
              id="assessment-privacy"
              type="checkbox"
              checked={privacyAcknowledged}
              aria-invalid={Boolean(emailErrors.privacy)}
              aria-describedby={emailErrors.privacy ? 'assessment-privacy-error' : undefined}
              onChange={(event) => setPrivacyAcknowledged(event.target.checked)}
            />
            <span>I acknowledge that these details will be used to respond to this request.</span>
          </label>
          {emailErrors.privacy && (
            <p className="form-error" id="assessment-privacy-error">
              {emailErrors.privacy}
            </p>
          )}
          {submissionMessage && (
            <p className="submission-message error" role="alert">
              {submissionMessage}
            </p>
          )}
          <button
            className="button button-ink"
            type="submit"
            disabled={submissionState === 'submitting'}
          >
            {submissionState === 'submitting'
              ? 'Sending…'
              : submissionState === 'error'
                ? 'Try again'
                : 'Send my action plan'}
          </button>
        </form>
      )}
      {submissionState === 'success' && (
        <p className="submission-message success" role="status">
          {submissionMessage}
        </p>
      )}
    </div>
  );
}

import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';
import { trackConsentedEvent } from '../../lib/analytics/consented-events';
import { workflowOptions } from '../../lib/assessment/questions';
import { loadAssessmentContext } from '../../lib/assessment/storage';
import type { StoredAssessmentContext } from '../../lib/assessment/storage';
import type { WorkflowCategory } from '../../lib/assessment/types';
import { createLeadSubmissionAdapter, LeadSubmissionError } from '../../lib/leads/adapter';
import { withBase } from '../../lib/routing/base-path';
import type { LeadSubmissionAdapter } from '../../lib/leads/types';
import {
  validateDemoStep,
  type DemoFormErrors,
  type DemoFormValues,
} from '../../lib/leads/validation';

interface Props {
  adapter?: LeadSubmissionAdapter;
}

const initialValues: DemoFormValues = {
  workEmail: '',
  company: '',
  role: '',
  sizeBand: '',
  priorityWorkflow: '',
  desiredStart: '',
  systemsContext: '',
  privacyAcknowledged: false,
  marketing: false,
};

export default function DemoForm({ adapter: suppliedAdapter }: Props) {
  const adapter = useMemo(
    () => suppliedAdapter ?? createLeadSubmissionAdapter(),
    [suppliedAdapter],
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<DemoFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [initialAssessment] = useState<StoredAssessmentContext | null>(() =>
    loadAssessmentContext(),
  );
  const assessmentRef = useRef<StoredAssessmentContext | null>(initialAssessment);
  const abortRef = useRef<AbortController | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const didNavigateRef = useRef(false);

  const [values, setValues] = useState<DemoFormValues>(() => ({
    ...initialValues,
    ...(initialAssessment ? { priorityWorkflow: initialAssessment.workflow } : {}),
  }));
  const hasAssessment = initialAssessment !== null;

  useEffect(() => {
    trackConsentedEvent({
      name: 'demo_started',
      source: initialAssessment ? 'assessment' : 'direct',
    });
    return () => {
      abortRef.current?.abort();
    };
  }, [initialAssessment]);
  useEffect(() => {
    if (didNavigateRef.current) stepHeadingRef.current?.focus();
  }, [step]);

  function updateValue<Key extends keyof DemoFormValues>(key: Key, value: DemoFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function focusFirstError(nextErrors: DemoFormErrors) {
    const first = Object.keys(nextErrors)[0];
    if (first) window.setTimeout(() => document.getElementById(`demo-${first}`)?.focus(), 0);
  }

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validateDemoStep(step, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    if (step === 1) {
      didNavigateRef.current = true;
      setStep(2);
      return;
    }

    if (status === 'error') {
      trackConsentedEvent({ name: 'submission_retried', surface: 'demo' });
    }
    setStatus('submitting');
    setMessage('');
    abortRef.current = new AbortController();
    const assessment = assessmentRef.current;

    try {
      const receipt = await adapter.submit(
        {
          source: assessment ? 'assessment-discussion' : 'demo',
          contact: { workEmail: values.workEmail.trim() },
          company: {
            name: values.company.trim(),
            role: values.role.trim(),
            sizeBand: values.sizeBand,
          },
          intent: {
            priorityWorkflow: values.priorityWorkflow as WorkflowCategory,
            desiredStart: values.desiredStart,
            ...(values.systemsContext.trim()
              ? { systemsContext: values.systemsContext.trim() }
              : {}),
          },
          ...(assessment
            ? {
                assessment: {
                  impactScore: assessment.impactScore,
                  readinessScore: assessment.readinessScore,
                  quadrant: assessment.quadrant,
                },
              }
            : {}),
          consent: {
            privacyAcknowledged: values.privacyAcknowledged,
            marketing: values.marketing,
          },
          attribution: { landingPath: '/demo' },
        },
        abortRef.current.signal,
      );
      setStatus('success');
      setMessage(
        receipt.submissionId.startsWith('preview-')
          ? 'Preview request confirmed. No information was sent.'
          : 'Request confirmed. We have the workflow context needed for the next step.',
      );
      trackConsentedEvent({
        name: 'demo_submitted',
        source: assessment ? 'assessment' : 'direct',
      });
    } catch (error) {
      if (abortRef.current.signal.aborted) return;
      const code = error instanceof LeadSubmissionError ? error.code : 'unexpected';
      setStatus('error');
      setMessage(
        error instanceof LeadSubmissionError
          ? error.message
          : 'The request could not be sent. Please try again.',
      );
      trackConsentedEvent({ name: 'submission_failed', surface: 'demo', code });
    }
  }

  if (status === 'success') {
    return (
      <div className="demo-form demo-success" role="status">
        <span className="evidence-badge">Submission confirmed</span>
        <h2>Thank you. The workflow is in the ledger.</h2>
        <p>{message}</p>
        <a className="button button-ink" href={withBase('/')}>
          Return home
        </a>
      </div>
    );
  }

  return (
    <form className="demo-form" noValidate onSubmit={(event) => void submit(event)}>
      <div className="demo-progress">
        <div>
          <span>Request / Step {step} of 2</span>
          <strong>{step === 1 ? 'About you' : 'About the work'}</strong>
        </div>
        <div
          role="progressbar"
          aria-label="Demo request progress"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={step}
        >
          <span style={{ width: `${step * 50}%` }} />
        </div>
      </div>

      {hasAssessment && (
        <p className="prefill-note" role="status">
          Assessment context added. Your answers and contact details are not in the URL.
        </p>
      )}

      {step === 1 ? (
        <div className="form-step" aria-labelledby="demo-step-one">
          <div className="form-section-heading">
            <span>Contact</span>
            <h2 id="demo-step-one" ref={stepHeadingRef} tabIndex={-1}>
              Who should we prepare for?
            </h2>
          </div>
          <div className="field-grid two-columns">
            <Field
              id="workEmail"
              label="Work email"
              error={errors.workEmail}
              input={
                <input
                  id="demo-workEmail"
                  type="email"
                  autoComplete="email"
                  value={values.workEmail}
                  onChange={(event) => updateValue('workEmail', event.target.value)}
                />
              }
            />
            <Field
              id="company"
              label="Company"
              error={errors.company}
              input={
                <input
                  id="demo-company"
                  type="text"
                  autoComplete="organization"
                  value={values.company}
                  onChange={(event) => updateValue('company', event.target.value)}
                />
              }
            />
            <Field
              id="role"
              label="Role"
              error={errors.role}
              input={
                <input
                  id="demo-role"
                  type="text"
                  autoComplete="organization-title"
                  value={values.role}
                  onChange={(event) => updateValue('role', event.target.value)}
                />
              }
            />
            <Field
              id="sizeBand"
              label="Organization size"
              error={errors.sizeBand}
              input={
                <select
                  id="demo-sizeBand"
                  value={values.sizeBand}
                  onChange={(event) => updateValue('sizeBand', event.target.value)}
                >
                  <option value="">Choose a band</option>
                  <option value="1-249">1–249 people</option>
                  <option value="250-999">250–999 people</option>
                  <option value="1000-4999">1,000–4,999 people</option>
                  <option value="5000-plus">5,000+ people</option>
                </select>
              }
            />
          </div>
        </div>
      ) : (
        <div className="form-step" aria-labelledby="demo-step-two">
          <div className="form-section-heading">
            <span>Workflow</span>
            <h2 id="demo-step-two" ref={stepHeadingRef} tabIndex={-1}>
              What should move forward?
            </h2>
          </div>
          <div className="field-grid">
            <Field
              id="priorityWorkflow"
              label="Priority workflow"
              error={errors.priorityWorkflow}
              input={
                <select
                  id="demo-priorityWorkflow"
                  value={values.priorityWorkflow}
                  onChange={(event) => updateValue('priorityWorkflow', event.target.value)}
                >
                  <option value="">Choose a workflow</option>
                  {workflowOptions.map((option) => (
                    <option value={option.id} key={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              }
            />
            <Field
              id="desiredStart"
              label="Desired start window"
              error={errors.desiredStart}
              input={
                <select
                  id="demo-desiredStart"
                  value={values.desiredStart}
                  onChange={(event) => updateValue('desiredStart', event.target.value)}
                >
                  <option value="">Choose a window</option>
                  <option value="exploring">Exploring now</option>
                  <option value="0-3-months">Within 3 months</option>
                  <option value="3-6-months">Within 3–6 months</option>
                  <option value="6-plus-months">More than 6 months</option>
                </select>
              }
            />
            <label className="field">
              <span>
                Systems or context <small>Optional</small>
              </span>
              <textarea
                id="demo-systemsContext"
                rows={4}
                value={values.systemsContext}
                onChange={(event) => updateValue('systemsContext', event.target.value)}
                placeholder="For example: approved knowledge sources, reporting tools, or systems involved"
              />
            </label>
          </div>
          <div className="consent-group">
            <label className="check-field">
              <input
                id="demo-privacyAcknowledged"
                type="checkbox"
                checked={values.privacyAcknowledged}
                aria-invalid={Boolean(errors.privacyAcknowledged)}
                aria-describedby={
                  errors.privacyAcknowledged ? 'demo-privacyAcknowledged-error' : undefined
                }
                onChange={(event) => updateValue('privacyAcknowledged', event.target.checked)}
              />
              <span>
                I acknowledge that Zeno will use these details to respond to this request. Final
                privacy wording is pending legal approval.
              </span>
            </label>
            {errors.privacyAcknowledged && (
              <small className="field-error" id="demo-privacyAcknowledged-error">
                {errors.privacyAcknowledged}
              </small>
            )}
            <label className="check-field">
              <input
                type="checkbox"
                checked={values.marketing}
                onChange={(event) => updateValue('marketing', event.target.checked)}
              />
              <span>Send me occasional Zeno updates. Optional and unchecked by default.</span>
            </label>
          </div>
        </div>
      )}

      {message && (
        <p className="submission-message error" role="alert">
          {message}
        </p>
      )}

      <div className="demo-form-actions">
        {step === 2 && (
          <button
            className="button button-ghost"
            type="button"
            onClick={() => {
              didNavigateRef.current = true;
              setStep(1);
            }}
          >
            Back
          </button>
        )}
        <button className="button button-primary" type="submit" disabled={status === 'submitting'}>
          {step === 1
            ? 'Continue'
            : status === 'submitting'
              ? 'Submitting…'
              : status === 'error'
                ? 'Try again'
                : 'Request a demo'}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: keyof DemoFormValues;
  label: string;
  error: string | undefined;
  input: ReactElement;
}

function Field({ id, label, error, input }: FieldProps) {
  const errorId = `demo-${id}-error`;
  const formControl = input as ReactElement<Record<string, unknown>>;
  return (
    <label className="field">
      <span>{label}</span>
      {input &&
        /* Cloning keeps the form control's accessible error contract next to its single owner. */
        cloneElement(formControl, {
          'aria-label': label,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? errorId : undefined,
        })}
      {error && (
        <small className="field-error" id={errorId}>
          {error}
        </small>
      )}
    </label>
  );
}

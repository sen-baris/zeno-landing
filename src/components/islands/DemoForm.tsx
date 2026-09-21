import { cloneElement, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';
import { trackConsentedEvent } from '../../lib/analytics/consented-events';
import { createLeadSubmissionAdapter, LeadSubmissionError } from '../../lib/leads/adapter';
import { demoFormUiCopy, localizeDemoErrors } from '../../lib/i18n/forms';
import type { Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/routes';
import { withBase } from '../../lib/routing/base-path';
import type { LeadSubmissionAdapter } from '../../lib/leads/types';
import {
  validateDemoForm,
  type DemoFormErrors,
  type DemoFormValues,
} from '../../lib/leads/validation';

interface Props {
  adapter?: LeadSubmissionAdapter;
  locale?: Locale;
  privacyAcknowledgement: string;
}

const initialValues: DemoFormValues = {
  fullName: '',
  workEmail: '',
  company: '',
  phoneNumber: '',
  role: '',
  sizeBand: '',
  desiredStart: '',
  systemsContext: '',
  privacyAcknowledged: false,
  marketing: false,
};

const subscribeToHydration = () => () => undefined;

export default function DemoForm({
  privacyAcknowledgement,
  locale = 'en',
  adapter: suppliedAdapter,
}: Props) {
  const copy = demoFormUiCopy[locale];
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const adapter = useMemo(
    () => suppliedAdapter ?? createLeadSubmissionAdapter(),
    [suppliedAdapter],
  );
  const [errors, setErrors] = useState<DemoFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const [values, setValues] = useState<DemoFormValues>(initialValues);

  useEffect(() => {
    trackConsentedEvent({ name: 'demo_started' });
    return () => {
      abortRef.current?.abort();
    };
  }, []);

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

    const nextErrors = localizeDemoErrors(validateDemoForm(values), locale);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    if (status === 'error') {
      trackConsentedEvent({ name: 'submission_retried', surface: 'demo' });
    }
    setStatus('submitting');
    setMessage('');
    abortRef.current = new AbortController();

    const role = values.role.trim();
    const phoneNumber = values.phoneNumber.trim();
    const systemsContext = values.systemsContext.trim();

    try {
      const receipt = await adapter.submit(
        {
          source: 'demo',
          contact: {
            fullName: values.fullName.trim(),
            workEmail: values.workEmail.trim(),
            ...(phoneNumber ? { phoneNumber } : {}),
          },
          company: {
            name: values.company.trim(),
            ...(role ? { role } : {}),
            ...(values.sizeBand ? { sizeBand: values.sizeBand } : {}),
          },
          intent: {
            ...(values.desiredStart ? { desiredStart: values.desiredStart } : {}),
            ...(systemsContext ? { systemsContext } : {}),
          },
          consent: {
            privacyAcknowledged: values.privacyAcknowledged,
            marketing: false,
          },
          attribution: {
            landingPath: getLocalizedPath({ kind: 'static', key: 'demo' }, locale) ?? '/demo',
          },
        },
        abortRef.current.signal,
      );
      setStatus('success');
      setMessage(receipt.submissionId.startsWith('preview-') ? copy.previewSuccess : copy.success);
      trackConsentedEvent({ name: 'demo_submitted' });
    } catch (error) {
      if (abortRef.current.signal.aborted) return;
      const code = error instanceof LeadSubmissionError ? error.code : 'unexpected';
      setStatus('error');
      setMessage(
        error instanceof LeadSubmissionError && locale === 'en'
          ? error.message
          : copy.unexpectedError,
      );
      trackConsentedEvent({ name: 'submission_failed', surface: 'demo', code });
    }
  }

  if (status === 'success') {
    return (
      <div className="demo-form demo-success" data-hydrated="true" role="status">
        <span className="evidence-badge">{copy.submissionConfirmed}</span>
        <h2>{copy.successTitle}</h2>
        <p>{message}</p>
        <a
          className="button button-ink"
          href={withBase(getLocalizedPath({ kind: 'static', key: 'home' }, locale) ?? '/')}
        >
          {copy.returnHome}
        </a>
      </div>
    );
  }

  return (
    <form
      className="demo-form"
      data-hydrated={hydrated ? 'true' : 'false'}
      noValidate
      onSubmit={(event) => void submit(event)}
    >
      <header className="demo-form-heading">
        <div>
          <p className="product-label">{copy.requestLabel}</p>
          <h2>{copy.requestTitle}</h2>
        </div>
        <p>{copy.preparationNote}</p>
      </header>

      {!hydrated && (
        <p className="demo-hydration-note" role="status">
          {copy.hydrationNote}
        </p>
      )}
      <fieldset disabled={!hydrated || status === 'submitting'}>
        <legend className="visually-hidden">{copy.legend}</legend>
        <div className="demo-required-grid">
          <Field
            id="fullName"
            label={copy.fullName}
            error={errors.fullName}
            input={
              <input
                id="demo-fullName"
                type="text"
                autoComplete="name"
                value={values.fullName}
                onChange={(event) => updateValue('fullName', event.target.value)}
              />
            }
          />
          <Field
            id="workEmail"
            label={copy.workEmail}
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
            label={copy.company}
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
            id="phoneNumber"
            label={copy.phone}
            error={errors.phoneNumber}
            input={
              <input
                id="demo-phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
                value={values.phoneNumber}
                onChange={(event) => updateValue('phoneNumber', event.target.value)}
              />
            }
          />
        </div>

        <details className="demo-optional-details">
          <summary>{copy.optionalSummary}</summary>
          <div className="field-grid two-columns">
            <Field
              id="role"
              label={copy.role}
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
              label={copy.organizationSize}
              error={errors.sizeBand}
              input={
                <select
                  id="demo-sizeBand"
                  value={values.sizeBand}
                  onChange={(event) => updateValue('sizeBand', event.target.value)}
                >
                  <option value="">{copy.chooseBand}</option>
                  <option value="1-249">{copy.peopleBands[0]}</option>
                  <option value="250-999">{copy.peopleBands[1]}</option>
                  <option value="1000-4999">{copy.peopleBands[2]}</option>
                  <option value="5000-plus">{copy.peopleBands[3]}</option>
                </select>
              }
            />
            <Field
              id="desiredStart"
              label={copy.desiredStart}
              error={errors.desiredStart}
              input={
                <select
                  id="demo-desiredStart"
                  value={values.desiredStart}
                  onChange={(event) => updateValue('desiredStart', event.target.value)}
                >
                  <option value="">{copy.chooseWindow}</option>
                  <option value="exploring">{copy.windows[0]}</option>
                  <option value="0-3-months">{copy.windows[1]}</option>
                  <option value="3-6-months">{copy.windows[2]}</option>
                  <option value="6-plus-months">{copy.windows[3]}</option>
                </select>
              }
            />
            <label className="field demo-systems-context">
              <span>{copy.systems}</span>
              <textarea
                id="demo-systemsContext"
                rows={3}
                value={values.systemsContext}
                onChange={(event) => updateValue('systemsContext', event.target.value)}
                placeholder={copy.systemsPlaceholder}
              />
            </label>
          </div>
        </details>

        <div className="demo-consent-row">
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
            <span>{privacyAcknowledgement}</span>
          </label>
          {errors.privacyAcknowledged && (
            <small className="field-error" id="demo-privacyAcknowledged-error">
              {errors.privacyAcknowledged}
            </small>
          )}
        </div>

        {message && (
          <p className="submission-message error" role="alert">
            {message}
          </p>
        )}

        <div className="demo-form-actions">
          <button
            className="button button-primary"
            type="submit"
            disabled={!hydrated || status === 'submitting'}
          >
            {status === 'submitting'
              ? copy.submitting
              : status === 'error'
                ? copy.retry
                : copy.requestDemo}
          </button>
        </div>
      </fieldset>
    </form>
  );
}

interface FieldProps {
  error: string | undefined;
  id: keyof DemoFormValues;
  input: ReactElement;
  label: string;
}

function Field({ error, id, input, label }: FieldProps) {
  const errorId = `demo-${id}-error`;
  const formControl = input as ReactElement<Record<string, unknown>>;
  return (
    <label className="field">
      <span>{label}</span>
      {cloneElement(formControl, {
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

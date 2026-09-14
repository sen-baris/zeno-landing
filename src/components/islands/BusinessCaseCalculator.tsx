import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FocusEvent,
  type Ref,
  type SyntheticEvent,
} from 'react';
import {
  businessCaseHourlyValueOptions,
  businessCaseHoursOptions,
  businessCaseQuestions,
  businessCaseTeamSizeOptions,
} from '../../lib/content/pricing';
import {
  calculateBusinessCase,
  calculateBusinessCasePilot,
  defaultBusinessCaseDraft,
  formatBusinessCaseCurrency,
  formatBusinessCaseNumber,
  supportedBusinessCaseCurrencies,
  validateBusinessCaseDraft,
  type BusinessCaseDraft,
  type BusinessCaseNumericField,
} from '../../lib/pricing/business-case';
import { withBase } from '../../lib/routing/base-path';

interface BusinessCaseCalculatorProps {
  disclaimer: string;
  method: string;
  pilotMethod: string;
  pilotStatement: string;
  privacyStatement: string;
  title: string;
}

interface NumberFieldProps {
  description: string;
  disabled: boolean;
  error?: string | undefined;
  field: BusinessCaseNumericField;
  label: string;
  max: number;
  min: number;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean | undefined;
  inputRef?: Ref<HTMLInputElement> | undefined;
  step: number;
  value: string;
}

const subscribeToHydration = () => () => undefined;
type GuidedField = (typeof businessCaseQuestions)[number]['field'];

interface GuidedChoiceOption {
  id: string;
  label?: string | undefined;
  value?: number | undefined;
}

const initialChoiceIds: Record<GuidedField, string> = {
  people: '',
  hoursReturnedPerWeek: '',
  hourlyValue: '',
};

const initialCustomValues: Record<GuidedField, string> = {
  people: '',
  hoursReturnedPerWeek: '',
  hourlyValue: '',
};

function getChoiceOptions(field: GuidedField): readonly GuidedChoiceOption[] {
  if (field === 'people') {
    return businessCaseTeamSizeOptions.map((option) => ({
      id: option.id,
      label: option.label,
      value: 'people' in option ? option.people : undefined,
    }));
  }
  if (field === 'hoursReturnedPerWeek') return businessCaseHoursOptions;
  return businessCaseHourlyValueOptions;
}

function NumberField({
  description,
  disabled,
  error,
  field,
  label,
  max,
  min,
  onBlur,
  onChange,
  optional = false,
  inputRef,
  step,
  value,
}: NumberFieldProps) {
  const descriptionId = `business-case-${field}-description`;
  const errorId = `business-case-${field}-error`;
  const describedBy = error ? `${descriptionId} ${errorId}` : descriptionId;

  return (
    <div className="business-case-field">
      <label className="business-case-field-label" htmlFor={`business-case-${field}`}>
        <span>{label}</span>
        {optional && <small>Optional</small>}
      </label>
      <input
        ref={inputRef}
        id={`business-case-${field}`}
        name={field}
        aria-label={label}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onBlur={onBlur}
        onChange={onChange}
      />
      <small id={descriptionId} className="business-case-field-description">
        {description}
      </small>
      {error && (
        <small id={errorId} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

export default function BusinessCaseCalculator({
  disclaimer,
  method,
  pilotMethod,
  pilotStatement,
  privacyStatement,
  title,
}: BusinessCaseCalculatorProps) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [draft, setDraft] = useState<BusinessCaseDraft>(defaultBusinessCaseDraft);
  const draftRef = useRef<BusinessCaseDraft>(defaultBusinessCaseDraft);
  const [choiceIds, setChoiceIds] = useState<Record<GuidedField, string>>(initialChoiceIds);
  const [customValues, setCustomValues] =
    useState<Record<GuidedField, string>>(initialCustomValues);
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<BusinessCaseNumericField, boolean>>>({});
  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const customInputRefs = useRef<Partial<Record<GuidedField, HTMLInputElement | null>>>({});
  const didNavigateRef = useRef(false);
  const shouldFocusCustomFieldRef = useRef<GuidedField | null>(null);

  const validation = validateBusinessCaseDraft(draft);
  const baseValidation = validateBusinessCaseDraft({ ...draft, annualBudget: '' });
  const baseInputs = baseValidation.ok ? baseValidation.values : undefined;
  const baseResults = baseInputs ? calculateBusinessCase(baseInputs) : undefined;
  const pilotEstimate = baseInputs ? calculateBusinessCasePilot(baseInputs) : undefined;
  const completeResults = validation.ok ? calculateBusinessCase(validation.values) : undefined;
  const activeQuestion = businessCaseQuestions[step]!;
  const activeField = activeQuestion.field;
  const activeChoiceOptions = getChoiceOptions(activeField);
  const selectedChoiceOption = activeChoiceOptions.find(
    (option) => option.id === choiceIds[activeField],
  );

  useEffect(() => {
    if (didNavigateRef.current) questionHeadingRef.current?.focus();
  }, [showResult, step]);

  useEffect(() => {
    const field = shouldFocusCustomFieldRef.current;
    if (!field || choiceIds[field] !== 'custom') return;
    shouldFocusCustomFieldRef.current = null;
    customInputRefs.current[field]?.focus();
  }, [choiceIds]);

  function setFieldValue(field: BusinessCaseNumericField, value: string) {
    const nextDraft = { ...draftRef.current, [field]: value };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    setTouched((current) => ({ ...current, [field]: false }));
  }

  function changeField(field: BusinessCaseNumericField, event: ChangeEvent<HTMLInputElement>) {
    setFieldValue(field, event.target.value);
  }

  function selectChoice(field: GuidedField, option: GuidedChoiceOption) {
    setChoiceIds((current) => ({ ...current, [field]: option.id }));
    if (option.value !== undefined) {
      setFieldValue(field, String(option.value));
      return;
    }

    shouldFocusCustomFieldRef.current = field;
    setFieldValue(field, customValues[field]);
  }

  function changeCustomValue(field: GuidedField, event: ChangeEvent<HTMLInputElement>) {
    setCustomValues((current) => ({ ...current, [field]: event.target.value }));
    changeField(field, event);
  }

  const touchField = (field: BusinessCaseNumericField) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
  };
  const visibleError = (field: BusinessCaseNumericField) =>
    touched[field] ? validation.errors[field] : undefined;
  const choiceGroupError = choiceIds[activeField] === '' ? visibleError(activeField) : undefined;

  function focusField(field: BusinessCaseNumericField) {
    const id =
      field !== 'annualBudget' && field !== 'workingWeeks' && choiceIds[field] !== 'custom'
        ? `business-case-${field}-choice-${getChoiceOptions(field)[0]?.id}`
        : `business-case-${field}`;
    document.getElementById(id)?.focus();
  }

  function advance(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const field = activeQuestion.field;
    const currentValidation = validateBusinessCaseDraft(draftRef.current);
    setTouched((current) => ({ ...current, [field]: true }));
    if (currentValidation.errors[field]) {
      focusField(field);
      return;
    }

    didNavigateRef.current = true;
    if (step < businessCaseQuestions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    setShowResult(true);
  }

  function goBack() {
    didNavigateRef.current = true;
    setStep((current) => Math.max(0, current - 1));
  }

  function editEstimate() {
    didNavigateRef.current = true;
    setStep(0);
    setShowResult(false);
  }

  const resultAnnouncement = baseResults
    ? `Your team could get back ${formatBusinessCaseNumber(baseResults.annualHoursReturned, 1)} hours each year, worth an estimated ${formatBusinessCaseCurrency(baseResults.annualCapacityValue, baseResults.currency)} in recovered time.${pilotEstimate ? ` A pilot with ${formatBusinessCaseNumber(pilotEstimate.people)} people represents ${formatBusinessCaseNumber(pilotEstimate.annualHoursReturned, 1)} hours and about ${formatBusinessCaseCurrency(pilotEstimate.annualCapacityValue, baseResults.currency)} in yearly time value.` : ''}${completeResults?.annualBudget !== undefined ? ` Estimated ROI against the annual budget ${formatBusinessCaseNumber(completeResults.roiPercent!, 1)} percent.` : ''}`
    : 'Check the calculation settings to restore the estimate.';

  const choiceLegend =
    activeField === 'people'
      ? 'Choose a team size'
      : activeField === 'hoursReturnedPerWeek'
        ? 'Choose weekly hours returned'
        : 'Choose an hourly value';
  const customLabel =
    activeField === 'people'
      ? 'Exact number of people'
      : activeField === 'hoursReturnedPerWeek'
        ? 'Custom weekly hours'
        : 'Custom hourly value';
  const customDescription =
    activeField === 'people'
      ? 'Enter a whole number between 1 and 100,000.'
      : activeField === 'hoursReturnedPerWeek'
        ? 'Enter a number between 0.1 and 168.'
        : 'Enter a value between 1 and 100,000.';
  const choiceErrorMessage =
    activeField === 'people'
      ? 'Choose a team size or enter a custom amount.'
      : activeField === 'hoursReturnedPerWeek'
        ? 'Choose weekly hours or enter a custom amount.'
        : 'Choose an hourly value or enter a custom amount.';

  function choiceLabel(option: GuidedChoiceOption): string {
    if (option.label) return option.label;
    return formatBusinessCaseCurrency(option.value!, draft.currency);
  }

  return (
    <section
      className="business-case-calculator"
      data-hydrated={hydrated ? 'true' : 'false'}
      aria-label="Business case calculator"
    >
      {!showResult ? (
        <form className="business-case-form" autoComplete="off" onSubmit={advance}>
          <header className="business-case-form-heading">
            <div>
              <p className="product-label">Business case estimate</p>
              <h2>{title}</h2>
            </div>
            <p>{privacyStatement}</p>
          </header>

          <div className="business-case-progress">
            <span>
              Step {step + 1} of {businessCaseQuestions.length}
            </span>
            <div
              role="progressbar"
              aria-label="Business case progress"
              aria-valuemin={1}
              aria-valuemax={businessCaseQuestions.length}
              aria-valuenow={step + 1}
            >
              <span style={{ width: `${((step + 1) / businessCaseQuestions.length) * 100}%` }} />
            </div>
          </div>

          <fieldset className="business-case-question" disabled={!hydrated}>
            <legend className="visually-hidden">Business case question {step + 1}</legend>
            <h3 ref={questionHeadingRef} tabIndex={-1}>
              {activeQuestion.heading}
            </h3>
            <div className="business-case-choice-step">
              <fieldset
                className="business-case-choice-group"
                disabled={!hydrated}
                aria-invalid={choiceGroupError ? 'true' : undefined}
                aria-describedby={
                  choiceGroupError
                    ? `business-case-${activeField}-description business-case-${activeField}-error`
                    : `business-case-${activeField}-description`
                }
              >
                <legend>{choiceLegend}</legend>
                <div className="business-case-choice-options">
                  {activeChoiceOptions.map((option) => (
                    <label className="business-case-choice-option" key={option.id}>
                      <input
                        id={`business-case-${activeField}-choice-${option.id}`}
                        name={`${activeField}Choice`}
                        type="radio"
                        value={option.id}
                        checked={choiceIds[activeField] === option.id}
                        disabled={!hydrated}
                        onChange={() => selectChoice(activeField, option)}
                      />
                      <span>{choiceLabel(option)}</span>
                    </label>
                  ))}
                </div>
                <small
                  id={`business-case-${activeField}-description`}
                  className="business-case-field-description"
                >
                  {activeQuestion.description}
                </small>
                {selectedChoiceOption?.value !== undefined && (
                  <p className="business-case-choice-value" aria-live="polite">
                    {activeField === 'people' ? (
                      <>
                        Estimate uses <strong>{selectedChoiceOption.value} people</strong>, the
                        rounded midpoint of this range.
                      </>
                    ) : activeField === 'hoursReturnedPerWeek' ? (
                      <>
                        Estimate uses <strong>{selectedChoiceOption.label}</strong> per person each
                        week.
                      </>
                    ) : (
                      <>
                        Estimate uses{' '}
                        <strong>
                          {formatBusinessCaseCurrency(selectedChoiceOption.value, draft.currency)}
                        </strong>{' '}
                        per hour.
                      </>
                    )}
                  </p>
                )}
                {choiceGroupError && (
                  <small
                    id={`business-case-${activeField}-error`}
                    className="field-error"
                    role="alert"
                  >
                    {choiceErrorMessage}
                  </small>
                )}
              </fieldset>

              {choiceIds[activeField] === 'custom' && (
                <NumberField
                  inputRef={(node) => {
                    customInputRefs.current[activeField] = node;
                  }}
                  field={activeField}
                  label={customLabel}
                  description={customDescription}
                  min={activeQuestion.min}
                  max={activeQuestion.max}
                  step={activeQuestion.step}
                  value={customValues[activeField]}
                  disabled={!hydrated}
                  error={visibleError(activeField)}
                  onChange={(event) => changeCustomValue(activeField, event)}
                  onBlur={touchField(activeField)}
                />
              )}
            </div>

            {activeQuestion.field === 'hourlyValue' && (
              <div className="business-case-currency-field">
                <label htmlFor="business-case-currency">Currency</label>
                <select
                  id="business-case-currency"
                  name="currency"
                  value={draft.currency}
                  disabled={!hydrated}
                  onChange={(event) => {
                    const nextDraft = {
                      ...draftRef.current,
                      currency: event.target.value as BusinessCaseDraft['currency'],
                    };
                    draftRef.current = nextDraft;
                    setDraft(nextDraft);
                  }}
                >
                  {supportedBusinessCaseCurrencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <small>Formatting only. No conversion.</small>
              </div>
            )}

            <div className="business-case-actions">
              {step > 0 && (
                <button className="button button-ghost" type="button" onClick={goBack}>
                  Back
                </button>
              )}
              <button className="button button-primary" type="submit" disabled={!hydrated}>
                {step === businessCaseQuestions.length - 1 ? 'See estimate' : 'Continue'}
              </button>
            </div>
          </fieldset>
        </form>
      ) : (
        <div className="business-case-results">
          <header className="business-case-results-heading">
            <div>
              <p className="product-label">Based on your inputs</p>
              <h2 ref={questionHeadingRef} tabIndex={-1}>
                What your team could get back
              </h2>
            </div>
            <button className="text-link" type="button" onClick={editEstimate}>
              Edit answers
            </button>
          </header>

          {baseResults && baseInputs ? (
            <section className="business-case-value-summary" aria-label="Full team estimate">
              <p className="product-label">Estimated value of recovered time each year</p>
              <p className="business-case-value-figure">
                {formatBusinessCaseCurrency(baseResults.annualCapacityValue, baseResults.currency)}
              </p>
              <p className="business-case-hours-summary">
                Your team could get back{' '}
                <strong>
                  {formatBusinessCaseNumber(baseResults.annualHoursReturned, 1)} hours
                </strong>{' '}
                each year.
              </p>
              <p className="business-case-assumptions">
                Based on {formatBusinessCaseNumber(baseInputs.people)} people,{' '}
                {formatBusinessCaseNumber(baseInputs.hoursReturnedPerWeek, 1)}{' '}
                {baseInputs.hoursReturnedPerWeek === 1 ? 'hour' : 'hours'} each week,{' '}
                {formatBusinessCaseCurrency(baseInputs.hourlyValue, baseInputs.currency, 2)} per
                hour, and {formatBusinessCaseNumber(baseInputs.workingWeeks)} working weeks.
              </p>
            </section>
          ) : (
            <p className="business-case-result-error" role="alert">
              Check the working year to restore the estimate.
            </p>
          )}

          {pilotEstimate && baseResults && (
            <section className="business-case-pilot" aria-labelledby="business-case-pilot-title">
              <div className="business-case-pilot-copy">
                <p className="product-label">A practical first step</p>
                <h3 id="business-case-pilot-title">
                  Test the case with {formatBusinessCaseNumber(pilotEstimate.people)}{' '}
                  {pilotEstimate.people === 1 ? 'person' : 'people'}.
                </h3>
                <p>{pilotStatement}</p>
              </div>
              <p className="business-case-pilot-value">
                <span>This pilot group represents about</span>
                <strong>
                  {formatBusinessCaseCurrency(
                    pilotEstimate.annualCapacityValue,
                    baseResults.currency,
                  )}
                </strong>
                <span>in yearly time value.</span>
              </p>
              <p className="business-case-pilot-hours">
                That is{' '}
                <strong>
                  {formatBusinessCaseNumber(pilotEstimate.annualHoursReturned, 1)} hours
                </strong>{' '}
                each year, based on your inputs.
              </p>
              <a className="button button-paper" href={withBase('/demo')}>
                Plan this pilot
              </a>
            </section>
          )}

          <div className="business-case-secondary-inputs">
            <details>
              <summary>Compare with an annual budget</summary>
              <NumberField
                field="annualBudget"
                label="Annual budget to compare"
                description="Optional. This is your planning input, not Zeno pricing."
                min={1}
                max={1_000_000_000_000}
                step={1}
                optional
                value={draft.annualBudget}
                disabled={!hydrated}
                error={visibleError('annualBudget')}
                onChange={(event) => changeField('annualBudget', event)}
                onBlur={touchField('annualBudget')}
              />
              {completeResults?.annualBudget !== undefined && (
                <div className="business-case-budget-result" aria-live="polite">
                  <p>Estimated ROI against this budget</p>
                  <strong>{formatBusinessCaseNumber(completeResults.roiPercent!, 1)}%</strong>
                  <small>
                    Estimated yearly value of recovered time minus annual budget, divided by annual
                    budget.
                  </small>
                </div>
              )}
            </details>
            <details>
              <summary>Calculation settings</summary>
              <NumberField
                field="workingWeeks"
                label="Working weeks per year"
                description="The estimate starts with a 46-week planning year."
                min={1}
                max={52}
                step={1}
                value={draft.workingWeeks}
                disabled={!hydrated}
                error={visibleError('workingWeeks')}
                onChange={(event) => changeField('workingWeeks', event)}
                onBlur={touchField('workingWeeks')}
              />
              <p className="business-case-method">{method}</p>
              <p className="business-case-method">{pilotMethod}</p>
            </details>
          </div>

          <p className="visually-hidden" aria-live="polite">
            {resultAnnouncement}
          </p>
          <p className="business-case-disclaimer">{disclaimer}</p>
          <p className="business-case-privacy">{privacyStatement}</p>
        </div>
      )}
    </section>
  );
}

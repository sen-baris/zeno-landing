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
  businessCaseHoursOptions,
  businessCaseQuestions,
  businessCaseTeamSizeOptions,
  businessCaseWorkTypeOptions,
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
  type BusinessCaseWorkTypeId,
} from '../../lib/pricing/business-case';
import { withBase } from '../../lib/routing/base-path';

interface BusinessCaseCalculatorProps {
  disclaimer: string;
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
  inputRef?: Ref<HTMLInputElement> | undefined;
  label: string;
  max: number;
  min: number;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  step: number;
  value: string;
}

type GuidedNumericField = 'weeklyHoursSpent' | 'people';
type GuidedField = GuidedNumericField | 'workTypeIds';

const subscribeToHydration = () => () => undefined;
const initialChoiceIds: Record<GuidedNumericField, string> = {
  weeklyHoursSpent: '',
  people: '',
};
const initialCustomValues: Record<GuidedNumericField, string> = {
  weeklyHoursSpent: '',
  people: '',
};

function NumberField({
  description,
  disabled,
  error,
  field,
  inputRef,
  label,
  max,
  min,
  onBlur,
  onChange,
  step,
  value,
}: NumberFieldProps) {
  const descriptionId = `business-case-${field}-description`;
  const errorId = `business-case-${field}-error`;
  return (
    <div className="business-case-field">
      <label className="business-case-field-label" htmlFor={`business-case-${field}`}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={`business-case-${field}`}
        name={field}
        aria-label={label}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${descriptionId} ${errorId}` : descriptionId}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
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
  const [choiceIds, setChoiceIds] = useState(initialChoiceIds);
  const [customValues, setCustomValues] = useState(initialCustomValues);
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<BusinessCaseNumericField | 'workTypeIds', boolean>>
  >({});
  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const customInputRefs = useRef<Partial<Record<GuidedNumericField, HTMLInputElement | null>>>({});
  const didNavigateRef = useRef(false);
  const shouldFocusCustomFieldRef = useRef<GuidedNumericField | null>(null);

  const validation = validateBusinessCaseDraft(draft);
  const inputs = validation.ok ? validation.values : undefined;
  const results = inputs ? calculateBusinessCase(inputs) : undefined;
  const pilotEstimate = inputs ? calculateBusinessCasePilot(inputs) : undefined;
  const pilotVisible = pilotEstimate && results && results.annualTimeValue > 0;
  const activeQuestion = businessCaseQuestions[step]!;
  const activeField: GuidedField = activeQuestion.field;
  const activeNumericQuestion = activeQuestion.field === 'workTypeIds' ? undefined : activeQuestion;
  const activeNumericField = activeField === 'workTypeIds' ? undefined : activeField;
  const activeChoiceOptions =
    activeNumericField === 'people' ? businessCaseTeamSizeOptions : businessCaseHoursOptions;
  const selectedChoiceOption = activeChoiceOptions.find(
    (option) => option.id === (activeNumericField ? choiceIds[activeNumericField] : ''),
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
    setTouched((current) => ({ ...current, [field]: showResult }));
  }

  function toggleWorkType(id: BusinessCaseWorkTypeId, checked: boolean) {
    const currentIds = draftRef.current.workTypeIds;
    const workTypeIds = checked
      ? [...currentIds, id]
      : currentIds.filter((selectedId) => selectedId !== id);
    const nextDraft = { ...draftRef.current, workTypeIds };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    setTouched((current) => ({ ...current, workTypeIds: false }));
  }

  function selectChoice(field: GuidedNumericField, id: string, value?: number) {
    setChoiceIds((current) => ({ ...current, [field]: id }));
    if (value !== undefined) {
      setFieldValue(field, String(value));
    } else {
      shouldFocusCustomFieldRef.current = field;
      setFieldValue(field, customValues[field]);
    }
  }

  function changeCustomValue(field: GuidedNumericField, event: ChangeEvent<HTMLInputElement>) {
    setCustomValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldValue(field, event.target.value);
  }

  const touchField = (field: BusinessCaseNumericField) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
  };
  const visibleError = (field: BusinessCaseNumericField | 'workTypeIds') =>
    touched[field] ? validation.errors[field] : undefined;

  function focusCurrentField(field: GuidedField) {
    const id =
      field === 'workTypeIds'
        ? `business-case-workTypeIds-${businessCaseWorkTypeOptions[0].id}`
        : choiceIds[field] === 'custom'
          ? `business-case-${field}`
          : `business-case-${field}-choice-${activeChoiceOptions[0].id}`;
    document.getElementById(id)?.focus();
  }

  function advance(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentValidation = validateBusinessCaseDraft(draftRef.current);
    setTouched((current) => ({ ...current, [activeField]: true }));
    if (currentValidation.errors[activeField]) {
      focusCurrentField(activeField);
      return;
    }
    didNavigateRef.current = true;
    if (step < businessCaseQuestions.length - 1) {
      setStep((current) => current + 1);
    } else {
      setShowResult(true);
    }
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

  const resultAnnouncement = results
    ? `Potential yearly value of time recovered: ${formatBusinessCaseCurrency(results.annualTimeValue, results.currency)}. About ${formatBusinessCaseNumber(results.annualHoursReturned, 1)} hours for the team if ${inputs!.recoveryPercent}% of the selected time is recovered.${pilotVisible ? ` A ${pilotEstimate.people}-person pilot represents ${formatBusinessCaseNumber(pilotEstimate.annualHoursReturned, 1)} annualized hours.` : ''}`
    : 'Check Calculation settings to restore the estimate.';

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
              {activeField === 'workTypeIds' ? (
                <fieldset
                  className="business-case-choice-group"
                  aria-invalid={visibleError('workTypeIds') ? 'true' : undefined}
                  aria-describedby={
                    visibleError('workTypeIds')
                      ? 'business-case-workTypeIds-description business-case-workTypeIds-error'
                      : 'business-case-workTypeIds-description'
                  }
                >
                  <legend>Choose all that apply</legend>
                  <div className="business-case-choice-options">
                    {businessCaseWorkTypeOptions.map((option) => (
                      <label className="business-case-choice-option" key={option.id}>
                        <input
                          id={`business-case-workTypeIds-${option.id}`}
                          name="workTypeIds"
                          type="checkbox"
                          value={option.id}
                          checked={draft.workTypeIds.includes(option.id)}
                          disabled={!hydrated}
                          onChange={(event) => toggleWorkType(option.id, event.target.checked)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <small
                    id="business-case-workTypeIds-description"
                    className="business-case-field-description"
                  >
                    {activeQuestion.description}
                  </small>
                  {visibleError('workTypeIds') && (
                    <small
                      id="business-case-workTypeIds-error"
                      className="field-error"
                      role="alert"
                    >
                      {visibleError('workTypeIds')}
                    </small>
                  )}
                </fieldset>
              ) : (
                <>
                  <fieldset
                    className="business-case-choice-group"
                    aria-invalid={visibleError(activeField) ? 'true' : undefined}
                    aria-describedby={
                      visibleError(activeField) && choiceIds[activeField] !== 'custom'
                        ? `business-case-${activeField}-description business-case-${activeField}-error`
                        : `business-case-${activeField}-description`
                    }
                  >
                    <legend>
                      {activeField === 'weeklyHoursSpent'
                        ? 'Choose combined weekly time'
                        : 'Choose a team size'}
                    </legend>
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
                            onChange={() =>
                              selectChoice(
                                activeField,
                                option.id,
                                'people' in option
                                  ? option.people
                                  : 'value' in option
                                    ? option.value
                                    : undefined,
                              )
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <small
                      id={`business-case-${activeField}-description`}
                      className="business-case-field-description"
                    >
                      {activeQuestion.description}
                    </small>
                    {selectedChoiceOption &&
                      'value' in selectedChoiceOption &&
                      selectedChoiceOption.value !== undefined && (
                        <p className="business-case-choice-value" aria-live="polite">
                          Estimate uses <strong>{selectedChoiceOption.value} hours</strong> per
                          person each week across the selected work.
                        </p>
                      )}
                    {selectedChoiceOption &&
                      'people' in selectedChoiceOption &&
                      selectedChoiceOption.people !== undefined && (
                        <p className="business-case-choice-value" aria-live="polite">
                          Estimate uses <strong>{selectedChoiceOption.people} people</strong>, the
                          rounded midpoint of this range.
                        </p>
                      )}
                    {visibleError(activeField) && choiceIds[activeField] !== 'custom' && (
                      <small
                        id={`business-case-${activeField}-error`}
                        className="field-error"
                        role="alert"
                      >
                        {activeField === 'weeklyHoursSpent'
                          ? 'Choose weekly time or enter a custom amount.'
                          : 'Choose a team size or enter a custom amount.'}
                      </small>
                    )}
                  </fieldset>
                  {choiceIds[activeField] === 'custom' && (
                    <NumberField
                      inputRef={(node) => {
                        customInputRefs.current[activeField] = node;
                      }}
                      field={activeField}
                      label={
                        activeField === 'people' ? 'Exact number of people' : 'Custom weekly hours'
                      }
                      description={
                        activeField === 'people'
                          ? 'Enter a whole number between 1 and 100,000.'
                          : 'Enter a combined number between 0.5 and 80.'
                      }
                      min={activeNumericQuestion?.min ?? 0}
                      max={activeNumericQuestion?.max ?? 0}
                      step={activeNumericQuestion?.step ?? 1}
                      value={customValues[activeField]}
                      disabled={!hydrated}
                      error={visibleError(activeField)}
                      onChange={(event) => changeCustomValue(activeField, event)}
                      onBlur={touchField(activeField)}
                    />
                  )}
                </>
              )}
            </div>
            <div className="business-case-question-footer">
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
            </div>
          </fieldset>
        </form>
      ) : (
        <div className="business-case-results">
          <header className="business-case-results-heading">
            <div>
              <p className="product-label">Planning estimate</p>
              <h2 ref={questionHeadingRef} tabIndex={-1}>
                What your team could get back
              </h2>
            </div>
            <button className="text-link" type="button" onClick={editEstimate}>
              Edit answers
            </button>
          </header>

          {results && inputs ? (
            <section className="business-case-value-summary" aria-label="Full team estimate">
              <p className="product-label">Potential yearly value of time recovered</p>
              <p className="business-case-value-figure">
                {formatBusinessCaseCurrency(results.annualTimeValue, results.currency)}
              </p>
              <p className="business-case-hours-summary">
                About{' '}
                <strong>{formatBusinessCaseNumber(results.annualHoursReturned, 1)} hours</strong>{' '}
                back across the team each year if{' '}
                {formatBusinessCaseNumber(inputs.recoveryPercent, 1)}% of this time is recovered.
              </p>
              <p className="business-case-selected-work">
                Selected work:{' '}
                {businessCaseWorkTypeOptions
                  .filter((option) => inputs.workTypeIds.includes(option.id))
                  .map((option) => option.label)
                  .join(', ')}
                .
              </p>
              <p className="business-case-assumptions">
                Based on {formatBusinessCaseNumber(inputs.people)} people,{' '}
                {formatBusinessCaseNumber(inputs.weeklyHoursSpent, 1)} combined hours per person
                each week, {formatBusinessCaseNumber(inputs.recoveryPercent, 1)}% time recovered,{' '}
                {formatBusinessCaseCurrency(inputs.hourlyPlanningValue, inputs.currency, 2)} per
                hour, and {formatBusinessCaseNumber(inputs.workingWeeks)} working weeks.
              </p>
            </section>
          ) : (
            <p className="business-case-result-error" role="alert">
              Check Calculation settings to restore the estimate.
            </p>
          )}

          {pilotVisible && (
            <section className="business-case-pilot" aria-labelledby="business-case-pilot-title">
              <div className="business-case-pilot-copy">
                <p className="product-label">A practical first step</p>
                <h3 id="business-case-pilot-title">
                  Test the case with {formatBusinessCaseNumber(pilotEstimate.people)}{' '}
                  {pilotEstimate.people === 1 ? 'person' : 'people'}.
                </h3>
                <p>{pilotStatement}</p>
              </div>
              <p className="business-case-pilot-hours">
                That represents{' '}
                <strong>
                  {formatBusinessCaseNumber(pilotEstimate.annualHoursReturned, 1)} hours
                </strong>{' '}
                across a year if the same recovery scenario holds.
              </p>
              <a className="button button-paper" href={withBase('/demo')}>
                Plan this pilot
              </a>
            </section>
          )}
          {results?.annualTimeValue === 0 && (
            <p className="business-case-zero-scenario">
              At 0% time recovered, there is no modeled time value to validate. Adjust the scenario
              in Calculation settings.
            </p>
          )}

          <div className="business-case-secondary-inputs">
            <details>
              <summary>Calculation settings</summary>
              <div className="business-case-settings-grid">
                <NumberField
                  field="recoveryPercent"
                  label="Time recovered (%)"
                  description="Illustrative scenario, not measured Zeno savings."
                  min={0}
                  max={100}
                  step={1}
                  value={draft.recoveryPercent}
                  disabled={!hydrated}
                  error={visibleError('recoveryPercent')}
                  onChange={(event) => setFieldValue('recoveryPercent', event.target.value)}
                  onBlur={touchField('recoveryPercent')}
                />
                <NumberField
                  field="hourlyPlanningValue"
                  label="Planning value per hour"
                  description="Illustrative value, not a labor-cost benchmark."
                  min={1}
                  max={100_000}
                  step={1}
                  value={draft.hourlyPlanningValue}
                  disabled={!hydrated}
                  error={visibleError('hourlyPlanningValue')}
                  onChange={(event) => setFieldValue('hourlyPlanningValue', event.target.value)}
                  onBlur={touchField('hourlyPlanningValue')}
                />
                <NumberField
                  field="workingWeeks"
                  label="Working weeks per year"
                  description="46 weeks by default."
                  min={1}
                  max={52}
                  step={1}
                  value={draft.workingWeeks}
                  disabled={!hydrated}
                  error={visibleError('workingWeeks')}
                  onChange={(event) => setFieldValue('workingWeeks', event.target.value)}
                  onBlur={touchField('workingWeeks')}
                />
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
              </div>
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

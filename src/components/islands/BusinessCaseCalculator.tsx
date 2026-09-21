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
import { businessCaseUiCopy, localizeBusinessCaseErrors } from '../../lib/i18n/forms';
import { localeDefinitions, type Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/routes';
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
  locale?: Locale;
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
  locale = 'en',
  pilotMethod,
  pilotStatement,
  privacyStatement,
  title,
}: BusinessCaseCalculatorProps) {
  const copy = businessCaseUiCopy[locale];
  const questions = copy.questions;
  const workTypeOptions = copy.workTypes;
  const teamSizeOptions = copy.teamSizes;
  const hoursOptions = copy.hours;
  const numberLocale = localeDefinitions[locale].numberFormatLocale;
  const formatCurrency = (
    value: number,
    currency: BusinessCaseDraft['currency'],
    maximumFractionDigits = 0,
  ) => formatBusinessCaseCurrency(value, currency, maximumFractionDigits, numberLocale);
  const formatNumber = (value: number, maximumFractionDigits = 0) =>
    formatBusinessCaseNumber(value, maximumFractionDigits, numberLocale);
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

  const rawValidation = validateBusinessCaseDraft(draft);
  const validation = {
    ...rawValidation,
    errors: localizeBusinessCaseErrors(rawValidation.errors, locale),
  };
  const inputs = validation.ok ? validation.values : undefined;
  const results = inputs ? calculateBusinessCase(inputs) : undefined;
  const pilotEstimate = inputs ? calculateBusinessCasePilot(inputs) : undefined;
  const pilotVisible = pilotEstimate && results && results.annualTimeValue > 0;
  const activeQuestion = questions[step]!;
  const activeField: GuidedField = activeQuestion.field;
  const activeNumericQuestion = activeQuestion.field === 'workTypeIds' ? undefined : activeQuestion;
  const activeNumericField = activeField === 'workTypeIds' ? undefined : activeField;
  const activeChoiceOptions = activeNumericField === 'people' ? teamSizeOptions : hoursOptions;
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
        ? `business-case-workTypeIds-${workTypeOptions[0]!.id}`
        : choiceIds[field] === 'custom'
          ? `business-case-${field}`
          : `business-case-${field}-choice-${activeChoiceOptions[0]!.id}`;
    document.getElementById(id)?.focus();
  }

  function advance(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const rawValidation = validateBusinessCaseDraft(draftRef.current);
    const currentValidation = {
      ...rawValidation,
      errors: localizeBusinessCaseErrors(rawValidation.errors, locale),
    };
    setTouched((current) => ({ ...current, [activeField]: true }));
    if (currentValidation.errors[activeField]) {
      focusCurrentField(activeField);
      return;
    }
    didNavigateRef.current = true;
    if (step < questions.length - 1) {
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
    ? copy.resultAnnouncement(
        formatCurrency(results.annualTimeValue, results.currency),
        formatNumber(results.annualHoursReturned, 1),
        formatNumber(inputs!.recoveryPercent, 1),
        pilotVisible
          ? `${copy.pilotHours.before} ${formatNumber(pilotEstimate.annualHoursReturned, 1)} ${copy.pilotHours.unit} ${copy.pilotHours.after}`
          : undefined,
      )
    : copy.restoreEstimate;

  return (
    <section
      className="business-case-calculator"
      data-hydrated={hydrated ? 'true' : 'false'}
      aria-label={copy.calculatorLabel}
    >
      {!showResult ? (
        <form className="business-case-form" autoComplete="off" onSubmit={advance}>
          <header className="business-case-form-heading">
            <div>
              <p className="product-label">{copy.estimateLabel}</p>
              <h2>{title}</h2>
            </div>
            <p>{privacyStatement}</p>
          </header>

          <div className="business-case-progress">
            <span>{copy.step(step + 1, questions.length)}</span>
            <div
              role="progressbar"
              aria-label={copy.progressLabel}
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-valuenow={step + 1}
            >
              <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
            </div>
          </div>

          <fieldset className="business-case-question" disabled={!hydrated}>
            <legend className="visually-hidden">{copy.questionLegend(step + 1)}</legend>
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
                  <legend>{copy.chooseAll}</legend>
                  <div className="business-case-choice-options">
                    {workTypeOptions.map((option) => (
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
                        ? copy.chooseWeeklyTime
                        : copy.chooseTeamSize}
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
                          {copy.selectedHours.before}{' '}
                          <strong>
                            {selectedChoiceOption.value} {copy.selectedHours.unit}
                          </strong>{' '}
                          {copy.selectedHours.after}
                        </p>
                      )}
                    {selectedChoiceOption &&
                      'people' in selectedChoiceOption &&
                      selectedChoiceOption.people !== undefined && (
                        <p className="business-case-choice-value" aria-live="polite">
                          {copy.selectedPeople.before}{' '}
                          <strong>
                            {selectedChoiceOption.people} {copy.selectedPeople.unit}
                          </strong>
                          , {copy.selectedPeople.after}
                        </p>
                      )}
                    {visibleError(activeField) && choiceIds[activeField] !== 'custom' && (
                      <small
                        id={`business-case-${activeField}-error`}
                        className="field-error"
                        role="alert"
                      >
                        {activeField === 'weeklyHoursSpent'
                          ? copy.weeklyChoiceError
                          : copy.peopleChoiceError}
                      </small>
                    )}
                  </fieldset>
                  {choiceIds[activeField] === 'custom' && (
                    <NumberField
                      inputRef={(node) => {
                        customInputRefs.current[activeField] = node;
                      }}
                      field={activeField}
                      label={activeField === 'people' ? copy.exactPeople : copy.customHours}
                      description={
                        activeField === 'people'
                          ? copy.exactPeopleDescription
                          : copy.customHoursDescription
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
                    {copy.back}
                  </button>
                )}
                <button className="button button-primary" type="submit" disabled={!hydrated}>
                  {step === questions.length - 1 ? copy.seeEstimate : copy.continue}
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      ) : (
        <div className="business-case-results">
          <header className="business-case-results-heading">
            <div>
              <p className="product-label">{copy.planningEstimate}</p>
              <h2 ref={questionHeadingRef} tabIndex={-1}>
                {copy.resultTitle}
              </h2>
            </div>
            <button className="text-link" type="button" onClick={editEstimate}>
              {copy.editAnswers}
            </button>
          </header>

          {results && inputs ? (
            <section className="business-case-value-summary" aria-label={copy.fullTeamLabel}>
              <p className="product-label">{copy.yearlyValueLabel}</p>
              <p className="business-case-value-figure">
                {formatCurrency(results.annualTimeValue, results.currency)}
              </p>
              <p className="business-case-hours-summary">
                {copy.hoursSummary.before}{' '}
                <strong>
                  {formatNumber(results.annualHoursReturned, 1)} {copy.hoursSummary.unit}
                </strong>{' '}
                {copy.hoursSummary.after(formatNumber(inputs.recoveryPercent, 1))}
              </p>
              <p className="business-case-selected-work">
                {copy.selectedWorkLabel}:{' '}
                {workTypeOptions
                  .filter((option) => inputs.workTypeIds.includes(option.id))
                  .map((option) => option.label)
                  .join(', ')}
                .
              </p>
              <p className="business-case-assumptions">
                {copy.assumptions(
                  formatNumber(inputs.people),
                  formatNumber(inputs.weeklyHoursSpent, 1),
                  formatNumber(inputs.recoveryPercent, 1),
                  formatCurrency(inputs.hourlyPlanningValue, inputs.currency, 2),
                  formatNumber(inputs.workingWeeks),
                )}
              </p>
            </section>
          ) : (
            <p className="business-case-result-error" role="alert">
              {copy.restoreEstimate}
            </p>
          )}

          {pilotVisible && (
            <section className="business-case-pilot" aria-labelledby="business-case-pilot-title">
              <div className="business-case-pilot-copy">
                <p className="product-label">{copy.pilotLabel}</p>
                <h3 id="business-case-pilot-title">
                  {copy.pilotTitle(formatNumber(pilotEstimate.people), pilotEstimate.people === 1)}
                </h3>
                <p>{pilotStatement}</p>
              </div>
              <p className="business-case-pilot-hours">
                {copy.pilotHours.before}{' '}
                <strong>
                  {formatNumber(pilotEstimate.annualHoursReturned, 1)} {copy.pilotHours.unit}
                </strong>{' '}
                {copy.pilotHours.after}
              </p>
              <a
                className="button button-paper"
                href={withBase(
                  getLocalizedPath({ kind: 'static', key: 'demo' }, locale) ?? '/demo',
                )}
              >
                {copy.pilotAction}
              </a>
            </section>
          )}
          {results?.annualTimeValue === 0 && (
            <p className="business-case-zero-scenario">{copy.zeroScenario}</p>
          )}

          <div className="business-case-secondary-inputs">
            <details>
              <summary>{copy.settings}</summary>
              <div className="business-case-settings-grid">
                <NumberField
                  field="recoveryPercent"
                  label={copy.recoveryLabel}
                  description={copy.recoveryDescription}
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
                  label={copy.hourlyValueLabel}
                  description={copy.hourlyValueDescription}
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
                  label={copy.workingWeeksLabel}
                  description={copy.workingWeeksDescription}
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
                  <label htmlFor="business-case-currency">{copy.currencyLabel}</label>
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
                  <small>{copy.currencyDescription}</small>
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

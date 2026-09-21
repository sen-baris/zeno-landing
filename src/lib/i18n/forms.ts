import type {
  BusinessCaseHoursOption,
  BusinessCaseQuestion,
  BusinessCaseTeamSizeOption,
  BusinessCaseWorkTypeOption,
} from '../content/pricing';
import type { BusinessCaseErrors } from '../pricing/business-case';
import type { DemoFormErrors } from '../leads/validation';
import type { Locale } from './locales';

export interface BusinessCaseUiCopy {
  questions: readonly BusinessCaseQuestion[];
  workTypes: readonly BusinessCaseWorkTypeOption[];
  teamSizes: readonly BusinessCaseTeamSizeOption[];
  hours: readonly BusinessCaseHoursOption[];
  calculatorLabel: string;
  estimateLabel: string;
  progressLabel: string;
  step: (current: number, total: number) => string;
  questionLegend: (current: number) => string;
  chooseAll: string;
  chooseWeeklyTime: string;
  chooseTeamSize: string;
  selectedHours: { before: string; unit: string; after: string };
  selectedPeople: { before: string; unit: string; after: string };
  weeklyChoiceError: string;
  peopleChoiceError: string;
  exactPeople: string;
  customHours: string;
  exactPeopleDescription: string;
  customHoursDescription: string;
  back: string;
  continue: string;
  seeEstimate: string;
  planningEstimate: string;
  resultTitle: string;
  editAnswers: string;
  fullTeamLabel: string;
  yearlyValueLabel: string;
  hoursSummary: { before: string; unit: string; after: (recovery: string) => string };
  selectedWorkLabel: string;
  assumptions: (
    people: string,
    hours: string,
    recovery: string,
    hourlyValue: string,
    weeks: string,
  ) => string;
  restoreEstimate: string;
  pilotLabel: string;
  pilotTitle: (people: string, singular: boolean) => string;
  pilotHours: { before: string; unit: string; after: string };
  pilotAction: string;
  zeroScenario: string;
  settings: string;
  recoveryLabel: string;
  recoveryDescription: string;
  hourlyValueLabel: string;
  hourlyValueDescription: string;
  workingWeeksLabel: string;
  workingWeeksDescription: string;
  currencyLabel: string;
  currencyDescription: string;
  resultAnnouncement: (value: string, hours: string, recovery: string, pilot?: string) => string;
}

const englishBusinessCaseCopy: BusinessCaseUiCopy = {
  questions: [
    {
      field: 'workTypeIds',
      heading: 'What work takes up your team’s time?',
      description: 'Choose all that apply. Count the time across these tasks together.',
    },
    {
      field: 'weeklyHoursSpent',
      heading: 'About how many hours does one person spend on this work each week?',
      description: 'Use one combined total for everything you selected.',
      min: 0.5,
      max: 80,
      step: 0.5,
    },
    {
      field: 'people',
      heading: 'How many people do this work?',
      description: 'Choose a team range or enter the exact number.',
      min: 1,
      max: 100_000,
      step: 1,
    },
  ],
  workTypes: [
    { id: 'report-generation', label: 'Report generation' },
    { id: 'financial-analysis', label: 'Financial analysis' },
    { id: 'presentation-creation', label: 'Presentation creation' },
    { id: 'email-triage', label: 'Email triage' },
    { id: 'document-review', label: 'Document review' },
    { id: 'other-work', label: 'Other recurring work' },
  ],
  teamSizes: [
    { id: '1-to-10', label: '1 to 10', people: 6 },
    { id: '11-to-25', label: '11 to 25', people: 18 },
    { id: '26-to-50', label: '26 to 50', people: 38 },
    { id: '51-to-100', label: '51 to 100', people: 76 },
    { id: '101-to-250', label: '101 to 250', people: 176 },
    { id: '251-to-500', label: '251 to 500', people: 376 },
    { id: 'custom', label: 'Custom amount' },
  ],
  hours: [
    { id: '1-hour', label: 'About 1 hour', value: 1 },
    { id: '2-hours', label: 'About 2 hours', value: 2 },
    { id: '4-hours', label: 'About 4 hours', value: 4 },
    { id: '8-hours', label: 'About 8 hours', value: 8 },
    { id: '16-hours', label: 'About 16 hours', value: 16 },
    { id: 'custom', label: 'Custom hours' },
  ],
  calculatorLabel: 'Business case calculator',
  estimateLabel: 'Business case estimate',
  progressLabel: 'Business case progress',
  step: (current, total) => `Step ${current} of ${total}`,
  questionLegend: (current) => `Business case question ${current}`,
  chooseAll: 'Choose all that apply',
  chooseWeeklyTime: 'Choose combined weekly time',
  chooseTeamSize: 'Choose a team size',
  selectedHours: {
    before: 'Estimate uses',
    unit: 'hours',
    after: 'per person each week across the selected work.',
  },
  selectedPeople: {
    before: 'Estimate uses',
    unit: 'people',
    after: 'the rounded midpoint of this range.',
  },
  weeklyChoiceError: 'Choose weekly time or enter a custom amount.',
  peopleChoiceError: 'Choose a team size or enter a custom amount.',
  exactPeople: 'Exact number of people',
  customHours: 'Custom weekly hours',
  exactPeopleDescription: 'Enter a whole number between 1 and 100,000.',
  customHoursDescription: 'Enter a combined number between 0.5 and 80.',
  back: 'Back',
  continue: 'Continue',
  seeEstimate: 'See estimate',
  planningEstimate: 'Planning estimate',
  resultTitle: 'What your team could get back',
  editAnswers: 'Edit answers',
  fullTeamLabel: 'Full team estimate',
  yearlyValueLabel: 'Potential yearly value of time recovered',
  hoursSummary: {
    before: 'About',
    unit: 'hours',
    after: (recovery) =>
      `back across the team each year if ${recovery}% of this time is recovered.`,
  },
  selectedWorkLabel: 'Selected work',
  assumptions: (people, hours, recovery, hourlyValue, weeks) =>
    `Based on ${people} people, ${hours} combined hours per person each week, ${recovery}% time recovered, ${hourlyValue} per hour, and ${weeks} working weeks.`,
  restoreEstimate: 'Check Calculation settings to restore the estimate.',
  pilotLabel: 'A practical first step',
  pilotTitle: (people, singular) =>
    `Test the case with ${people} ${singular ? 'person' : 'people'}.`,
  pilotHours: {
    before: 'That represents',
    unit: 'hours',
    after: 'across a year if the same recovery scenario holds.',
  },
  pilotAction: 'Plan this pilot',
  zeroScenario:
    'At 0% time recovered, there is no modeled time value to validate. Adjust the scenario in Calculation settings.',
  settings: 'Calculation settings',
  recoveryLabel: 'Time recovered (%)',
  recoveryDescription: 'Illustrative scenario, not measured Zeno savings.',
  hourlyValueLabel: 'Planning value per hour',
  hourlyValueDescription: 'Illustrative value, not a labor-cost benchmark.',
  workingWeeksLabel: 'Working weeks per year',
  workingWeeksDescription: '46 weeks by default.',
  currencyLabel: 'Currency',
  currencyDescription: 'Formatting only. No conversion.',
  resultAnnouncement: (value, hours, recovery, pilot) =>
    `Potential yearly value of time recovered: ${value}. About ${hours} hours for the team if ${recovery}% of the selected time is recovered.${pilot ? ` ${pilot}` : ''}`,
};

const germanBusinessCaseCopy: BusinessCaseUiCopy = {
  ...englishBusinessCaseCopy,
  questions: [
    {
      field: 'workTypeIds',
      heading: 'Welche Arbeit kostet Ihr Team Zeit?',
      description:
        'Wählen Sie alles Passende aus. Zählen Sie die Zeit für diese Aufgaben zusammen.',
    },
    {
      field: 'weeklyHoursSpent',
      heading: 'Wie viele Stunden verbringt eine Person pro Woche mit dieser Arbeit?',
      description: 'Verwenden Sie einen gemeinsamen Gesamtwert für alle gewählten Aufgaben.',
      min: 0.5,
      max: 80,
      step: 0.5,
    },
    {
      field: 'people',
      heading: 'Wie viele Personen erledigen diese Arbeit?',
      description: 'Wählen Sie eine Teamgröße oder geben Sie die genaue Zahl ein.',
      min: 1,
      max: 100_000,
      step: 1,
    },
  ],
  workTypes: [
    { id: 'report-generation', label: 'Berichte erstellen' },
    { id: 'financial-analysis', label: 'Finanzanalysen' },
    { id: 'presentation-creation', label: 'Präsentationen erstellen' },
    { id: 'email-triage', label: 'E-Mails sortieren' },
    { id: 'document-review', label: 'Dokumente prüfen' },
    { id: 'other-work', label: 'Andere wiederkehrende Arbeit' },
  ],
  teamSizes: [
    { id: '1-to-10', label: '1 bis 10', people: 6 },
    { id: '11-to-25', label: '11 bis 25', people: 18 },
    { id: '26-to-50', label: '26 bis 50', people: 38 },
    { id: '51-to-100', label: '51 bis 100', people: 76 },
    { id: '101-to-250', label: '101 bis 250', people: 176 },
    { id: '251-to-500', label: '251 bis 500', people: 376 },
    { id: 'custom', label: 'Genaue Zahl' },
  ],
  hours: [
    { id: '1-hour', label: 'Etwa 1 Stunde', value: 1 },
    { id: '2-hours', label: 'Etwa 2 Stunden', value: 2 },
    { id: '4-hours', label: 'Etwa 4 Stunden', value: 4 },
    { id: '8-hours', label: 'Etwa 8 Stunden', value: 8 },
    { id: '16-hours', label: 'Etwa 16 Stunden', value: 16 },
    { id: 'custom', label: 'Genaue Stundenzahl' },
  ],
  calculatorLabel: 'Business Case Rechner',
  estimateLabel: 'Business Case Schätzung',
  progressLabel: 'Fortschritt der Business Case Berechnung',
  step: (current, total) => `Schritt ${current} von ${total}`,
  questionLegend: (current) => `Frage ${current} zum Business Case`,
  chooseAll: 'Mehrfachauswahl möglich',
  chooseWeeklyTime: 'Wöchentliche Gesamtzeit wählen',
  chooseTeamSize: 'Teamgröße wählen',
  selectedHours: {
    before: 'Die Schätzung verwendet',
    unit: 'Stunden',
    after: 'pro Person und Woche für die gewählte Arbeit.',
  },
  selectedPeople: {
    before: 'Die Schätzung verwendet',
    unit: 'Personen',
    after: 'den gerundeten Mittelwert dieser Spanne.',
  },
  weeklyChoiceError: 'Wählen Sie eine Wochenzeit oder geben Sie einen eigenen Wert ein.',
  peopleChoiceError: 'Wählen Sie eine Teamgröße oder geben Sie einen eigenen Wert ein.',
  exactPeople: 'Genaue Personenzahl',
  customHours: 'Eigene Wochenstunden',
  exactPeopleDescription: 'Geben Sie eine ganze Zahl zwischen 1 und 100.000 ein.',
  customHoursDescription: 'Geben Sie einen Gesamtwert zwischen 0,5 und 80 ein.',
  back: 'Zurück',
  continue: 'Weiter',
  seeEstimate: 'Schätzung anzeigen',
  planningEstimate: 'Planungsschätzung',
  resultTitle: 'Was Ihr Team zurückgewinnen könnte',
  editAnswers: 'Antworten bearbeiten',
  fullTeamLabel: 'Schätzung für das gesamte Team',
  yearlyValueLabel: 'Möglicher jährlicher Wert der zurückgewonnenen Zeit',
  hoursSummary: {
    before: 'Das Team gewinnt etwa',
    unit: 'Stunden',
    after: (recovery) => `pro Jahr zurück, wenn ${recovery} % dieser Zeit frei werden.`,
  },
  selectedWorkLabel: 'Gewählte Arbeit',
  assumptions: (people, hours, recovery, hourlyValue, weeks) =>
    `Grundlage: ${people} Personen, ${hours} gemeinsame Stunden pro Person und Woche, ${recovery} % zurückgewonnene Zeit, ${hourlyValue} pro Stunde und ${weeks} Arbeitswochen.`,
  restoreEstimate: 'Prüfen Sie die Berechnungseinstellungen, um die Schätzung wiederherzustellen.',
  pilotLabel: 'Ein praktischer erster Schritt',
  pilotTitle: (people, singular) =>
    `Testen Sie den Business Case mit ${people} ${singular ? 'Person' : 'Personen'}.`,
  pilotHours: {
    before: 'Das entspricht',
    unit: 'Stunden',
    after: 'pro Jahr, wenn dasselbe Szenario gilt.',
  },
  pilotAction: 'Pilot planen',
  zeroScenario:
    'Bei 0 % zurückgewonnener Zeit entsteht kein modellierter Zeitwert. Passen Sie das Szenario in den Berechnungseinstellungen an.',
  settings: 'Berechnungseinstellungen',
  recoveryLabel: 'Zurückgewonnene Zeit (%)',
  recoveryDescription: 'Beispielszenario, keine gemessene Zeno-Einsparung.',
  hourlyValueLabel: 'Planungswert pro Stunde',
  hourlyValueDescription: 'Beispielwert, kein Benchmark für Arbeitskosten.',
  workingWeeksLabel: 'Arbeitswochen pro Jahr',
  workingWeeksDescription: 'Standardmäßig 46 Wochen.',
  currencyLabel: 'Währung',
  currencyDescription: 'Nur Formatierung. Keine Umrechnung.',
  resultAnnouncement: (value, hours, recovery, pilot) =>
    `Möglicher jährlicher Wert der zurückgewonnenen Zeit: ${value}. Etwa ${hours} Stunden für das Team, wenn ${recovery} % der gewählten Zeit frei werden.${pilot ? ` ${pilot}` : ''}`,
};

export const businessCaseUiCopy: Record<Locale, BusinessCaseUiCopy> = {
  en: englishBusinessCaseCopy,
  de: germanBusinessCaseCopy,
};

export function localizeBusinessCaseErrors(
  errors: BusinessCaseErrors,
  locale: Locale,
): BusinessCaseErrors {
  if (locale === 'en') return errors;
  const translated: BusinessCaseErrors = {};
  const labels: Record<Exclude<keyof BusinessCaseErrors, 'workTypeIds'>, string> = {
    people: 'Anzahl der Personen',
    weeklyHoursSpent: 'Wöchentliche Zeit pro Person',
    recoveryPercent: 'Szenario für zurückgewonnene Zeit',
    hourlyPlanningValue: 'Planungswert pro Stunde',
    workingWeeks: 'Arbeitswochen pro Jahr',
  };
  for (const [field, message] of Object.entries(errors) as Array<
    [keyof BusinessCaseErrors, string]
  >) {
    if (field === 'workTypeIds') {
      translated[field] = message.includes('valid')
        ? 'Wählen Sie gültige Aufgaben ohne Wiederholungen.'
        : 'Wählen Sie mindestens eine Aufgabe.';
      continue;
    }
    const label = labels[field];
    const bounds = message.match(/between ([\d.,]+) and ([\d.,]+?)(?:\.|$)/);
    translated[field] = message.includes('whole number')
      ? `${label} muss eine ganze Zahl sein.`
      : bounds
        ? `${label} muss zwischen ${bounds[1]} und ${bounds[2]} liegen.`
        : `${label} ist erforderlich.`;
  }
  return translated;
}

export interface DemoFormUiCopy {
  submissionConfirmed: string;
  successTitle: string;
  previewSuccess: string;
  success: string;
  returnHome: string;
  requestLabel: string;
  requestTitle: string;
  preparationNote: string;
  hydrationNote: string;
  legend: string;
  fullName: string;
  workEmail: string;
  company: string;
  phone: string;
  optionalSummary: string;
  role: string;
  organizationSize: string;
  chooseBand: string;
  peopleBands: readonly string[];
  desiredStart: string;
  chooseWindow: string;
  windows: readonly string[];
  systems: string;
  systemsPlaceholder: string;
  submitting: string;
  retry: string;
  requestDemo: string;
  unexpectedError: string;
}

export const demoFormUiCopy: Record<Locale, DemoFormUiCopy> = {
  en: {
    submissionConfirmed: 'Submission confirmed',
    successTitle: 'Thank you. Request confirmed.',
    previewSuccess: 'Preview request confirmed. No information was sent.',
    success: 'Request confirmed. We have the details needed for the next step.',
    returnHome: 'Return home',
    requestLabel: 'Meeting request',
    requestTitle: 'Tell us how to reach you.',
    preparationNote: 'A few details to prepare',
    hydrationNote:
      'The form will be ready in a moment. If it does not, enable JavaScript and reload.',
    legend: 'Demo request details',
    fullName: 'Full name',
    workEmail: 'Work email',
    company: 'Company',
    phone: 'Phone number (optional)',
    optionalSummary: 'Add planning context (optional)',
    role: 'Role',
    organizationSize: 'Organization size',
    chooseBand: 'Choose a band',
    peopleBands: ['1–249 people', '250–999 people', '1,000–4,999 people', '5,000+ people'],
    desiredStart: 'Desired start window',
    chooseWindow: 'Choose a window',
    windows: ['Exploring now', 'Within 3 months', 'Within 3–6 months', 'More than 6 months'],
    systems: 'Systems or context',
    systemsPlaceholder: 'Approved knowledge sources or systems involved',
    submitting: 'Submitting…',
    retry: 'Try again',
    requestDemo: 'Request a demo',
    unexpectedError: 'The request could not be sent. Please try again.',
  },
  de: {
    submissionConfirmed: 'Anfrage bestätigt',
    successTitle: 'Vielen Dank. Ihre Anfrage ist bestätigt.',
    previewSuccess: 'Vorschauanfrage bestätigt. Es wurden keine Informationen gesendet.',
    success: 'Anfrage bestätigt. Wir haben die Angaben für den nächsten Schritt.',
    returnHome: 'Zur Startseite',
    requestLabel: 'Gespräch anfragen',
    requestTitle: 'Wie können wir Sie erreichen?',
    preparationNote: 'Einige Angaben zur Vorbereitung',
    hydrationNote:
      'Das Formular ist gleich bereit. Falls nicht, aktivieren Sie JavaScript und laden Sie die Seite neu.',
    legend: 'Angaben zur Demo-Anfrage',
    fullName: 'Vollständiger Name',
    workEmail: 'Geschäftliche E-Mail-Adresse',
    company: 'Unternehmen',
    phone: 'Telefonnummer (optional)',
    optionalSummary: 'Planungskontext ergänzen (optional)',
    role: 'Rolle',
    organizationSize: 'Unternehmensgröße',
    chooseBand: 'Größe wählen',
    peopleBands: ['1–249 Personen', '250–999 Personen', '1.000–4.999 Personen', '5.000+ Personen'],
    desiredStart: 'Gewünschter Start',
    chooseWindow: 'Zeitraum wählen',
    windows: [
      'Wir orientieren uns',
      'Innerhalb von 3 Monaten',
      'In 3–6 Monaten',
      'Später als 6 Monate',
    ],
    systems: 'Systeme oder Kontext',
    systemsPlaceholder: 'Beteiligte Wissensquellen oder Systeme',
    submitting: 'Wird gesendet…',
    retry: 'Erneut versuchen',
    requestDemo: 'Demo anfragen',
    unexpectedError: 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
  },
};

export function localizeDemoErrors(errors: DemoFormErrors, locale: Locale): DemoFormErrors {
  if (locale === 'en') return errors;
  const translated: DemoFormErrors = {};
  if (errors.fullName) translated.fullName = 'Geben Sie Ihren vollständigen Namen ein.';
  if (errors.workEmail)
    translated.workEmail = 'Geben Sie eine gültige geschäftliche E-Mail-Adresse ein.';
  if (errors.company) translated.company = 'Geben Sie den Unternehmensnamen ein.';
  if (errors.phoneNumber) {
    translated.phoneNumber =
      'Geben Sie eine gültige Telefonnummer ein oder lassen Sie das Feld leer.';
  }
  if (errors.privacyAcknowledged) {
    translated.privacyAcknowledged = 'Bestätigen Sie, wie diese Angaben verwendet werden.';
  }
  return translated;
}

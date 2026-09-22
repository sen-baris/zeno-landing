export type LocalePublicationStatus = 'preview' | 'published';

interface LocaleDefinition {
  code: string;
  label: string;
  prefix: string;
  direction: 'ltr' | 'rtl';
  numberFormatLocale: string;
  publicationStatus: LocalePublicationStatus;
}

export const localeDefinitions = {
  en: {
    code: 'en',
    label: 'English',
    prefix: '',
    direction: 'ltr',
    numberFormatLocale: 'en-GB',
    publicationStatus: 'published',
  },
  de: {
    code: 'de',
    label: 'Deutsch',
    prefix: '/de',
    direction: 'ltr',
    numberFormatLocale: 'de-DE',
    publicationStatus: 'published',
  },
} as const satisfies Record<string, LocaleDefinition>;

export type Locale = keyof typeof localeDefinitions;

export const defaultLocale: Locale = 'en';
export const locales = Object.keys(localeDefinitions) as Locale[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in localeDefinitions;
}

export function isPublishedLocale(locale: Locale): boolean {
  return localeDefinitions[locale].publicationStatus === 'published';
}

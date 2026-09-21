import type { Locale } from './locales';

export interface SharedUiCopy {
  skipLink: string;
  header: {
    homeLabel: string;
    primaryNavigationLabel: string;
    mobileNavigationLabel: string;
    product: string;
    solutions: string;
    byIndustry: string;
    allIndustries: string;
    security: string;
    businessCase: string;
    signIn: string;
    bookDemo: string;
    menuOpenLabel: string;
    menuLabel: string;
    languageLabel: string;
  };
  footer: {
    tagline: string;
    navigationLabel: string;
    explore: string;
    company: string;
    legal: string;
    product: string;
    solutions: string;
    businessCase: string;
    why: string;
    security: string;
    trustCenter: string;
    trustCenterNewTab: string;
    bookDemo: string;
    privacy: string;
    terms: string;
    imprint: string;
    englishDocument: string;
    previewLabel: string;
  };
}

export const sharedUiCopy: Record<Locale, SharedUiCopy> = {
  en: {
    skipLink: 'Skip to main content',
    header: {
      homeLabel: 'Zeno home',
      primaryNavigationLabel: 'Primary navigation',
      mobileNavigationLabel: 'Mobile navigation',
      product: 'Product',
      solutions: 'Solutions',
      byIndustry: 'By industry',
      allIndustries: 'All industries',
      security: 'Security',
      businessCase: 'Calculate business case',
      signIn: 'Sign in',
      bookDemo: 'Book a demo',
      menuOpenLabel: 'Menu, open navigation',
      menuLabel: 'Menu',
      languageLabel: 'Language',
    },
    footer: {
      tagline: 'Enterprise AI for everyday work, from useful assistance to governed execution.',
      navigationLabel: 'Footer navigation',
      explore: 'Explore',
      company: 'Company',
      legal: 'Legal',
      product: 'Product',
      solutions: 'Solutions',
      businessCase: 'Business case',
      why: 'Why Zeno',
      security: 'Security',
      trustCenter: 'Trust center',
      trustCenterNewTab: ' (opens in a new tab)',
      bookDemo: 'Book a demo',
      privacy: 'Privacy policy',
      terms: 'Terms of service',
      imprint: 'Imprint',
      englishDocument: '',
      previewLabel: 'English / V1 preview',
    },
  },
  de: {
    skipLink: 'Zum Hauptinhalt springen',
    header: {
      homeLabel: 'Zeno Startseite',
      primaryNavigationLabel: 'Hauptnavigation',
      mobileNavigationLabel: 'Mobile Navigation',
      product: 'Produkt',
      solutions: 'Lösungen',
      byIndustry: 'Nach Branche',
      allIndustries: 'Alle Branchen',
      security: 'Sicherheit',
      businessCase: 'Business Case berechnen',
      signIn: 'Anmelden',
      bookDemo: 'Demo buchen',
      menuOpenLabel: 'Menü, Navigation öffnen',
      menuLabel: 'Menü',
      languageLabel: 'Sprache',
    },
    footer: {
      tagline:
        'Enterprise AI für die tägliche Arbeit, von hilfreicher Assistenz bis zur sicheren Ausführung.',
      navigationLabel: 'Navigation in der Fußzeile',
      explore: 'Entdecken',
      company: 'Unternehmen',
      legal: 'Rechtliches',
      product: 'Produkt',
      solutions: 'Lösungen',
      businessCase: 'Business Case',
      why: 'Warum Zeno',
      security: 'Sicherheit',
      trustCenter: 'Trust Center',
      trustCenterNewTab: ' (öffnet in einem neuen Tab)',
      bookDemo: 'Demo buchen',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      imprint: 'Impressum',
      englishDocument: ' (Englisch)',
      previewLabel: 'Deutsch / Vorschau',
    },
  },
};

export const solutionNavigationLabels: Record<Locale, Record<string, string>> = {
  en: {
    manufacturing: 'Manufacturing',
    'management-consulting': 'Management consulting',
    'm-and-a': 'M&A',
    'private-equity': 'Private equity',
    legal: 'Legal',
  },
  de: {
    manufacturing: 'Fertigung',
    'management-consulting': 'Unternehmensberatung',
    'm-and-a': 'M&A',
    'private-equity': 'Private Equity',
    legal: 'Recht',
  },
};

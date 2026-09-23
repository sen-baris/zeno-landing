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
    resources: string;
    externalNewTab: string;
    businessCase: string;
    signIn: string;
    bookDemo: string;
    menuOpenLabel: string;
    menuLabel: string;
  };
  footer: {
    tagline: string;
    navigationLabel: string;
    explore: string;
    company: string;
    resources: string;
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
    languageLabel: string;
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
      resources: 'Resources',
      externalNewTab: ' (opens in a new tab)',
      businessCase: 'Calculate business case',
      signIn: 'Sign in',
      bookDemo: 'Book a demo',
      menuOpenLabel: 'Menu, open navigation',
      menuLabel: 'Menu',
    },
    footer: {
      tagline: 'Enterprise AI for everyday work, from useful assistance to governed execution.',
      navigationLabel: 'Footer navigation',
      explore: 'Explore',
      company: 'Company',
      resources: 'Resources',
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
      languageLabel: 'Language',
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
      resources: 'Ressourcen',
      externalNewTab: ' (öffnet in einem neuen Tab)',
      businessCase: 'Business Case berechnen',
      signIn: 'Anmelden',
      bookDemo: 'Demo buchen',
      menuOpenLabel: 'Menü, Navigation öffnen',
      menuLabel: 'Menü',
    },
    footer: {
      tagline:
        'Enterprise AI für die tägliche Arbeit, von hilfreicher Assistenz bis zur sicheren Ausführung.',
      navigationLabel: 'Navigation in der Fußzeile',
      explore: 'Entdecken',
      company: 'Unternehmen',
      resources: 'Ressourcen',
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
      languageLabel: 'Sprache',
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

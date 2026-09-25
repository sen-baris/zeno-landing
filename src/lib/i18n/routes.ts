import { customerStoryDrafts } from '../content/customer-stories';
import { solutions } from '../content/solutions';
import {
  defaultLocale,
  isPublishedLocale,
  localeDefinitions,
  locales,
  type Locale,
} from './locales';

export const staticRouteDefinitions = {
  home: { en: '/', de: '/de/' },
  product: { en: '/product', de: '/de/produkt' },
  pricing: { en: '/pricing', de: '/de/business-case' },
  security: { en: '/security', de: '/de/sicherheit' },
  demo: { en: '/demo', de: '/de/demo' },
  solutions: { en: '/solutions', de: '/de/loesungen' },
  customers: { en: '/customers', de: '/de/kunden' },
  privacy: { en: '/privacy-policy' },
  terms: { en: '/terms-of-service' },
  imprint: { en: '/imprint' },
} as const satisfies Record<string, Partial<Record<Locale, string>>>;

export type StaticRouteKey = keyof typeof staticRouteDefinitions;

export const solutionSlugDefinitions = {
  manufacturing: { en: 'manufacturing', de: 'fertigung' },
  'management-consulting': { en: 'management-consulting', de: 'unternehmensberatung' },
  'm-and-a': { en: 'm-and-a', de: 'ma' },
  'private-equity': { en: 'private-equity', de: 'private-equity' },
  legal: { en: 'legal', de: 'recht' },
} as const satisfies Record<string, Record<Locale, string>>;

export type SolutionSlug = keyof typeof solutionSlugDefinitions;

export type RouteReference =
  | { kind: 'static'; key: StaticRouteKey }
  | { kind: 'solution'; slug: SolutionSlug }
  | { kind: 'customer'; slug: string };

export interface LocalizedRouteLink {
  locale: Locale;
  lang: Locale;
  label: string;
  path: string;
}

export interface HreflangLink {
  hreflang: Locale | 'x-default';
  path: string;
}

function normalizedPath(path: string): string {
  if (path === '/') return path;
  return `/${path.replace(/^\/+|\/+$/g, '')}`;
}

export function getLocalizedPath(reference: RouteReference, locale: Locale): string | undefined {
  if (reference.kind === 'static') {
    const definition: Partial<Record<Locale, string>> = staticRouteDefinitions[reference.key];
    return definition[locale];
  }

  if (reference.kind === 'solution') {
    const slug = solutionSlugDefinitions[reference.slug]?.[locale];
    return slug
      ? normalizedPath(
          `${localeDefinitions[locale].prefix}/${
            locale === 'en' ? 'solutions' : 'loesungen'
          }/${slug}`,
        )
      : undefined;
  }

  return normalizedPath(
    `${localeDefinitions[locale].prefix}/${locale === 'en' ? 'customers' : 'kunden'}/${
      reference.slug
    }`,
  );
}

export function getRouteSwitcherLinks(
  reference: RouteReference,
  includePreviewLocales = true,
): LocalizedRouteLink[] {
  return locales.flatMap((locale) => {
    const path = getLocalizedPath(reference, locale);
    if (!path || (!includePreviewLocales && !isPublishedLocale(locale))) return [];
    return [
      {
        locale,
        lang: locale,
        label: localeDefinitions[locale].label,
        path,
      },
    ];
  });
}

export function getPublishedHreflangLinks(reference: RouteReference): HreflangLink[] {
  return buildHreflangLinks(
    reference,
    locales.filter((locale) => isPublishedLocale(locale)),
  );
}

export function buildHreflangLinks(
  reference: RouteReference,
  publishedLocales: readonly Locale[],
): HreflangLink[] {
  const localized = publishedLocales.flatMap((locale) => {
    const path = getLocalizedPath(reference, locale);
    return path ? [{ locale, path }] : [];
  });
  if (localized.length < 2) return [];

  const defaultPath = getLocalizedPath(reference, defaultLocale);
  if (!defaultPath) return [];

  return [
    ...localized.map(({ locale, path }) => ({ hreflang: locale, path })),
    { hreflang: 'x-default', path: defaultPath },
  ];
}

export function getAllLocalizedRouteEntries(options?: { includePreview?: boolean }): Array<{
  locale: Locale;
  path: string;
  reference: RouteReference;
}> {
  const includePreview = options?.includePreview ?? false;
  const references: RouteReference[] = [
    ...Object.keys(staticRouteDefinitions).map(
      (key) => ({ kind: 'static', key: key as StaticRouteKey }) as const,
    ),
    ...solutions.map(
      (solution) => ({ kind: 'solution', slug: solution.slug as SolutionSlug }) as const,
    ),
    ...customerStoryDrafts.map((story) => ({ kind: 'customer', slug: story.slug }) as const),
  ];

  return references.flatMap((reference) =>
    locales.flatMap((locale) => {
      if (!includePreview && !isPublishedLocale(locale)) return [];
      const path = getLocalizedPath(reference, locale);
      return path ? [{ locale, path, reference }] : [];
    }),
  );
}

export function assertLocalizationRouteIntegrity(): void {
  const knownSolutions = new Set(solutions.map((solution) => solution.slug));
  const mappedSolutions = new Set(Object.keys(solutionSlugDefinitions));
  if (
    knownSolutions.size !== mappedSolutions.size ||
    [...knownSolutions].some((slug) => !mappedSolutions.has(slug))
  ) {
    throw new Error('Every solution requires one localized slug definition.');
  }

  const seen = new Set<string>();
  for (const { locale, path } of getAllLocalizedRouteEntries({ includePreview: true })) {
    const key = `${locale}:${path}`;
    if (seen.has(key)) throw new Error(`Localized route "${key}" is duplicated.`);
    seen.add(key);
  }
}

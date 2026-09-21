import { isPublishedLocale, type Locale } from './locales';
import {
  getLocalizedPath,
  getPublishedHreflangLinks,
  getRouteSwitcherLinks,
  type HreflangLink,
  type LocalizedRouteLink,
  type RouteReference,
} from './routes';

export interface LocalizedSeo {
  locale: Locale;
  canonicalPath: string;
  hreflangLinks: readonly HreflangLink[];
  switcherLinks: readonly LocalizedRouteLink[];
  isPublished: boolean;
}

export function createLocalizedSeo(
  reference: RouteReference,
  locale: Locale,
  options?: { includePreviewLocales?: boolean },
): LocalizedSeo {
  const canonicalPath = getLocalizedPath(reference, locale);
  if (!canonicalPath) {
    throw new Error(`Route does not have a localized path for "${locale}".`);
  }

  return {
    locale,
    canonicalPath,
    hreflangLinks: getPublishedHreflangLinks(reference),
    switcherLinks: getRouteSwitcherLinks(reference, options?.includePreviewLocales ?? false),
    isPublished: isPublishedLocale(locale),
  };
}

export function createStandaloneSeo(locale: Locale, canonicalPath: string): LocalizedSeo {
  return {
    locale,
    canonicalPath,
    hreflangLinks: [],
    switcherLinks: [],
    isPublished: false,
  };
}

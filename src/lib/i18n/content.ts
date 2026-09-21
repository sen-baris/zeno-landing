import type { Locale } from './locales';
import {
  buildHreflangLinks,
  getLocalizedPath,
  type HreflangLink,
  type RouteReference,
} from './routes';

export type LocalizedContentStatus = 'draft' | 'published';
export type LocalizedContentIndexingStatus = 'index' | 'noindex';

export interface LocalizedContentEntry {
  translationKey: string;
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  status: LocalizedContentStatus;
  indexingStatus: LocalizedContentIndexingStatus;
  claimIds: readonly string[];
  publishedAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface LocalizedContentGroup {
  translationKey: string;
  entries: readonly LocalizedContentEntry[];
}

export interface ResolvedLocalizedContentRoute {
  locale: Locale;
  path: string;
  lastmod?: Date | undefined;
}

export interface ResolvedLocalizedContentGroup {
  translationKey: string;
  routes: readonly ResolvedLocalizedContentRoute[];
  hreflangLinks: readonly HreflangLink[];
}

export function groupPublishedLocalizedContent(
  entries: readonly LocalizedContentEntry[],
): LocalizedContentGroup[] {
  const seenRoutes = new Set<string>();
  const seenGroupLocales = new Set<string>();
  const groups = new Map<string, LocalizedContentEntry[]>();

  for (const entry of entries) {
    if (!entry.translationKey.trim() || !entry.slug.trim()) {
      throw new Error('Localized content requires a translation key and slug.');
    }

    const routeKey = `${entry.locale}:${entry.slug}`;
    if (seenRoutes.has(routeKey)) {
      throw new Error(`Localized content route "${routeKey}" is duplicated.`);
    }
    seenRoutes.add(routeKey);

    const groupLocaleKey = `${entry.translationKey}:${entry.locale}`;
    if (seenGroupLocales.has(groupLocaleKey)) {
      throw new Error(
        `Translation group "${entry.translationKey}" contains duplicate locale "${entry.locale}".`,
      );
    }
    seenGroupLocales.add(groupLocaleKey);

    if (entry.status !== 'published') continue;
    const group = groups.get(entry.translationKey) ?? [];
    group.push(entry);
    groups.set(entry.translationKey, group);
  }

  return [...groups.entries()].map(([translationKey, groupEntries]) => ({
    translationKey,
    entries: groupEntries,
  }));
}

/**
 * Resolves future CMS entries through the same stable route registry as local pages. CMS data may
 * supply a localized slug, but never a canonical URL. The adapter passes the stable route reference
 * owned by the application, and this function verifies that each published slug agrees with it.
 */
export function resolveLocalizedContentGroup(
  group: LocalizedContentGroup,
  reference: RouteReference,
): ResolvedLocalizedContentGroup {
  const indexableEntries = group.entries.filter(
    (entry) => entry.status === 'published' && entry.indexingStatus === 'index',
  );
  const routes = indexableEntries.map((entry) => {
    const path = getLocalizedPath(reference, entry.locale);
    if (!path) {
      throw new Error(
        `Translation group "${group.translationKey}" has no registered ${entry.locale} route.`,
      );
    }

    const routeSlug = path.split('/').filter(Boolean).at(-1) ?? '';
    if (routeSlug !== entry.slug) {
      throw new Error(
        `Translation group "${group.translationKey}" slug "${entry.slug}" does not match route "${path}".`,
      );
    }

    return {
      locale: entry.locale,
      path,
      ...(entry.updatedAt ? { lastmod: entry.updatedAt } : {}),
    };
  });

  const hasEnglishCounterpart = routes.some((route) => route.locale === 'en');
  const hreflangLinks = hasEnglishCounterpart
    ? buildHreflangLinks(
        reference,
        routes.map((route) => route.locale),
      )
    : [];

  return { translationKey: group.translationKey, routes, hreflangLinks };
}

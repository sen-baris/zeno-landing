import { withBase } from '../routing/base-path';
import type { Locale } from './locales';
import { getAllLocalizedRouteEntries, getLocalizedPath } from './routes';
import { germanInterfaceCopy } from './de-ui-copy';
import { germanIndustryCopy } from './de-industry-copy';
import { germanEditorialCopy } from './de-page-copy';
import { germanWorkspaceCopy } from './de-workspace-copy';
import { germanArticleCopy } from './de-article-copy';

export const germanPageCopy: Readonly<Record<string, string>> = {
  ...germanIndustryCopy,
  ...germanInterfaceCopy,
  ...germanEditorialCopy,
  ...germanWorkspaceCopy,
  ...germanArticleCopy,
};

export interface EmphasizedCopy {
  before: string;
  text: string;
  after: string;
}
export const agentStartingPointCopy = {
  en: { before: 'Start with a ', text: 'prebuilt agent', after: ' or build your own.' },
  de: {
    before: 'Einen ',
    text: 'vorgefertigten Agenten',
    after: ' wählen oder einen eigenen bauen.',
  },
} as const satisfies Record<Locale, EmphasizedCopy>;

/** Exact source strings identify copy, never animation stages or route slugs. */
export function translatePageText(locale: Locale, value: string | number | undefined): string {
  if (value === undefined) throw new Error('Required page copy is missing.');
  const source = String(value);
  if (locale === 'en') return source;
  const normalized = source.replace(/\s+/g, ' ').trim();
  if (normalized.endsWith(' | Zeno'))
    return `${translatePageText(locale, normalized.slice(0, -7))} | Zeno`;
  const translated = Object.hasOwn(germanPageCopy, normalized)
    ? germanPageCopy[normalized]
    : undefined;
  if (translated !== undefined) return translated;
  // Explicit approved number formatting takes precedence over unchanged numeric-only copy.
  if (!/[A-Za-z]/.test(source)) return source;
  throw new Error(`Missing German page copy: ${normalized}`);
}

export function localizedPagePath(locale: Locale, source: string): string {
  const [pathname, fragment] = source.split('#');
  const entry = getAllLocalizedRouteEntries().find(
    ({ locale: candidate, path }) => candidate === 'en' && path === pathname,
  );
  const translated = entry ? (getLocalizedPath(entry.reference, locale) ?? pathname!) : pathname!;
  return withBase(translated + (fragment === undefined ? '' : `#${fragment}`));
}

export function createPageLocale(locale: Locale) {
  return {
    text: (value: string | number | undefined) => translatePageText(locale, value),
    path: (value: string) => localizedPagePath(locale, value),
  };
}

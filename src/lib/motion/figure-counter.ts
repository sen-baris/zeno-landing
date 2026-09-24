import type { Locale } from '../i18n/locales';

/** Animate whole localized quantities while retaining the approved punctuation and units. */
export function createFigureCounter(target: string, locale: Locale): (progress: number) => string {
  const separator = locale === 'de' ? '.' : ',';
  const numbers = locale === 'de' ? /(\d{1,3}(?:\.\d{3})+|\d+)/ : /(\d{1,3}(?:,\d{3})+|\d+)/;
  const formatter = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB');
  const parts = target
    .split(numbers)
    .map((part, index) =>
      index % 2 === 0
        ? part
        : { value: Number(part.replaceAll(separator, '')), grouped: part.includes(separator) },
    );

  return (progress) => {
    if (progress >= 1) return target;
    return parts
      .map((part) => {
        if (typeof part === 'string') return part;
        const value = Math.round(part.value * Math.max(0, progress));
        return part.grouped ? formatter.format(value) : String(value);
      })
      .join('');
  };
}

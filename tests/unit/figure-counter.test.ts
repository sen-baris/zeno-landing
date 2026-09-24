import { describe, expect, it } from 'vitest';
import { createFigureCounter } from '../../src/lib/motion/figure-counter';

describe('localized figure count-up', () => {
  it.each([
    ['en', '2,000+', '1,000+', '1,500+'],
    ['de', '2.000+', '1.000+', '1.500+'],
  ] as const)(
    'animates a grouped %s number as a single quantity',
    (locale, target, half, threeQuarters) => {
      const count = createFigureCounter(target, locale);
      expect(count(0)).toBe('0+');
      expect(count(0.25)).toBe('500+');
      expect(count(0.5)).toBe(half);
      expect(count(0.75)).toBe(threeQuarters);
      expect(count(1)).toBe(target);
    },
  );

  it('preserves ranges, units and approximation markers without changing other figures', () => {
    expect(createFigureCounter('~92', 'en')(0.5)).toBe('~46');
    expect(createFigureCounter('+65%', 'en')(0.5)).toBe('+33%');
    expect(createFigureCounter('~€7–8M', 'en')(0.5)).toBe('~€4–4M');
    expect(createFigureCounter('~€7–8 Mio.', 'de')(0.5)).toBe('~€4–4 Mio.');
    expect(createFigureCounter('2000', 'en')(0.75)).toBe('1500');
    expect(createFigureCounter('One workspace', 'en')(0.5)).toBe('One workspace');
  });

  it('bounds progression and restores the approved text verbatim', () => {
    const count = createFigureCounter('2,000+', 'en');
    expect(count(-1)).toBe('0+');
    expect(count(2)).toBe('2,000+');
    expect(createFigureCounter('1.000.000', 'de')(0.5)).toBe('500.000');
    expect(createFigureCounter('~€7–8M', 'en')(1)).toBe('~€7–8M');
  });
});

import { describe, expect, it } from 'vitest';
import { siteBase, withBase } from '../../src/lib/routing/base-path';

describe('deployment base path', () => {
  describe('at a domain root', () => {
    it.each(['/', '', '  '])('treats %j as no prefix', (base) => {
      expect(siteBase(base)).toBe('');
      expect(withBase('/demo', base)).toBe('/demo');
      expect(withBase('/', base)).toBe('/');
      expect(withBase('/#trust', base)).toBe('/#trust');
    });
  });

  describe('below a domain root', () => {
    it.each(['/zeno-landing', '/zeno-landing/', 'zeno-landing'])(
      'normalises %j to a single leading slash and no trailing slash',
      (base) => {
        expect(siteBase(base)).toBe('/zeno-landing');
      },
    );

    it('prefixes pages, fragments, and public assets', () => {
      const base = '/zeno-landing/';
      expect(withBase('/', base)).toBe('/zeno-landing/');
      expect(withBase('/demo', base)).toBe('/zeno-landing/demo');
      expect(withBase('/ai-readiness', base)).toBe('/zeno-landing/ai-readiness');
      expect(withBase('/#trust', base)).toBe('/zeno-landing/#trust');
      expect(withBase('/customer-logos/kbc.svg', base)).toBe(
        '/zeno-landing/customer-logos/kbc.svg',
      );
    });

    it('leaves destinations that do not address this deployment alone', () => {
      const base = '/zeno-landing/';
      expect(withBase('https://trust.textcortex.com/home', base)).toBe(
        'https://trust.textcortex.com/home',
      );
      expect(withBase('#main-content', base)).toBe('#main-content');
      expect(withBase('mailto:hello@example.test', base)).toBe('mailto:hello@example.test');
    });
  });

  it('defaults to the configured build base, which is the root in tests', () => {
    expect(withBase('/demo')).toBe('/demo');
  });
});

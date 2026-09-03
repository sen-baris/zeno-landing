/**
 * The line marks Glyph.astro can draw. Kept in a module rather than in the component's frontmatter,
 * so plain TypeScript files can refer to it: tsc does not resolve .astro imports outside .astro.
 */
export type GlyphName =
  'ask' | 'draft' | 'number' | 'finance' | 'legal' | 'operations' | 'schedule' | 'eu';

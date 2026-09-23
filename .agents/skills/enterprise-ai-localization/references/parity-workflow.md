# Localized page workflow

## Ownership map

Paths are repository-relative. Inspect the current files before editing; do not copy a historical
implementation from an audit.

| Concern | Owner |
| --- | --- |
| Shared sections and page-boundary resolution | `src/components/pages/*.astro` |
| English entry points / German dispatcher | `src/pages/` / `src/pages/de/[...path].astro` |
| Exact text lookup and localized links | `src/lib/i18n/page-copy.ts` |
| Page, visual, article, and industry translations | `src/lib/i18n/de-*-copy.ts` |
| Navigation and footer | `src/lib/i18n/ui.ts` |
| Calculator and demo messages | `src/lib/i18n/forms.ts` |
| English factual truth | `src/lib/claims/` and `src/lib/content/` |
| Reviewed German approval snapshot | `src/lib/i18n/de-approved-claims.json` |
| Source-claim validation and article reconstruction | `de-claims.ts` and `claim-copy.ts` in `src/lib/i18n/` |
| Pinned-content fit and cleanup | `src/lib/motion/scene-fit.ts` and the two shared scene components |

## Editing an existing page

1. Compare English and German at the same viewport and state. List the affected sections, semantic
   captions, visuals, forms, and destinations before editing.
2. Change shared structure once. Add required copy for every published locale, including metadata,
   errors, accessible names, and decorative visual labels. Exact source-text keys require updating
   the German catalog when English wording changes.
3. Classify factual changes and resolve their approval before rendering. German approval must
   retain the actual source claim ID and exact source statement. A source change invalidates its
   old translation approval. Do not auto-approve future edits.
4. Fit text with concise equivalent wording, component-specific sizing, proper columns, and
   language-aware wrapping. Do not hide clipping with overflow rules or hard-code arbitrary word
   fragments. Avoid translating a claim into a stronger promise.
5. Recheck both languages. A shared CSS adjustment can regress English even when only German was
   requested. Review changed images before accepting snapshots.

## Adding or publishing a language

- Define the locale explicitly in `locales.ts` and Astro configuration. Keep it unpublished until
  its exact factual records receive approval.
- Extend all locale-dependent branches and required copy contracts, not just the locale array.
  Current solution and customer route families contain English/German segment choices that need
  explicit extension for a third language.
- Add registered slugs, complete shared-page content, UI, form messages, number formatting, and
  approved claims. Missing copy must fail, not fall back or drop a component.
- Obtain legal translations separately. Do not generate held legal paths or advertise nonexistent
  alternates. A translation request does not authorize legal changes.
- Use the SEO skill to verify direct crawlability, page-preserving language links, self-canonicals,
  reciprocal alternates, and sitemap eligibility before changing publication status.

## Acceptance matrix

For a shared family change inspect every affected pair. For a localization architecture change,
inspect all 15 English/German pairs. Narrow changes need proportionate evidence, not a claim that
the entire site was audited.

| Surface | Required evidence |
| --- | --- |
| Content | Same section order, figures, articles, workflow lists, qualifiers, quote language, and semantic captions |
| Layout | 390, 768, 1101, 1440px; actual text wrapping, overlap, alignment, and clipping |
| Conversion | Usable first choice / first field in 390 × 844 and 1280 × 720, plus tablet and desktop |
| Motion | Both 300vh journeys, 76px offset, forward and reverse, keyboard paging, resize, 1100/1101px and 719/720px boundaries |
| Fallbacks | Reduced motion, short viewports, 200% text size, no JavaScript, complete static scenes |
| Interactive UI | Header, customer preview hover/focus/pin/Escape, native FAQs, calculator progression, demo validation/failure/retry/success |
| Privacy | No calculator network/storage/URL writes; no locale detection, persistence, or tracking |
| Links | German internal destinations, footer-only counterpart links, English legal destinations with `hreflang="en"` and no visible language suffixes |

Run the smallest relevant tests first:

```sh
pnpm exec vitest run tests/unit/localization.test.ts tests/unit/page-localization.test.ts tests/unit/scene-fit.test.ts
E2E_PORT=4322 pnpm exec playwright test tests/e2e/localization.spec.ts tests/e2e/localization-parity.spec.ts tests/e2e/localization-visual.spec.ts --workers=4
```

Then run the broader gates required by AGENTS.md and the feature audit. The first command validates
records; it does not replace rendered review. The browser command uses an isolated gateway test
server so it does not reuse a synthetic development form. Use synthetic fixtures only.

For each finding record reproduction, actual and expected behavior, evidence, cause, correction,
and rerun. The prior omissions are documented in
`docs/audits/2026-09-22-german-page-parity-audit.md`. That report is historical evidence, not a
passing result for a future revision.

# Feature audit: solution FAQ security references

## Scope and acceptance

Date: 2026-09-24. Base revision: `d266607b66473ba62fa2d191a58dfc08b885fc63`.
Scope: all five English and German solution detail pages, their shared FAQ composition,
localized copy, one supporting style, tests, and affected visual baselines.

The owner directed visitors to the Trust Center documentation for the requested data-handling
details. Add a concise reference to Zero Data Retention (ZDR) and model-training policies beside
each page's relevant security answer. Link to `/security` or `/de/sicherheit`, where the existing
Trust Center links provide access to documents and reports. Keep the four FAQ entries, EU-hosting
wording, industry-specific answers, and all other sections unchanged.

This is a navigational reference, not approval of a new provider-wide retention guarantee. No
provider-specific terms, new training promise, blanket compliance statement, or confidential
document is reproduced. Existing claim records and production release gates remain unchanged.
No push or deployment is included in this request.

## Four invariants

| Invariant      | Review                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | `solutions.ts` marks the one relevant answer per industry and owns the shared reference. German exact copy lives in the industry catalog. |
| Feedback       | The reference spells out ZDR and uses an underlined, keyboard-focusable link with a descriptive localized label.                          |
| Failure radius | Shared solution FAQ markup only. No customer figures, capability claims, forms, metadata, or routes change.                               |
| Timing         | Static HTML links work immediately, without hydration. Existing locale/base-path resolution chooses the destination.                      |

## Verification

- Red/green: the new unit test failed before implementation because no FAQ referenced Security.
- Targeted unit checks after implementation: ten solution and localized-copy tests passed.
- `pnpm check`: formatting, lint, strict types (135 files, zero diagnostics), 157 unit/component
  tests, coverage, preview build, and client budgets passed.
- Coverage: 94.37% statements, 95.77% lines, 94.63% functions, 88.62% branches.
- `CONTENT_MODE=production pnpm exec astro build` and `pnpm check:budgets`: passed, 36 static pages.
  This checks production-mode output, not approval to launch or bypass release gates.
- `python3 tools/check_agent_skills.py` and the governance unittest suite: nine skills validated,
  18 tests passed. No skill or governance contract changes.
- New `solution-security-reference.spec.ts`: 36 tests passed across Chromium, Firefox, and WebKit.
  All ten localized routes were exercised with and without JavaScript. Keyboard activation,
  visible focus, local destinations, safe external Trust Center links, reduced motion, four widths
  (390, 768, 1101, 1440), and 100%/200% text reflow passed. Scoped axe checks passed.
- Existing solution and paired-localization regressions: 24 tests passed across those browsers.
  The solution index remains unchanged.
- Seventeen affected Chromium full-page baseline tests passed. The changed FAQ regions were
  visually reviewed for all five industries in English and German at 390px and 1440px, plus
  manufacturing in both languages at 200% text size. Content order, readable wrapping, spacing,
  and link contrast were inspected. Full-page images are supporting regression evidence, not a
  claim that every unaffected section received a new manual review.

Environment: macOS, Node 24.19.0, pnpm 10.32.1, repository Playwright browser versions. Browser
checks used the local Astro server at `127.0.0.1:4322`. Builds and browser tests ran sequentially.
Screenshots are in the ignored `test-results/security-references/` directory; accepted baselines
are in the existing `visual.spec.ts-snapshots` and `localization-visual.spec.ts-snapshots` folders.

Reproduction commands (set `E2E_PORT=4322` for each Playwright invocation):

```sh
pnpm exec playwright test tests/e2e/solution-security-reference.spec.ts --workers=4
pnpm exec playwright test tests/e2e/funnel.spec.ts tests/e2e/localization-parity.spec.ts --grep "every solutions page|solution product story reflows|solutions overview remains|/de/loesungen/.+ preserves" --workers=4
pnpm exec playwright test tests/e2e/visual.spec.ts tests/e2e/localization-visual.spec.ts --project=chromium --grep "solutions-(manufacturing|management-consulting|m-and-a|private-equity|legal)|German (manufacturing|consulting|ma|pe|legal) complete composition" --workers=4
```

## Findings and limitations

The prior answers did not link to the existing Security page. The change adds one reference per
page without duplicating security documentation or changing the underlying data-handling claims.

### P2: German FAQ meaning differed from English

- Surface: German consulting, M&A, private-equity, and legal FAQ catalogs.
- Impact: a visitor received different questions and answers, including a data-handling link
  beside a question about starting a project rather than model access.
- Reproduction: compare the last FAQ on `/solutions/private-equity` and
  `/de/loesungen/private-equity` at the base revision, or the first legal FAQ in both languages.
- Expected: the German question and answer preserve the English security topic and access/hosting
  meaning. Actual: the old dictionary substituted unrelated FAQ topics from the retired shorter pages.
- Evidence: desktop paired screenshots exposed this even though structure and link tests passed.
- Cause: source strings were mapped to positionally corresponding old German content instead of
  equivalent translations.
- Correction: translate all FAQ answers and questions in those four solution catalogs against the
  existing English copy. Restore the omitted manufacturing signoff-record sentence as well. No
  English capability or security claim is expanded.
- Regression: explicit assertions for all five German security-question meanings and access/model
  wording, plus paired browser and visual re-verification. Status: fixed and verified. The M&A
  access-close instruction remains an instruction in German, not an automatic-closure guarantee.

Provider contracts and gated Trust Center documents are not independently audited in this change.
The external link destination is verified; document access permissions remain with the Trust Center.
The entire sitewide browser suite was not rerun. The affected solution journeys, both locales,
their destinations, and adjacent structural regressions received the cross-browser checks above.

## Decision

PASS for the scoped feature. No unresolved P0-P2 finding. No production release or GitHub push
was performed or authorized by this task.
